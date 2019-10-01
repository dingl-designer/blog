### [Tech Primers Live Stream](https://www.youtube.com/playlist?list=PLTyWtrsGknYdZlO7LAZFEElWkEk59Y2ak)

[示例代码](https://github.com/dingl-designer/springcloud)



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

* @LoadBalanced加在RestTemplate上，使得RestTemplate在解析URL的时候能够将其中的服务名（eureka-provider）自动替换成从Eureka获取的真实的IP:PORT（localhost:8762）。