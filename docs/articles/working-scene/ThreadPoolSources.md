补充：`class Thread implements Runnable`，其中`Thread.start()`与`Thread.run()`的区别在于，前者调用本地（native）函数创建新的线程并执行`run()`内的代码块；如果直接调用`run()`，意味着将使用当前线程执行`run()`内部逻辑，并没有创建新的线程。



#### `interface Executor`

* `execute()`：在将来的某个时候执行给定的命令，可能在新的线程中、在已放入池中的线程中、或者调用方的线程中执行，这是由`Executor`的实现决定的。

* `interface ExecutorService extends Executor`

* `abstract class AbstractExecutorService implements ExecutorService`

#### `class ThreadPoolExecutor extends AbstractExecutorService`

* `Worker extends AbstractQueuedSynchronizer`

* `CAS` and `AQS`
* 