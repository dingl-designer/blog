[Spring Boot](https://spring.io/projects/spring-boot)



#### Building a RESTful Web Service

根据[Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)指引，搭建最简单Web，有两点值得注意：

1、Controller类注释`@RestController`是`@Controller`和`@ResponseBody`的简称。

2、打包方式。使用maven打包默认是`jar`包，使用`java -jar`命令执行。如果要[打成war包](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#howto-create-a-deployable-war-file)，需要在三个地方添加代码或配置：

* 启动类继承`SpringBootServletInitializer`并重写`config`函数。

  原启动类：

  ```java
  @SpringBootApplication
  public class Application extends SpringBootServletInitializer {
  	public static void main(String[] args) {
  		SpringApplication.run(Application.class, args);
  	}
  }
  ```

  增加代码后的启动类：

  ```java
  @SpringBootApplication
  public class Application extends SpringBootServletInitializer {
  	@Override
  	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) 
    {
  		return application.sources(Application.class);
  	}
  
  	public static void main(String[] args) {
  		SpringApplication.run(Application.class, args);
  	}
  }
  ```

* pom.xml声明打包方式为`war`并且将`spring-boot-starter-tomcat`的范围声明为`provided`。

  ```xml
  <packaging>war</packaging>
  <!-- … -->
  <dependencies>
  	<!-- … -->
  	<dependency>
  		<groupId>org.springframework.boot</groupId>
  		<artifactId>spring-boot-starter-tomcat</artifactId>
  		<scope>provided</scope>
  	</dependency>
  	<!-- … -->
  </dependencies>
  ```

修改完成之后使用`mvn clean package` 打包为`war`包，该`war`包既可以使用`java -jar`作为`jar`包运行，也可以放入`tomcat`中运行。

#### 整合Mybatis

准备工作：先安装一个MySQL数据库，见[Ubuntu18.04安装MySQL](./MySQL.html)

开始整合，[参考教程](https://segmentfault.com/a/1190000017211657)：

1、添加依赖包

```xml
<dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>1.3.2</version>
</dependency>
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <!-- 编译时用不到，但是运行时会用到，所以告诉maven别忘了一起打包 -->
    <scope>runtime</scope>
</dependency>
```

上面的依赖包使得mybatis和springboot整合几乎零配置，下面的依赖包是连接驱动，注意要将作用范围声明为`runtime`。

2、在application.properties中配置数据库连接

```properties
spring.datasource.url=jdbc:mysql://192.168.1.107:3306/mysql?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=GMT%2B8
spring.datasource.username=dinl
spring.datasource.password=654321
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

其中使用了新的驱动`com.mysql.cj.jdbc.Driver`，该项不配置也会默认加载。

3、编写dao\service\controller层代码。SQL语句的配置可以使用注解，也可以使用XML。注解比较简单，这里记一下XML方式。

一般来讲，SQL的XML文件放在/dao/mapper目录下，但是有一个问题，idea在默认配置下认为src/main/java目录为源码（Sources）目录，所以只会编译其中以`java`为后缀的文件，为了将`xml`文件也编译进`target`，需要在`pom.xml`的`build`标签下声明Resources：

```xml
<build>
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*Mapper.xml</include>
            </includes>
        </resource>
    </resources>
    <!--...-->
</build>
```

其中mapper文件是通过属性`namespace="hello.mybatis.dao.PluginDao"`完成与DAO接口的绑定。

4、在中指定mapper路径。

```properties
mybatis.mapperLocations=classpath:**/*Mapper.xml
```

5、结束