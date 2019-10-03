Hystrix源码阅读



#### class Hystrix

补充知识点：

* `private class Node<E>`——泛型。
* `/* package */static Action0 startCurrentThreadExecutingCommand(HystrixCommandKey key)`——`Action0`来自`rxjava-1.2.0`，一个处理异步任务的包；前面的`/*package*/`注释的作用是作者为了表明自己并非忘记写修饰符（`private/protected/public...`），而是确定使用默认的访问级别，即同一包内可访问（`default`）。
* `AtomicReference<Node<E>> top = new AtomicReference<Node<E>>();`——`AtomicReference`来自jdk的`java.util.concurrent.atomic`包，该包下的类都是为了保持并发线程下对象操作的原子性。实现方式主要借助`volatile`修饰符，其用法参考[面试官最爱问的volatile关键字](https://juejin.im/post/5a2b53b7f265da432a7b821c)。
* 要理解hystrix，看来要先读Hystrixcommand。

#### class HystrixCommand

