### Maven Repository

#### 参考文档

* [官方文档](https://maven.apache.org/guides/introduction/introduction-to-repositories.html)

* [非官方文档](https://www.tutorialspoint.com/maven/maven_repositories.htm)

#### 关于仓库

* 本地仓库：运行Maven的主机的一个目录，用来缓存从远程仓库下载的内容和本地项目的临时构建； 
* 远程仓库：一类是真正意义上的远程仓库，专门提供第三方资源的下载服务，又称中央仓库（如[repo.maven.apache.org](http://repo.maven.apache.org/maven2/)， [uk.maven.org](http://uk.maven.org/maven2/)）；一类是为了在公司内部开发团队之间共享私有资源而搭建的仓库，称为私有仓库。
* 中央仓库地址不需要显式配置，本地仓库和私有仓库需要显式配置。
* Maven依赖资源的默认检索顺序：本地仓库>>中央仓库>>私有仓库。
* 本地仓库和远程仓库的仓库结构是一致的，这意味着，仓库之间可以进行资源的直接拷贝。当中央仓库资源不可达时，可以预先将中央仓库的资源经由本地仓库备份到私有仓库。

#### 仓库配置

* Maven项目的仓库信息可以在三个层次上进行定义：工程级别，in the project POM file（pom.xml）；用户级别，in Maven settings xml file（%USER_HOME%/.m2/settings.xml）；全局级别，in Maven global settings xml file（%M2_HOME%/conf/settings.xml）。级别覆盖范围越广，优先级越低。

##### mirrors

* 仓库替换（覆盖），检索依赖时使用

  ```xml
  <mirrors>
      <mirror>
        <id>alimaven</id>
        <name>aliyun maven</name>
        <url>http://maven.aliyun.com/nexus/content/groups/public/</url>
        <mirrorOf>central</mirrorOf>        
      </mirror>
    </mirrors>
  ```

  上面的配置会将中央仓库替换为阿里仓库（使用阿里仓库覆盖中央仓库）。即默认到中央仓库检索的依赖，转而去到阿里仓库中检索。

  其中`<mirrorOf>central</mirrorOf>`为覆盖id是central的仓库，如果是`<mirrorOf>*</mirrorOf> `为覆盖所有仓库。

##### distributionManagement

* 

##### servers

* 

#### 搭建私有仓库

