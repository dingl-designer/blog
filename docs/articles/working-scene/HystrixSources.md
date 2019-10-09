### Hystrix源码阅读

读源码之前有必要了解一下[How it Works](https://github.com/Netflix/Hystrix/wiki/How-it-Works)



#### 补充知识点：

- 泛型（generics）。
- `rxjava-1.2.0.jar`，即[ReactiveX](http://reactivex.io/)技术，是观察者模式（observer pattern）的扩展。有人称之为函数式响应型编程（functional reactive programming），但这是一种误解，在其[简介](http://reactivex.io/intro.html)中就已经进行了澄清。
- `/*package*/`注释的作用是作者为了表明自己并非忘记写修饰符（`private/protected/public...`），而是确定使用默认的访问级别，即同一包内可访问（`default`）。
- `java.util.concurrent.atomic`包，为了保持并发线程下对象操作的原子性。实现方式主要借助`volatile`修饰符，其用法参考[volatile关键字](https://juejin.im/post/5a2b53b7f265da432a7b821c)。
- 线程池`java.util.concurrent.Executor`。



#### class Hystrix

* hystrix类主要维护了一个`ThreadLocal<ConcurrentStack<HystrixCommandKey>>` currentCommand。

#### abstract class HystrixCommand

* 继承自`AbstractCommand`。除了构造器和重写外，向外部暴露了一个新的`excute()`函数，用于返回回调函数的执行结果。

* `AbstractCommand`的另一个子类是`HystrixObservedCommand`，该类和`HystrixCommand`都是用于封装对外部系统的调用并在单独的线程中执行，之所以命名为`*Command`，因为应用了设计模式中的命令模式。

#### abstract class HystrixCollapser

* HystrixCollapser将多次请求压缩为只需单次执行的HystrixCommand。其使用的基础类在`collapser`包下定义。

#### interface HystrixObservable

* 只有`observe()`和`toObservable()`两个函数。
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

* 该类的第二个属性为线程池`protected final HystrixThreadPool threadPool`，看一下线程池的创建。

* Java线程池位于`java.util.concurrent`包。其中关于线程池的几个重要的类或接口关系如下：

  * `interface Executor`：实现了该接口的类均可视作线程池。该接口只有一个方法`Executor`用于执行传入的线程对象；
  * `interface ExecutorService`：继承了`Executor`，定义了一些其他的应该由线程池实现的函数，比如关闭（`shutdown()`）、能够返回`Futrue`对象的提交任务函数（`<T> Future<T> submit(Callable<T> task)`）；
  * `abstract class AbstractExecutorService`：实现了`ExecutorService`接口，定义了线程池的默认实现；
  * `class ThreadPoolExecutor`：继承自`AbstractExecutorService`，是线程池的具体实现。使用`new ThreadPoolExecutor(args...)`即可完成线程池的创建；
  * `class Executors`：定义了一些常用的线程池，包括固定大小的线程池`newFixedThreadPool`、单个线程的线程池`newSingleThreadExecutor`、可变大小的线程池`newCachedThreadPool`等；

  顺着`threadPool`属性查找，发现它是在`HystrixConcurrencyStrategy`类中使用`new ThreadPoolExecutor(args...)`方式创建的。


#### class HystrixCommandMetrics

* 注释里说，这个类被`HystrixCommand`类用来记录指标（我们知道`AbstractCommand`有两个子类，为什么只说被`HystrixCommand`使用，另外一个子类`HystrixObservedCommand`不使用吗？）。

* 所以理所当然的，在命令类`AbstractCommand`和熔断器`HystrixCircuitBreaker`都包含一个`HystrixCommandMetrics metrics`属性，并且命令类和该命令类的所持有的熔断器将使用同一个指标对象，前者负责指标（`class HealthCounts`）的统计和更新，后者查询该指标，并在检测到指标异常时，打开熔断器。

* 在熔断器`HystrixCircuitBreaker`的打开逻辑中可以看到实际上是通过订阅`HystrixCommandMetrics`中的`HealthCountsStream`对象来获取统计数据的：

  ```java
  private Subscription subscribeToStream() {
      return metrics.getHealthCountsStream()
          .observe()
          .subscribe(new Subscriber<HealthCounts>() {
              //...
              @Override
              public void onNext(HealthCounts hc) {
                  //...
  ```

  于是跟踪`HealthCountsStream`的继承关系，一路来到了`abstract class BucketedCounterStream`：

  ```java
  this.bucketedStream = Observable.defer(new Func0<Observable<Bucket>>() {
      @Override
      public Observable<Bucket> call() {
          return inputEventStream
              .observe()
              .window(bucketSizeInMs, TimeUnit.MILLISECONDS) //bucket it by ...
              .flatMap(reduceBucketToSummary)                //for a given bucket...
              .startWith(emptyEventCountsToStart);           //start it with...
      }
  });
  ```

  上面的代码是获取一个窗口（或称为bucket）内发生的数据，其中`reduceBucketToSummary`的定义为：

  ```java
  this.reduceBucketToSummary = new Func1<Observable<Event>, Observable<Bucket>>() {
      @Override
      public Observable<Bucket> call(Observable<Event> eventBucket) {
          return eventBucket.reduce(getEmptyBucketSummary(), appendRawEventToBucket);
      }
  };
  ```

  上面`reduce`函数接收的第一个参数为可变类型，第二个参数为函数类型。在该定义中，第一个参数`getEmptyBucketSummary()`为抽象方法，在`HealthCountsStream`的定义为：

  ```java
  @Override
  long[] getEmptyBucketSummary() {
      return new long[NUM_EVENT_TYPES];
  }
  ```

  所以第一个参数类型为long[]，第二个参数在`HealthCountsStream`的构造器中找到：

  ```java
  HealthCountsStream newStream = new HealthCountsStream(commandKey, numBuckets, bucketSizeInMs, HystrixCommandMetrics.appendEventToBucket);
  ```

  其中`HystrixCommandMetrics.appendEventToBucket`作为函数的定义如下：

  ```java
  public static final Func2<long[], HystrixCommandCompletion, long[]> appendEventToBucket = new Func2<long[], HystrixCommandCompletion, long[]>() {
      @Override
      public long[] call(long[] initialCountArray, HystrixCommandCompletion execution) {
          ExecutionResult.EventCounts eventCounts = execution.getEventCounts();
          for (HystrixEventType eventType: ALL_EVENT_TYPES) {
              switch (eventType) {
                  case EXCEPTION_THROWN: break; //this is just a sum of other anyway - don't do the work here
                  default:
                      initialCountArray[eventType.ordinal()] += eventCounts.getCount(eventType);
                      break;
              }
          }
          return initialCountArray;
      }
  };
  ```

  从该函数中能够看到，`execution`中保存了执行结果统计，并将统计结果累加到了`initialCountArray`中（因为`initialCountArray`初始值全为0，因此只相当于转移了数据）。

  从上面的分析可以得出，`HealthCountsStream`其实是完成了分割窗口和数据接收的工作，真正的计数工作继续追踪`execution`，发现是存放在了`ExecutionResult`类的内部类`EventCounts`中。

