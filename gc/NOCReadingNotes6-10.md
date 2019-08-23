#### 6 自动代理

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

* 组行为：分离。每个粒子和其他所有粒子比较，当距离小于指定距离时，累加反方向的期望速度（期望速度与距离成反比），并计算平均值。根据当前速度和总的期望速度，计算转向力。

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

* 集群（flocking）行为三原则：分离（separation、avoidance），避免与邻居碰撞的转向力；结盟（alignment、copy），保持和邻居的速度方向相同的转向力；内聚（cohesion、center），向着邻居中心的转向力。

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













