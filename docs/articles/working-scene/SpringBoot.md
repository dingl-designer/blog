[Spring Boot 官网](https://spring.io/projects/spring-boot)



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

1、先安装一个MySQL数据库，见[Ubuntu18.04安装MySQL](./MySQL.html)

2、