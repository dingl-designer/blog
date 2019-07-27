### Maven Repository

#### 参考文档

* <https://maven.apache.org/guides/introduction/introduction-to-repositories.html>
* <https://help.sonatype.com/repomanager3>

#### 关于仓库

* 本地仓库：运行Maven的主机的一个目录，用来缓存从远程仓库下载的内容和本地项目的临时构建； 
* 远程仓库：一类是真正意义上的远程仓库，专门提供第三方资源的下载服务，又称中央仓库（如[repo.maven.apache.org](http://repo.maven.apache.org/maven2/)， [uk.maven.org](http://uk.maven.org/maven2/)）；一类是为了在公司内部开发团队之间共享私有资源而搭建的仓库，称为私有仓库。
* 本地仓库和远程仓库的仓库结构是一致的，仓库之间可以进行资源的直接拷贝。当在内网环境开发时（互联网不可达），可以在内网搭建似有仓库，将互联网仓库资源经由本地仓库备份到私有仓库。


#### 搭建私有仓库

* 使用仓库管理器Nexus OOS版进行搭建

* 当前用户下新建nexus/目录，[下载](https://help.sonatype.com/repomanager3/download)最新版二进制压缩包（nexus-3.17.0-01-unix.tar.gz）到nexus/，解压得到nexus-3.17.0-01/和snoatype-work/
* 执行./nexus-3.17.0-01/bin/nexus start启动服务。使用./nexus-3.17.0-01/bin/nexus查看指令提示。
* 访问ip:8081进入管理界面，点击Sign in，用户名admin，密码在sonatype-work/nexus3/admin.password中。首次登陆在引导设置中将密码置为admin123，并勾选anonymous access（允许匿名检索，不允许匿名发布）。
* Nexus默认创建了：两个仓库分组（maven-public和nuget-group），两个代理仓库（maven-central和nuget.org-proxy），三个主机仓库（maven-releases、maven-snapshots和nuget-hosted）。前缀`nuget-`的表示供.NET语言使用，`maven-`前缀为Java语言使用。
* 仓库分组的作用是将组内的多个仓库地址统一到同一个分组地址。
* 代理仓库可看作是远程仓库在本主机上的缓存。理论上，获取阿里仓库的资源要比国外的资源更快，所以最好为阿里仓库创建一个代理仓库alicloud-proxy，仓库类型maven2(proxy)，代理地址<https://maven.aliyun.com/repository/public>，并添加到maven-public分组，maven-central之前。

#### 开发者配置

- Maven项目的仓库信息可以在三个层次上进行定义：工程级别，in the project POM file（pom.xml）；用户级别，in Maven settings xml file（%USER_HOME%/.m2/settings.xml）；全局级别，in Maven global settings xml file（%M2_HOME%/conf/settings.xml）。覆盖范围越广，优先级越低。
- 实际开发过程中，虽然可能存在多个settings.xml文件，但是只有配置到IDE中的那个settings.xml文件才生效。

##### 检索配置

- 仓库替换（重定向），在settings.xml中设置

  ```xml
  <mirrors>
      <mirror>
        <id>nexus</id>
        <name>nexus repo</name>
        <url>http://ip:8081/repository/maven-public/</url>
        <mirrorOf>*</mirrorOf>        
      </mirror>
    </mirrors>
  ```

  在没有私有仓库的情况下，maven工程在进行资源检索时先到本地仓库检索，如果找不到就到中央仓库检索（中央仓库不需要显式配置）；当使用nexus搭建好私有仓库之后，上面的配置会将所有原本指向中央仓库的检索重定向到私有仓库。


##### 发布配置

- 如果公司内部需要共享artifacts，可以将jar包发布到私有仓库。

  首先在settings.xml中添加用户信息（用户信息属于敏感信息，不宜放进maven工程）以拥有发布权限：

  ```xml
  <servers>
      <server>
          <id>releases</id>
          <username>admin</username>
          <password>admin123</password>
      </server>
      <server>
          <id>snapshots</id>
          <username>admin</username>
          <password>admin123</password>
      </server>
  </servers>
  ```

  同时在maven工程的POM文件中添加如下配置，ID属性与settings.xml保持一致：

  ```xml
  <distributionManagement>
      <repository>
          <id>releases</id>
          <url>http://ip:8081/repository/maven-releases/</url>
      </repository>
      <snapshotRepository>
          <id>snapshots</id>
          <url>http://ip:8081/repository/maven-snapshots/</url>
      </snapshotRepository>
  </distributionManagement>
  ```

##### 其他

* 测试过程中遇到的问题：Mac版idea选择配置maven时，在Preferences菜单下配置生效，在Default settings菜单下配置不生效（差点被烦死）。