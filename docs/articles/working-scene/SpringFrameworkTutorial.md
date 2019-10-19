[ISpring Framework Tutorial](https://www.youtube.com/playlist?list=PLw_k9CF7hBpJJsRWAhwSrDlWAzuMV0irl)

[教程示例代码](https://github.com/in28minutes/spring-master-class)

#### 007 quick introduction to spring framework

terminology:

* Beans：Spring中对Class的称呼
* Autowiring：负责感知依赖关系并组装
* Dependency Injection：将被依赖者注入到依赖者，通过构造器或者set方式
* Inversion of Control：被依赖bean的创建权由依赖者交给容器
* IOC Container：即Application Context，负责bean的创建
* Application Context：Spring 容器

#### 013 what is happening in the backgroud

application.properties:

`logging.level.org.springframework= debug`

以上配置可查看bean初始化日志：search class in ddirectory> identified component> creating instance of bean> autowiring by type from bean .. to bean ..> finished creating instance and so on

 #### 033 Autowiring in Depth by name and @Primary

当接口有多个实现类时，可以选择以名称注入或者使用@Primary，后者的优先级更高

#### 034 Autowiring in Depth @Qualifier annotation

当接口有多个实现类时，可以使用@Qualifier("beanname")

#### 035 scope of a bean Prototype and Singleton

default is singleton

four type of beans:

* singleton - one instance per Spring Context
* prototype - new bean whenever requested
* request - one bean per http request
* session - one bean per http session

默认是singleton，指定为prototype的方式为：

`@Scope("portotype")` or `@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)`

#### 036 complex scope acenarios of a spring bean

如果bean A dependent on bean B，并且A是单例模式，B是原型模式，默认情况下每次向A中注入的是同一个B，即B也是单例模式。

通过设置代理`Scope(value=ConfigurableBeanFactory.SCOPE_PROTOTYPE, proxyMode=ScopedProxyMode.TARGET_CLASS)`，可以在每次调用时，向同一个A中注入不同的B。

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

