#### zookeeper安装（Ubuntu 18.04）

* [参考文档](https://zookeeper.apache.org/doc/r3.4.14/zookeeperStarted.html)
* zookeeper用作dubbo的注册中心。从[官方网站](https://archive.apache.org/dist/zookeeper/)下载稳定版压缩包，我用的3.4.14。
* 进入解压的文件夹，将conf目录下的 zoo_sample.cfg 重命名为 zoo.cfg（zookeeper启动时默认寻找的文件名）。
* 启动zookeeper命令：`bin/zkServer.sh start`；相应的停止命令：`bin/zkServer.sh stop`。如果是Windows系统，启动命令为`bin\zkServer`。
* 使用客户端连接服务：`bin/zkCli.sh -server 127.0.0.1:2181`，如果进入`[zk:127.0.0.1:2181(CONNECTED) 0]`状态，说明连接成功。可使用`quit`命令退出。zookeeper准备完毕。



#### 运行dubbo-demos

* 我写了一个简单的例子，[dubbo-demos](https://github.com/dingl-designer/dubbo-demos)。

* 运行步骤：

  * 将项目下载到本地，使用Idea将`dubbo-provider`和`dubbo-consumer`作为maven项目打开。

  * 将两个项目resources目录下的注册中心地址改为实际地址。

    ```xml
    <dubbo:registry address="zookeeper://127.0.0.1:2181"></dubbo:registry>
    ```

  * 将dubbo-provider使用maven的`install`命令安装到本地仓库，确认安装成功`$maven-repository$\com\dingl\dubbo-provider\1.0-SNAPSHOT\dubbo-provider-1.0-SNAPSHOT-classes.jar`。

  * 使用tomcat运行两个项目。

  * 假设dubbo-provider访问地址`provider_address`为http://localhost:8080/dubbo-provider，dubbo-consumer访问地址`consumer_address`为http://localhost:8080/dubbo-consumer。使用浏览器访问`provider_address`/provider/hello?name=Lily，返回字符串“hello Lily”；访问`consumer_address`/consumer/hello，返回字符串“hello Lucy”，则说明dubbo调用成功。
  
* 为了验证provider和consumer确实通过注册中心zookeeper完成了通信，可使用`zkCli`登录zookeeper，查看消费者信息：`ls /dubbo/com.dingl.service.IMainService/consumers`。

#### 遇到的问题

* 除了Spring的jar包外，为了整合dubbo添加的jar包如下：

  ```xml
  <dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>dubbo</artifactId>
    <version>2.5.6</version>
  </dependency>
  <dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.0.35.Final</version>
  </dependency>
  <!--zkclient用于连接zookeeper-->
  <dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.2</version>
  </dependency>
  <dependency>
    <groupId>org.slf4j</groupId>
    <artifactId>log4j-over-slf4j</artifactId>
    <version>1.7.25</version>
  </dependency>
  ```
  
* jar包版本按照[官网](https://dubbo.apache.org/zh-cn/docs/user/dependencies.html)给出的版本配置（如上）。要使用更新的jar包，可能面临一些兼容问题。

* 在官方文档的快速启动章节的provider-xml示例中，注册dubbo的命名空间时使用的是`http://dubbo.apache.org/schema/dubbo`，但是项目启动时报错，将地址改成`http://code.alibabatech.com/schema/dubbo`则运行成功。

  使用浏览器访问两个地址，发现前者可以访问，后者不能访问。为什么一个无效的地址反倒能够运行成功呢？

  打开dubbo的jar包，在`\META-INF`目录下有一个spring.handlers文件，内容为`http\://code.alibabatech.com/schema/dubbo=com.alibaba.dubbo.config.spring.schema.DubboNamespaceHandler`，看来两者需要保持一致才行。

#### 其他

* web项目（`<packaging>war</packaging>`）如果想打成jar包，可以在打包插件中使用attachClasses属性。

  ```xml
  <plugin>
      <groupId>org.apache.maven.plugins</groupId>
      <artifactId>maven-war-plugin</artifactId>
      <version>3.0.0</version>
      <configuration>
          <!--同时打包jar包-->
          <attachClasses>true</attachClasses>
      </configuration>
  </plugin>
  ```

  其他项目在引用时，加上class后缀即可：

  ```xml
  <dependency>
      <groupId>com.dingl</groupId>
      <artifactId>dubbo-provider</artifactId>
      <version>1.0-SNAPSHOT</version>
      <!--引用的jar包带有classes后缀-->
      <classifier>classes</classifier>
  </dependency>
  ```

  