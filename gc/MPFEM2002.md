*注*：[原文链接](./MPFEM.pdf)



*名词解释*：

*应力（stress）*：在[连续介质力学](https://zh.wikipedia.org/wiki/連續介質力學)里，应力定义为单位[面积](https://zh.wikipedia.org/wiki/面積)所承受的[作用力](https://zh.wikipedia.org/wiki/作用力)。

*应变（strain）*：在[力学](https://zh.wikipedia.org/wiki/力学)中定义为一微小材料元素承受[应力](https://zh.wikipedia.org/wiki/應力)时所产生的变形强度(或简称为单位长度变形量)，因此是一个[无量纲量](https://zh.wikipedia.org/wiki/无量纲量)。



### 运动粒子有限元法

**摘要**：本文介绍了运动粒子有限元方法背后的基本概念，它结合了有限元和无网格方法的显著特征。所提出的方法减轻了困扰无网格技术的某些问题，例如必要的边界条件实施和使用单独的背景网格来整合弱形式。该方法通过二维线性弹性问题来说明。提供数值示例以显示该方法在基准问题中的能力。

#### 1 引言

​	有限元法（FEM）是计算力学中最流行和最广泛使用的方法。 然而，FEM并非没有缺点。 一个是如果实验体经受明显变形就会发生网格扭曲；这种网格扭曲可以终止计算或导致精确度的急剧恶化。 另一个是FEM在具有高梯度或明显的局部特征的问题中经常需要非常精细的网格，这在计算上可能是昂贵的。

​	由于FEM的这些和其他缺点，最近出现了所谓的无网格方法。这些方法基于在域中的任意离散点处构造插值函数以强制再现某些条件限制，从而消除对元素和网格的需要。无网格方法的例子包括Liu等人的再生核粒子方法（RKPM）[1,2]，Belytschko等人的无元素Galerkin方法（EFG）[3-5]，Lucy及其同事提出的光滑粒子流体动力学方法（SPH）[6- 8]，Babuska等人的统一方法划分（PUM）[9-11]，Oden等人的hp clouds [12]和 Yagawa等人的自由网格方法[13，14]。这些无网格方法在传统上FEM失败的应用中具有很强的可用性，例如大的变形问题[15,16]，动态剪切带传播[7,18]和传播的不连续性[19-22]，例如裂缝。其他最近的进展包括Bonet等人的校正光滑粒子流体动力学（CSPH）[23]，Atluri等人的无网格局部Petrov-Galerkin（MLPG）[24，25]，Chen等人的稳定服从（SC）节点整合[26]，以及Huerta等人的无网格方法和有限元的耦合[27]。关于重要发现的一个非常好的总结可以在研究论文的三篇特刊中找到，参见文献[28-30]。

​	虽然无网格方法是关于上述应用的对于FEM的改进，但这类方法仍然面临一些问题。 例如，名称“无网格”有点用词不当，因为大多数无网格方法通常使用背景网格来设置高斯正交点以整合弱形式。 其他的，例如SPH，由于缺乏一致性而失败，特别是在边界附近或边界上。 某些无网格方法固有的问题是形状函数不满足Kronecker-Delta属性，这会在强制执行基本边界条件时引发其他问题。 参见文献[31,32]优雅地解决了这个问题。 一个值得注意的例外是Sukumar等人的自然元素法（NEM）[33，34]。 最后，所有无网格方法不同程度地在计算上比FEM更加昂贵。

​	我们现在介绍一种计算力学的新方法，即运动粒子有限元法（MPFEM）。 MPFEM提供以下特性：

* 它应该像FEM一样高效和准确。
* 计算MPFEM形状函数的成本应该与FEM有竞争力。
* 不需要北京网格和压力点来整个弱形式。因此，所有计算关注点，比如应力和应变，都在粒子上。
* 基本边界条件应与FEM一样处理，无需采用特殊方法。



​	本文的结构如下。 首先回顾线性弹性静力学的控制方程，然后导出并离散相应的弱公式。第3部分中通过示例给出了MPFEM的基本细节，包括形状函数及其导数的计算，基本边界条件处理和再现条件。在第4部分，导出了五节点MPFEM元素，并且这个五节点元素在第5部分的基准问题中进行了测试。最后一部分包括总结和结果讨论。

#### 2 控制方程和弱形式

​	在本节中，回顾了经典线性弹性静力学的控制方程，并得出了弱公式。 正如在文献[35]中给出的那样，由$\Gamma$限定的域$\Omega\subset \Re^2$中的平衡方程和边界条件可以写成如下形式：
$$
\begin{align}%'&'用来标记对齐的位置%
\sigma_{ij,j}+f_i&=0		\tag{1a}\\
u_i&=g_i \:\:on \:\:\Gamma_g		\tag{1b}\\
\sigma_{ij}n_j&=h_i \:\:on \:\:\Gamma_h		\tag{1c}
\end{align}
$$

​	在（1）中，$\sigma_{ij}=C_{ijkl}\epsilon_{kl}=C_{ijkl}u_{(k,l)}$是Cauchy应力张量，其中$(k,l)$表示应变的对称部分，$f_i$是每单位体积的体力，$\epsilon_{kl}$是应变张量，$C_{ijkl}$是 弹性系数，$h_i$是边界牵引力，$g_i$规定的边界位移，$\Gamma_h$自然边界和$\Gamma_g$的基础边界。 变量后面的逗号（在哪？）表示关于指示的空间变量的偏导数。

​	乘以测试函数$\delta u_i$并按部分执行积分，得到以下弱公式：
$$
\int_\Omega\delta u_{(i,j)}C_{ijkl}u_{(k,l)}\mathrm{d\Omega}=\int_\Omega\delta u_if_i\mathrm{d\Omega}+\int_{\Gamma_{h_i}}\delta u_ih_i\mathrm{d\Gamma_{h_i}}	\tag{2}
$$
对于上面中给出的弱形式（2），左手项近似为
$$
\int_\Omega\delta u_{i}C_{ijkl}u_{(k,l)}\mathrm{d\Omega}\approx\delta 
\mathrm{u^TKu}		\tag{3}
$$
其中$\delta\mathrm{u}$和$\mathrm{u}$分别是试验函数和离散位移矢量。 刚性矩阵$\mathrm{K}$近似为
$$
\mathrm{K}=\int_\Omega\mathrm{B^TCBd\Omega}\approx\sum_{I=1}^{NP}
\mathrm{B^T}(X_I)\mathrm{CB}(X_I)\Delta V_I		\tag{4}
$$
其中$\mathrm{NP}$是粒子数且$\Delta V_I$是与每个粒子相关的整合重量（或者翻译为积分权重？）。 特别要注意的是粒子等同于FEM公式中的节点。

​	类似地，（2）中的第二项，即体力项，近似为
$$
\int_\Omega\delta u_if_i\mathrm{d\Omega} \approx\sum_{I=1}^{\mathrm{NP}}\mathrm{N^T}(X_I)\mathrm{f}(X_I)\Delta V_I		\tag{5}
$$
（2）中的最后一项，牵引力项，近似为
$$
\int_{\Gamma_{h_i}}\delta u_ih_i\mathrm{d\Gamma_{h_i}} \approx\sum_{I=1}^{\mathrm{NB}}\mathrm{N^T}(X_I)\mathrm{h}(X_I)\Delta S_I		\tag{6}
$$
其中$\mathrm{NB}$是域的自然边界上的粒子数且$\Delta S_I$是和每一个边界粒子相关的整合重量。

















