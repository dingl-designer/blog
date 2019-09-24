[The Nature of Code在线阅读](https://natureofcode.com/book/)

[The Nature of Code示例代码](https://github.com/nature-of-code/noc-examples-processing)

*注*：通过[本书主页]([https://natureofcode.com](https://natureofcode.com/))的下载按钮获取的示例代码包含过时的内容（比如第五章关于Box2DProcessing，旧版本名字为PBox2D）。



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

  *注*：Processing程序主入口两个默认函数：$setup()$用于初始化变量，比如窗口大小和一些其他自定义常量；`draw()`用于渲染，该函数每执行一次，相当于窗口刷新一次。刷新频率不固定，即没有时钟的概念，每次渲染耗时越短，渲染频率就越高。所以即使同样的代码，在不同性能的机器上也会呈现不同的效果。

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
  	//force.div(mass); 		//错误写法
  	PVector f = PVector.div(force, mass);		//正确写法；也可先复制向量（force.get()），使用复制的值参加计算
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

* 弧度 `radians=2*PI*(degrees/360)`
* 在Processing中，函数接收参数为弧度，使用角度思考，使用弧度写代码的方式为：`float angle = radians(60); rotate(angle);`.

3.2

* 类似与线性运动公式，但比线性运动方程更简单，因为角度是标量，旋转运动公式
  $$
  \begin{align}
  &angle=angle+angular\:\:velocity\\
  &angular\:\:velocity=angular\:\:velocity+angle\:\:acceleration
  \end{align}
  $$

* 一个示例：

  ```java
  translate(width/2,height/2);	//平移世界坐标系
  rotate(angle);	//旋转世界坐标系
  line(-50,0,50,0);
  ellipse(50,0,8,8);
  ellipse(-50,0,8,8);
  ```

* 从示例代码发现一个带有轨迹的例子：NOC_3_02_forces_angular_mot_trails，其中实现轨迹的方式为（截取与`draw()`）：

  ```java
  //backgound(255);	//不清空背景
  
  rectMode(CORNER);		//CORNER模式绘制矩形
  noStroke();		//不勾勒边框
  fill(255,5);	//fill(gray,alpha)，第二个参数越大，轨迹越短
  rect(0,0,width,height);		//重绘整个视窗
  ```

  *注*：这里有必要了解一下矩形的绘制，`rect`第三和第四个参数是矩形的宽和高，第一和第二个参数是一个点的坐标，当`rectMode(CORNER)`时（默认模式），这个点是矩形的左上角顶点，当`rectMode(CENTER)`时，这个点是矩形的中点。

3.3

* 三角函数公式（sin,cos,tan）

3.4

* 如果物体不是圆形，当它跟随鼠标时，其实有两个意思：前端转向鼠标并朝着鼠标方向位移。

* $tangent(angle)=\frac{velocity_y}{velocity_x}$，通常velocity已知，旋转角度angle未知，要求angle，需要借助`rangent`的反函数（逆函数）`arctangent`，在Processing中为`atan(value)`。

* 上式的问题在于$atan(-4/3)=atan(4/-3)=-0.9272952$；为了区分方向，要是用`atan2(y, x)`。

  ```java
  float angle = atan2(velocity.y,velocity.x);
  ```

  或者更简单的

  ```java
  float angle = velocity.heading();	//内部调用了atan2()
  ```

* 在示例NOC_3_03_pointing_velocity_trail中，运动的为了自然过渡的，即创建指向鼠标的加速度并逐渐改变当前物体的运动速度，而不是重置速度瞬间转向鼠标；转向时保持正面朝向当前速度的前方，而不是瞬间指向鼠标。那么，如果瞬间指向鼠标会怎样？如同漂移？

  ```
  float theta = velocity.heading2D();
  ```

  改为：

  ```java
  PVector mouse = new PVector(mouseX, mouseY);
  PVector dir = PVector.sub(mouse, location);
  float theta = dir.heading2D();
  ```

  上面的代码说明，在主函数，`mouseX, mouseY`亦可直接获取。

* 另外一个问题，当Mover变为矩形之后，每次渲染会和圆形物体有所不同。

  圆形物体只要给定圆心和半径，就可以画唯一的圆：

  ```java
  ellipse(location.x,location.y,mass*16,mass*16);
  ```

  矩形有方向属性，所以要先平移和旋转画板之后再画，其中平移也是必须的，因为旋转是以当前原点为参考点。

  ```java
  rectMode(CENTER);
  translate(location.x, location.y);
  rotate(theta);
  rect(0, 0, 30, 10);
  ```

3.5

* 极坐标系（角度和半径）和直角坐标系：Processing只能处理直角坐标系，所以极坐标系数据可以转到极坐标系。

  ```java
  float r = 75;
  float theta = PI / 4;
  //Converting from polar (r,theta) to Cartesian (x,y)
  float x = r * cos(theta);
  float y = r * sin(theta);
  ```

3.6

* `sine,cosine`函数可以模拟震荡。

  ```java
  float amplitude = 100;		//振幅
  float x = amplitude * sin(angle);	//位移
  angle += aVelocity;		//更新弧度值
  ```

3.7

* 震荡曲线由震荡幅度和周期决定。在现实世界，周期常与时间相关联，但是在Processing中，周期只能和帧数（渲染一次为一帧）相关联。$ 周期时间 = 周期帧数 \times 每帧时长$，人为规定其中想要的两个值，就可以得到第三个值。
* 示例代码NOC_3_07_oscillating_objects中将物体的震荡从$x$轴方向震荡扩展到了在$x,y$轴同时震荡，震荡看起来无规律，是因为$x,y$轴两个方向的震荡周期不一致造成的。
* 同样是在上面的示例中，所有物体做的是匀速震荡（Oscillation with Angular Velocity），其中匀速指的控制位移的自变量`angle`是匀速变化，不是指物体的位移是匀速变化。

3.8

* 一系列的物体上下震荡，可以用来模拟波浪或者动物的身体。
* NOC_3_09_wave_a(bc)三个示例的`angleVel`不同，这导致相邻物体间的错位不一致。但是为什么运动周期会一致呢？这里见代码，每次渲染的时候第一个物体的位移由`startAngle`决定，这个值与`angleVel`无关，且在三份代码中相同。
* NOC_3_08_static_wave_lines画了一条静态波浪线，使用了`beginShape()\endShape()`以及`vertex(x,y)`即将一系列的顶点（vertex）相连接。你是不是也设想过每个$x$值画一个像素（使用`point`）不也能得到一条线吗？想象一下图形学中把线段转成像素有多么麻烦，你应该就不会这么想了。
* Exc_3_11_AdditiveWave显示的是多个波形的叠加，是整个宽度区间内的震荡的叠加，见代码`yvalues[i] += cos(x)*amplitude[j];`和`yvalues[i] += sin(x)*amplitude[j];`
* 另一个问题，为什么波形看起来都是从右向左传播呢，如何让波形从左向右传播？这其实是由自变量（`angle`）的变化规律决定的。我们总是设定随着$x$的增加，`angle`是递增的，另一方面，随着时间的增加，`angle`也是递增的。这就导致随着时间的推移，左侧图形总是跟随右侧图形，或者说，右侧图形是左侧图形的未来的样子。所以，只要把两个递增的其中一个（而不是两个）改为递减就可以改变波的传播方向。
* 这里我试着画了一些随机的虫子，为了让虫子具有随机的位置、随机的方向，在每只虫子之前，要先将画布平移后旋转。为了让每只虫子拥有独立的画布，使用到了`pushMatrix(),popMatrix()`两个函数。

3.9

* 钟摆问题：钟摆由三部分构成，原点（origin）、摆臂（arm）、和钟摆（bob）。钟摆（bob）受到两个作用力，摆臂的牵引力和重力。两个力的合力沿着切线方向指向下方，大小为$G * sin(\theta)$，$\theta$为摆臂与垂直线夹角。
* 上一步求得了作用力，根据牛顿第二定律，`A=F/M`，得出沿着切线方向的加速度。根据[角加速度公式](https://zh.wikipedia.org/wiki/角加速度) $\alpha=\frac{\mathrm a_T}{r}$（其中$\mathrm a_T$是正切直线加速度，$r$是曲率半径），最终角加速度为$\alpha=\frac{g}{r}sin(\theta)$。而且$g,r$这些值均为常量，可知角加速度与$sin(\theta)$成正比。
* 由于Processing无法建立与现实的直接关联，上式中的$g,r$给定适当值即可。

3.10

* 将3.6钟摆的摆臂替换为弹簧。弹簧的拉力由虎克定律（Hooke's law）确定：$F_s=kx$（其中$F_s$为平衡状态下弹簧受到的拉力，$k$为弹簧的固有属性，$x$是弹簧相对于放松状态发生的形变长度）。此公式在弹簧伸长或压缩状态均生效。



#### 4 粒子系统

4.1

* 为什么需要粒子系统？管理不定量的、有时很多的物体，跟踪每个粒子，他们在做什么，他们看起来什么样。

4.2

* 为粒子添加寿命（lifespan）属性。典型地，粒子是由粒子发射器（emitter）生成和初始化的。如果粒子的寿命是永久的，又不断有粒子生成，系统总有不堪重负的时候。粒子到达寿命尽头的方式有多种，比如被其他粒子吸收或者逃出了可视窗口。或者直接给定一个帧数值作为寿命，并将寿命值与透明度关联，就可以做出粒子渐渐隐去最后消失的过程。

4.3

* 使用数组和Java的`ArrayList`类管理多个粒子。有很多方法可以扩展数组长度，但是使用`ArrayList`依旧更便利，比如可以通过迭代器遍历或删除元素。

4.4

* 将`ArrayList`封装进`ParticleSystem`类中，暴露给外部一个构造器和一个`run()`函数。

4.5

* 有多个粒子系统的系统：在鼠标点击处增加一个新的粒子发射器。
* 主入口的默认函数（如`setup(),draw()`）`mousePressed()`可以捕捉到鼠标点击事件。
* 代码示例`NOC_4_04_SystemofSystems`在使用`Iterator`时要显式地引入一下：`import java.util.Iterator;`；

4.6

* 引入继承和多态（inheritance and polymorphism），通过一个反例：向贺卡中添加跟中个样的纸屑，新建了各总各样的纸屑类，代码冗余。

4.7

* 使用了经典的动物模型介绍了基类继承；
* 子类使用`extends`关键字继承父类，构造器中通过`super()`调用父类构造器，通过添加新的属性和方法以及重写父类方法。

4.8

* 回到贺卡的问题，实现继承`class Confetti extends Particle`。
* 在示例代码`simpleInferitance`中给出了一种在MV中很常见的运动：jiggle。随机漫步伴随物体大小的随机变化，营造了一种无所适从的氛围。

4.9

* 什么是多态？依旧使用4.7的动物王国说明：一个`Dog`对象既可以作为`Dog`类来对待，也可以作为`Animal`类来对待。

  ```java
  Dog rover = new Dog();
  Animal spot = new Dog();
  ```

4.10

* 回到贺卡的问题，使用`ArrayList<Particle>`管理`Particle`和`Confetti`实例对象。

4.11

* 上面的例子中，加速度一致是一个模仿重力的常量，如果像前几章那样，也给粒子添加函数`applyForce(PVector f)`供外部调用，就得到了一个可以施加外力的粒子系统。

* 实例代码`NOC_4_08_ParticleSystemSmoke`模拟了随风飘动的烟雾。另外还使用到了图片渲染（用图片更容易模拟模糊的边界）：

  ```
  PImage img = loadImage("texture.png");	//加载图片
  ...
  imageMode(CENTER);		//渲染图片
  tint(255,lifespan);
  image(img,loc.x,loc.y);
  ```

  1 其中`loadImage(filename, extension)`默认从当前路径的`data`文件目录下搜索图片，也可以使用从根目录开始的绝对路径或网络资源。并且最好在`setup()`中进行预加载。
  
  2 如果想看清每个粒子的边界，粒子的`render()`函数中使用圆代替图片渲染。
  
  3 烟雾粒子的初始化速度是由高斯分布生成的，0.4节我们介绍了高斯分布（截取自粒子的构造函数）：
  
  ```java
  float vx = (float) generator.nextGaussian()*0.3;
  float vy = (float) generator.nextGaussian()*0.3 - 1.0;
  ```
  
  粒子的平均速度是`(0,-1)`；`generator.nextGaussian()`生成数值范围关于零对称，但是没有严格边界。我们只能说，68%的数值分布在`(-1,1)`...

4.12

* 在系统中添加一个排斥物（Repeller），原理和Attractor类似。示例代码见`NOC_4_07_ParticleSystemForcesRepeller`

4.13

* 粒子的图形纹理和粒子初始速度的高斯分布使烟雾看起来更真实。其实在4.11节学习示例代码的时候不自觉地完成自学了，这里不再重复。另外作者建议图片使用`PNG`格式，因为Processing可以处理它的透明通道（alpha channel）。
* 相加混合（additive blending）。在图形学中通过透明技术实现物体色彩的叠加叫做混合。通过在`draw()`函数的开始处调用`blendMode(mode)`进行设置。其中`mode`可取值`NORMAL`（默认）、`CENTER`等，还有一种`ADD`模式，这种模式会产生辉光效应（space-age glow effect），因为叠加的层越多就会变得越亮。

* 为了实现相加混合，需要使用P2D或P3D渲染引擎。

  ```java
  void setup(){
    size(640,360,P2D);
  }
  ```

  这里我翻看了一下[size函数的API](https://processing.org/reference/size_.html)，在3.0的Processing中，建议`size()`函数放到`settings()`里。

  ```java
  void settings(){
    size(640,360,P2D);
  }
  ```

  另外`settings`和`setup`的区别：

  ```html
  The settings() method runs before the sketch has been set up, so other Processing functions cannot be used at that point. For instance, do not use loadImage() inside settings(). The settings() method runs "passively" to set a few variables, compared to the setup() command that call commands in the Processing API.
  ```

  

#### 5 物理函数库

5.0

* 本书的哲学：已经有很多开源的物理引擎（open-source physics engine），为什么还要学习前四章？为了你好。

5.1

* Box2D用于开发了《蜡笔物理学》和《愤怒的小鸟》。
* Box2D是一个纯物理引擎，不涉及计算机图形，只是接收物理参数，返回更多的值。
* 我们为什么需要它？有了它，我们既可以使用Processing处理爆炸场景，又有时间陪伴家人和朋友。--Erin Catto（Creator of Box2D）花了多年心血。

5.2

* 在Processing中使用：[Box2D](http://box2d.org/)是用`c++`写的，Processing是基于`Java`的，所以可以直接用[JBox2D](http://www.jbox2d.org/)（Box2D的Java端口），为了方便，JBox2D与Processing之间还有一个附加层`PBox2D`（已经改名叫`Box2DProcessing`），可减少调用时的代码冗余。

* [Daniel Shiffman封装的Box2DProcessing](https://github.com/shiffman/Box2D-for-Processing)，可以选择自动或手动安装。

* 自动安装：打开Processing，点击速写本（Sketch）>引入库文件（Import Library）>添加库文件（Add library），在弹出框的Libraries页签搜索并点击`Box2D for Processing  Author Daniel Shiffman`，点击下方的`Install`。重启Processing。

* 手动安装：通过上面的链接打开Box2DProcessing的git项目，在dist目录下找到`box2d_processing.zip`。下载并解压到速写本目录即可。（参考5.15节手动安装Toxiclibs）

* 导入验证。打开示例代码`NOC_5_2_Boxes`，点击运行。

  如果提示找不到`PBox2D`。通过页面开始处的链接获取最新代码，或者手动改动如下：
  
  ```java
  import pbox2d.*;	//row 8
  PBox2D box2d;		//row 14
	box2d = new PBox2D(this);	//row 26
  ```

  改为：
  
  ```java
  import shiffman.box2d.*;
  Box2DProcessing box2d;
box2d = new Box2DProcessing(this);
  ```
  

5.3

* 使用Box2D，在SETUP和DRAW阶段代码逻辑与之前有所不同。

  * SETUP：1 在我们的像素世界建立所有对象；2 将所有对象从像素世界转换到Box2D世界。
  * DRAW：1 询问Box2D所有对象的位置；2 将Box2D给出的答案转换到像素的世界； 3渲染所有对象。

  其中SETUP的步骤2和DRAW的步骤1、2是使用Box2D时新增的。

* Box2D世界的基本组件：World、Body、Shape、Fixture、Joint、Vec2等，后面将会详述这些元素的使用。

* PVector和Vec2语法的比较。

  ```java
  Vec2 a = new Vec2(1,-1);
  Vec2 b = new Vec2(3,4);
  a.addLocal(b);	//相当于PVector的非静态add
  Vec2 c = a.add(b);	//无变化
  float m = a.length();	//相当于PVector的mag
  a.normalize();		//无变化
  ```

5.4

* Box2D的World类，掌控一切。初始化如下：

  ```java
  Box2DProcessing box2d;
  void setup() {
    box2d = new Box2DProcessing(this);
    //Initializes a Box2D world with default settings
    box2d.createWorld();
  }
  ```

  对象创建之后会默认设置向下的重力加速度，也可以自己设定：

  ```java
  box2d.setGravity(0, -10);
  ```

  `-10`？没错，Box2D的坐标系和Processing不同，在Box2D中，屏幕中心为坐标原点，`y`轴指向上方，`x`轴向右。此外，两个坐标系的单位长度也不相等。

* 使用Box2DProcessing提供的函数可以进行Processing（pixels）坐标系和Box2D（world）坐标系的转换：

  ```java
  Vec2 mouseWorld = box2d.coordPixelsToWorld(mouseX,mouseY);
  ```

  ```java
  Vec2 worldPos = new Vec2(-10,25); 
  Vec2 pixelPos = box2d.coordWorldToPixels(worldPos);
  ellipse(pixelPos.x, pixelPos.y,16,16);
  ```

  其他方法：`coordWorldToPixelsPVector`返回PVector对象，`scalarWorldToPixels`可转换标量。

5.5

* Box2D的Body类相当于我们之前定义的Mover类，Body可以是运动的也可以是固定的，Body没有几何属性，但是可以绑定Shape属性。

* 定义Body之前要先声明定义（definition）类。

  ```java
  BodyDef bd = new BodyDef();
  ```

  配置Body的属性，比如位置：

  ```java
  Vec2 center = new Vec2(width/2,height/2);
  Vec2 center = box2d.coordPixelsToWorld(width/2,height/2));	//转换坐标系
  bd.position.set(center);
  ```

  Body的类型有：动态的（Dynamic）、静态的（Static）和运动的（Kinematic）。

  ```java
  bd.type = BodyType.DYNAMIC;
  ```

  其他一些属性：

  ```java
  bd.fixedRotation = true;		//国定角度
  bd.linearDamping = 0.8;			//设置线性阻力
  bd.angularDamping = 0.9;		//旋转阻力
  bd.bullet = true;						//如果物体将快速移动，将其设置为bullet
  ```

* 配置完定义，就可以创建Body了。

  ```java
  Body body = box2d.createBody(bd);		//bd可用于创建多个Body
  ```

  可以配置初始速度：

  ```java
  body.setLinearVelocity(new Vec2(0,3));	//线性速度
  body.setAngularVelocity(1.2);		//角速度
  ```

5.6

* 物体（Body）、形状（Shape）和固定装置（Fixture）三位一体。如果Body对象是灵魂，形状对象就是灵魂居住的躯壳。Shape也会影响Body的运动，因为Shape有密度（质量）、摩擦力和通过Fixture定义的反弹力。

* 定义Shape前要先确定要定义的类型。比如使用PolygonShape创建矩形。

  ```java
  PolygonShape ps = new PolygonShape();
  float box2Dw = box2d.scalarPixelsToWorld(150);	//标量转换
  float box2Dh = box2d.scalarPixelsToWorld(100);
  ps.setAsBox(box2Dw, box2Dh);	//Use setAsBox() function to define shape as a rectangle.
  ```

* 创建Fixture，分配Shape：

  ```java
  FixtureDef fd = new FixtureDef();
  fd.shape = ps;	//The fixture is assigned the PolygonShape we just made.
  fd.friction = 0.3;
  fd.restitution = 0.5;
  fd.density = 1.0;
  ```

* 使用Fixture将Shape绑定到Body：

  ```java
  body.createFixture(fd);
  ```

5.7

* 一旦Body被创建（），Box2D总是知道它在哪，检查他的碰撞，根据受力移动它，Box2D会自主进行这些计算而不需要你动一根手指。

* Box2D会维护一个列表，用来保存所有的Body对象可以通过`getBodyList()`获取。但是我们最好维护自己的列表，这可能会牺牲效率，但能让我们有更多的主动性。

* 示例代码`NOC_5_1_box2d_excercise`是不使用Box2D的进行的编程；`NOC_5_1_box2d_excercise_solved`是使用Box2D的效果，由于默认的重力作用，后者生成的矩形会自由落体。现在梳理一下Box2D的使用流程。

  * 第一步，在主函数中添加Box2D：

    ```java
    PBox2D box2d;
    
    void setup() {
      box2d = new PBox2D(this);		//Initialize and create the Box2D world.
      box2d.createWorld();
    }
    void draw() {
      box2d.step();		//We must always step through time!
    }
    ```

  * 第二步，将Processing对象和Box2D对象建立关系，我们之前维护的对象属性，现在依旧不应舍弃，这是为了方便渲染：

    ```java
    class Box  {
      //Instead of any of the usual variables, we will store a reference to a Box2D body.
      Body body;	
      float w;
      float h;
      
      Box() {
        w = 16;
        h = 16;
    	//Build body.
        BodyDef bd = new BodyDef();
        bd.type = BodyType.DYNAMIC;
        bd.position.set(box2d.coordPixelsToWorld(mouseX,mouseY));
        body = box2d.createBody(bd);
    	//Build shape.
        PolygonShape ps = new PolygonShape();
        float box2dW = box2d.scalarPixelsToWorld(w/2);
        float box2dH = box2d.scalarPixelsToWorld(h/2);
        ps.setAsBox(box2dW, box2dH);
    	//create a fixture
        FixtureDef fd = new FixtureDef();
        fd.shape = ps;
        fd.density = 1;
        fd.friction = 0.3;
        fd.restitution = 0.5;
    	//Attach the Shape to the Body with the Fixture.
        body.createFixture(fd);
      }
      
      void display() {
    	//We need the Body’s location and angle.
        Vec2 pos = box2d.getBodyPixelCoord(body);
        float a = body.getAngle();
     
        pushMatrix();
    	//Using the Vec2 position and float angle to translate and rotate the rectangle
        translate(pos.x,pos.y);
        rotate(-a);		//这里是-a
        fill(175);
        stroke(0);
        rectMode(CENTER);
        rect(0,0,w,h);
        popMatrix();
      }
      
      void killBody() {
        box2d.destroyBody(body);		//从Box2D的世界删除该Body
      }
    }
    ```

    其中需要注意的是，由于Processing和Box2D坐标系的`y`轴方向相反，导致`body.getAngle()`获取的角度乘以`-1`以后才能使用。

5.8

* 使用`BodyType.STATIC`添加固定边界，比如在上面的示例中添加两条固定边界：

  ```java
  class Boundary {
  	//A boundary is a simple rectangle with x, y, width, and height.
    float x,y;
    float w,h;
    Body b;
   
    Boundary(float x_,float y_, float w_, float h_) {
      x = x_;
      y = y_;
      w = w_;
      h = h_;
   
  		//Build the Box2D Body and Shape.
      BodyDef bd = new BodyDef();
      bd.position.set(box2d.coordPixelsToWorld(x,y));
  		//Make it fixed by setting type to STATIC!
      bd.type = BodyType.STATIC;
      b = box2d.createBody(bd);
   
      float box2dW = box2d.scalarPixelsToWorld(w/2);
      float box2dH = box2d.scalarPixelsToWorld(h/2);
      PolygonShape ps = new PolygonShape();
  		//The PolygonShape is just a box.
      ps.setAsBox(box2dW, box2dH);
  		//Using the createFixture() shortcut
      b.createFixture(ps,1);		//将Shape绑定到Body的简易方式，1为密度（density）
    }
   
  	//Since we know it can never move, we can just draw it the old-fashioned way, using our original variables. No need to query Box2D.
    void display() {
      fill(0);
      stroke(0);
      rectMode(CENTER);
      rect(x,y,w,h);
    }
  }
  ```

5.9

* 使用`ChainShape`画曲线边界：

  ```java
  class Surface {
    ArrayList<Vec2> surface;
    
    Surface() {
      surface = new ArrayList<Vec2>();
  		//3 vertices in pixel coordinates
      surface.add(new Vec2(0, height/2+50));
      surface.add(new Vec2(width/2, height/2+50));
      surface.add(new Vec2(width, height/2));
   
      ChainShape chain = new ChainShape();
  		//Make an array of Vec2 for the ChainShape.
      Vec2[] vertices = new Vec2[surface.size()];
      for (int i = 0; i < vertices.length; i++) {
  			//Convert each vertex to Box2D World coordinates.
        vertices[i] = box2d.coordPixelsToWorld(surface.get(i));
      }
  		//Create the ChainShape with array of Vec2.
      chain.createChain(vertices, vertices.length);
  		//Attach the Shape to the Body.
      BodyDef bd = new BodyDef();		//ChainShape将要绑定的Body不需要设置position和type属性，ChainShape会处理好这些（type默认为STATIC）。
  		Body body = box2d.world.createBody(bd);
      body.createFixture(chain, 1);
    }
    
    void display() {
      strokeWeight(1);
      stroke(0);
      noFill();
  		//Draw the ChainShape as a series of vertices.
      beginShape();
      for (Vec2 v: surface) {
        vertex(v.x,v.y);
      }
      endShape();
    }
  }
  ```

  另外我注意到`box2d.world.createBody(bd)`，这和`box2d.createBody(bd)`是一致的，因为在`Box2DProcessing`中：

  ```java
  public Body createBody(BodyDef bd) {
  	return world.createBody(bd);
  }
  ```

5.10

* 使用Box2D画复杂形状有两种方案，一种是使用`PolygonShape`：

  ```java
  Vec2[] vertices = new Vec2[4];  // An array of 4 vectors
  vertices[0] = box2d.vectorPixelsToWorld(new Vec2(-15, 25));
  vertices[1] = box2d.vectorPixelsToWorld(new Vec2(15, 0));
  vertices[2] = box2d.vectorPixelsToWorld(new Vec2(20, -15));
  vertices[3] = box2d.vectorPixelsToWorld(new Vec2(-10, -10));
  //Making a polygon from that array
  PolygonShape ps = new PolygonShape();
  ps.set(vertices, vertices.length);
  ```

  需要注意的，一个是顶点顺序（Processing和Box2D旋转方向相反）；另外一个，Box2D无法处理凹多边形碰撞，所以如果要画凹多边形，需要分解成多个图多边形（稍后会介绍）。

* 当渲染图形的时候，就需要从Box2D中取回这些顶点：

  ```java
  void display() {
      Vec2 pos = box2d.getBodyPixelCoord(body);
      float a = body.getAngle();
  		//First we get the Fixture attached to the body...
      Fixture f = body.getFixtureList();
      PolygonShape ps = (PolygonShape) f.getShape();
   
      rectMode(CENTER);
      pushMatrix();
      translate(pos.x,pos.y);
      rotate(-a);
      fill(175);
      stroke(0);
      beginShape();
  		//We can loop through that array and convert each vertex from Box2D space to pixels.
      for (int i = 0; i < ps.getVertexCount(); i++) {
        Vec2 v = box2d.vectorWorldToPixels(ps.getVertex(i));
        vertex(v.x,v.y);
      }
      endShape(CLOSE);
      popMatrix();
    }
  ```

* 那么凹多边形（或者多个图多边形组成的图形）要怎么画呢？回忆一下单个Shape的情况：

  * Step 1: Define the body.
  * Step 2: Create the body.
  * **Step 3: Define the shape.**
  * **Step 4: Attach the shape to the body.**
  * Step 5: Finalize the body’s mass.

  现在我们只需要重复第3和第4步就可以了。

  ```java
  BodyDef bd = new BodyDef();
  bd.type = BodyType.DYNAMIC;
  bd.position.set(box2d.coordPixelsToWorld(center));
  body = box2d.createBody(bd);
   
  //Making shape 1 (the rectangle)
  PolygonShape ps = new PolygonShape();
  float box2dW = box2d.scalarPixelsToWorld(w/2);
  float box2dH = box2d.scalarPixelsToWorld(h/2);
  sd.setAsBox(box2dW, box2dH);
  //Making shape 2 (the circle)
  CircleShape cs = new CircleShape();
  cs.m_radius = box2d.scalarPixelsToWorld(r);
  //设置圆形的偏移
  Vec2 offset = new Vec2(0,-h/2);
  offset = box2d.vectorPixelsToWorld(offset);
  cs.m_p.set(offset.x,offset.y);
  //Attach both shapes with a fixture.
  body.createFixture(ps,1.0);
  body.createFixture(cs, 1.0);
  ```

  其中`cs.m_p.set(offset.x,offset.y);`设置了圆形的偏移，因为默认情况下，Shape在绑定到Body的时候，Body的位置作为Shape的中心位置。

  见示例代码`NOC_5_5_MultiShapes`。

5.11

* Box2D连接器（Joint）有很多种，本章介绍其中三种：distance joints, revolute joints, and “mouse” joints。

* 距离连接器（distance joint）：使用固定（这里说是固定不太合适，后面说连接可以是弹性的）长度连接两个Body的中心位置。

  ```java
  //准备两个和Body关联的对象
  Particle p1 = new Particle();
  Particle p2 = new Particle();
  //创建连接器
  DistanceJointDef djd = new DistanceJointDef();
  //关联连接器和Body
  djd.bodyA = p1.body;
  djd.bodyB = p2.body;
  //定义连接器长度
  djd.length = box2d.scalarPixelsToWorld(10);
  //可以定义连接器的弹性（频率和阻力系数）
  djd.frequencyHz  = ___;		//频率用Hz表示
  djd.dampingRatio = ___;		//Dampens the spring; typically a number between 0 and 1.
  //创建连接器
  DistanceJoint dj = (DistanceJoint) box2d.world.createJoint(djd);
  ```

* 旋转连接器（revolute joint）的使用：

  ```java
  Box box1 = new Box();
  Box box2 = new Box();
  RevoluteJointDef rjd = new RevoluteJointDef();
  //旋转连接器最重要的属性，除了两个连接的物体外，还要指定连接点，下面的代码使用第一个物体的中心作连接点
  rjd.initialize(box1.body, box2.body, box1.body.getWorldCenter());
  //可以选择是否开启发动机（motor），开启之后可以在发动机作用下自行旋转
  rjd.enableMotor = true;		//开启发动机
  rjd.motorSpeed = PI*2;		//How fast is the motor?
  rjd.maxMotorTorque = 1000.0;		//How powerful is the motor?
  //还可以设置旋转角度限制（我尝试了一下开启发动机后加上角度限制，嗯，发动机肯定很烫）
  rjd.enableLimit = true;
  rjd.lowerAngle = -PI/8;
  rjd.upperAngle = PI/8;
  //创建连接器
  RevoluteJoint joint = (RevoluteJoint) box2d.world.createJoint(rjd);
  ```

* 最后是鼠标连接器（mouse joint），鼠标连接器其实是用来拖拽物体的。Box2D中不是可以直接设置物体的位移吗，为什么还需要连接器呢？像下面这样不是很方便吗？

  ```java
  Vec2 mouse = box2d.screenToWorld(x,y);
  body.setTransform(mouse,0);
  ```

  这样做的问题就像是，你在系统里里面加了一个传送门，这是不符合牛顿定律的，可能会给Box2D造成混乱。我们来看一下正确的做法：

  ```java
  MouseJointDef md = new MouseJointDef();
  md.bodyA = box2d.getGroundBody();		//Whoa, this is new!
  md.bodyB = box.body;		//Attach the Box body.
  //Set properties.
  md.maxForce = 5000.0;
  md.frequencyHz = 5.0;
  md.dampingRatio = 0.9;
  //Create the joint.
  MouseJoint mouseJoint = (MouseJoint) box2d.world.createJoint(md);.
  ```

  其中`md.bodyA = box2d.getGroundBody();`是指连接器的一端连接到`ground`，可以理解成屏幕（screen）。连接器创建完成，我们想要在鼠标鼠标拖拽的时候更新目标位置

  ```java
  Vec2 mouseWorld = box2d.coordPixelsToWorld(mouseX,mouseY);
  mouseJoint.setTarget(mouseWorld);
  ```

  另外一件要做的事，就是状态切换：当鼠标点击的时候，创建鼠标连接器，鼠标释放，销毁它。示例代码见`NOC_5_8_MouseJoint`。

5.12

* 在第二章中我们讨论了如何应用各种力，我们在Mover中添加了applyForce函数 ，在函数中使用力除以质量求出加速度。在Box2D的Body类中也有这样的函数，不需要我们自己计算。

  ```java
  class Box {
    Body body;
    void applyForce(Vec2 force) {
      Vec2 pos = body.getWorldCenter();
  	//Calling the Body's applyForce() function
      body.applyForce(force, pos);
    }
  }
  ```

  重要的区别在于Box2D是一个更复杂的系统，在应用力的时候需要指定作用点，上面的力作用在了Body的中心点。下面是将第二章的万有引力应用到Box2D物体上的写法的。第二章代码：

  ```java
  PVector attract(Mover m) {
    PVector force = PVector.sub(location,m.location);
    float distance = force.mag();
    distance = constrain(distance,5.0,25.0);
    force.normalize();
    float strength = (g * mass * m.mass) / (distance * distance);
    force.mult(strength);
    return force;
  }
  ```

  使用Box2D的Vec2重写后：

  ```java
  Vec2 attract(Mover m) {
    //We have to ask Box2D for the locations first!
    Vec2 pos = body.getWorldCenter();
    Vec2 moverPos = m.body.getWorldCenter();
    Vec2 force = pos.sub(moverPos);
    float distance = force.length();
    distance = constrain(distance,1,5);
    force.normalize();
    float strength = (G * 1 * m.body.m_mass) / (distance * distance);
    //Remember, it’s mulLocal() for Vec2.
    force.mulLocal(strength);
    return force;
  }
  ```

5.13

* 因为本书不是专门介绍Box2D的，所以我不能覆盖所有Box2D的知识点。不过在介绍完Body、Shape、Joint之后，我觉得还有一个值得讲一讲的东西：碰撞事件。

* 事实上Box2D已经帮我们考虑了所有的碰撞情况，并且处理得很好，所以不要误解我，我并不是想把碰撞重新实现一遍，而是当碰撞发生的时候，我们还能做点什么，就比如你要卖掉一个叫做《愤怒的小鸟》的游戏，那么当一只脾气暴躁的鸽子碰撞纸板箱的时候，你最好还要做些其他的东西。Box2D使用接口（interface）来提醒你碰撞发生的时刻。

* 检测碰撞事件会处理一个回调函数，用法和`mousePressed()`差不多，当碰撞发生的时候，会触发`beginContact()`。

  ```java
  void mousePressed() {
    println("The mouse was pressed!");
  }
  //What our "beginContact" event looks like.
  void beginContact(Contact cp) {
    println("Something collided in the Box2D World!");
  }
  ```

  为了使监听生效，我们需要告诉Box2D我们需要监听（当我们不需要监听的时候，Box2D就可以不监听从而减少开销）。

  ```java
  void setup() {
    box2d = new PBox2D(this);
    box2d.createWorld();
    //Add this line if you want to listen for collisions.
    box2d.listenForCollisions();
  }
  ```

* 碰撞的监听事件有：

  * beginContact()：两个物体第一次接触时触发；
  * endContact()：物体持续接触过程中会一遍又一遍地触发；
  * preSolve()：计算碰撞结果之前触发，在beginContact()之前，如有必要，可设置碰撞失效；
  * postSolve()：计算完碰撞之后触发，使收集碰撞结果（冲力）信息成为可能。

* `beginContact(Contact cp)`，利用事件参数`cp`可以获取所有的碰撞信息。比如有两个绑定到`Particle`的Box2D Body发生了碰撞：

  ```java
  //通过cp获取碰撞的两个固定装置
  Fixture f1 = cp.getFixtureA();
  Fixture f2 = cp.getFixtureB();
  //通过固定装置获取碰撞的两个物体
  Body b1 = f1.getBody();
  Body b2 = f2.getBody();
  ```

  那么如何通过Body获取到绑定的Processing中的Particle对象呢？我们看一下Particle的构造函数：

  ```java
  class Particle {
    Body body;
   
    Particle(float x, float y, float r) {
      BodyDef bd = new BodyDef();
      bd.position = box2d.coordPixelsToWorld(x, y);
      bd.type = BodyType.DYNAMIC;
      body = box2d.createBody(bd);
      CircleShape cs = new CircleShape();
      cs.m_radius = box2d.scalarPixelsToWorld(r);
      body.createFixture(fd,1);
   
      body.setUserData(this);	//"this" refers to this Particle object. We are telling the Box2D Body to store a reference to this Particle that we can access later.
    }
  ...
  ```

  有了上面的绑定过程`body.setUserData(this)`，我们就可以这样获取：

  ```java
  Particle p1 = (Particle) b1.getUserData();
  Particle p2 = (Particle) b2.getUserData();
  ```

  但是...但是，在大部分情况下，我们并不知道碰撞的是不是两个Particle，所以在强制转换对象类型之前，要先做判断：

  ```java
  Object o1 = b1.getUserData();
  if (o1.getClass() == Particle.class) {
  	Particle p = (Particle) o1;
  	p.change();
  }
  ```

* 另外需要注意的是不能在上面这四个回调函数中销毁Box2D实体，在回调函数中确定需要删除，一种可行的方法是打标记（比如：`markForDeletion = true`），然后在draw() 函数中检查并删除。



5.14

* 积分（Integration ）算法是微积分（calculus）领域两个重要算法之一，另外一个是微分（differentiation）。在我们的程序中一直在使用积分，比如：

  ```java
  velocity.add(acceleration);
  location.add(velocity);
  ```

  这种方法被称为欧拉（Euler）积分法，这种积分法最简单，也最容易通过代码实现，但这种算法并不是最高效、也不是最准确的方法。欧拉方法通过分段计算来模拟连续的现实世界，这就产生了不准确的数据。提高欧拉算法准确性的方案是使用更小的时间间隔，但这会是我们的程序运行地非常慢。

  尽管如此，欧拉算法依旧是最基础和最易实现的方法，大部分情况下是适用的。

* 还有一种积分法叫做Runge-Kutta，在一些物理引擎中被使用。
* 一种非常流行的积分法，即下一个物理引擎（toxiclibs）使用的算法，叫做Verlet integration。这种算法在考虑运动问题时不存储速度变量，而是在程序运行过程中计算速度。该方法尤其适用于粒子系统，特别是弹簧连接的粒子系统。如果想了解更多，见[维基](https://en.wikipedia.org/wiki/Verlet_integration)。

5.15

* 正式介绍另一个物理引擎：`toxiclibs`。toxiclibs是专门为Processing设计的，所以用起来不像Box2D那样麻烦。不需要转换坐标系，并且toxiclibs不限于二维世界。

* `Box2D`和`toxiclibs`如何选择呢？

  1 我的工程中有各种形状的物体碰撞、弹跳，那么我需要Box2D，toxiclibs不处理爆炸场景。

  2 我的工程中有很多粒子飞来飞去，他们有时相吸有时互斥，有时与弹簧连接，这时toxiclibs是最好选择。toxiclibs使用更简单，适合处理粒子连接系统，并且由于使用韦尔莱积分（Verlet integration）算法，它的性能也很好。

* 补充：[依赖库的手动导入方式](https://github.com/processing/processing/wiki/How-to-Install-a-Contributed-Library)，以toxiclibs为例：从[toxiclibs官网](http://toxiclibs.org/)下载toxiclibs的最新版zip包（`toxiclibs-complete-0200.zip`）待用。然后打开Processing，点击偏好设置（preference）菜单，弹出框的最上方有一个速写本（sketchbook）位置，Mac版默认为`~/Documents/Processing`，Windows下默认为`Documents/Processing`，这个文件夹下有一个`libraries`文件夹，如果没有就新建一下，将下载的zip包拷贝到`libraries`文件夹下并解压。文件目录`/Documents/Processing/libraries/toxiclibs-complete-0200/toxiclibscore`。重启Processing。手动导入完成。

* 导入成功验证：打开示例代码`NOC_5_10_SimpleSpring`，点击运行，如果提示找不到`GravityBehavior2D`类，将`2D`后缀删除，执行成功。

* toxiclibs的基本组件：VerletPhysics、VerletParticle、VerletSpring。toxiclibs的向量：Vec2D和Vec3D。

* toxiclibs物理世界的初始化和调用：

  ```java
  VerletPhysics2D physics;
   
  void setup() {
  Creating a toxiclibs Verlet physics world
    physics=new VerletPhysics2D();
    //hard boundaries past which objects cannot travel
  	physics.setWorldBounds(new Rect(0,0,width,height));
    //add gravity to the physics world
  	physics.addBehavior(new GravityBehavior(new Vec2D(0,0.5)));
  }
  
  void draw() {
    physics.update();
  }
  ```

5.16

* toxiclibs的粒子通过继承来创建，使用`physics.addParticle(particle);`添加到VerletPhysics2D：

  ```java
  class Particle extends VerletParticle2D {
    Particle(Vec2D loc) {
  	//Calling super() so that the object is initialized properly
      super(loc);
    }
    //We want this to be just like a VerletParticle, only with a display() method.
    void display() {
      fill(175);
      stroke(0);
  	//We’ve inherited x and y from VerletParticle!
      ellipse(x,y,16,16);
    }
  }
  ```
  
* toxiclibs的弹簧类VerletSpring、VerletConstrainedSpring、VerletMinDistanceSpring，需要两个粒子进行初始化。

  ```java
  float len = 80;		//The rest length of the spring.
  float strength = 0.01;	//How strong is the spring?
  VerletSpring2D spring=new VerletSpring2D(particle1,particle2,len,strength);
  physics.addSpring(spring);
  ```

5.17

* 在Box2D中，如果我们忽略物理规律直接设置物体的位置，就会破坏物理生态，但是在toxiclibs中不存在这样的问题，我们可以手动设定粒子的位置，但是在这之前，最好调用`lock()`函数。

* `lock()`函数用于锁定粒子，相当于Box2D中设置密度为0。下面我们来看看当鼠标点击的时候，我们锁定粒子、移动它、解锁以使它继续运动。

  ```java
  if (mousePressed) {
  	//First lock the particle, then set the x and y, then unlock() it.
      p2.lock();
      p2.x = mouseX;
      p2.y = mouseY;
      p2.unlock();
  }
  ```

5.18

* 一根弹簧连接两个粒子作为基本元素，toxiclibs特别适合模拟柔软的物体。用弹簧连接的线性排列的粒子可以模拟一条线，用弹簧连接的网格排列的粒子可以模拟一张毯子，使用自定义的连接方式还可以模拟可爱又柔软的卡通形象。

* 还是钟摆的例子，和第三章的刚性摆臂不同，这次我们用弹性摆臂。

  ```java
  //定义摆臂上的粒子列表
  ArrayList<Particle> particles = new ArrayList<Particle>();
  float len = 10;
  float numParticles = 20;
  //粒子水平排列
  for(int i=0; i < numPoints; i++) {
    Particle particle=new Particle(i*len,10);	//粒子水平排列
    physics.addParticle(particle);	//将粒子添加到toxiclibs物理世界
    particles.add(particle);
    //相邻粒子用弹簧连接
    if (i != 0) {
      Particle previous = particles.get(i-1);
      VerletSpring2D spring = new VerletSpring2D(particle,previous,len,strength);
      physics.addSpring(spring);		////将弹簧添加到toxiclibs物理世界
    }
  }
  ```

  固定一端：

  ```java
  Particle head=particles.get(0);
  head.lock();
  ```

5.19

* 作者说：“I have a whole bunch of stuff I want to draw on the screen and I want all that stuff to be spaced out evenly in a nice, neat, organized manner. Otherwise I have trouble sleeping at night.”。试试力导图（force-directed graph）吧。

* 我们将力导图中的粒子称为节点。首先，创建节点（Node）类：

  ```java
  class Node extends VerletParticle2D {
    Node(Vec2D pos) {
      super(pos);
    }
   
    void display() {
      fill(0,150);
      stroke(0);
      ellipse(x,y,16,16);
    }
  }
  ```

  接下来创建叫做簇（Cluster）的类，用来描述一系列的节点：

  ```java
  class Cluster {
    ArrayList<Node> nodes;
   
    Cluster(int n, float d, Vec2D center) {
      nodes = new ArrayList<Node>();
      diameter = d;
      for (int i = 0; i < n; i++) {
  	  //围绕中心随机分布的点
        nodes.add(new Node(center.add(Vec2D.randomVector())));
        ...
      }
    }
  ...
  ```

  然后将节点两两连接。注意两个细节：1 节点不用和自身连接；2 节点之间只需连接一次。

  ```java
  for (int i = 0; i < nodes.size()-1; i++) {
    VerletParticle2D ni = nodes.get(i);
    for (int j = i+1; j < nodes.size(); j++) {	//j从i+1开始
      VerletParticle2D nj = nodes.get(j);
      physics.addSpring(new VerletSpring2D(ni,nj,diameter,0.01));
    }
  }
  ```

5.20

* Box2D有`applyForce()`，同样toxiclibs有`addForce()`，但是toxiclibs走的更远，它允许我们在粒子上添加共有的作用力，或者称作行为（behavior）。当我们在一个粒子上附加`AttractionBehavior `对象，系统中的所有其他粒子都会被吸引。假设有`class Particle extends VerletParticle`：

  ```java
  Particle p = new Particle(new Vec2D(200,200));
  float distance = 20;	//作用力的半径
  float strength = 0.1;
  AttractionBehavior behavior = new AttractionBehavior(p, distance, strength);
  physics.addBehavior(behavior);
  ```

* 尽管toxiclibs不能处理碰撞，但是我们可以通过AttractionBehavior来模拟：

  ```java
  class Particle extends VerletParticle2D {
    float r;
   
    Particle (Vec2D loc) {
      super(loc);
      r = 4;
  	//每当创建一个粒子，就生成一个AttractionBehavior并添加到物理世界。力的大小为负可表示斥力。
      physics.addBehavior(new AttractionBehavior(this, r*4, -1));
    }
   
    void display () {
      fill (255);
      stroke (255);
      ellipse (x, y, r*2, r*2);
    }
  }
  ```

  








