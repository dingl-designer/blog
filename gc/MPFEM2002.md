*注*：1 [原文链接](./MPFEM.pdf)

2 文中直体的 $\mathrm x$ 含义待确认。文中出现的$x 和 y$严格来说不是指坐标轴，而是指形函数中的自变量$x和y$。

*名词解释*：

*应力（stress）*：在[连续介质力学](https://zh.wikipedia.org/wiki/連續介質力學)里，应力定义为单位[面积](https://zh.wikipedia.org/wiki/面積)所承受的[作用力](https://zh.wikipedia.org/wiki/作用力)。

*应变（strain）*：在[力学](https://zh.wikipedia.org/wiki/力学)中定义为一微小材料元素承受[应力](https://zh.wikipedia.org/wiki/應力)时所产生的变形强度(或简称为单位长度变形量)，因此是一个[无量纲量](https://zh.wikipedia.org/wiki/无量纲量)。

*形函数（Shape Functions）*：也叫基函数（Basis Functions），作为某些已知函数的线性组合，用来获取有限元方法中精确解的近似值。

*德劳内三角化（Delaunay triangulation）*：在 [数学](https://zh.wikipedia.org/wiki/數學) 和 [计算几何](https://zh.wikipedia.org/wiki/計算幾何)领域, 平面上的点集 P的 德劳内三角化是一种 三角剖分DT(P)，使得在 P 中没有点严格处于 DT(P) 中任意一个三角形 [外接圆](https://zh.wikipedia.org/wiki/外接圓) 的内部。Delaunay 三角化 最大化了此三角剖分中三角形的最小角，换句话，此算法尽量避免出现“极瘦”的三角形。

*单位分解（Partition of Unity）*：通过巧妙手法构造 $1$。在流形上的微积分中，单位分解是流形上的函数集，其和为1。微分流形的仿紧性保证了它具有单位分解的性质。这个性质能把局部函数扩并为整体函数，反过来也能把整体函数分解为局部函数来研究。

*克罗内克 $\delta$ （Kronecker delta）*：又称克罗内克$\delta$函数、克罗内克函数），$\delta_{ij}$是一个[二元函数](https://zh.wikipedia.org/wiki/函數#多元函數)，得名于德国数学家[利奥波德·克罗内克](https://zh.wikipedia.org/wiki/利奥波德·克罗内克)。克罗内克函数的自变量（输入值）一般是两个[整数](https://zh.wikipedia.org/wiki/整数)，如果两者相等，则其输出值为1，否则为0。表示为
$$ {\right后面一定要加个‘.’是什么意思}
\delta_{ij}=\left\{\begin{array}{}1&(i=j)\\0&(i\ne j)\end{array}\right.
$$

*单数矩阵（Singular matrix）*：在线性代数中，一个$n\times n$的方阵$\mathrm A$，如果存在矩阵 $\mathrm B$使得$\mathrm{AB=BA=I_n}$，则称$\mathrm A$是可逆的，$\mathrm A$为可逆方阵（非奇异矩阵、非单数矩阵、非退化矩阵），否则称方阵$\mathrm A$为奇异矩阵（单数矩阵、退化矩阵）。所以如果矩阵$\mathrm A$ 是单数矩阵，即说该矩阵是方阵但不可逆。



### 运动粒子有限元法

**摘要**：本文介绍了运动粒子有限元方法背后的基本概念，它结合了有限元和无网格方法的显著特征。所提出的方法减轻了困扰无网格技术的某些问题，例如必要的边界条件实施和使用单独的背景网格来整合弱形式。该方法通过二维线性弹性问题来说明。提供数值示例以显示该方法在基准问题中的能力。

#### 1 引言

​	有限元法（FEM）是计算力学中最流行和最广泛使用的方法。然而，FEM并非没有缺点。一个是如果实验体经受明显变形就会发生网格扭曲；这种网格扭曲可以终止计算或导致精确度的急剧恶化。另一个是FEM在具有高梯度或明显的局部特征的问题中经常需要非常精细的网格，这在计算上可能是昂贵的。

​	由于FEM的这些和其他缺点，最近出现了所谓的无网格方法。这些方法基于在域中的任意离散点处构造插值函数以强制再现某些条件限制，从而消除对元素和网格的需要。无网格方法的例子包括Liu等人的再生核粒子方法（RKPM）[1,2]，Belytschko等人的无元素Galerkin方法（EFG）[3-5]，Lucy及其同事提出的光滑粒子流体动力学方法（SPH）[6- 8]，Babuska等人的统一方法划分（PUM）[9-11]，Oden等人的hp clouds [12]和 Yagawa等人的自由网格方法[13，14]。这些无网格方法在传统上FEM失败的应用中具有很强的可用性，例如大的变形问题[15,16]，动态剪切带传播[7,18]和传播的不连续性[19-22]，例如裂缝。其他最近的进展包括Bonet等人的校正光滑粒子流体动力学（CSPH）[23]，Atluri等人的无网格局部Petrov-Galerkin（MLPG）[24，25]，Chen等人的稳定服从（SC）节点整合[26]，以及Huerta等人的无网格方法和有限元的耦合[27]。关于重要发现的一个非常好的总结可以在研究论文的三篇特刊中找到，参见文献[28-30]。

​	虽然无网格方法是关于上述应用的对于FEM的改进，但这类方法仍然面临一些问题。例如，名称“无网格”有点用词不当，因为大多数无网格方法通常使用背景网格来设置高斯正交点以整合弱形式。其他的，例如SPH，由于缺乏一致性而失败，特别是在边界附近或边界上。某些无网格方法固有的问题是形函数不满足Kronecker-Delta属性，这会在强制执行基本边界条件时引发其他问题。参见文献[31,32]优雅地解决了这个问题。一个值得注意的例外是Sukumar等人的自然元素法（NEM）[33，34]。最后，所有无网格方法不同程度地在计算上比FEM更加昂贵。

​	我们现在介绍一种计算力学的新方法，即运动粒子有限元法（MPFEM）。MPFEM提供以下特性：

* 它应该像FEM一样高效和准确。
* 计算MPFEM形函数的成本应该与FEM有竞争力。
* 不需要北京网格和压力点来整个弱形式。因此，所有计算关注点，比如应力和应变，都在粒子上。
* 基本边界条件应与FEM一样处理，无需采用特殊方法。



​	本文的结构如下。首先回顾线性弹性静力学的控制方程，然后导出并离散相应的弱公式。第3部分中通过示例给出了MPFEM的基本细节，包括形函数及其导数的计算，基本边界条件处理和再现条件。在第4部分，导出了五节点MPFEM元素，并且这个五节点元素在第5部分的基准问题中进行了测试。最后一部分包括总结和结果讨论。

#### 2 控制方程和弱形式

​	在本节中，回顾了经典线性弹性静力学的控制方程，并得出了弱公式。正如在文献[35]中给出的那样，由$\Gamma$限定的域$\Omega\subset \Re^2$中的平衡方程和边界条件可以写成如下形式：
$$
\begin{align}%'&'用来标记对齐的位置%
\sigma_{ij,j}+f_i&=0		\tag{1a}\\
u_i&=g_i \:\:on \:\:\Gamma_g		\tag{1b}\\
\sigma_{ij}n_j&=h_i \:\:on \:\:\Gamma_h		\tag{1c}
\end{align}
$$

​	在（1）中，$\sigma_{ij}=C_{ijkl}\epsilon_{kl}=C_{ijkl}u_{(k,l)}$是Cauchy应力张量，其中$(k,l)$表示应变的对称部分，$f_i$是每单位体积的体力，$\epsilon_{kl}$是应变张量，$C_{ijkl}$是 弹性系数，$h_i$是边界牵引力，$g_i$规定的边界位移，$\Gamma_h$自然边界和$\Gamma_g$的基础边界。变量后面的逗号（在公式26、27中第一次看到）表示关于指示的空间变量的偏导数。

​	乘以测试函数$\delta u_i$并按部分执行积分，得到以下弱公式：
$$
\int_\Omega\delta u_{(i,j)}C_{ijkl}u_{(k,l)}\mathrm{d\Omega}=\int_\Omega\delta u_if_i\mathrm{d\Omega}+\int_{\Gamma_{h_i}}\delta u_ih_i\mathrm{d\Gamma_{h_i}}	\tag{2}
$$
对于上面中给出的弱形式（2），左手项近似为
$$
\int_\Omega\delta u_{i}C_{ijkl}u_{(k,l)}\mathrm{d\Omega}\approx\delta 
\mathrm{u^TKu}		\tag{3}
$$
其中$\delta\mathrm{u}$和$\mathrm{u}$分别是试验函数和离散位移矢量。刚性矩阵$\mathrm{K}$近似为
$$
\mathrm{K}=\int_\Omega\mathrm{B^TCBd\Omega}\approx\sum_{I=1}^{NP}
\mathrm{B^T(x_\mathit{I})CB(x_\mathit{I})}\Delta V_I		\tag{4}
$$
其中$\mathrm{NP}$是粒子数且$\Delta V_I$是与每个粒子相关的积分权重。特别要注意的是粒子等同于FEM公式中的节点。

​	类似地，（2）中的第二项，即体力项，近似为
<!--这里的x是小写，字体是直体;x下标i为默认字体为意大利体，即斜体（italic）。注：斜体即源于意大利，参考斜体的来历-->
$$
\int_\Omega\delta u_if_i\mathrm{d\Omega} \approx\sum_{I=1}^{\mathrm{NP}}\mathrm{N^T(x_\mathit{I})f(x_\mathit{I})}\Delta V_I		\tag{5}
$$
（2）中的最后一项，牵引力项，近似为
$$
\int_{\Gamma_{h_i}}\delta u_ih_i\mathrm{d\Gamma_{h_i}} \approx\sum_{I=1}^{\mathrm{NB}}\mathrm{N^T(x_\mathit{I})h(x_\mathit{I})}\Delta S_I		\tag{6}
$$
其中$\mathrm{NB}$是域的自然边界上的粒子数且$\Delta S_I$是和每一个边界粒子相关的积分权重。

​	在MPFEM中，弱形式通过节点积分方案集成。这种方案的唯一限制是积分权重与域的总体积相加，也就是
$$
\sum_{I=1}^{\mathrm{NP}}V_I=V		\tag{7}
$$
其中$V$是域$\Omega$的总体积。对于MPFEM来说，德劳内三角化用于计算每个粒子的积分权重。

​	考虑图1中的点 $G$。首先，使用附录B中描述的算法找到某些相邻粒子，这些粒子与创建第4节中讨论的MPFEM5元素的粒子相同。接下来，开始三角化过程，其中每个相邻粒子连接到中间粒子（在这种情况下为 $G$），以及最接近它（这个它是指当前的相邻粒子，而非点 $G$）的两个粒子。最终结果是将找到四个三角形，每个三角形具有特定区域。然后通过下式计算点G的积分体积

$$
\Delta V_G=\frac{1}{3}(\Delta V_1+\Delta V_2+\Delta V_3+\Delta V_4)		\tag{8}
$$
作为一个个体粒子考虑图2(a)中的点 $G$。$G$的刚性矩阵为
$$
\mathrm{K(x_G)}=\mathrm{B^T(x_G)CB(x_G)}\Delta V_G		\tag{9}
$$
其中点 $\mathrm{G}$的应变位移矩阵 $\mathrm{B}$为
$$
\mathrm{B(x_G)}=\left[\begin{matrix}
N_1^x(\mathrm{x_G}) & 0 & N_2^x(\mathrm{x_G}) & 0 & N_3^x(\mathrm{x_G}) & 0 \\
0 & N_1^y(\mathrm{x_G}) & 0 & N_2^y(\mathrm{x_G}) & 0 & N_3^y(\mathrm{x_G}) \\
N_1^y(\mathrm{x_G}) & N_1^x(\mathrm{x_G}) & N_2^y(\mathrm{x_G}) & N_2^x(\mathrm{x_G}) & N_3^y(\mathrm{x_G}) & N_3^x(\mathrm{x_G})
\end{matrix}\right]		\tag{10}
$$
其中$N_I^x$表示粒子 的形函数$I$关于 $\mathrm{x}$的偏导数。

​	平面应变状态下各向同性材料的弹性系数张量 $\mathrm{C}$由下式给出

$$
\mathrm{C}=\frac{E}{(1+v)(1-2v)}\left[\begin{matrix}
1-v & v & 0 \\ v & 1-v & 0 \\ 0 & 0 & \frac{1-2v}{2}
\end{matrix}\right]		\tag{11}
$$
其中 $E$是杨氏模量且 $v$是泊松比。

​	图2（b）说明了MPFEM和FEM之间的一些审美差异。在FEM网格中，元素之间没有重叠，并且节点定义每个元素的边界。在MPFEM中，相邻粒子用于形成特定点周围的元素。由于在点周围形成元素的概念，MPFEM元素不可避免地重叠。（所以图2（a）（b）都是MPFEM，对吧；现在的MPFEM还不是五节点模型，五节点是在第4部分才引入的概念）

​	由于不需要网格并且在域中的离散点处构造近似值，因此MPFEM是粒子方法。有限元（FEM）特征是MPFEM中固有的，因为选择围绕一个点的粒子形成一个关于点的类似元素的存在。由于MPFEM元素可以显示为等同于他们的FEM兄弟，也就是说，图2中的三角形单元像FEM三角形一样在x和y中再现常数和线性场，因此该方法称为粒子有限元法。

​	必须要注意的是，上面给出的关于B矩阵的形函数导数不是通过形函数的直接微分获得的。相反，它们由第3节中给出的再现条件决定，因为它们是形函数本身。由于这个事实，MPFEM可以基于假设的应变法制定[36]。

​	图3（a）总结了MPFEM的编程流程图。为了比较，在图3（b）中给出了FEM的典型编码流程图。在MPFEM中，第一步是使用粒子将问题的域离散化。然后启动迭代所有粒子的循环。对于每个粒子，找到最近的邻居粒子，这些粒子环绕当前关注的粒子并且满足某些再现条件。选择这些邻居的标准在附录B中描述。然后，确定颗粒的节点积分体。接下来，确定粒子的形函数和导数，并计算每个粒子的 $\mathrm{B}$矩阵。最后，使用节点积分权重计算和整合粒子的刚性矩阵（就是$\mathrm{K(x_G)}$吧），并将其扩展到全局刚性矩阵中。



#### 3 MPFEM基础

##### 3.1 再现条件

​	在基于粒子的方法中，再现条件或近似值预期再现的单项式的顺序，在所关注的每个粒子及其邻居之间被满足。 如下所示，MPFEM形函数和导数被构造以再现所需的单项式的任何顺序。

​	对于零阶一致性，近似值应该精确再现一个常数，因此为了方便取值 $1$。 在数学上，就是说
$$
u^h(\mathrm{x})=1=(\sum_IN_I(\mathrm{x}))(1)		\tag{12}
$$
因为 $u_I=1$。这表明
$$
\sum_IN_I(\mathrm x)=1		\tag{13}
$$
这个表达式很重要，因为它意味着单位分解，这确保了数值方案是连续性。

​	一阶一致性表明近似值应该精确地再现线性场，也就是说
$$
\sum_IN_I(\mathrm x)x_I=x		\tag{14}
$$
然而，由于再现条件在粒子之间被满足，我们应该让MPFEM知道，这意味着
$$
\sum_IN_I(\mathrm x_G)(x_I-x_G)=0		\tag{15}
$$
其中 $x_G$表示任意一个点的坐标。展开这个表达式，且利用（13），可以看出
$$
\sum_IN_I(\mathrm x_G)x_I=x_G		\tag{16}
$$
上式说明提出的近似值（是指 $1$吧）能够在 $x$上内准确再现线性场。类似的计算可以证明再现条件在 $y$上也满足要求。

​	以类似的方式来实现形函数导数的再现条件推导。考虑如下形式的近似值
$$
\frac{\part u^h(\mathrm x)}{\part x}=\sum_IN_I^x(\mathrm x)u_I		\tag{17}
$$
其中 $N_I^x(\mathrm x)$ 是形函数的导数。对于导数来说，零阶一致性意味着常量属性的导数等于零，或者
$$
\frac{\part u^h(\mathrm x)}{\part x}=0=\left(\sum_IN_I^x(\mathrm x)\right)(1)		\tag{18}
$$
再一次使用 $1$作为常量值。这意味着导数的零阶再现条件
$$
\sum_IN_I^x(\mathrm x)=0		\tag{19}
$$
​	对于一阶一致性，线性场的导数应该得到一个常数，或者
$$
1=\sum_IN_I^x(\mathrm x)x_I		\tag{20}
$$
使用与上面相同的转换技术，为了保证离散粒子之间的一致性，我们指出一阶导数一致性等于是说
$$
1=\sum_IN_I^x(\mathrm x_G)(x_I-x_G)		\tag{21}
$$
为了证明，将上式展开得到
$$
1=\sum_IN_I^x(\mathrm x_G)x_I-\sum_IN_I^x(\mathrm x_G)x_G		\tag{22}
$$
然而，因为 $x_G$是任意点的坐标且因此它（$x_G$吧）独立于 $I$的求和，表达式变为
$$
1=\sum_IN_I^x(\mathrm x_G)x_I-x\sum_IN_I^x(\mathrm x_G)		\tag{23}
$$
利用（19），表达式简化为
$$
\sum_IN_I^x(\mathrm x_G)x_I=1		\tag{24}
$$
证明了MPFEM近似值强制执行了 $x$-导数的一阶再现条件。用类似的方式可以证明 $y$-导数也满足同样的再现条件。表 $\mathrm I$总结了二维MPFEM三角形的再现条件。

##### 3.2 MPFEM形函数

​	考虑如下形式的二维近似值
$$
u^h(\mathrm x)=\sum_{I=1}^3N_I(\mathrm x)u_I		\tag{25}
$$
其中，$N_I(x)$是形函数且$u_I$是节点自由度。$x$-导数的表达式为
$$
u_{,x}^h(\mathrm x)=\sum_{I=1}^3N_I^x(\mathrm x)u_I		\tag{26}
$$
其中 $N_I^x(\mathrm x)$ 是形函数的 $x$-导数。类似的，$y$-导数的表达式为
$$
u_{,y}^h(\mathrm x)=\sum_{I=1}^3N_I^y(\mathrm x)u_I		\tag{27}
$$
其中 $N_I^y(\mathrm x)$ 是形函数的 $y$-导数。

​	写出图2中点 $\mathrm G$处近似值的表达式和它的导数，得到
$$
\begin{align}
u^h(\mathrm{x_G})&=\sum_{I=1}^3N_I(\mathrm{x_G})u_I=N_1(\mathrm{x_G})u_1+N_2(\mathrm{x_G})u_2+N_3(\mathrm{x_G})u_3		\tag{28a}\\
u_{,x}^h(\mathrm{x_G})&=\sum_{I=1}^3N_I^x(\mathrm{x_G})u_I=N_1^x(\mathrm{x_G})u_1+N_2^x(\mathrm{x_G})u_2+N_3^x(\mathrm{x_G})u_3		\tag{28b}\\
u_{,y}^h(\mathrm{x_G})&=\sum_{I=1}^3N_I^y(\mathrm{x_G})u_I=N_1^y(\mathrm{x_G})u_1+N_2^y(\mathrm{x_G})u_2+N_3^y(\mathrm{x_G})u_3		\tag{28c}\\
\end{align}
$$
​	等式（28a）-（28c）说明和FEM相比，MPFEM三角形的表达式和FEM是完全一致的。然而，根本的不同在于MPFEM的形函数不能作为插值函数。图2（b）中可以看到原因。注意点 $\mathrm G$和 $\mathrm H$的MPFEM元素是如何重叠的。因此如果要获得一个与两个三角形都相交的点的近似值就会产生问题。换种说法就是，要决定选用哪个元素为点进行插值。因此，为解决这个矛盾，MPFEM近似值被构建在需要获取近似值的单独的离散点上。

​	这就导致了MPFEM中移动（第一个‘M’）的解释。移动的想法是使用上面详述的再现条件在域中逐点计算MPFEM形函数。 因此，MPFEM元素的概念纯粹是出于比较目的，因为元素不用于对任何属性插值。

​	现在，将形函数及其导数的表达式以可用的形式写出。 对于图1中的点 $\mathrm G$，这些表达式变为
$$
\begin{align}

\left[\begin{matrix}1&1&1\\x_1-x_G&x_2-x_G&x_3-x_G\\y_1-y_G&y_2-y_G&y_3-y_G\end{matrix}\right]
\left[\begin{matrix}N_1(\mathrm{x_G})\\N_2(\mathrm{x_G})\\N_3(\mathrm{x_G})\end{matrix}\right]&=
\left[\begin{matrix}1\\0\\0\end{matrix}\right]		\tag{29a}\\
\left[\begin{matrix}1&1&1\\x_1-x_G&x_2-x_G&x_3-x_G\\y_1-y_G&y_2-y_G&y_3-y_G\end{matrix}\right]
\left[\begin{matrix}N_1^x(\mathrm{x_G})\\N_2^x(\mathrm{x_G})\\N_3^x(\mathrm{x_G})\end{matrix}\right]&=
\left[\begin{matrix}0\\1\\0\end{matrix}\right]		\tag{29b}\\
\left[\begin{matrix}1&1&1\\x_1-x_G&x_2-x_G&x_3-x_G\\y_1-y_G&y_2-y_G&y_3-y_G\end{matrix}\right]
\left[\begin{matrix}N_1^y(\mathrm{x_G})\\N_2^y(\mathrm{x_G})\\N_3^y(\mathrm{x_G})\end{matrix}\right]&=
\left[\begin{matrix}0\\0\\1\end{matrix}\right]		\tag{29c}

\end{align}
$$
值得注意的是，方程（29a）-（29c）只是第3.1节中定义的再现条件的显式表达式。还需要注意（29a）-（29c）的最后一项是表 $\mathrm I$中总结的再现向量。当前情形下，我们定义矩阵 $\mathrm W$：
$$
\mathrm{W(x_G)}=\left[\begin{matrix}
1&1&1\\x_1-x_G&x_2-x_G&x_3-x_G\\y_1-y_G&y_2-y_G&y_3-y_G
\end{matrix}\right]		\tag{30}
$$
等式（29a）-（29c）可以结合为一个，给出点 $\mathrm G$处的形函数及其导数：
$$
\left[\begin{matrix}1&1&1\\x_1-x_G&x_2-x_G&x_3-x_G\\y_1-y_G&y_2-y_G&y_3-y_G\end{matrix}\right]
\left[\begin{matrix}
N_1(\mathrm{x_G})&N_1^x(\mathrm{x_G})&N_1^y(\mathrm{x_G})\\
N_2(\mathrm{x_G})&N_2^x(\mathrm{x_G})&N_2^y(\mathrm{x_G})\\
N_3(\mathrm{x_G})&N_3^x(\mathrm{x_G})&N_3^y(\mathrm{x_G})
\end{matrix}\right]=
\left[\begin{matrix}1&0&0\\0&1&0\\0&0&1\end{matrix}\right]		\tag{31}
$$
我们在前面声明过MPFEM应与FEM具有相同级别的效率，现在我们来解释一下：

* 在MPFEM中没有数值积分。
* 节点数量比高斯正交点的个数少很多。
* 如（31）所示，我们已经推导出了用于确定每个节点的形函数及其导数的显式表达式；因此，只需要一个矩阵求逆来确定所有必要的插值。

##### 3.3 MPFEM应用基本边界条件

​	如下图所示，可以构造MPFEM以复原边界粒子的克罗内克$\delta $属性。通过实现这一点，可以像FEM一样简单地执行基本边界条件。可以实现这一点的一种方式是选择粒子本身作为边界粒子的邻居之一。例如，考虑图4中所示的情况。在这种情况下，粒子$1$是形函数需要的边界点。对于粒子 $1$，$\mathrm W$变为
$$
\mathrm W(x_1)=\left[\begin{matrix}
1&1&1\\0&x_2-x_1&x_3-x_1\\0&y_2-y_1&y_3-y_1
\end{matrix}\right]		\tag{32}
$$
$\mathrm W$的逆矩阵乘以 $\mathrm P(0)$，其中$\mathrm{P(0)^T}=[1,0,0]$，得到
$$
\left[\begin{matrix}N_1(x_1)\\N_2(x_1)\\N_3(x_1)\end{matrix}\right]=
\left[\begin{matrix}1\\0\\0\end{matrix}\right]		\tag{33}
$$
所以保留了克罗内克$\delta $属性。

#### 4 五节点MPFEM元素

##### 4.1 元素描述

​	我们选择详细研究的MPFEM元素是一个5节点元素，它再现了一个常数场，$x$和$y$平面的线性场，以及$x$和$y$平面的二次场。图5（a）给出了该元素的图形描述。 所有MPFEM元素的潜在问题是当 $\mathrm W$ 矩阵是单数时。 因此，我们建议MPFEM5的$x$-导数采用以下形式：
$$
\mathrm N_2^x(\mathrm x_5)=\frac{1}{4}(\mathrm Q)+(\eta_1-\frac{1}{4})(\mathrm R)+(\eta_2-\frac{1}{4})(\mathrm S)		\tag{34}
$$
其中
$$
\begin{align}
\mathrm Q&=\left[\begin{matrix}
N_{1A}^x(\mathrm x_5)\\0\\0\\N_{4A}^x(\mathrm x_5) \\N_{5A}^x(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
N_{1B}^x(\mathrm x_5)\\N_{2B}^x(\mathrm x_5)\\0\\0 \\N_{5B}^x(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\N_{2C}^x(\mathrm x_5)\\N_{3C}^x(\mathrm x_5)\\0 \\N_{5C}^x(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\0\\N_{3D}^x(\mathrm x_5)\\N_{4D}^x(\mathrm x_5) \\N_{5D}^x(\mathrm x_5)
\end{matrix}\right]		\tag{35a}\\
\mathrm R&=\left[\begin{matrix}
N_{1A}^x(\mathrm x_5)\\0\\0\\N_{4A}^x(\mathrm x_5) \\N_{5A}^x(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
N_{1B}^x(\mathrm x_5)\\N_{2B}^x(\mathrm x_5)\\0\\0 \\N_{5B}^x(\mathrm x_5)
\end{matrix}\right]		\tag{35b}\\
\mathrm S&=\left[\begin{matrix}
0\\N_{2C}^x(\mathrm x_5)\\N_{3C}^x(\mathrm x_5)\\0 \\N_{5C}^x(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\0\\N_{3D}^x(\mathrm x_5)\\N_{4D}^x(\mathrm x_5) \\N_{5D}^x(\mathrm x_5)
\end{matrix}\right]		\tag{35c}
\end{align}
$$
且 $N_{IA}^x(\mathrm x_5)$是关于粒子 $5$处的三角形的 $x$-导数。

​	在上文中，MPFEM5元素首先被分解为四个三角形，如图5（b）所示。 这样做是因为已知三角形单元的  $\mathrm W$矩阵不是单数的，除非三个点位于一条直线上。 然后，对于每个三角形，求解与（29b）和（29c）相同的一组方程，得到在点 $5$ 处每个三角形的每个点的$x$-和$y$-导数。这确保满足了常数和线性导数的再现条件。 因此，$\mathrm Q$是点 $5$ 处四个三角形的导数的简单平均。

##### 4.2 $x$-导数

​	然而，尚未施加显性或二次再现条件。对于$x$-导数，必须求解下面的方程，这个方程给出了（34）中$\eta$的值
$$
\left[\begin{matrix}\eta_1\\\eta_2\end{matrix}\right]=
\left[\begin{matrix}\alpha_1&\alpha_2\\\alpha_3&\alpha_4\end{matrix}\right]^{-1}
\left[\begin{matrix}1\\0\end{matrix}\right]		\tag{36a,b}
$$
其中
$$
\begin{align}
\alpha_1&=\sum_IN_{IA}^x(\mathrm x_I-\mathrm x_5)+
\sum_JN_{JB}^x(\mathrm x_J-\mathrm x_5)		\tag{37a}\\
\alpha_2&=\sum_IN_{IC}^x(\mathrm x_I-\mathrm x_5)+
\sum_JN_{JD}^x(\mathrm x_J-\mathrm x_5)		\tag{37b}\\
\alpha_3&=\sum_IN_{IA}^x(\mathrm x_I-\mathrm x_5)^2+
\sum_JN_{JB}^x(\mathrm x_J-\mathrm x_5)^2		\tag{37c}\\
\alpha_4&=\sum_IN_{IC}^x(\mathrm x_I-\mathrm x_5)^2+
\sum_JN_{JD}^x(\mathrm x_J-\mathrm x_5)^2		\tag{37b}
\end{align}
$$
如（37a）和（37b）中那样施加线性再现条件导出等式（36a），如（37c）和（37d）中那样施加二次再现条件导出（36b）。

​	从上面可以看出，$\eta $代表了粒子离散化的几何不规则性。 如果网格是规则的，$\eta_1=\eta_2=\frac{1}{4}$，并且点5的形函数导数是包括该点的三角形的$x$-导数的平均值。 对于这种情况，$\mathrm R$和$\mathrm S$项对微分近似没有贡献。 因此，（34）中的第一项可以被认为是满足常数再现条件的项。 如果网格不规则，$\eta_1\ne\frac{1}{4},\eta_2\ne\frac{1}{4}$，（34）中的$\mathrm R$ 和$\mathrm S$ 向量不再为零。 因此，这些项可以被认为是满足线性和二次再现条件的项。

​	现在让我们通过求逆$\mathrm W$ 矩阵并乘以适当的再现向量来证明（34）的等价性，以获得形函数导数（对于规则间距）。 考虑粒子5的MPFEM5元素，如图5（a）所示。 将均匀网格间距定义为$\Delta $。通过求解方程组来计算$x$-导数
$$
\mathrm N^x(\mathrm x_5)=\mathrm W^{-1}\mathrm P^x(0)		\tag{38a}
$$
其中
$$
\begin{align}
\mathrm W^{-1}&=\left[\begin{matrix}
1&1&1&1&1\\
-\Delta&0&\Delta&0&0\\
0&-\Delta&0&\Delta&0\\
\Delta^2&0&\Delta^2&0&0\\
0&\Delta^2&0&\Delta^2&0
\end{matrix}\right]^{-1}		\tag{38b}\\
\mathrm P^x(0)^{\mathrm T}&=[0,1,0,0,0]		\tag{38c}
\end{align}
$$
对于这样的均匀间隔配置，
$$
\mathrm N^x(\mathrm x_5)^{\mathrm T}=[-\frac{1}{2\Delta},0,\frac{1}{2\Delta},0,0]		\tag{39}
$$


应用上面描述的理论，如图4（b），MPFEM5元素首先被分解成四个三角形，这四个三角形展示如下
$$
\begin{align}
N_A^x(\mathrm x_5)^{\mathrm T}=[-\frac{1}{\Delta},0,0,0,\frac{1}{\Delta}]		\tag{40a}\\
N_B^x(\mathrm x_5)^{\mathrm T}=[-\frac{1}{\Delta},0,0,0,\frac{1}{\Delta}]		\tag{40b}\\
N_C^x(\mathrm x_5)^{\mathrm T}=[0,0,\frac{1}{\Delta},0,-\frac{1}{\Delta}]		\tag{40c}\\
N_D^x(\mathrm x_5)^{\mathrm T}=[0,0,\frac{1}{\Delta},0,-\frac{1}{\Delta}]		\tag{40d}\\
\end{align}
$$
有了这些结果并利用（34）很容易证明，在均匀间隔情形下，（34）的结果等价于（39）。

​	为了完整性，应该注意MPFEM5形函数满足克罗内克$\delta$ 属性。 这可以通过在（38b）中求逆$\mathrm W$并乘以适当的再现向量来证明。 生成的形函数在点$\mathrm x_5$处具有克罗内克$\delta$ 属性。

##### 4.3 $y$-导数

​	对于 $y$-导数，一个几乎与 $x$-导数相同的计算过程将在下面给出。首先，$y$-导数可以写作
$$
\mathrm N^y(\mathrm x_5)=\frac{1}{4}(\mathrm Q)+(\eta_1-\frac{1}{4})(\mathrm R)+(\eta_2-\frac{1}{4})(\mathrm S)		\tag{41}
$$
其中
$$
\begin{align}
\mathrm Q&=\left[\begin{matrix}
N_{1A}^y(\mathrm x_5)\\0\\0\\N_{4A}^y(\mathrm x_5) \\N_{5A}^y(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
N_{1B}^y(\mathrm x_5)\\N_{2B}^y(\mathrm x_5)\\0\\0 \\N_{5B}^y(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\N_{2C}^y(\mathrm x_5)\\N_{3C}^y(\mathrm x_5)\\0 \\N_{5C}^y(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\0\\N_{3D}^y(\mathrm x_5)\\N_{4D}^y(\mathrm x_5) \\N_{5D}^y(\mathrm x_5)
\end{matrix}\right]		\tag{42a}\\
\mathrm R&=\left[\begin{matrix}
N_{1A}^y(\mathrm x_5)\\0\\0\\N_{4A}^y(\mathrm x_5) \\N_{5A}^y(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\N_{2C}^y(\mathrm x_5)\\N_{3C}^y(\mathrm x_5)\\0 \\N_{5C}^y(\mathrm x_5)
\end{matrix}\right]		\tag{42b}\\
\mathrm S&=\left[\begin{matrix}
N_{1B}^y(\mathrm x_5)\\N_{2B}^y(\mathrm x_5)\\0\\0 \\N_{5B}^y(\mathrm x_5)
\end{matrix}\right]+
\left[\begin{matrix}
0\\0\\N_{3D}^y(\mathrm x_5)\\N_{4D}^y(\mathrm x_5) \\N_{5D}^y(\mathrm x_5)
\end{matrix}\right]		\tag{42c}
\end{align}
$$
​	注意上面的等式与（34）和（35）的相似性，区别在于不同的三角形分组；三角形 $\mathrm A$和$\mathrm C$ 组合在一起，三角形 $\mathrm B$ 和 $\mathrm D$组合在一起。同样，尚未满足更高阶的再现条件。在这种情况下，施加了$y$上的线性和二次再现条件。 对应于（36）和（37）的等式是

$$
\left[\begin{matrix}\eta_1\\\eta_2\end{matrix}\right]=
\left[\begin{matrix}\alpha_1&\alpha_2\\\alpha_3&\alpha_4\end{matrix}\right]^{-1}
\left[\begin{matrix}1\\0\end{matrix}\right]		\tag{43}
$$
其中
$$
\begin{align}
\alpha_1&=\sum_IN_{IA}^y(\mathrm y_I-\mathrm y_5)+
\sum_JN_{JC}^y(\mathrm y_J-\mathrm y_5)		\tag{44a}\\
\alpha_2&=\sum_IN_{IB}^y(\mathrm y_I-\mathrm y_5)+
\sum_JN_{JD}^y(\mathrm y_J-\mathrm y_5)		\tag{44b}\\
\alpha_3&=\sum_IN_{IA}^y(\mathrm y_I-\mathrm y_5)^2+
\sum_JN_{JC}^y(\mathrm y_J-\mathrm y_5)^2		\tag{44c}\\
\alpha_4&=\sum_IN_{IB}^y(\mathrm y_I-\mathrm y_5)^2+
\sum_JN_{JD}^y(\mathrm y_J-\mathrm y_5)^2		\tag{44b}
\end{align}
$$

##### 4.4 边界处理

​	使用MPFEM5元素时需要注意的一个事实是，边界粒子将经历与内部粒子不同的离散化。 这是因为不可能为边界粒子形成MPFEM5元素。 因此，为边界粒子构造了4粒子四边形单元。 构造边界四边形用以再现$x$和$y$上的常数线性场，以及$x$或$y$上的二次场。 选择二次场是为了确保 $\mathrm W $ 矩阵是可逆的。 与第3.3节中所示的边界元素一样，这个4粒子四边形可以被证明保留了克罗内克属性，以确保基本边界条件的简单实施。 4粒子四边形如图6所示。

​	规则边界的特殊情况涉及角粒子。 对于这些情况，如果有人尝试再现二次场，会发现  $ \mathrm W$矩阵是单数的。 针对这种特殊情况再现的是常数场，$x$和$y$上的线性场，以及$xy$上的双线性场。



#### 5 数值样例

##### 5.1 剪切加载束

​	在本节中，MPFEM5元件用于解决在其自由端受到剪切加载束的问题。详细的问题陈述是

位移：
$$
u_1(0,0)=u_2(0,0)=0,\quad{u_1(0,\pm c)=0}		\tag{45a}
$$
牵引力：
$$
\begin{align}
t_1(x,\pm c)&=t_2(x,\pm c)=0,\quad x\in(0,L)		\tag{45b}\\
t_1(L,y)&=0,\quad y\in(-c,c)		\tag{45c}\\
t_2(L,y)&=\frac{P(c^2-y^2)}{2I},\quad y\in(-c,c)		\tag{45d}\\
t_1(0,y)&=\frac{PLy}{I},\quad y\in(-c,0)\cup(0,c)		\tag{45e}\\
t_2(0,y)&=\frac{-P(c^2-y^2)}{2I},\quad y\in(-c,0)\cup(0,c)		\tag{45f}
\end{align}
$$
$P$ 是常量，$c=D/2$，且惯性矩$I$由下式给出
$$
I=\frac{2c^3}{3}		\tag{45g}
$$
问题的精确解由下面的式子给出：
$$
\begin{align}
\sigma_{11}&=\frac{-P(L-x)y}{I},\quad\sigma_{22}=0,\quad \sigma_{12}=\frac{P(c^2-y^2)}{2I}		\tag{45h}\\
u_1&=\frac{-Py}{6\tilde EI}\left((6L-3x)x+(2+\tilde v)\left(y^2-\frac{D^2}{4}\right)\right)		\tag{45i}\\
u_2&=\frac{P}{6\tilde EI}\left(3\tilde vy^2(L-x)+(4+5\tilde v)\frac{D^2x}{4}+(3L-x)x^2\right)		\tag{45j}
\end{align}
$$
对于平面应变，
$$
\tilde v=\frac{v}{1-v}\quad 且 \quad \tilde E=\frac{E}{1-v^2}	\tag{45k}
$$
其中， $P=-1,D=2,L=10,E=2000$ 且$v=0.3和0.4999$。控制方程和弱形式和第2部分给出的相同（见图7）。

##### 5.2 数值结果

​	为了评估解决方案中的误差，我们使用如下位移误差范式：
$$
\|u-u^h\|=\frac{\sum_{I=1}^\mathrm{NP}(\mathrm u_I-\mathrm u_I^h)\cdot(\mathrm u_I-\mathrm u_I^h)}
{\sum_{J=1}^{\mathrm{NP}}(\mathrm u_J\cdot\mathrm u_J)}		\tag{46}
$$
在上式中，$\mathrm u$是精确解且 $u^h$是近似解。

​	讨论数值结果之前，我们首先阐明这个问题中使用的位移误差的定义。



















