#### abstract Class ClassLoader

##### 注释

`ClassLoader`负责加载类。给出一个类的二进制名称，类加载器试图定位或生成构成该类的定义的数据。典型的策略是将名称转换成文件名并从文件系统读取这个class文件。

每一个类对象都包含对定义了当前对象的`ClassLoader`的引用——`getClassLoader()`。

数组类的类对象不是被类加载器创建的，而是在Java运行时根据需要创建的。数组类的类加载器（`getClassLoader()`的返回值）和它的元素类型的类加载器是一致的。

应用程序实现了`ClassLoader`的子类以达到动态加载类的目的。

安全管理器通过类加载器指定安全域。

`ClassLoader`类使用委托（delegation）模型（中文翻译成“双亲委派”，太魔性）搜索类和资源。每一个`ClassLoader`实例关联一个父级类加载器。当收到一个类或资源的查找请求时，`ClassLoader`实例在自己动手查找之前会先将查找任务交给父级加载器。虚拟机内置的类加载器，称为“bootstrap class loader”，没有父级但可以作为其他`ClassLoader`实例的父级。

支持并发加载类文件的类加载器被称为“parallel capable”类加载器，并且要求在类初始化的时候通过调用`ClassLoader.registerAsParallelCapable`进行注册。然而，它的子类如果要获得并行能力需要也注册。

在使用非严格等级制的委托模型的环境中，类加载器需要并行能力，否则类的加载可能引发死锁，因为在类的加载过程中持有加载器锁（详见`loadClass`函数）。

通常，JVM从基于平台行为的本地文件系统中加载类文件。比如，在UNIX系统中，JVM从环境变量`CLASSPATH`定义的目录加载类文件。

然而，一些类可能不来自文件，他们可能来自其他源，比如网络，或者被应用程序构建。函数`defineClass(String, byte[], int, int)`将字节数组转换成类实例。新定义的类的实例可以使用`Class.newInstance`创建。

**注**：上面使用的“实例（instance）”、“对象（object）”并非指我们通常所说的通过new关键字创建出来的对象（除了最后一句）。即加载类并不是创建对象，但是加载的类可以通过`Class.newInstance`创建对象。

类加载器加载的类可能引用了其他类。为了确定被引用类，JVM调用创建该类的类加载器的`loadClass`函数。

比如，一个应用可以创建一个网络类加载器从服务器下载类文件。示例代码可能是这样的：

```java
ClassLoader loader = new NetworkClassLoader(host, port);
Object main = loader.loadClass("Main", true).newInstance();
//...
```

子类网络类加载器必须定义`findClass`和`loadClassData`以从网络加载类。一旦他下载了构成类的字节数组，它使用`defineClass`函数创建类的示例。一个实现示例为：

```java
class NetworkClassLoader extends ClassLoader {
    //...
    public Class findClass(String name) {
        byte[] b = loadClassData(name);
        return defineClass(name, b, 0, b.length);
    }
    //...
}
```













