### Hystrix源码阅读

读源码之前有必要了解一下[How it Works](https://github.com/Netflix/Hystrix/wiki/How-it-Works)



#### 补充知识点：

- 泛型（generics）。
- `rxjava-1.2.0.jar`，一个处理异步任务的包，其中的常用类`Observable`。
- `/*package*/`注释的作用是作者为了表明自己并非忘记写修饰符（`private/protected/public...`），而是确定使用默认的访问级别，即同一包内可访问（`default`）。
- `java.util.concurrent.atomic`包，为了保持并发线程下对象操作的原子性。实现方式主要借助`volatile`修饰符，其用法参考[面试官最爱问的volatile关键字](https://juejin.im/post/5a2b53b7f265da432a7b821c)。



#### class Hystrix

* hystrix类主要维护了一个`ThreadLocal<ConcurrentStack<HystrixCommandKey>>` currentCommand。

#### abstract class HystrixCommand

* 继承自AbstractCommand。除了构造器和重写外，向外部暴露了一个新的`excute()`函数，用于返回回调函数的执行结果。

* AbstractCommand的另一个子类是HystrixObservedCommand，该类和HystrixCommand都是用于封装对外部系统的调用并在单独的线程中执行，之所以命名为`*Command`，因为应用了设计模式中的命令模式。

#### abstract class HystrixCollapser

* HystrixCollapser将多次请求压缩为只需单次执行的HystrixCommand。其使用的基础类在`collapser`包下定义。

#### interface HystrixObservable

* 只有`observe()`和`toObservable()`两个函数。实现该接口的所有可执行类的示例对象可以作为相同的类型使用相同的方式来处理。
* 两个函数都返回`Observable`，这是用来存储异步任务返回结果的对象。

#### interface HystrixCircuitBreaker

* 熔断接口，本身包含两个实现类`HystrixCircuitBreakerImpl`和没有任何操作的`NoOpCircuitBreaker`。
* 熔断逻辑据说融进了`HystrixCommand`。

