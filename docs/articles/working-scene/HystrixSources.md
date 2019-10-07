### Hystrix源码阅读

读源码之前有必要了解一下[How it Works](https://github.com/Netflix/Hystrix/wiki/How-it-Works)



#### 补充知识点：

- 泛型（generics）。
- `rxjava-1.2.0.jar`，即[ReactiveX](http://reactivex.io/)技术，是观察者模式（observer pattern）的扩展。有人称之为函数式响应型编程（functional reactive programming），但这是一种误解，在其[简介](http://reactivex.io/intro.html)中就已经进行了澄清。理解RX的[Observable](http://reactivex.io/documentation/observable.html)对理解Hystrix是必不可少的。
- `/*package*/`注释的作用是作者为了表明自己并非忘记写修饰符（`private/protected/public...`），而是确定使用默认的访问级别，即同一包内可访问（`default`）。
- `java.util.concurrent.atomic`包，为了保持并发线程下对象操作的原子性。实现方式主要借助`volatile`修饰符，其用法参考[volatile关键字](https://juejin.im/post/5a2b53b7f265da432a7b821c)。



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

* 熔断器接口，包含五个函数、一个工厂类和两个实现类；

* 工厂类`HystrixCircuitBreaker.Factory`维护一个`ConcurrentHashMap`，保证每个`HystrixCommandKey`下只有一个熔断器。

* 两个实现类：`HystrixCircuitBreakerImpl`和没有任何操作的`NoOpCircuitBreaker`。在`HystrixCircuitBreakerImpl`的构造函数中`Subscription s = subscribeToStream();`，而`subscribeToStream()`就包含了熔断器的打开逻辑：

  ```java
  @Override
  public void onNext(HealthCounts hc) {
    // check if we are past the statisticalWindowVolumeThreshold
    if (hc.getTotalRequests() < properties.circuitBreakerRequestVolumeThreshold().get()) {
      // we are not past the minimum volume threshold for the stat window,
      // so no change to circuit status.
      // ...
    } else {
      if (hc.getErrorPercentage() < properties.circuitBreakerErrorThresholdPercentage().get()) {
        //we are not past the minimum error threshold for the stat window,
        // so no change to circuit status.
        // ...
      } else {
        // our failure rate is too high, we need to set the state to OPEN
        if (status.compareAndSet(Status.CLOSED, Status.OPEN)) {
          circuitOpened.set(System.currentTimeMillis());
        }
      }
    }
  }
  ```

  当请求数量超过阈值且错误率超过阈值时，打开熔断器（也就是说，当错误率高但请求数量不多时，不会打开熔断器，因为它没有占用过多资源，不会导致雪崩效应）。

* 五个函数如下并以实现类`HystrixCircuitBreakerImpl`的实现作为说明：
  * `allowRequest()`：每个请求都要询问熔断器是否允许通过，是则通过；该方法只做状态查询，不修改状态；
  * `isOpen()`：熔断器是否开启状态，开启状态即断开状态；
  * `markSuccess()`：当熔断器处于半开（half-open）状态且`HystrixCommand`执行成功时调用，以关闭熔断器（连通通路）。
  * `markNonSuccess()`：当熔断器处于半开（half-open）状态且`HystrixCommand`执行失败时调用，以打开熔断器（断开通路）。
  * `attemptExecution()`：尝试执行。当熔断器处于开放状态，并经过默认的（或自定义的）的关闭时长后（`isAfterSleepWindow()`），将状态置为半开状态，并返回TRUE。
* 注释里说“熔断逻辑”融进了`HystrixCommand`。`HystrixCommand`构造器中的HystrixCircuitBreaker接口类型参数直接传递给了父类`AbstractCommand`，`AbstractCommand`中调用了熔断器的`attemptExecution(), markSuccess(), markNonSuccess(), isOpen()`函数。因此，熔断器根据订阅信息主动打开，关闭逻辑则由`AbstractCommand`来完成。


#### abstract class AbstractCommand

* 我想搞明白hystrix中对线程池的使用以及请求成功/失败数量是如何完成统计的。看看在当前类中能发现什么？该类的第二个属性即为线程池`protected final HystrixThreadPool threadPool`。

* 关于线程池，在JDK1.5，Java新增了`java.util.concurrent`包，专门处理线程并发相关问题。其中关于线程池的几个重要的类或接口关系如下：

  * `interface Executor`：实现了该接口的类均可视作线程池。该接口只有一个方法`Executor`用于执行传入的线程对象；
  * `interface ExecutorService`：继承了`Executor`，定义了一些其他的应该由线程池实现的函数，比如关闭（`shutdown()`）、能够返回`Futrue`对象的提交任务函数（`<T> Future<T> submit(Callable<T> task)`）；
  * `abstract class AbstractExecutorService`：实现了`ExecutorService`接口，定义了线程池的默认实现；
  * `class ThreadPoolExecutor`：继承自`AbstractExecutorService`，是线程池的具体实现。使用`new ThreadPoolExecutor(args...)`即可完成线程池的创建；
  * `class Executors`：定义了一些常用的线程池，包括固定大小的线程池`newFixedThreadPool`、单个线程的线程池`newSingleThreadExecutor`、可变大小的线程池`newCachedThreadPool`等；

  hystrix中的线程池未使用`Executors`中给出的常用线程池，而是在抽象类`HystrixConcurrencyStrategy`中使用`new  ThreadPoolExecutor(args...)`方式创建了自定义线程池。

* 