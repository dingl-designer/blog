#### zookeeper安装（Ubuntu 18.04）

* [参考文档](https://zookeeper.apache.org/doc/r3.4.14/zookeeperStarted.html)

* zookeeper用作dubbo的注册中心。从[官方网站](https://archive.apache.org/dist/zookeeper/)下载稳定版压缩包，我用的3.4.14。
* 进入解压的文件夹，将conf目录下的 zoo_sample.cfg 重命名为 zoo.cfg（zookeeper启动时默认寻找的文件名）。
* 启动zookeeper命令：`bin/zkServer.sh start`；相应的停止命令：`bin/zkServer.sh stop`
* 如果启动失败，查看日志文件 zookeeper.out。

* 启动客户端验证服务可用：`bin/zkCli.sh -server 127.0.0.1:2181`，如果进入`[zk:127.0.0.1:2181(CONNECTED) 0]`状态，说明连接成功。可使用`quit`命令退出。zookeeper准备完毕。



#### 运行demo

* 我写了一个简单的例子，[dubbo-demos](https://github.com/dingl-designer/dubbo-demos)。

* 运行步骤：

  * 将项目下载到本地，使用Idea将子项目`dubbo-provider`和`dubbo-consumer`作为maven项目导入。

  * 将两个子项目resources目录下的注册中心地址改为实际地址。

    ```xml
    <dubbo:registry address="zookeeper://192.168.1.107:2181"></dubbo:registry>
    ```

  * 将dubbo-provider使用maven命令安装到本地仓库，作为dubbo-consumer的依赖库。

  * 使用tomcat运行两个子项目，假设dubbo-provider访问地址`provider_address`为http://localhost:8080/dubbo-provider，dubbo-consumer访问地址`consumer_address`为http://localhost:8080/dubbo-consumer。

  * 使用浏览器访问地址`provider_address`/provider/hello?name=Lily，返回字符串“hello Lily”；访问地址`consumer_address`/consumer/hello，返回字符串“hello Lucy”。

#### 遇到的问题

* jar包版本问题。一开始尝试着用用较新的jar包，遇到兼容性问题。最终按照[官网](https://dubbo.apache.org/zh-cn/docs/user/dependencies.html)给出的版本，运行成功。

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

  