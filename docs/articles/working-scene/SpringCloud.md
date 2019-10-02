### [Tech Primers Live Stream](https://www.youtube.com/playlist?list=PLTyWtrsGknYdZlO7LAZFEElWkEk59Y2ak)

[示例代码](https://github.com/dingl-designer/springcloud)使用的SpringBoot 2.1.8



#### Lesson 3 Sleuth

* Sleuth负责完成分布式日志追踪，它为每个请求生成唯一的ID，根据ID追踪请求路径。
* 示例代码中的sleuth-server和sleuth-client
* @Configration和@Bean搭配使用，通过注解方式完成效果等同于XML中<**beans**/>对象注册。

* RestTemplate类完成了对HTTP请求的封装，作用类似于JdbcTemplate

* @RestController是@Controller和@Responsebody的缩写

  @GetMapping是@RequestMapping(method= RequestMethod.GET) 的缩写

#### Lesson 4 Eureka

* Eureka负责服务的注册和发现，相当于zookeeper

* 示例代码中的eureka-center（注册中心）、eureka-provider（服务提供者）、eureka-consumer（服务消费者）

* 使用[初始化工具](https://start.spring.io/)初始化项目的时候，eureka-center依赖Eureka Server，eureka-provider/consumer依赖Eureka Discovery Client。

  **注**：在实际操作中，eureka-provider/consumer还需要添加对于Spring Web的依赖，否则@RestController无法使用，服务亦无法正常注册。这个在视频里没有的，可能是由于Eureka版本更新导致的。

* Eureka中未区分provider和consumer，他们都是Eureka Client。依赖关系在具体代码中体现。

* @EnableEurekaServer加在注册中心的启动类上，@EnableEurekaClient加在注册服务的启动类上。

* @LoadBalanced加在RestTemplate上，使得RestTemplate在解析URL的时候能够将其中的服务名（eureka-provider）自动替换成从Eureka获取的真实的IP:PORT（localhost:8762）。

* .properties和.yml配置作用是等同的，只是在使用方式上有区别。详见[Difference between YAML(.yml) and .properties file in Java SpringBoot](https://www.geeksforgeeks.org/difference-between-yaml-yml-and-properties-file-in-java-springboot/)。

#### Lesson 6 Zuul + Hystrix

* Zuul是边界服务，直接与Eureka Server连接，实现对Eureka Client的代理。
* Hystrix熔断机制，防止雪崩效应的发生。
* 沿用Lesson 4的示例代码，并添加了zuul-center工程。
* zuul-center在application.yml中设置了对eureka-provider/consumer的代理规则，代理后的eureka-consumer访问路径变为http://localhost:8080/consumer/rest/hello/consumer。
* 为了实现熔断（这部分教程无法观看）：
  * eureka-consumer工程中添加了hystrix的依赖
  * 启动类上添加@EnableCircuitBreaker
  * Controller类上配置@HystrixCommand和调用失败回调函数。
* 熔断机制的效果是这样的：
  * 当eureka-consumer本身挂掉时，熔断机制不起作用（因为熔断加载了本工程上）。
  * 当eureka-provider挂掉时，eureka-consumer发现调用失败，进行熔断，之后的请求不再继续调用eureka-provider而是直接执行回调函数，返回“fallback hello world”。
  * 当eureka-provider恢复正常时，eureka-consumer无法立即恢复，因为此时仍在熔断期内。经过一段时间，eureka-consumer才会使请求重新尝试调用eureka-provider，发现服务已恢复，则熔断结束。

