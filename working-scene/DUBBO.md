#### zookeeper安装（Ubuntu 18.04）

* [参考文档](https://zookeeper.apache.org/doc/r3.4.14/zookeeperStarted.html)

* zookeeper用作dubbo的注册中心。从[官方网站](https://archive.apache.org/dist/zookeeper/)下载稳定版压缩包，我用的3.4.14。
* 进入解压的文件夹，将conf目录下的 zoo_sample.cfg 重命名为 zoo.cfg（zookeeper启动时默认寻找的文件名）。
* 启动zookeeper命令：`bin/zkServer.sh start`；相应的停止命令：`bin/zkServer.sh stop`
* 如果启动失败，查看日志文件 zookeeper.out。

* 启动客户端验证服务可用：`bin/zkCli.sh -server 127.0.0.1:2181`，如果进入`[zk:127.0.0.1:2181(CONNECTED) 0]`状态，说明连接成功。可使用`quit`命令退出。zookeeper准备完毕。