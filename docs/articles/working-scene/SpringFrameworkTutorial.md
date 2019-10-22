<a href="#t1">Tutorial 1:Spring Framework Tutorial</a>

<a href="#t2">Tutorial 2:Spring Framework</a>

[Tutorial 3:Spring Framework Reference Documentation](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/)



### <a id="t1"> </a>[Spring Framework Tutorial](https://www.youtube.com/playlist?list=PLw_k9CF7hBpJJsRWAhwSrDlWAzuMV0irl)

#### 007 quick introduction to spring framework

terminology:

* Beans：Spring中用来表示被容器创建或管理的对象
* Autowiring：负责感知依赖关系并组装
* Dependency Injection：JSR 330定义的标准，将被依赖者注入到依赖者
* Inversion of Control：bean的创建权交给容器
* IOC Container：容器，负责bean的创建和管理
* Application Context：Spring中的容器，本质上是beanfactory

#### 013 what is happening in the background

application.properties:

`logging.level.org.springframework= debug`

以上配置可查看bean初始化日志：search class in directory> identified component> creating instance of bean> autowiring by type from bean .. to bean ..> finished creating instance and so on

 #### 033 Autowiring in Depth by name and @Primary

当接口有多个实现类时，可以选择以名称注入或者使用@Primary，后者的优先级更高

#### 034 Autowiring in Depth @Qualifier annotation

当接口有多个实现类时，可以使用@Qualifier("beanname")

#### 035 scope of a bean Prototype and Singleton

教程中提到的四种bean scope:

* singleton - one instance per Spring Context
* prototype - new bean whenever requested
* request - one bean per http request
* session - one bean per http session

1、Spring bean默认的scope是singleton，指定为prototype的方式为：

`@Scope("portotype")` 或 `@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)` 或 `<bean .. scope="prototype"/>`

2、request和session scope只在web-aware applicationcontext中生效

3、教程中未提及的还有三种：global session、application、WebSocket，同样只在web-aware applicationcontext中生效，并且只应用于特定种类的web程序中（比如global session 应用于portlet程序）

#### 036 complex scope acenarios of a spring bean

如果bean A dependent on bean B，并且A是单例模式，B是原型模式，因为注入的机会只有一次，就是在实例化A的时候，这导致B也成了单例模式。

为了每次调用B都生成新的bean，有[几种方式](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/beans.html#beans-factory-scopes-sing-prot-interaction)：

* 教程中给出的方式使用了代理，设置`Scope(value=ConfigurableBeanFactory.SCOPE_PROTOTYPE, proxyMode=ScopedProxyMode.TARGET_CLASS)`；

  这里关于代理的使用，详见[Scoped beans as dependencies](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/beans.html#beans-factory-scopes-other-injection)

* 每次调用时从`applicationContext`重新获取

* 使用[Lookup method injection](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/beans.html#beans-factory-lookup-method-injection)（自动生成代码）等等

#### 038 using Component Scan to scan for beans

Springboot应用默认只扫描启动类所在的包，使用@ComponentSan可以扫描其他包。

#### 040 Container and Dependency Injection(CDI)

**重点**：Dependency Injection for Java (**JSR 330**) defines a standard set of annotations (and one interface) for use on injectable classes. 若要使用这些注解和接口，需要添加`javax.inject-1.jar`的依赖（在Spring Framework的依赖列表中可以找到）。一些对应关系如下：

* @Inject(@Autowired)
* @Named(@Component & @Qualifier)
* @Singleton(Defines a scope of Singleton)

#### 042 Removing Spring Boot in Basic Application

how to run a application without springboot?

关键类`AnnotationConfigApplicationContext`。

#### 044/045 defining spring application context using xml

使用XML文件定义bean（替代@Component & @Autowired），关键类`ClassPathXmlApplicationContext`。

#### 047 IOC Container vs Application Context vs Bean Factory

there are two kinds of IOC Container, they are Application Context and Bean Factory, and actually the Application Context is Bean Factory++ with the following advantages：

* Spring AOP features
* I18n(internationalization) capabilities
* WebApplicationContext for web applications etc

#### 048 @Component vs @Service vs @Resository vs @Controller

上面四个注解都在spring-context下的stereotype包下，都可作为bean标识。他们的区别参见课外链接：[Difference between ...](https://javarevisited.blogspot.com/2017/11/difference-between-component-service.html)

or maybe you'll interested in the Spring Core Professional Certification. so check [how to crack...](https://javarevisited.blogspot.com/2018/08/how-to-crack-spring-core-professional-certification-exam-java-latest.html)

#### 049 Read values from external properties file

加载配置文件：`@PropertySource("classpath:app.properties")` 或`<context:property-placeholder location="classpath:app.properties" />`

获取值：`@Value("${propertyname}")`

#### 063 Spring Unit Testing with a Java Context

```java
@RunWith(SpringRunner.class)
@ContextConfiguration(classes=***.class)	//***.class指向启动类
```

其中`SpringRunner`和`ContextConfiguration`均位于`spring-test`jar包中。

#### 064 Spring Unit Testing with an XML Context

```java
@RunWith(SpringRunner.class)
@ContextConfiguration(locations="/applicationContext.xml")
```

#### 068 Theory 1 Maven and Magic

开发一个简单的Java web application需要继承HttpServlet，所以引入了jar：

```xml
<groupId>javax</groupId>
<artifactId>javaee-web-api</artifactId>
<scope>provided</scope>
```

当我在SpringBoot项目中使用HttpServlet时，显示来自tomcat-embed-core.jar包，两者的关系是什么？

Em, too basic. without the background thoeries.



### <a id="t2"> </a>[Spring Framework](https://www.youtube.com/playlist?list=PLC97BDEFDCDD169D7)

#### 10 Bean Autowiring

`autowire="byType"`适用于该类只有一个实例时，如果有多个实例，使用`autowire="byName"`

#### 12 Using ApplicationContextAware

任何singleton可以通过实现`ApplicationContextAware, BeanNameAware`接口来获取当前容器和beanName值。

#### 14 Lifecycle Callbacks

 对应tutorial 3 的[Customizing the nature of a bean](https://docs.spring.io/spring/docs/4.3.x/spring-framework-reference/html/beans.html#beans-factory-nature)

先到这，得去准备考试了