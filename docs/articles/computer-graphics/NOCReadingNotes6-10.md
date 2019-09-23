*注*：1 第九和第十章的在线示例长时间运行会非常占用电脑资源，所以每当你看完一个示例演示之后，可以点一下左下角的PAUSE按钮。

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

#### 9 The Evolution of Code

* 将变量视作DNA，可以在代间传递。本章致力于研究生物进化背后的原理，并找到在代码中应用这些原则的方法。

9.1

* 本章分为三部分，大部分时间将花费在第一部分。

  * 传统遗传算法（Traditional Genetic Algorithm）：传统遗传算法为了解决暴力（brute force）算法耗时很长的问题。比如为了得到1到一百万之间的一个数字，暴力算法会依次验证每一个答案，但是如果我们能够告诉你你给出的答案是好还是坏，高还是低，你下次就能给出更接近真实解的值，更快地找到答案。
  * 互动选择（Interactive Selection）：通过用户交互来演化某些东西的过程。
  * 模拟生态系统：屏幕上移动的物体如何相遇、交配并将基因传给下一代。


9.2

* 无限猴子定理（infinite monkey theorem）：一只猴子随机敲打键盘并最终完成莎士比亚的全部作品（无限时间）。实际上成功的概率极低。

* 如果我们知道答案，我们可以很容易的打印出结果：

  ```java
  string s = "To be or not to be that is the question";
  println(s);
  ```

  如果我们不知道答案呢？

9.3

* 达尔文进化论（Darwinian evolution）的三个原则：
  * 遗传。子女必须能够接收父母的属性。如果生物活到可以生育的年龄，他们的特征就会传给下一代。
  * 变异。必须存在不同的特征或者引入变异的手段，如果大家都一样，就不会有新的特征组合，也不会有任何发展。
  * 选择。通过这种机制，一些个体成为父母并遗传其基因，一些个体则没有。通常称为“适者生存”。
* 算法本身将分为两部分：一组初始条件和不对重复的步骤直到得到正确答案。

9.4

* 基因算法第一步：创建族群（population）。猴子打字的目标是进化出短语“cat”，如果现在有三个短语“hug” “rid” “won”，无论怎么拼接都不能得到“cat”，因为没有足够的多样性。大量的短语更有可能包含足够的属性来得到我们想要的结果。
* 在遗传学领域，基因型（genotype）和表型（phenotype）是完全不同的概念。在我们的例子中，数字信息本身是成员的基因型，表型是该数据的表达。在编程过程中如何设计基因型和表型，最简单的例子是颜色，比如0表现为黑色，255表现为白色。在其他例子中，整数还可以表现为线段的长度、力的大小等。
* 我们这样总结第一步：创建一个包含N个成员的族群，每个成员携带随机生成的基因。

9.5

* 基因算法第二步：选择。选择分为两步：
  * 评估健康度（evaluate fitness）：为了使我们的遗传算法正常运行，我们需要设计所谓的健康度函数。 该函数将产生数字分数来描述给定成员的健康度。在当前猴子打字的例子中，比如有三个成员“hut” “car” “box”，“car”显然是最健康的，因为它有两个正确的字符，“hut”只有一个，“box”零个，这就是评估健康度的函数。
  * 创建交配池（mating pool）：每个成员都有健康度，我们就可以选择那些适合成为父母的成员放入交配池中。选择方案有很多，比如选择得分最高的两个成员繁殖**所有**的下一代，但这不符合变异原则，反而会限制进化；或者我们可以选择更大的交配池（1000成员的前500名），但他不能产生最佳结果，第1名和第500名成为父母的机会均等，为什么第500名成员有机会，第501名成员却没有。交配池更好的解决方案是概率方法，我们称之为“命运轮盘”或“赌博轮盘”。
* 通过健康度得分归一化，可以计算每个成员的概率。基于健康度的概率选择算法的优势在于：1 得分最高的成员最有机会被选中； 2 完全没有消除族群的多样化，得分最低的成员也有概率向下一代传播基因。因为即使最低的成员也有可能携带真正有用的基因，所以不应该被消除。

9.6

* 根据达尔文的遗传原则，子女继承父母的属性。有很多方法可以应用，比如无性繁殖，选择一个个体并制作副本作为下一代，但是标准的做法是选择两个成员作为父母并通过以下步骤繁殖：
  * 交配（crossover）。在当前例子中，我们可以选择父亲的前半段基因和母亲的后半段基因，拼接生成下一代。另一个变种方法是随机选择中点，即不一定恰好继承父母各方一半的基因。还有一种可能是每一个字符都从父母双方随机选取，就像抛硬币。
  * 变异（mutation）：将产生的子女作为下一代之前还要经过最后一道工序，变异。变异是可选的，因为有时候不是必需的。突变使用比例来表示。在我们的例子中字符突变定义为选择一个新的字符。突变率可以定义为`0.5%` `1%`等，如果突变率太高（比如`80%`），否定了进化论本身，因为不能保证优秀的基因出现的几率更高。
* 选择和繁殖的过程重复N次，直到获得N个新的成员，新的一代称为当前族群，并重复选择和繁殖的过程。
* 在编写代码之前，总结一下整个过程：
  * 第一步，初始化。创建N成员族群，成员携带随机基因。
  * 循环：
    * 第二步：选择。评估成员健康度并创建交配池。
    * 第三步：繁殖。重复N次：
      * 根据概率（通过健康度计算得到）选取两个成员作为父母。
      * 交配-结合父母的基因产生后代。
      * 变异-通过给定概率改变子女基因。
      * 将新生子女加入下一代。
    * 第四步：新一代取代上一代并回到第二步。

9.7

* 第一步：创建族群。大多数情况下族群成员数是固定的，我们可以使用数组（成员可变时用列表）。数组的每个元素是一个对象，我们称之基因。

  ```java
  class DNA {
    char[] genes = new char[18];
   
    DNA() {
      for (int i = 0; i < genes.length; i++) {
  	//Picking randomly from a range of characters with ASCII values between 32 and 128. For more about ASCII: http://en.wikipedia.org/wiki/ASCII
        genes[i] = (char) random(32,128);
      }
    }
  }
  ```

  ```java
  DNA[] population = new DNA[100];
   
  void setup() {
    for (int i = 0; i < population.length; i++) {
  	//Initializing each member of the population
      population[i] = new DNA();
    }
  }
  ```

* 第二步：选择。在基因类内部添加健康度函数。

  ```java
  class DNA {
    float fitness;
  
    void fitness () {
      int score = 0;
      for (int i = 0; i < genes.length; i++) {
        if (genes[i] == target.charAt(i)) {	//Is the character correct?
          score++;	//If so, increment the score.
        }
      }
      fitness = float(score)/target.length();		Fitness is the percentage correct.
    }
  ...
  ```

  并在渲染的时候进行计算：

  ```java
  void draw() {
    for (int i = 0; i < population.length; i++) {
      population[i].fitness();
    }
  ...
  ```

  获取所有成员的健康度之后，就可以建立交配池。交配池是一个数据结构，我们不断的从中选取两个成员作为父母，健康度越高，被选中几率越高。如何实现“命运轮盘”呢？我们将创建一个桶（ArrayList），并将父母成员添加进桶N次，N是健康度得分（score）的百分点数。

  ```java
  ArrayList<DNA> matingPool = new ArrayList<DNA>();
  for (int i = 0; i < population.length; i++) {
    //n is equal to fitness times 100, which leaves us with an integer between 0 and 100.
    int n = int(population[i].fitness * 100);
    for (int j = 0; j < n; j++) {
      //Add each member of the population to the mating pool N times.
      matingPool.add(population[i]);
    }
  }
  ```

  Exercise 9.2：用于生成随机数的自定义分布的其他方法之一称为蒙特卡罗方法。 这种技术涉及挑选两个随机数，第二个数字作为限定数字，并确定是否应保留或丢弃第一个随机数。（关于这种方法可以查看[rejection sampling](https://en.wikipedia.org/wiki/Rejection_sampling)）

  Exercise 9.3：有时成员健康度差别会很大，这时可以使用排名来计算选择概率。

* 第三步：繁殖。首先选择两个成员作为父母。再次说明，两个成员不是必须的，你可以选择进行无性繁殖，或者挑选三个或四个作为父母。

  ```java
  int a = int(random(matingPool.size()));
  int b = int(random(matingPool.size()));
  DNA parentA = matingPool.get(a);
  DNA parentB = matingPool.get(b);
  ```

  因为列表中可能有成员的多个实例，所以就可能选择了同一个成员两次。为了严格，可以添加额外的代码处理这种情况。（同时a,b本身可能相等，这种情况可以再生成新的随机数）

  然后交配和变异：

  ```java
  DNA child = parentA.crossover(parentB);
  child.mutate();
  ```

  使用“随机中点法”实现交配：

  ```java
  DNA crossover(DNA partner) {
    //child会有随机的DNA，但不用担心，后面会将其覆盖
    DNA child = new DNA();
    //Picking a random “midpoint” in the genes array
    int midpoint = int(random(genes.length));
    for (int i = 0; i < genes.length; i++) {
      if (i > midpoint) child.genes[i] = genes[i];
      else child.genes[i] = partner.genes[i];
    }
    return child;
  }
  ```

  下面是变异的函数，注意`1%`概率发生的实现方式：

  ```java
  float mutationRate = 0.01;
  void mutate() {
    //处理基因中的每一个字符
    for (int i = 0; i < genes.length; i++) {
      if (random(1) < mutationRate) {
        //Mutation, a new random character
        genes[i] = (char) random(32,128);
      }
    }
  }
  ```

9.8

* 把代码整合在了一起，可以看示例代码`NOC_9_01_Shakespeare_simplified`。运行时可能会提示“Courier”字体找不到，这没什么关系。一个存在的问题是程序运行期间我们不能获得直观的感受，所以示例代码`NOC_9_01_Shakespeare`添加了一些统计学属性，让门们可以看到族群进化的过程。

9.9

* 使用遗传算法在应用程序之间迁移，核心机制不需要变，但是三个关键组件需要自定义。

* 关键组件一：改变变量。前面的示例中有两个全局变量：

  ```java
  float mutationRate = 0.01;
  int totalPopulation = 150;
  ```

  这两个值对族群行为有很大的影响，随意的给定值并不是好主意。根据实验数据可以得出一些结论。成员数量的增加可以减少获取最终短语所需的代数，但不一定能缩短时间，成员数量过大会使程序运行缓慢。突变率也会产生影响，如果突变率为零，你只能期待足够幸运能够拥有合适的初始值，否则可能永远获取不到正确的短语，而如果突变率为`10%`，你则需要等待更长的时间。

* 关键组件二：健康度函数。上面的桶的例子是有缺陷的，健康度`80%`和`80.1%`的成员都向桶中添加80次，他们被选取的概率相等。我们来看一下现在的健康度函数，正确字符数和健康度是线性关系，如何让健康度随着正确字符数的增长成倍增长呢？让健康度和正确字符数的平方正相关。另外一个方式，让健康度和2的“正确字符数”次幂正相关。

* 讨论线性性相关和指数相关固然重要，但是还有更重要的问题，在你的实验中健康度未必总和字符串相关。游戏中的电脑玩家也是常见场景，假设用户玩家是守门员，其他玩家是由你的计算机程序控制的，电脑玩家的健康度和其得分数相关。得分越多的电脑玩家出现在下一局的几率会更高。而当用户玩家更换时，电脑玩家的健康度会明显降低并可是新的进化。这个场景展示了一个非常强大的东西-系统的适应性。

* 关键组件三：基因型和表型。基因型类`DNA`会包含一个参数数组，以便能够迭代应用`crossover()`和`mutate()`函数。

  ```java
  class DNA {
    float[] genes;
  
    DNA(int num) {
      genes = new float[num];
      for (int i = 0; i < genes.length; i++) {
        genes[i] = float(1);	//Always pick a number between 0 and 1.
      }
    }
  ...
  ```

  表型类是不同的类，比如`Vehicle`，能够被基因类控制其表象或行为，为了建立这种关系，在`Vehicle`中维护一个`DNA`类的示例。

  ```java
  class Vehicle {
    DNA dna;
   
    float maxspeed;
    float maxforce;
    float size;
    float separationWeight;
  ... 
    Vehicle() {
      DNA = new DNA(4);
  	//Using the genes to set variables
      maxspeed = dna.genes[0];
      maxforce = dna.genes[1];
      size = dna.genes[2];
      separationWeight = dna.genes[3];
  ...
    }
  ```

  基因的每个元素都在0到1取值，但是这个范围也许不能满足参数的实际需求，此时借助map函数会很方便：

  ```java
  size = map(dna.genes[2],0,1,10,72);
  ```

  而在另外一些情况下，你想要的基因是一个对象数组，比如火箭的一系列推进器，这时基因数组的每个元素是具有方向和大小属性的PVector。

  ```java
  class DNA {
    PVector[] genes;
   
    DNA(int num) {
      genes = new float[num];
      for (int i = 0; i < genes.length; i++) {
        genes[i] = PVector.random2D();	//A PVector pointing in a random direction
        genes[i].mult(random(10));	//And scaled randomly
      }
    }
  ...
  ```

9.10

* 智能火箭（Smart Rockets）。Jer Thorp指出NASA使用进化计算技术来解决各种问题，从卫星天线设计到火箭发射模式。 这激发了他创造了不断发展的火箭的Flash演示。 场景的说明：

  * 一组火箭从屏幕底部发射企图撞击屏幕顶部的一个目标（障碍物阻挡了直线行进路线）。
  * 每枚火箭都配备了五个可变强度和方向的推进器。 推进器不会一次连续推进; 相反，他们以自定义序列一次一个地工作。

* 受Jer Thorp启发，本节我们发明了自己的智能火箭。我们的火箭只有一个推进器，并在每帧的运动中都可以向任何方向以任何大小的力推进。将第2章的Mover类重命名为Rocket，并在`draw()`函数中调用`applyForce()`实现推进。

* 让我们重新审视9.9节总结的三个关键组件：

  * 成员数量和变异率。暂定为成员数量100，变异率1%。

  * 健康度函数。因为我们的目标是到达目的地。所以离目的地越近，健康度越高。我们前面讨论过平方的使用，所以

    ```java
    void fitness() {
      float d = PVector.dist(location,target);
      fitness = pow(1/d,2);
    }
    ```

  * 基因型和表型。猴子打字的基因类在这里我们需要改一下基因组的类型

    ```java
    class DNA{
    	PVector[] genes;
    ...
    ```

    然后考虑一下随机基因的初始化：

    ```java
    PVector v = new PVector(random(-1,1),random(-1,1));
    ```

    如果是这样，将生成一些如图9.12所示的向量，在各个方向上向量大小不一致，所以这样：

    ```java
    for (int i = 0; i < genes.length; i++) {
      //random2D()生成一个随机角度的单位向量，如图9.13
      genes[i] = PVector.random2D();
    }
    ```

    单位向量的力事实上有点大，我们在基因类中添加阈值：

    ```java
    class DNA {
      PVector[] genes;
      float maxforce = 0.1;
     
      DNA() {
        //We need a PVector for every frame of the rocket’s life.
        genes = new PVector[lifetime];
        for (int i = 0; i < genes.length; i++) {
          genes[i] = PVector.random2D();
          genes[i].mult(random(0, maxforce));
        }
      }
    ...
    ```

    需要注意到我们创建了和火箭寿命等长的数组，在火箭寿命的每一帧都需要记录一个PVector。

    表型-火箭类是从第2章的Mover类得到的，需要向其中添加基因和健康度属性以及健康度评估函数。

    ```java
    class Rocket {
      DNA dna;
      float fitness;
    ...
    ```

    以及基因的应用：

    ```java
    int geneCounter = 0;
    void run() {
      applyForce(dna.genes[geneCounter]);		//Apply a force from the genes array.
      geneCounter++;	//Go to the next force in the genes array.
      update();	//Update the Rocket’s physics.
    }
    ```

9.11

* 现在就差族群（Population）类了，莎士比亚猴子的族群类在建立交配池和产生后代的方法完全一致，重要的改变是，猴子的字符串一旦生成就可以评估健康度，但是火箭必须存活一段时间才能评估健康度。所以向族群类中添加`run()`函数进行物理模拟，完成更新坐标和渲染操作。

  ```java
  void live () {
    for (int i = 0; i < population.length; i++) {
      //The run function takes care of the forces, updating the rocket’s location, and displaying it.
      population[i].run();
    }
  }
  ```

* 和莎士比亚的例子不同，我们不需要每帧都进行族群的繁殖，我们的步骤如下：

  * 创建族群；
  * 火箭生存N帧；
  * 进化出下一代：选择、繁殖；
  * 回到第二步。

* 示例代码：`NOC_9_02_SmartRockets_superbasic`。但这并不有趣，下面我们讨论两个改进的地方，并提供代码片段。

* 改进一：添加障碍物。添加障碍物类，并写一个函数检测火箭是否撞上了障碍物：：

  ```java
  class Obstacle {
    //An obstacle is a location (top left corner of rectangle) with a width and height.
    PVector location;
    float w,h;
      
    boolean contains(PVector v) {
      if (v.x > location.x && v.x < location.x + w && v.y > location.y && v.y < location.y + h) {
        return true;
      } else {
        return false;
      }
    }
  ...
  ```

  假设有很多个障碍物，火箭类中添加方法检测是否撞击，并使用布尔值`stopped`记录：

  ```java
  void obstacles() {
    for (Obstacle obs : obstacles) {
      if (obs.contains(location)) {
        stopped = true;
      }
    }
  }
  ```

  如果发生撞击，我们就停止更新它的坐标：

  ```java
  void run() {
    if (!stopped) {
      applyForce(dna.genes[geneCounter]);
      geneCounter = (geneCounter + 1) % dna.genes.length;
      update();
      obstacles();
    }
  }
  ```

  如果发生撞击，健康度会很低：

  ```java
  void fitness() {
    float d = dist(location.x, location.y, target.location.x, target.location.y);
    fitness = pow(1/d, 2);
    if (stopped) fitness *= 0.1;
  }
  ```

* 改进二：更快得到达目标。前面的例子中，火箭行的并没有因为更快得到达目标而获得奖励；如果火箭更快得接近目标并超过了目标可能会受到惩罚，最终的结果是，缓慢而稳定的火箭将会获胜。

  同样，可以用很多方法。比如可以使用火箭在任意时刻的最短距离，而不是结束时刻的最短距离，称之为火箭的距离纪录。其次，火箭应该因为更快地到达目标获得奖励。可以再火箭类中添加计时器，用于记录到达目标的时间，并且时间越短，评估的健康度越高。

  ```java
  void checkTarget() {
    float d = dist(location.x, location.y, target.location.x, target.location.y);
    if (d < recordDist) recordDist = d;
  
    if (target.contains(location)) {
      hitTarget = true;
    } else if (!hitTarget) {
      finishTime++;
    }
  }
  ```

  ```java
  void fitness() {
    fitness = (1/(finishTime*recordDist));
    fitness = pow(fitness, 2);
  
    if (stopped) fitness *= 0.1;
    if (hitTarget) fitness *= 2;	//You are rewarded for reaching the target.
  }
  ```

* 另外一个著名的基因算法的实现是Karl Sims的虚拟生物进化（Evolved Virtual Creatures）。评估一个虚拟生物族群完成特定任务（比如游泳、跑步、跳跃、争夺箱子）的能力。Karl Sims的创新之处在于基于节点（node-based）的基因型，即基因不是字符或向量的线性列表，而是节点的位图。

9.12

* 除了“虚拟生物进化”之外，Sims还因其博物馆装置Galapagos而闻名。 该装置最初于1997年安装在东京的互通中心，由12个监视器组成，显示计算机生成的图像。 图像的健康度与观看者观看的时间长度有关。 这被称为交互式选择，一种具有由用户指定的健康度值的遗传算法。
* 在面部（face）进化的实验中，面部的基因是一个浮点数组，每个属性对应一个0到1点浮点值。表型Face类包含一个基因对象。在屏幕上画面部的时候，将基因值通过`map`函数映射到合适区间，也可以通过`colorMode()`将颜色区间设置为0到1。
* 与前面的例子不同的是健康度函数`fitness()`。我们请用户来调配健康度。如何设计交互不属于本书的内容。简单起见，当鼠标滑过面部时，提高健康度；点击“evolve next generation”时生成下一代。
* 该试验只是为了证明交互选择的可行性，不要在其他方面过于苛求，他确实非常的粗糙。

9.13

* 之前的实验与现实相比都有点奇怪，比如下一代同时出生，上一代同时消失，也没有人用计算器去统计健康度。我们有必要研究一下如何用遗传算法构建类似于生态系统的东西，就像每章结尾那样。

* 我们从一个简单场景开始。一种叫“小胖（bloop）”的圆形生物，根据佩林噪音在屏幕上移动。它有半径和最大速度，而且半径越大，速度越慢。我们使用ArrayList而不是数组存储族群，意味着成员数量是可变的。ArrayList将存储在World类中，管理族群的所有成员。

* 我们要添加两个额外的功能：出生和死亡。死亡是替代健康度评估和选择的功能，如果成员死亡，他就无法被选择，因为它已经不存在了。一种实现死亡的机制是在类中添加健康变量。每一帧运动，健康度降低一些，降至0即死亡。我们必须设法让成员拥有不同的寿命，以防止他们同时死去，比如速度更快的小胖更容易逃脱，所以活得更久，或者引入食物机制，进食可以延长寿命。

  ```java
  void eat() {
    for (int i = food.size()-1; i >= 0; i--) {
      PVector foodLocation = food.get(i);
      float d = PVector.dist(location, foodLocation);
      if (d < r/2) {
        health += 100;
        food.remove(i);
      }
    }
  }
  ```

* 接下来建立基因型和表型。小胖找到食物的能力和两个变量有关-大小和速度。但因为大小和速度反相关，所以只需要存储一个值。

  ```java
  class DNA {
    float[] genes;
    DNA() {
      genes = new float[1];
      //只有一个值，但沿用数组。这样方便扩展
      for (int i = 0; i < genes.length; i++) {
        genes[i] = random(0,1);
      }
    }
  ...
  ```

  表型是小胖类本身，大小和速度由内部的基因类决定。

  ```java
  class Bloop {
    PVector location;
    float health;
   
    DNA dna;
    float r;
    float maxspeed;
   
    Bloop(DNA dna_) {
      location = new PVector(width/2,height/2);
      health = 200;
      dna = dna_;
       maxspeed = map(dna.genes[0], 0, 1, 15, 0);
      r        = map(dna.genes[0], 0, 1, 0, 50);
    }
  ...
  ```

  根据上面的代码，基因值为0以15的速度移动，基因为1则不动。

* 选择和繁殖。小胖的生命越长，繁殖机会就越多，寿命即健康值。一种选择是，当两个小胖相遇时，就会产生一个小小胖，因为寻找对象也是繁殖的因素之一。一个更简单的算法是“无性繁殖”，其描述为：在任意给定时刻，小胖有1%的机会繁殖后代。

  ```java
  Bloop reproduce() {
    if (random(1) < 0.01) {
      // Make the Bloop baby
    }
  }
  ```

  在前面的实验，繁殖过程我们调用了`crossover()`，在单性繁殖中，我们调用`copy()`：

  ```java
  Bloop reproduce() {
    if (random(1) < 0.0005) {
      DNA childDNA = dna.copy();
      childDNA.mutate(0.01);
      return new Bloop(location, childDNA);
    } else {
      return null;
    }
  }
  ```

  注意，上面显示繁殖几率更低了，这个值的影响在于，繁殖几率高会产生人口过剩，过低则导致族群灭绝。自我复制的函数实现如下，利用了`arraycopy`函数：

  ```java
  class DNA {
  	//This copy() function replaces crossover() in this example.
    DNA copy() {
       float[] newgenes = new float[genes.length];
      arraycopy(genes,newgenes);
      return new DNA(newgenes);
    }
    ...
  }
  ```

  程序运行的结果是中型体积和中型移动速度的小胖最终活下来。

* 每章课后练习：生态系统。



#### 10 神经网络

10.0

* 人类的大脑可以描述为生物神经网络-传输复杂模式的电信号的神经元互联网络。在本章中，我们将首先概述神经网络的属性和特征，并构建一个最简单的例子。 之后，我们将研究创建Brain对象的策略，该对象可以插入到我们的Vehicle类中并用于确定转向。 最后，我们还将研究用于可视化和动画的神经网络技术。

10.1

* 1943年，神经科学家Warren S. McCulloch和逻辑学家Walter Pitts开发了人工神经网络的第一个概念模型。 在他们的论文“A logical calculus of the ideas imminent in nervous activity”中，他们描述了神经元的概念，一个生活在细胞网络中的单个细胞，接收输入、处理这些输入并产生输出。
* 有些事情对人类来说很难，比如求964324的平方根，但机器不到一毫秒就能得出982。有些事对人类来说很简单，对带脑来说确很困难，比如分辨猫和狗，识别特定的人（在神经网络发明以前）。当今计算中神经网络最常见的应用之一就是执行这些“人工容易，机器困难”的任务，通常称为模式识别。 应用范围从光学字符识别（将打印或手写扫描转换为数字文本）到面部识别。 推荐两本书：《*Artificial Intelligence: A Modern Approach* 》by Stuart J. Russell and Peter Norvig 以及《*AI for Game Developers* 》by David M. Bourg and Glenn Seemann.
* 神经网络是连接机制（connectionist）的计算系统。我们通常的系统是线性的，执行完一条指令，继续下一条。神经网络是并行的。单个神经元很简单，但是很多神经元的网络表现出丰富和智能的行为。
* 神经网络的关键要素之一是它的学习能力。 神经网络不仅仅是一个复杂的系统，而是一个复杂的自适应系统，这意味着它可以根据流经它的信息改变其内部结构。 通常，这是通过调整权重来实现的。
* 学习策略有几种，我们研究其中两种：
  * 监督学习（Supervised Learning）。我们的第一个例子使用这种策略。
  * 无监督学习（Unsupervised Learning）。我们的实验不涉及。
  * 强化学习（Reinforcement Learning）。在机器人技术中很常见。我们的小车转向实验中使用这种策略。
* 神经网络的学习能力，使其在人工智能领域很有用。以下是软件中的一些标准用法，并非全部：
  * 模式识别。比如人脸识别（facial recognition）。
  * 预测时间序列。比如天气、股票。
  * 信号处理。比如助听器需要滤除不必要的噪声并放大重要声音。
  * 控制。比如自动驾驶。
  * 软传感器（Soft Sensors）。接收多个单独传感器的数据作为整体评估。
  * 异常检测 - 因为神经网络非常善于识别模式，所以它们也可以被训练以在出现不适合模式的事物时生成输出。

10.2

* 感知机（Perceptron）是最简单的神经网络：单个神经元的计算模型。感知机遵循前馈（feed-forward）模型，让我们看看每一步：

  * 第一步：输入值。

    ```
    Input 0: x1 = 12
    Input 1: x2 = 4
    ```

  * 第二步：输入权重（weight）。输入值传送给感知器之前要先加权重，创建建感知器时分配随机权重。

    ```
    Weight 0: 0.5
    Weight 1: -1
    ```

  * 第三步：求和。

    ```
    Sum = 12 * 0.5 + 4 * -1 = 2
    ```

  * 第四步：生成输出。求和结果经过激活函数（activation function）处理生成输出结果，最简单的情况下，激活函数告诉感知器是否触发（是否输出结果）。事实上激活函数可以是很复杂的，但是在我们的例子中，我们只将激活函数作为输出结果的符号。

10.3

* 一个最简单的模式识别的例子，通过训练感知器判断二维空间的一点在直线的哪一侧。感知器有两个输入值（x，y坐标值），激活函数判断计算结果符号输出-1或1。
* 考虑点（0,0），不管怎么调整输入权重，加和总为0。所以增加一个输入值：偏移量（bias）。偏移量通常为1并且也有权重值。计算结果是三个值权重之后的和，根据结果符号判断位置关系，所以偏移量本身，即反映了点（0,0）和直线的相对关系。

10.4

* 编码实现感知器Perceptron类，该类只需要跟踪权重数据。

  ```java
  class Perceptron {
    float[] weights;
    
    Perceptron(int n) {
      weights = new float[n];
      for (int i = 0; i < weights.length; i++) {
        weights[i] = random(-1,1);	//The weights are picked randomly to start.
      }
    }
  ...
  ```

  感知器需要接受输入生成输出，我们定义函数`feedforward`：

  ```java
  int feedforward(float[] inputs) {
    float sum = 0;
    for (int i = 0; i < weights.length; i++) {
      sum += inputs[i]*weights[i];
    }
    return activate(sum);
  }
  ```

  现在创建一个感知机，让它猜猜点在线的上方还是下方：

  ```java
  Perceptron p = new Perceptron(3);
  float[] point = {50,-12,1};
  int result = p.feedforward(point);
  ```

  它猜对了吗？这时候，他猜对的概率不会超过一半，记得吗，我们初始化的权重值是随机生成的。除非我们告诉它怎么做，否则他很难把事情做准确。

* 在我们的方法中，还要为输入值提供已知的结果。网络借此知道是否做出正确的判断，如果错误，就要调整权重。过程如下：

  * 1 向感知机提供已知结果的输入值。
  * 2 让感知机猜答案。
  * 3 计算误差。
  * 4 根据误差调整所有权重。
  * 5 回到第1步并重复。

  第3步和第4步如何实现？误差定义为：

  `ERROR = DESIRED OUTPUT _ GUESS OUTPUT`

  这类似于第六章计算转向力：

  `STEERING = DESIRED VELOCITY - CURRENT VELOCITY`

  因为输出值只有-1和1，意味着误差值只有三种取值：-1，0，1。误差是权重调整的决定因素，我们想计算得到的权重调整值称为“delta weight”，delta代表希腊字母 $ \Delta$。

  `NEW WEGHT = WEIGHT + DELTA WEIGHT` 且 `DELTA WEIGHT = ERROR * INPUT`

  所以`NEW WEGHT = WEIGHT + ERROR * INPUT`

  为了说明以上工作机制，我们还是回到转向力的例子。转向力是速度的偏差，如果将转向力作为加速度，小车就会向正确的方向移动。这也是我们想要对神经网络中权重做的，我们想要把它调整到正确的方向。

  在转向力实验中，转向力越大，速度调整的越快，转向力小，就调整得慢。神经网络中也有类似的机制，称为“学习常数（learning constant）”。将其添加进公式：

  `NEW WEGHT = WEIGHT + ERROR * INPUT * LEARNING CONSTANT`

  学习常数越大，权重调整的就越快，但可能跃过最合适的值；学习常数小，需要训练越长的时间，但结果会更精确。将变量c作为学习常数，训练函数如下：

  ```java
  float c = 0.01;
   
  void train(float[] inputs, int desired) {
    int guess = feedforward(inputs);
    float error = desired - guess;
    for (int i = 0; i < weights.length; i++) {
      weights[i] += c * error * inputs[i];
    }
  }
  ```

* 为了训练感知机，我们需要已知结果的输入值的集合。我们将一组输入值和结果封装为Trainer类：

  ```java
  class Trainer {
    float[] inputs;
    int answer;
   
    Trainer(float x, float y, int a) {
      inputs = new float[3];
      inputs[0] = x;
      inputs[1] = y;
      inputs[2] = 1;	//the bias input
      answer = a;
    }
  }
  ```

  接下来的问题是，如何计算点在线的上方还是下方？

  ```java
  float yline = f(x);
  if (y < yline) {
    answer = -1;	//在线的上方（这里别搞错了，Processing的y轴正方向向下）
  } else {
    answer = 1;
  }
  ```

  训练感知机：

  ```java
  Trainer t = new Trainer(x, y, answer);
  ptron.train(t.inputs,t.answer);
  ```

10.5

* 将感知机的概念应用于转向行为，并说明强化学习。**注**:该例子中有很多不合理的地方，没法一一指出，只理解思想即可。

* 假设有一个小车和一个目标列表，小车搜寻屏幕上的所有目标。还可以根据规则设置转向力权重，比如离目标越远，力就越大。

  ```java
  void seek(ArrayList<PVector> targets) {
    for (PVector target : targets) {
      //For every target, apply a steering force towards the target.
      PVector force = seek(targets.get(i));
      float d = PVector.dist(target,location);
      float weight = map(d,0,width,0,5);
      force.mult(weight);
      applyForce(force);
    }
  }
  ```

  但是如果我们交个一个大脑去处理这件事呢？接收所有的力，输出处理后的力：

  ```java
  class Vehicle {
    Perceptron brain;
    
    void seek(ArrayList<PVector> targets) {
      PVector[] forces = new PVector[targets.size()];
      for (int i = 0; i < forces.length; i++) {
        forces[i] = seek(targets.get(i));
      }
      PVector output = brain.process(forces);
      applyForce(output);
    }
  ```

  这开辟了一种可能性，车辆可以决定如何驾驶，从错误中学习并对环境的刺激做出反应。感知机的处理函数如下：

  ```java
  PVector feedforward(PVector[] forces) {
    PVector sum = new PVector();
    for (int i = 0; i < weights.length; i++) {
      // Vector addition and multiplication
      forces[i].mult(weights[i]);
      sum.add(forces[i]);
    }
    // No activation function
    return sum;
  }
  ```

  一旦施加了转向力，就应该向大脑提供反馈，称之为强化学习。大脑根据反馈判断向特定方向的引导是好的还是坏的。比如小车只想呆在屏幕中心，那么：

  ```java
  PVector desired = new PVector(width/2,height/2);
  PVector error = PVector.sub(desired, location);
  brain.train(forces,error);	//将输入力的副本和观察结果传给大脑
  ```

  大脑将误差作为调整权重的依据：

  ```java
  void train(PVector[] forces, PVector error) {
    for (int i = 0; i < weights.length; i++) {
      weights[i] += c*error.x*forces[i].x;
      weights[i] += c*error.y*forces[i].y;
    }
  }
  ```

  每个权重都调整了两次，一次是x轴误差，一次是y轴误差。

10.6

* 如果你阅读人工智能的书籍，它会说感知机只能处理线性可分问题，比如点线位置关系的例子。图10.11中，左侧图的两种颜色的点可以用直线分开，他是线性可分的；右侧点则不能。
* 最简单的非线性可分的例子是“XOR”，或称为“异或（Exclusive or）”。看图10.13的真值表。XOR相当于OR且NOT AND：$p\oplus q = (p\lor q)\land \lnot (p\land q)$，即“一真一假才为真”。感知机甚至不能解决异或问题，但是如果用两个感知机组成网呢，一个感知机处理OR，另一个感知机处理NOT AND。
* 图10.14被称为多层（multi-layered）感知机。由很多个神经元组成，一些是输入神经元，专门接收输入数据，一些作为隐藏层的组成部分（因为他们既不直接接收输入，又不直接给出输出），剩下的是输出神经元，是我们读取输出数据的地方。
* 训练这种神经网络要复杂得多。因为有很多连接，并且处于不同的层，如何得知每个神经元或者连接对整体误差的贡献有多大呢？优化多层网络权重值的解决方案称为反向传播。输入和前馈的过程是一样的，不同之处在于数据在到达输出神经元之前要通过一层额外的神经元。训练依旧依赖于误差，然而，误差必须通过网络反向传播。最终误差用于调整所有连接的权重。反向传播有点超出了本书的范围，涉及更高级的激活函数（称为sigmoid函数）以及一些基本的微积分。
* 我们将专注于构建网络的可视化架构的代码框架。 我们将创建Neuron对象和Connection对象，进而创建Network对象并设置动画以显示前馈进程。 这将与我们在第5章（toxiclibs）中研究的一些力导向图示例非常相似。

10.7

* 接下来我们的目标是创建如10.15所示的网络图。

* 神经元类描述一个坐标实体：

  ```java
  class Neuron {
    PVector location;
    Neuron(float x, float y) {
      location = new PVector(x, y);
    }
    void display() {
      stroke(0);
      fill(0);
      ellipse(location.x, location.y, 16, 16);
    }
  }
  ```

  网络类管理神经元列表，以及自己的坐标：

  ```java
  class Network {
    ArrayList<Neuron> neurons;
    PVector location;
   
    Network(float x, float y) {
      location = new PVector(x,y);
      neurons = new ArrayList<Neuron>();
    }
  
    void addNeuron(Neuron n) {
      neurons.add(n);
    }
  
    void display() {
      pushMatrix();
      translate(location.x, location.y);
      for (Neuron n : neurons) {
        n.display();
      }
      popMatrix();
    }
  }
  
  ```

  现在可以简单的画一下：

  ```java
  Network network;
   
  void setup() {
    size(640, 360);
    network = new Network(width/2,height/2);
  
    Neuron a = new Neuron(-200,0);
    Neuron b = new Neuron(0,100);
    Neuron c = new Neuron(0,-100);
    Neuron d = new Neuron(200,0);
  
    network.addNeuron(a);
    network.addNeuron(b);
    network.addNeuron(c);
    network.addNeuron(d);
  }
   
  void draw() {
    background(255);
    network.display();
  }
  ```

  没错，还少了连接类。连接类有三个元素组成：两个神经元以及权重值：

  ```java
  class Connection {
  A connection is between two neurons.
    Neuron a;
    Neuron b;
    float weight;
   
    Connection(Neuron from, Neuron to,float w) {
      weight = w;
      a = from;
      b = to;
    }
  
    void display() {
      stroke(0);
      //权重表现为线段的宽度
      strokeWeight(weight*4);
      line(a.location.x, a.location.y, b.location.x, b.location.y);
    }
  }
  ```

  有了连接类，我们想着创建神经元后连接神经元：

  ```java
  void setup() {
    size(640, 360);
    network = new Network(width/2,height/2);
   
    Neuron a = new Neuron(-200,0);
    Neuron b = new Neuron(0,100);
    Neuron c = new Neuron(0,-100);
    Neuron d = new Neuron(200,0);
   
  	//Making connections between the neurons
    network.connect(a,b);
    network.connect(a,c);
    network.connect(b,d);
    network.connect(c,d);
   
    network.addNeuron(a);
    network.addNeuron(b);
    network.addNeuron(c);
    network.addNeuron(d);
  }
  ```

  所以网络类要维护连接的列表吗，向管理神经元一样？不是的。因为我们要显示前馈过程，所以每个神经元最好知道他后面连接了谁。

  ```java
  void connect(Neuron a, Neuron b) {
    Connection c = new Connection(a, b, random(1));
    a.addConnection(c);
  }
  ```

  上面的代码，神经元b不必知道他的前面是谁，因为我们不演示反向传播。

  神经元接收并保存连接，渲染时调用连接的渲染：

  ```java
  class Neuron {
    PVector location;
    ArrayList<Connection> connections;
   
    Neuron(float x, float y) {
      location = new PVector(x, y);
      connections = new ArrayList<Connection>();
    }
    
    void addConnection(Connection c) {
      connections.add(c);
    }
    
    void display() {
      stroke(0);
      strokeWeight(1);
      fill(0);
      ellipse(location.x, location.y, 16, 16);
   
      for (Connection c : connections) {	//Drawing all the connections
        c.display();
      }
    }
  ...
  ```

10.8

* 为了演示前馈过程，我们希望看到数据的流动。加入我们希望这样像网络输入：

  ```java
  network.feedforward(random(1));
  ```

  网络类选择第一个神经元接收输入：

  ```java
  class Network {
    void feedforward(float input) {
      Neuron start = neurons.get(0);
      start.feedforward(input);
    }
  ...
  ```

  在接到输入数据时，神经元的标准处理方式是将其累加，并通过一个简单的激活函数（是否大于1）判断是否触发下一步行为：

  ```java
  class Neuron
    int sum = 0;
    void feedforward(float input) {
      sum += input;
      if (sum > 1) {
        fire();
        sum = 0;
      }
    }
  ...
  ```

  `fire()`函数做什么呢？通过连接向前传递：

  ```java
  void fire() {
    for (Connection c : connections) {
      c.feedforward(sum);
    }
  }
  ```

  因为连接都有权重，我们很容易想到应该根据权重来传递数据：

  ```java
  class Connection {
    void feedforward(float val) {
      b.feedforward(val*weight);
    }
  ...
  ```

  但是我们实际上是想直观的看到数据从`a`到`b`的移动过程。首先数据从`a`出发：

  ```java
  PVector sender = a.location.get();
  ```

  我们可以用很多运动算法实现移动的过程，这里我们使用简单的插值函数：

  ```java
  sender.x = lerp(sender.x, b.location.x, 0.1);
  sender.y = lerp(sender.y, b.location.y, 0.1);
  ```

  有了坐标，我们就可以画当前帧的数据：

  ```java
  ellipse(sender.x, sender.y, 8, 8);
  ```

  我们还需要一个布尔值记录信号是否正在传播：

  ```java
  class Connection {
    boolean sending = false;
    PVector sender;
    float output;
   
    void feedforward(float val) {
      sending = true;
      sender = a.location.get();
      output = val*weight;
    }
  ...
  ```

  当连接被激活时立即调用`feedforward()`函数，并且每次渲染（`draw()`）时更新传播中的数据的位置，Connection类还要提供一个更新函数：

  ```java
  void update() {
    if (sending) {
      sender.x = lerp(sender.x, b.location.x, 0.1);
      sender.y = lerp(sender.y, b.location.y, 0.1);
  
      float d = PVector.dist(sender, b.location);
      //当距离足够近时，停止传播动画
      if (d < 1) {
        b.feedforward(output);
        sending = false;
      }
    }
  }
  ```

* 见示例代码：`NOC_10_04_NetworkAnimation`。



#### 结束语：

​	本书结束了，但是几乎没有触及到我们生活的世界和模拟它的技术。我希望将来会添加新的教程和示例。

















