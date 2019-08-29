#### 6 自动代理

*名词解释*：

*涌现（emergence）*：或称*创发*、*突现*是一种现象，为许多小实体相互作用后产生了大实体，而这个大实体展现了组成它的小实体所不具有的特性。

*禽拥行为（Flocking behavior）*：是一群被称为群（flock）的鸟类在觅食或逃跑时表现出来的行为。 与鱼的浅滩行为，昆虫的蜂群行为和陆地动物的群体行为有相似之处。[维基](https://en.wikipedia.org/wiki/Flocking_(behavior))中这个词还没有中文解释，网络中有人将其译为“植绒行为”，个人认为可能是和*Flock(texture)*搞混了。

6.1

* 自动代理是指无需引导的根据环境进行自我决策的行为（运动）。
* 自我感知需要三个基本组件：感知环境的能力；处理环境信息并计算得到结果；无需引导。
* 一个著名的例子：Reynolds’s “boids” model。

6.2

* 汽车模型的三阶段：行为选择，转向，运动。
* 我们需要关注的是行为选择：模型需要表现的情感是什么，它的动力是什么。

6.3

* 转向力（steering force）的概念：汽车模型的后续动作是寻求目标。在第2掌中，我们会给汽车模型施加一个指向目标的牵引力，但是现在，我们希望汽车根据想要移动的方式，和当前的运动状态作比较，然后施加相应的力。

  `steering force = desired velocity - current velocity`

* 这两者有什么区别呢？我想可能是这样的：

  * 从力的来源来看，前者靠的是目标的吸引力，后者是自发的转向力。
  * 从力的作用点来看，后者在纠正速度，而前者更像在纠正位移。

  * 从结果来看，前者更倾向于围绕目标运动；后者是朝着目标运动（转向力较小是也表现围绕，但围绕半径会逐渐变小）。

  

* 汽车的目的是以自己能达到的最快速度奔向目标地址。所以期望速度（desired velocity） 的方向和大小都有了。转向力可求。

* 将汽车看作有生命的模型，受于自身属性的限制，模型能够提供的转向力（steering force）的不同，会表现出不同的运动轨迹。

6.4

* 上一节的汽车模型在想什么？“我要尽快的抵达目标”，导致汽车超过了目标再折返回来。现实中是怎样的？汽车停进车库，蜜蜂落在花上。它们在想，“我已经接近目标了，我需要减速；我到达目标了，需要停下来”。
* Reynolds 给出了这样一个描述：在目标的周围有一个给定半径的圆，模型进入圆的边缘时开始减速，在边缘位置的期望速度（desired velocity）为最大速度，当达到圆心时，期望速度降为0。

6.5

* Reynolds的随机漫步（见图6.12）：在当前速度的前方固定距离的画一个点，以该点为圆心`r`为半径画圆。圆上取随机的一个点作为汽车模型的目标点。期望速度指向目标点。
* 在围墙内运动，当距离墙面足够近时，汽车模型的期望速度是：保持和墙面平行方向速度不变，和墙面垂直方向速度反向。

6.6

* 什么是流场？把Processing窗口想象成很多方形格子，在每个格子里都有一个指向某方向的箭头。当模型来到某个格子时，格子的箭头就是模型的期望速度。
* Reynolds的跟随流场模型它会预测模型将来的位置，然后会跟随该位置（预测位置）上的向量。为了实现简单，我们只关心当前位置向量。
* `resolution`是指单位场（一个格子）的边长，比如20像素。
* 给出了各种场：单一方向场、随机场、佩林噪音场、指向中心的场。
* 示例代码`NOC_6_04_Flow_Figures`给出了保存图片`saveFrame('filename')`和停止渲染`noLoop()`的用法。`NOC_6_04_Flowfield`给出了在窗口输出文本的方法`text(char, x-coor, y-coor)`。

6.7

* 点乘的定义：

  ```java
  public float dor(PVector v){
    return x*v.x + y*v.y + z*v.z;
  }
  ```

* 点乘的作用：求两个向量的夹角：
  $$
  \vec{A}\cdot\vec{B}=\|\vec{A}\|*\|\vec{B}\|*cos(\theta)\\
  $$

* 代码示例

  ```java
  static public float angleBetween(PVector v1, PVector v2) {
      float dot = v1.dot(v2);
      float theta = (float) Math.acos(dot / (v1.mag() * v2.mag()));
      return theta;
  }
  ```

6.8

* 路径跟随：两点之间连线定义为路径，路径有宽度属性，宽度越小，汽车模型跟随随路径越紧密。路径的画法：

  ```java
  void display() {  // Display the path.
      strokeWeight(radius*2);		//画宽度为radius*2的路径
      stroke(0,100);
      line(start.x,start.y,end.x,end.y);
      strokeWeight(1);		//画中线
      stroke(0);
      line(start.x,start.y,end.x,end.y);
  }
  ```

* 预测汽车模型将来的位置（当前位置沿着当前速度方向前进25个像素）：

  ```java
  PVector predict = vel.get();	//copy the velocity
  predict.normalize();
  predict.mult(25);
  //Add vector to location to find the predicted location.
  PVector predictLoc = PVector.add(loc, predict);
  ```

  其中`predict.normalize();`是获取单位长度，在Processing中一个单位长度即一个像素。

* 判断预测位置（predictLoc）到路径中线的距离，即求由预测位置向路径做垂线的长度，即预测位置到垂点的距离（normalPoint）：

  ```java
  b.normalize();
  //We can use the dot product to scale b’s length.
  b.mult(a.dot(b));
  PVector normalPoint = PVector.add(path.start,b);
  float distance = PVector.dist(predictLoc, normalPoint);
  ```

  其中`a`为路径起点到预测位置的向量，`b`为路径起点到路径终点的向量。

  `a.dot(b)`的结果为`a`在`b`上的标量投影（scalar projection），其中`b`为单位向量。

* 现在知道预测位置到路径的距离，如果距离大于路径半径（宽度的一半），需要向路径方向转向，否则无需转向。在Reynolds的算法中，转向的目标是垂点前方的一个点：

  ```java
  if (distance > path.radius) {
    //Normalize and scale b (pick 25 pixels arbitrarily).
    b.normalize();
    b.mult(25);
    PVector target = PVector.add(normalPoint,b);
    seek(target);
  }
  ```

  在进行目标计算时，`PVector target = PVector.add(normalPoint,b);`中，`normalPoint`不是垂点吗，如何把一个点加在一个向量上面？如果你也有这样的疑惑，那说明你可能忘记了，点可以看作是原点到该点的向量。在Processing中，`PVector`既表示向量也表示点。

6.9

* 多段路径画法：

  ```java
  void display() {
      // Draw thick line for radius
      stroke(175);
      strokeWeight(radius*2);
      noFill();
      beginShape();
      for (PVector v : points) {
        vertex(v.x, v.y);
      }
      endShape();
      // Draw thin line for center of path
      stroke(0);
      strokeWeight(1);
      noFill();
      beginShape();
      for (PVector v : points) {
        vertex(v.x, v.y);
      }
      endShape();
  }
  ```

  多段路径我尝试着用`line`画，也并没有出现期望的转角处的裂缝，因为`strokeWeight`不止在两侧生效，在两端也生效，即粗线短两端是半个圆弧。
  
* 跟随多段路径的过程：计算预测位置所有路径段的垂直点，并判断该点是否在对应路径段的两端之间，只保留真实存在的垂直点。遍历所有符合要求的垂直点，找到距离预测位置最近的那个。后面的操作和上一节相同。

6.10

* 复杂系统三原则：元素的有限感知；所有元素并行（同时）工作；作为整体的系统展现出新兴的现象。
* 三个可选特征：非线性关系（混沌理论、蝴蝶效应）；竞争与合作，只在有生命的复杂系统里有；反馈（比如人类社会的供需关系、股市）。

6.11

* 群组行为：分离。每个粒子和其他所有粒子比较，当距离小于指定距离时，累加反方向的期望速度（期望速度与距离成反比），并计算平均值。根据当前速度和总的期望速度，计算转向力。

  ```java
  void separate (ArrayList<Vehicle> vehicles) {
  	//Note how the desired separation is based on the Vehicle’s size.
      float desiredseparation = r*2;
      PVector sum = new PVector();
      int count = 0;
      for (Vehicle other : vehicles) {
        float d = PVector.dist(location, other.location);
        if ((d > 0) && (d < desiredseparation)) {
          PVector diff = PVector.sub(location, other.location);
          diff.normalize();
  		//What is the magnitude of the PVector pointing away from the other vehicle? The closer it is, the more we should flee. The farther, the less. So we divide by the distance to weight it appropriately.
          diff.div(d);
          sum.add(diff);
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);	//这个有必要吗，后面是normalize
        sum.normalize();
        sum.mult(maxspeed);
        PVector steer = PVector.sub(sum, vel);
        steer.limit(maxforce);
        applyForce(steer);
      }
  }
  ```

6.12

* 新建`void applyBehaviors()`来管理其他的行为：

  ```java
  void applyBehaviors(ArrayList<Vehicle> vehicles) {
      PVector separate = separate(vehicles);
      PVector seek = seek(new PVector(mouseX,mouseY));
  	//We have to apply the force here since seek() and separate() no longer do so.
      applyForce(separate);
      applyForce(seek);
  }
  ```

6.13

* 禽拥（flocking）行为三原则：分离（separation、avoidance），避免与邻居碰撞的转向力；结盟（alignment、copy），保持和邻居的速度方向相同的转向力；内聚（cohesion、center），向着邻居中心的转向力。

  ```java
  void flock(ArrayList<Boid> boids) {
  	//The three flocking rules
      PVector sep = separate(boids);
      PVector ali = align(boids);
      PVector coh = cohesion(boids);
  	//Arbitrary weights for these forces (Try different ones!)
      sep.mult(1.5);
      ali.mult(1.0);
      coh.mult(1.0);
  	//Applying all the forces
      applyForce(sep);
      applyForce(ali);
      applyForce(coh);
  }
  ```

* 分离转向力上一节已经实现了，下面是结盟转向力（只需要计算指定半径范围内的邻居速度）：

  ```java
  PVector align (ArrayList<Boid> boids) {
  	//This is an arbitrary value and could vary from boid to boid.
      float neighbordist = 50;
      PVector sum = new PVector(0,0);
      int count = 0;
      for (Boid other : boids) {
        float d = PVector.dist(location,other.location);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(other.velocity);
  		//For an average, we need to keep track of how many boids are within the distance.
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);	//同样，这个有必要吗，后面是normalize
        sum.normalize();
        sum.mult(maxspeed);
        PVector steer = PVector.sub(sum,velocity);
        steer.limit(maxforce);
        return steer;
      } else {
        //If we don’t find any close boids, the steering force is zero.
        return new PVector(0,0);
      }
  }
  ```

* 接下来是内聚。结盟计算的是邻居的平均速度，这里要计算的是邻居的平均位置：

  ```java
  PVector cohesion (ArrayList<Boid> boids) {
      float neighbordist = 50;
      PVector sum = new PVector(0,0);
      int count = 0;
      for (Boid other : boids) {
        float d = PVector.dist(location,other.location);
        if ((d > 0) && (d < neighbordist)) {
  		//Adding up all the others’ locations
          sum.add(other.location);
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
  	  //Here we make use of the seek() function we wrote in Example 6.8. The target we seek is the average location of our neighbors.
        return seek(sum);
      } else {
        return new PVector(0,0);
      }
  }
  ```

6.14

* 上面介绍的几圈算法复杂度为$N\times N$，当粒子较多时，效率极低。

* 为了改善这种情况，Reynolds在2000年的一篇论文《[Interaction with Groups of Autonomous Characters](http://www.red3d.com/cwr/papers/2000/pip.pdf)》中详细介绍了“bin-lattice spatial subdivision”。利用该算法，假设将空间分为`10*10=100`个网格，2000个粒子的计算复杂度将从`4000000`降为`40000`。

* 为了实现这个算法，需要增加一个二维数组`ArrayList<Boid>[][]`，每个元素是一个列表，记录当前网格内的所有粒子。

  ```java
  int column = int(boid.x) / resolution;
  int row    = int(boid.y) /resolution;
  grid[column][row].add(boid);
  ```

  当获取粒子的邻居时，只检查粒子所在网格的其他粒子即可。（事实上，当粒子在网格边缘时，还要检查邻居网格里的粒子）。

6.15

* 适当的场合，可以使用`magSq()`代替`mag()`以提高效率：

  ```java
  if (v.mag() > 10) {		//slow
    // Do Something!
  }
  if (v.magSq() > 100) {		//fast
    // Do Something!
  }
  ```

* 计算耗时的函数包括`Square root, Sine, Cosine, Tangent`，要尽量避免这些函数出现在大量的循环中。一个可以考虑的方案是建立速查表。

  ```java
  float sinvalues[] = new float[360];
  float cosvalues[] = new float[360];
  for (int i = 0; i < 360; i++) {
    sinvalues[i] = sin(radians(i));
    cosvalues[i] = cos(radians(i));
  }
  ```

  当我需要计算`sin(PI)`时，

  ```java
  int angle = int(degrees(PI));
  float answer = sinvalues[angle];
  ```

* 为了使代码可读性强，示例代码的`draw()`函数以及调用的子函数中创建了超级多的`PVector`。这也会严重的影响效率。应该避免如此。

  ```java
  void draw() {		//slow
    for (Vehicle v : vehicles) {
     PVector mouse = new PVector(mouseX,mouseY);
     v.seek(mouse);
    }
  }
  
  PVector mouse = new PVector();		//fast
  void draw() {
    mouse.x = mouseX;
    mouse.y = mouseY;
    for (Vehicle v : vehicles) {
     v.seek(mouse);
    }
  }
  ```



#### 7 元胞自动机

7.0

* 这一章不在讨论向量和运动，转而把关注点放在系统和算法上。上一章模拟了禽拥（flocking）行为，并简要陈述了复杂系统的核心原则：复杂系统不是个体的简单加和，而是并行运行的、小范围内个体互相影响的、能够表现出个体所没有的行为的系统。本章我们将建立另外一个复杂的系统，与之前不同的是，系统中的个体不再是物理世界的一部分，而是一个比特（bit），该比特称为元胞，每个元胞有0和1两种状态。使用这样简单地元素有助于我们理解复杂系统运作的细节。

7.1

* **cellular automata**是**cellular automaton**的复数形式，简称为“CA”。注：CA是复数。
* 元胞（cell）有如下特征：
  * 生活在网格（grid）里，本章有一维和二维的网格，任意有限维度的网格都可以，通过后文可以发现，Grid不是指单独的一个网格，而是一系列的网格；
  * 典型的元胞拥有有限的状态（state）数，最简单的是0和1（开和关、生和死）。
  * 每个元胞都有社区（neighborhood），这里的`neighborhood`是一个整体或一个集合。典型的社区是相邻元胞的列表。注意这里的社区**包含自身**。虽然在7.7节编程游戏人生的时候将自己排除了邻居（neighbors）的范畴，但是并没有说自身不属于社区，7.6节的游戏规则定义中也没有使用社区的概念，而是使用的`neighbors`一词。

* CA是由计算机之父冯·诺依曼为了模拟生命系统所具有的自复制功能而提出来的。之后Stephen Wolfram进行了深入研究，并在[*A New Kind of Science*](http://www.wolframscience.com/nksonline/toc.html)中用了1280页来进行详细的阐释，本章不讨论理论，只涉及代码实现。

7.2

* 我们来用代码实现最简单的CA——基本元胞自动机（Elementary CA）。CA的三个关键元素是：网格、状态集、社区。所以我们使用线性的元胞（cell），每个元胞有随机的0和1状态，每个元胞有两个相邻元胞。边缘的元胞只有一个相邻元胞，我们稍后再说，见图7.5。通过7.6节的描述，我再次确定ECA特指这种最简单的CA——一维的、二元状态集的、社区元素为3的。
* CA生活的一段时间，我们称之为代（generation），在我们的情形下，可以看做是运动的帧数。我们得到了时间为0或者第0代的CA，如何求得第1代和第2代的CA呢？
* 我们使用这样的规则：元胞（cell）在在时间`t`的状态由它的社区（左右邻居和自身）在`t-1`时刻的状态决定的。社区的状态有8种可能的取值。我们假设有这样一个函数，输入社区的状态，输出0或1。这样的函数有2^8=256种可能。每种可能都有编号，从0到255（大概是吧，出于程序员的直觉），我们选取编号为90的函数，称为Rule 90，结果见图7.9。
* 标准的Wolfram模型采用这样的初始状态，也就是第0代CA：中间的元胞状态为1，其他全为0，见图7.10。
* 应用这样的规则，求出每一代的CA并堆叠（stack）起来，我们得到图7.12的结果，这个低解析度的图形称为谢尔宾斯基三角形（Sierpinski triangle）。这是我们下一章要讲的一种分型模式（fractal pattern）。将分辨率提高（每个元胞设为一像素宽），得到图7.13。
* 得到这样的结果并不是巧合，图7.9用图7.14的形式展示，发现规律了吗？另外让我们看看Rule 222的结果，见图7.15。
* 尽管256种规则中只有少数结果令人信服，但是我们依然能够得出结论：简单的规则可以生成如现实世界中所见的那般复杂的模型。

7.3

* 如何在Processing中实现呢，你可能会想这样

  ```java
  class Cell{
  ...
  }
  ```

  但是我们最好这样

  ```java
  int[] cells = {1,0,1,0,0,0,0,1,0,1,1,1,0,0,0,1,1,1,0,0};
  ```

* 边缘的问题。在求下一代CA时，如何处理只有一个相邻元胞的元胞呢？有三种选择：1 保持原值；2 边缘连接，就像把一张纸卷成一个环；3 为边缘定义不同于中心的函数。为了实现简单，我们选择 1。

* 计算第`t`代CA时，不能立即将第`t-1`代数据覆盖，所以我们需要一个临时数组`int[] newcells = new int[cells.length]`。

* 转换规则函数与其用条件函数（一种社区取值对应一种条件，但是如果状态集有四个元素，比如0~3，就需要写2^4=64行代码，如果更大的状态集呢），不如使用数组存储，将元胞体的值转为十进制作为数组索引。实际上，还要将数组翻转才符合我们前面给的函数规则。

* 不用着急，下一节开始渲染。

7.4

* 如果是状态1，就画黑色矩形，否则白色。但是在实现之前，有几个问题要澄清：
  * 这种对数据的直观解释（是指1黑0白吧）仅作为展示CA和基础学习使用，不应该用于指导你的个人工作或用于构建精确系统。
  * 使用二维图形展示一维CA容易使人困惑。我们只是保留了一维CA的历史数据，但是系统本身仍是一维的。我们后面会涉及二维CA。

* 好了，开始吧。计算一维CA的元胞个数：

  ```java
  int w = 10;
  int[] cells = new int[width/w];
  ```

  渲染：

  ```java
  for (int i = 0; i < cells.length; i++) {
    if (cells[i] == 1) fill(0);
    else               fill(255);
    rect(i*w, 0, w, w);
  }
  ```

  渲染第0代CA，所有矩形的`y`坐标都是0。在渲染后面的CA是，需要累加的参数`generation`来计算`y`坐标。

* 即：但在本节中，每次渲染只一代CA（一行），每一代的渲染结果都要保留，无需在每次渲染前清空背景，最后呈现的是多次（height/w次）渲染累加的结果。

7.5

* 根据呈现结果的不同，Wolfram将CA分为四类：
  * 稳定型（uniformity）：一定运行时间之后，每一个元胞的状态都成为常量。比如上面的Rule 222，图7.18。
  * 周期型或重复型（repetition）：一定运行时间之后，和第一类一样，该类也保持稳定，但每个元胞的状态不是常量，而是以有规律的形式震荡。如上面的Rule 190，图7.19，每个元胞的状态周期为“1110”。
  * 混沌型或随机型（random）：表现出随机性，没有可识别的模式。比如Rule 30。
  * 复杂型（complexity）：可以看做分类2、3的结合。表现出重复和震荡，但是何时何地出现不可预期。

7.6

* 将CA从一维扩展到二维。
* John Conway的游戏人生（Game of Life），为我们提供了模拟、重现生物系统的灵感和基础。
* 我们看看游戏人生如何运行的？现在我们有了元胞的二维矩阵。元胞状态1代表存活，0代表死亡。元胞的社区有9个比特，2^9=512种取值。不太可能为每种取值单独定义输出结果，游戏人生定义了这样的规则：
  * 死亡。如果一个元胞处于存活状态，在如下情形下将会死去：
    * 人口过剩：如果元胞有`4`个或更多的邻居存活，他将死去。
    * 孤独：如果元胞有`1`个或更少的邻居存活，他将死去。
  * 诞生。如果元胞处于死亡状态并且恰好（不多不少）有`3`个邻居处于存活状态，他将获得新生。
  * 静止。在其他情况下，状态不变。为了详细，我们描述一下这些情形：
    * 保持存活：如果元胞处于存活状态，且恰好有`2`个或`3`个邻居处于存活状态。
    * 保持死亡：如果元胞处于死亡状态，且处于存活状态的邻居数不等于`3`。

* 在初始CA中（指前面的一维CA，这暗示着，初始CA特指前面那种一维的，只有二元状态集的CA），可以将不同代的CA堆叠在二维网格中；但是游戏人生的CA本身是二维的。不考虑往三维网格堆叠二维CA，典型的方式是，我们一次只能看到一代的数据。
* 游戏人生有一些很有趣的初始模式，有些初始模式保持静止，图7.24；有些在两个状态间震荡，图7.25；还有一些随着代的更新在网格中移动（只是看起来移动，实际上元胞只会更新状态）。如果感兴趣，网上有一些例子，可以自定义初始状态。

7.7

* 编程游戏人生，我们摘录一些重要的代码片段：

  ```java
  //二维数组用于存储元胞状态
  int[][] board = new int[columns][rows];
  //初始化随机值
  for (int x = 0; x < columns; x++) {
    for (int y = 0; y < rows; y++) {
      current[x][y] = int(random(2));
    }
  }
  ```

  ```java
  int[][] next = new int[columns][rows];
  //注意跳过边缘元胞
  for (int x = 1; x < columns-1; x++) {
    for (int y = 1; y < rows-1; y++) {
      int neighbors = 0;
      //统计存活邻居个数（3*3循环）
      for (int i = -1; i <= 1; i++) {
        for (int j = -1; j <= 1; j++) {
          neighbors += board[x+i][y+j];
        }
      }
      //邻居不包括自身哦
      neighbors -= board[x][y];
      //通过规则确定生死
      if      ((board[x][y] == 1) && (neighbors <  2)) next[x][y] = 0;
      else if ((board[x][y] == 1) && (neighbors >  3)) next[x][y] = 0;
      else if ((board[x][y] == 0) && (neighbors == 3)) next[x][y] = 1;
      else next[x][y] = board[x][y];
    }
  }
  //更新generation
  board = next;
  ```

  要注意的是，自己不是自己的邻居，在循环过后要记得`neighbors -= board[x][y]`。

7.8

* 7.3节开始的时候，你想要创建Cell类，我拒绝了你，现在你可以释放自我了。使用Class类利于实现更多的扩展需求。
* 我们只需要把` int[][] board;`改成`Cell[][] board;`
* 为了便于计算，我们可以在Cell类中添加`int previous`属性用来储存上一代的状态值。

7.9

* 我们前面介绍了最著名的一维和二维CA，接下来我们可以尝试一些更具创造性的CA。
* 非矩形网格，比如六边形。
* 按照概率输出结果，比如在游戏人生的人口过剩情形下，有80个点的概率死亡。
* 状态集的连续性，比如不在限于0和1的取值，可以是浮点数。
* 处理图片。比如图片模糊特效、墨汁在纸上扩散。
* 跟踪单元的状态历史。元胞通过历史状态来适应和改变。第10章神经网络中涉及这样的例子。
* 可移动的元胞。前面的例子中，元胞都是固定的。你可以创建元胞可移动的自动机，比如将CA规则用于禽拥（flocking）系统。
* 嵌套。嵌套是复杂系统的另一个特征。比如城市是人的复杂系统，人是器官的复杂系统，器官是细胞的复杂系统等等。



#### 8 分形系统

* 欧几里得几何不能很好的模拟诸如树叶、闪电、山脉、海岸线这些自然几何，我们需要一种模拟自然几何的技术：分形（fractal）。

8.1

* `fractal`是从拉丁语`fractus`（意为打破）创造出来的。

* 图8.2或者示例代码`Figure_8_02_Mandelbrot`展示的[曼德博集合](https://zh.wikipedia.org/wiki/曼德博集合)（Mandelbrot set）是最被熟知的分形模式之一。但这种算法不太实用。

  示例代码需要将`size(863,863/2)`改为`size(863,431)`，并且渲染有点慢，需要耐心等待一会。

* 树杈的分形是自相似的（self-similar），股票的分形是在统计学上是自相似的。它们分别代表了生成分形模式的确定性和随机性技术。

* 自相似是分形的关键特征，但一条线也是自相似的，但不是分形。分形的另一个特征是在小尺度上拥有精细的结构并且不能用欧几里得几何来描述。

* 分形的另一个基本组件是递归（recursive【adj.】,recursion【n.】），分形都有递归的定义。

8.2

* 康托尔集（Cantor set）定义：
  * 以一条线段开始。
  * 擦除中间的三分之一。
  * 对剩下的线段应用第二步，不断重复。

* 我们不会无限应用规则，因为像素是有限的。
* 函数调用自己成为递归，能够解决特定问题，比如阶乘（当然用迭代也能解决）。
* 递归必须有结束条件。

8.3

* 在Processing中实现康托尔集时发现，使用递归比使用迭代更方便。
* 当线段长度小于1时，停止渲染和调用。

8.4

* 只是递归能做的事情有限，联合列表（ArrayList）让我们做更多。
* [科赫曲线](https://zh.wikipedia.org/zh-cn/科赫曲線)（Koch carve）定义：
  * 1 以一条线段开始。
  * 2 线段等分为三段。
  * 3 以中间的线段为底边画等边三角形。
  * 4 擦除等边三角形的底边（线段中间部分）。
  * 5 在剩余的四条线段上应用步骤2到4，不断重复。
* 科赫曲线和其他分形模式常被称为数学怪物，它们最终能得到无限长的线。比如科赫曲线初始长度为1，第n次分形得到总长度为(4/3)^n的线。
* 在编程中，我们将每个科赫曲线的线段当做单独的对象来对待。这提供更多的可能性。
* 说了一堆，直接看示例代码`Exercise_8_02_KochSnowFlake`就够了。通过把`generate()`放进`draw()`函数，我把代码改成了动态的（每分形一次，停顿几秒钟），看起来更直观。

8.5

* 前面的都是确定性分形，不自然，接下来是随机性的。我们使用分形树作为示例，生成规则如下：

  * 画一条线段。
  * 在线段末端，向左旋转画一条较短的线段，向右旋转画一条较短的线段。
  * 得到的新的线段应用第二步，不断重复。

* 与之前的代码相比，难点在于旋转的处理。我们需要用到变换矩阵（transformation matrix）和`pushMatrix(),popMatrix()`函数。后面两个函数的作用在于使两个函数包裹的代码能够进行独立的矩阵变换而不对外部的代码产生影响。查看教程[2D Transformations](http://processing.org/learning/transform2d/)。

* 分支函数定义为三条线段：

  ```java
  void branch(float len) {
    line(0, 0, 0, -len);
    translate(0, -len);
   
    len *= 0.66;	//Each branch’s length shrinks by two-thirds.
    if (len > 2) {
      pushMatrix();
      rotate(theta);
      branch(len);	//Subsequent calls to branch() include the length argument.
      popMatrix();
   
      pushMatrix();
      rotate(-theta);
      branch(len);
      popMatrix();
    }
  }
  ```

  有三点值得注意：1 `branch()`的递归调用； 2 `branch()`需要被`pushMatrix(),popMatrix()`函数包裹； 3 第二组`pushMatrix(),popMatrix()`存在的意义在于，虽然每个分支看起来是独立的，但递归的过程是串行的，不是并行的。

* 示例代码`NOC_8_06_Tree_static`是静态树，`NOC_8_06_Tree`则根据鼠标位置调整旋转角度，`Exercise_8_07_Tree`通过`float sw = map(len,2,120,1,10);`将线段宽度设置为长度的12分之1。

* 本节的主题是随机性，我们加上随机的角度。`branch()`内部总是调用自己两次，调用随机次不行吗？示例代码`NOC_8_07_TreeStochastic`展示了随机生成的树，点击刷新的效果没写好，需要更改下面三个函数：

  ```java
  void setup() {
    size(800, 200);
    smooth();
  }
  void draw() {
    newTree();
    noLoop();
  }
  void mousePressed() {
    redraw();	//重新调用draw()函数，配合包含noLoop()的draw()使用
  }
  ```
  
* 如何画动态的树呢？示例代码`TreeStochasticNoise`，通过二维的佩林噪音（在第0章介绍过）模拟摇曳的效果，有两点值得注意：1 这种摇曳不能说是随风摇曳，因为两个分支经常同时向相反的方向摆动 2 `randomSeed(seed);`函数在每次渲染（`draw()`）时都会调用，这是为了使每次渲染的树都是相同的结构。[伪随机数](https://zh.wikipedia.org/wiki/伪随机性)的生成函数：

  ```c
  /* 使用 ANSI C 可移植算法 */
  static unsigned long int next = 1;    // 种子
  
  int rand(void)                        // 生成伪随机数
  {
      next = next * 1103515245 + 12345;
      return (unsigned int) (next / 65536) % 32768;
  }
  
  void srand(unsigned int seed)         // 修改种
  {
      next = seed;
  }
  ```

  可见，重置随机种子，是为了在每次生产树的时候都能得到相同的随机数列。

8.6 L-systems 

* L-系统是 Lindenmayer systems 的简称，他提供了跟踪复杂和多方面生长规则的分形结构的机制。

* 在Processing中实现L-系统除了递归和转换，还需要习惯字符串（strings）的处理。L系统三个基本组件：

  * 字母表（Alphabet）：L-系统的字母表由可包含的有效字符组成。
  * 公理（Axiom）：公理是一个句子（由字母表中的字符构成），用于表示系统的初始状态。
  * 规则（Rules）：规则应用于公理，并且递归应用，不断生成新的句子。规则包括两个句子，“被替代物”和“替代物”。

* 和分形一样，我们可以称规则的一次替换应用称为一代（generation）。根据定义，第0代就是公理本身。

* 虽然字符串用起来确实比字符数组（char[]）用起来方便，但是使用字符串也存在限制：在Java中，String有最大长度为Integer的最大值，即`2^31-1`；且String类是被`final`修饰的，意味着字符串一旦被创建就不能再更改，所以每次向字符串末尾添加字符实际上都是创建了一个新的字符串，这是很耗资源的。`StringBuffer`类专门用于解决后面这类问题。

  ```java
  StringBuffer next = new StringBuffer();
  for (int i = 0; i < current.length(); i++) {
      char c = current.charAt(i);
      if (c == 'A') {		//注意这里是单引号
          next.append("AB");
      } else if (c == 'B') {
          next.append("A");
      }
  }
  current = next.toString();
  ```

* 这些生成的句子，其实是绘图说明。我们来转换一下：

  * A：向前画一条线段。
  * B：向前走一段距离但不画线。

* 字母表”FG+-[]“是L-系统经常被用到。其含义已经对应的Processing代码为：

  * F：画一条线段，并向前移动。code：`line(0,0,0,len); translate(0,len);`
  * G：向前移动（不画线）。code：`translate(0,len);`
  * +：向右转。code：`rotate(angle);`
  * -：向左转。code：`rotate(-angle);`
  * [：保存当前坐标。code：`pushMatrix();`
  * ]：重载上一个坐标。code：`popMatrix();`

* 接下来就是示例代码`NOC_8_09_LSystem`，可以运行看一下效果。该L-系统定义：

  * 字母集：FG+-[]
  * 公理：F
  * 规则：F $\to$ FF+[+F-F-F]-[-F+F+F]，被替换的句子为“F”，原著多了个“-”符号，这点可以根据代码确认。

* 植物应该是渐渐长高的，上面的示例代码为了让我们看清变化过程，每一代都占用了整个高度。可以将`Turtle`的`len`属性设置为一个较小的值，然后注释掉`turtle.changeLen(0.5)`，会得到一株渐渐长高的植物。实现简单，不贴代码。

#### 9 代码的进化（evolution）

* 将变量视作DNA，可以在代间传递。本章致力于研究生物进化背后的原理，并找到在代码中应用这些原则的方法。

9.1

* 本章分为三部分，大部分时间将花费在第一部分。

  * 传统遗传算法（Traditional Genetic Algorithm）：传统遗传算法为了解决暴力（brute force）算法耗时很长的问题。比如为了得到1到一百万之间的一个数字，暴力算法会依次验证每一个答案，但是如果我们能够告诉你你给出的答案是好还是坏，高还是低，你下次就能给出更接近真实解的值，更快地找到答案。
  * 互动选择（Interactive Selection）：通过用户交互来演化某些东西的过程。
  * 模拟生态系统：屏幕上移动的物体如何相遇、交配并将基因传给下一代。

* 无限猴子定理（infinite monkey theorem）：一只猴子随机敲打键盘并最终完成莎士比亚的全部作品（无限时间）。实际上成功的概率极低。

* 如果我们知道答案，我们可以很容易的打印出结果：

  ```java
  string s = "To be or not to be that is the question";
  println(s);
  ```

  如果我们不知道答案呢？

9.2

* 达尔文进化论（Darwinian evolution）的三个原则：
  * 遗传。子女必须能够接收父母的属性。如果生物活到可以生育的年龄，他们的特征就会传给下一代。
  * 变异。必须存在不同的特征或者引入变异的手段，如果大家都一样，就不会有新的特征组合，也不会有任何发展。
  * 选择。通过这种机制，一些个体成为父母并遗传其基因，一些个体则没有。通常称为“适者生存”。
* 算法本身将分为两部分：一组初始条件和不对重复的步骤直到得到正确答案。

9.3

* 















