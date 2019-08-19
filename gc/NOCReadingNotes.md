[The Nature of Code在线阅读](https://natureofcode.com/book/)

[The Nature of Code示例代码](https://github.com/nature-of-code/noc-examples-processing)



#### 0 Introduction

0.2

* `random()`是一个伪随机（pseudo-random）方法模拟的随机函数，[用法](https://processing.org/reference/random_.html)：

  ```
  float f1 = random(4);	//获取[0,4)的随机值
  float f2 = random(-1,1);	//获取[-1,1)的随机值
  ```

0.4

* `random`获取的随机值是平均分布的，现实中常用到正态分布（或叫高斯分布）；

* 高斯分布由两个特征值决定，平均值（mean）$\mu$和标准差（standard deviation）$\sigma$。根据两个数值可以得出：68%的成员分布在距离平均值一个标准差的范围内，98%的成员分布在两个标准差范围内，99.7%分布在三个以内。

  示例代码：

  ```
  Random generator = new Random();
  float num = (float)generator.nextGaussian();	//nextGaussian返回double
  float sd = 60;
  float mean = 320;
  float x = num*sd+mean;	//x是得到的高斯分布值
  ```

0.5

* 一个获取自定义分布（Custom Distribution）随机值的方法：蒙特卡罗方法（Monte Carlo method）。该方法实现了随机值越大，被选择的概率就越大的线性分布。

  ```java
  float montecarlo() {
    //We do this “forever” until we find a qualifying random value.
    while (true) {
  	//Pick a random value.
      float r1 = random(1);
  	//Assign a probability.
      float probability = r1;
  	//Pick a second random value.
      float r2 = random(1);
  	//Does it qualify? If so, we’re done!
      if (r2 < probability) {
        return r1;
      }
    }
  }
  ```

0.6

* 佩林噪音（Perlin Noise），可以生成平滑的随机值，更符合自然界的特征。

* 一维的佩林噪音可以看做**关于时间的平滑曲线**，所以通过改变时间参数，可以得到不同的值（如果时间参数不变，就会得到相同的值）；时间跨度小，随机值就越平滑，时间跨度大，得到的随机值就震荡。

  ```java
  float time = 0;
  void draw() {
    float n = noise(time);
    println(n);
    // Now, we move forward in time!
    time += 0.01;	//如果t不变，会一直打印同一个值
  }
  ```

* 使用不同的`time`参数区间，可以得到相互独立的随机值序列。

* 上面生成的随机值总是在[0,1)区间，使用`map(value,current min,current max,new min,new max)`映射到我们想要的区间，比如`noise(t)`生成了随机值0.3，把它映射到[1,10)：`float x=map(0.3,0,1,0,10);`。

* 参数`time`只是佩林噪音的一种理解，参数还可以理解为`x`轴偏移。后一种理解方式方便把佩林噪音扩展到二维。

* 二维噪音`noise(xoff,yoff)`，三维噪音`noise(xoff,yoff,zoff)`，`noiseDetail(lod, falloff)`可调节噪音的细节。[详见API，我是没看懂](https://processing.org/reference/noiseDetail_.html)

* Exc_I_9和Exc_I_10的代码，哇！

  其中从Exc_I_9的`draw()`函数中截取的渲染像素的部分（在该函数中，窗口大小`height,width`可以直接获取）：

  ```java
  loadPixels();
  float bright = 100;
  for (int x = 0; x < width; x++) {
    for (int y = 0; y < height; y++) {
      pixels[x+y*width] = color(bright,bright,bright);
    }
  }
  updatePixels();
  ```

  从Exc_I_10中截取的在三维中画四边形（不是矩形）的代码：

  ```java
  beginShape(QUADS);
  translate(x*scl-w/2, y*scl-h/2, 0);
  vertex(0, 0, z[x][y]);
  vertex(scl, 0, z[x+1][y]);
  vertex(scl, scl, z[x+1][y+1]);
  vertex(0, scl, z[x][y+1]);
  endShape();
  ```

#### 1 Vectors

1.1

* 使用向量代替标量，代码更简单

  ` float x,y,xspeed,yspeed`$\to$`Vector location,speed`

* 三维向量`PVector`

1.2

* 常用`PVector`存储二维数据

* 向量可以进行一般数学运算，如运动方程：

  `location=location+velocity`

1.3

* 向量的使用：

  `location.add(velocity)	velocity.x=velocity.x*-1`

* 画圆函数不接受向量参数，所以要把标量提出来：

  `ellipse(location.x,location.y,16,16)`;

1.4

* 加法之外还有其他函数：

`sub,mult,div,mag(计算向量长度),setMag,normalize(单位向量),limit,heading,rotate,lerp,dist,angleBetween,dot,cross,random2D,random3D`

1.5

* 向量长度（magnitude）计算原理：勾股定理

1.6

* 单位向量（unit vector）计算原理：向量除以向量长度

1.7

* 一个基本的运动物体Mover是一个类（class），包括基本属性:

  `PVector location, veloticy`，

  和基本方法:

  `update(用于更新location),display(用于渲染),checkEdges(检测是否到达边界，需要改变速度方向)`

  update方法示例:

  `void update(){ location.add(velocity); }`

1.8

* 引入加速度向量`PVector acceleration`，用于更新`velocity`。加速度可以是常量、随机值、或者跟踪鼠标。

  示例代码：

  `void update(){ velocity.add(acceleration); velocity.limit(top_speed); location.add(velocity); }`

1.9

* 静态和非静态方法的区别（`PVector u,v,w`）：`u.add(v)`改变`u`的值，且不返回值，这个`add`是非静态的；`w=PVector.add(u,v)`更新的是`w`的值，这个方法是静态的；`w=u.add(v)`这种写法是错误的。

1.10

* 加速度追踪鼠标示例：

  ```java
  void update(){
  	PVector mouse = new PVector(mouseX, mouseY); 
    PVector dir = PVector.sub(mouse, location);
    dir.normalize(); 
    dir.mul(0.5); 
    acceleration = dir; 
    …
  }
  ```

#### 2 Forces

2.1

* 牛顿第一定律：An object at rest satys at rest and an object in motion stays in motion.

  在Processing表现为：An object's PVector velocity will remain constant if it is in a state of equilibrium.

* 牛顿第三定律：For every action there is an equal and opposite reaction.

  在Processing中表现为：If we calculate a PVector f that is a force of object A on object B, we must also apply the force-PVector.mult(f, -1);-that object B exerts on object A.

2.2

* 牛顿第二定律：Force equals mass times acceleration.

  在Processing中，假设所有物体质量为1，在物体上施加力的方法为：

  ```java
  mover.applyForce(gravity);
  void applyForce(PVector force){
  	acceleration = force;
  }
  ```

2.3

* 2.2中`acceleration = force;`导致调用`applyForce`多次，只有最后一次生效，前面的力会被覆盖，所以优化如下：

  ```java
  void applyForce(PVector force){
  	acceleration.add(force);
  }
  if(mousePressed){
  	PVector wind = new PVector(0.5, 0);
  	mover.applyForce(wind);
  }
  ```

  记得在`update()`中重置加速度：

  ```java
  void update(){
  	velocity.add(acceleration);
  	location.add(velocity);
  	acceleration.mult(0);		//重置为0
  }
  ```

2.4

* 给运动的物体添加质量属性:`class Mover{...float mass;}`，在构造器中初始化`Mover(){...mass=10.0}`。质量是一个标量（scalar）。

* 在计算加速度时，因为作用力可能施加在多个物体上，为了使力向量能够复用，要使用向量的静态方法：

  ```java
  void applyForce(PVector force){
  	//force.div(mass); 错误写法
  	PVector f = PVector.div(force, mass);		//正确写法；也可先复制力向量（force.get()），使用复制的值参加计算
  	acceleration.add(f);
  }
  ```

2.5

* 一个例子（两个作用力，多个不同质量的物体）：

  注：上面的`checkEdges`提醒了我，左上角为坐标系原点。

2.6

* 上一节的例子的问题在于，物体越小，下降地越快（因为重力初始化为常量）。在现实中“两个铁球同时落地”。代码做一下修改

  ```java
  for (int i = 0; i < movers.length; i++) {
    PVector wind = new PVector(0.001,0);
    float m = movers[i].mass;
    // Scaling gravity by mass to be more accurate
    PVector gravity = new PVector(0,0.1*m);
    movers[i].applyForce(wind);
    movers[i].applyForce(gravity);
    movers[i].update();
    movers[i].display();
    movers[i].checkEdges();
  }
  ```

* 力是如何工作的？比如摩擦力的公式：
  $$
  \overrightarrow{Friction}=-\mu N\hat{v}
  $$
  等式两侧都是向量，其中$\hat{v}$表示速度的单位向量。

2.7

* 摩擦力分为静态摩擦力（相对静止的物体之间）和动态摩擦力（相对运动的物体之间），这里指研究动态摩擦力。

* 2.6给出的公式中，$\mu$代表摩擦系数，$N$代表摩擦表面的法向作用力（比如高速路上飞奔的汽车，法向力即车的重力）。在Processing中，计算摩擦力分三步，计算标量部分、计算向量部分、整合：

  ```java
  float c = 0.01;
  float normal = 1;
  float frictionMag = c*normal;	//标量计算完毕
  PVector friction = velocity.get();	//复制速度向量
  friction.mult(-1);
  friction.normalize();	//向量部分完毕
  friction.mult(frictionMag);	//整合
  ```

2.8

* 空气/流体阻力：$F_d=-\frac{1}{2}\rho v^2AC_d\hat{v}$，其中$\rho$为流体密度，$v$为速度，$A$为正面区域面积，$C_d$为阻力系数。

* 在Processing中简化为：$F_{drag}=\|v\|^2*C_d*\hat{v}*-1$。此外，为了完成程序，还需要新建流体类、初始化流体对象、判断物体是否在流体区域内以及应用流体阻力。

  详见示例代码：`chp02_forces/NOC_2_5_fluidresistance`

2.9

* 万有引力公式：$F=\frac{Gm_1m_2}{r^2}\hat{r}$，其中引力常数$G=6.67428\times 10^{-11}\:\mathrm{N\cdot m^2/kg^2}$。

  示例代码：

  ```java
  PVector force = PVector.sub(location1,location2);
  float distance = force.magnitude();
  float m = (G*mass1*mass2)/(distance*distance);
  force.normalize();
  force.mult(m);
  ```

* $r$极大时，作用力小得可以忽略，$r$极小时，根据公式引力会变得极大，现实世界却并非如此。所以简单起见，$distance = constrain(distance,5.0,25.0)$给距离加上极值限制。
* 一个示例：一个固定的Attractor，多个Mover（见NOC_2_7_attraction_many）

2.10

* 去掉2.9中的Attractor，多个Mover之间相互吸引。

* 个人认为代码有一点可以改进：物体之间的作用力时同时发生的，所以更新位移的`update`方法应该在所有物体的作用力计算完成之后再调用。更改如下：

  ```java
  void draw() {
    background(255);
    for (int i = 0; i < movers.length; i++) {
      for (int j = 0; j < movers.length; j++) {
        if (i != j) {
          PVector force = movers[j].attract(movers[i]);
          movers[i].applyForce(force);
        }
      }
    }
    for (int i = 0; i < movers.length; i++) {
      movers[i].update();
      movers[i].display();
    }
  }
  ```

  使用更改后的代码，能够使所有物体保持在可视窗体内（原代码使得物体很快逃逸出当前窗体）。



#### 3 震荡

3.1

* 在Processing中，函数接收参数为弧度，使用角度思考，使用弧度写代码的方式为：`float angle = radians(60);rotate(angle)`.
* 













