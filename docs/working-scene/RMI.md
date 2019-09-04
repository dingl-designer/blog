RMI教程：

[Java Remote Method Invocation - Distributed Computing for Java](https://www.oracle.com/technetwork/java/javase/tech/index-jsp-138781.html)

一个可运行的RMI示例：

https://docs.oracle.com/javase/tutorial/rmi/TOC.html



#### 概述

​	RMI提供了一个简单而直接的使用Java对象进行分布式计算的模型，具有Java在分布式计算方面的安全性和可移植性（portability）的优势。

​	RMI可以使用标准的Java本地方法接口（native method interface-JNI）连接现有的旧系统，也可以使用标准的JDBC包连接现有的关系型数据库。

####  优势

​	可以说，RMI是Java对于远程过程调用（remote procedure call-RPC）机制的实现。传统的RPC是语言中立的（language-neutral），所以它只提供在所有可能的目标平台上都可用的通用功能。RMI专注于Java，拥有基于本地方法建立的与现有系统的连接，这意味着RMI可以通过自然、直接的途径为您提供分布式计算技术，使您能够在整个系统中渐进而无缝地添加Java功能。

​	RMI的基本优势：

* 面向对象：RMI中，参数和返回值可以是完整对象（比如hashtable对象），而不仅仅是预定义的数据类型。而传统的RPC系统中，您必须让客户端将这样的对象分解为原始数据类型，并在服务器端重新组装。
* 移动（传递）行为：RMI可以在客户端和服务端之间移动行为（实现类）。例如你定义了一个接口，用户调用接口时，客户端从服务端取得实现类，如果服务端实现类发生变化，就会开始向客户端返回新的实现类。实现类的一致性由客户端负责检查（更快的响应用户且减轻服务端负载）而无需向用户系统安装新的软件。这提供了很大的灵活性，因为业务的改变只需要写一个新的Java对象且在服务端进行一次安装。
* 设计模式：对象的传递使得可以在分布式计算中发挥面向对象技术的全部优势，比如二层和三层架构（two- and three-tier）系统。当你可以传递行为的时候，你就可以使用面向对象设计模式。如果不能完整地传递对象（包括实现和类型），设计模式的优势就会消失。
* 安全可靠：RMI使用内置Java安全机制，当用户下载实现（implementations）时保证系统的安全。RMI使用安全管理器可以保护系统远离恶意小应用程序（hostile applets），这样可以保护你的系统和网络免受已经下载的（download**ed**）潜在恶意代码的攻击（详见安全性章节）。
* 易写易用：RMI使得编写远程Java服务器和访问这些服务器的Java客户端变得简单。服务器只需要三行代码声明自己是服务器，其余部分和其他Java对象一样。
* 与现有系统的连接：RMI使用JNI与现有系统建立连接。使用RMI和JNI你可以使用Java写客户端并调用现有的服务器实现（implementation）。同样，RMI可以通过JDBC与现有关系型数据库交互而无需改变使用该数据库的非Java源。
* 一次编写，处处运行：如果是RMI/JDBC系统，可以100%移植到任何Java虚拟机；如果使用RMI/JNI与现有系统交互，使用JNI编写的代码可以使用任何Java虚拟机编译和运行。
* 分布式垃圾收集：RMI使用其分布式垃圾收集功能收集不再被任何客户端引用的远程服务器对象。
* 并行计算：RMI是多线程的，允许你的服务器使用Java线程对客户请求进行更好的并发（concurrent）处理。
* Java分布式计算解决方案：从JDK1.1开始RMI就是Java核心平台的一部分，存在于每一个1.1的Java 虚拟机中。所有的RMI系统通过相同的公共协议交流，无需任何协议转换开销。

#### 传递行为（Passing Behavior）

​	深入描述RMI是如何实现将行为在系统之间传递和更新的。

#### 服务器定义政策（Server-Defined Policy）

​	图1展示了一个动态可配置费用报表系统的一般图形。客户端为用户提供GUI（graphical user interface），用以填写费用报表。客户端通过RMI与服务器连接。服务器通过Java关系数据库包（Java relational database package）JDBC将费用报表存储在数据库。这看起来像一个多层架构系统，但是有一个重要的区别：RMI能够下载行为。

​	假设公司关于费用报表的政策发生改变。比如今天公司只要求费用大于20美元的收据，明天又觉得这太宽容，它要求除了少于20美元的伙食补贴的所有收据都要上报。如果不能下载行为，你有如下设计方案用于系统更新。

* 将政策实现安装到客户端。当政策更新时，要求更新所有包含政策的客户端。
* 费用报表每增加一个条目都由服务器检查策略。这回导致客户端和服务器之间的大量流量，阻塞网络并给服务器增加负担。它还会是系统变得脆弱，也意味着增加一个条目会很慢，因为需要等待服务器响应。
* 当用户提交报告时由服务器检查策略。这导致用户不能第一时间发现错误，因而浪费很多时间。

有了RMI，你仅需要一个简单的调用就可以从服务器更新策略到客户端，从而将计算负载从服务器转移到客户端，同时为用户提供更快的响应。当用户准备好填写新的费用报表时，客户端向服务端请求一个包含当前报表政策的对象，作为Java编写的政策接口的实现。对象可以以任何方式实现政策。如果RMI客户端是第一次看到政策的这种特定实现，就会向服务端请求一个实现的副本（准确的来说是实现类的类定义，具体实现见[codebase](./codebase.html)。实现副本会在实现对象返回之前完成下载，见本章节结尾部分）。如果明天实现发生了改变，会向客户端返回一种新的政策对象，RMI客户端会请求新的实现。

​	这意味着政策始终是动态的。如果政策改变，你仅需要写一个政策接口的新实现类，安装到服务器并配置服务器返回该类型的对象即可。

​	这是比任何静态方案更好的方案，因为：

* 无需停止和更新客户端。
* 服务器不被可以本地进行的条目检查工作困扰。
* 允许动态协议（dynamic constraints），因为实现对象可以再客户端和服务器之间传递。
* 客户可以立即得知错误。

这是定义的客户端可以从服务器调用的远程接口：

```java
import java.rmi.*;
public interface ExpenseServer extends Remote {
    Policy getPolicy() throws RemoteException;
    void submitReport(ExpenseReport report) 
        throws RemoteException, InvalidReportException;
}
```

所有RMI类型都在`java.rmi`包或其子目录下定义。ExpenseServer接口有两个有趣的特征：

* 它继承了Remote接口，标志着接口可以被远程调用。
* 它的所有方法都会抛出RemoteException，这个异常用来提示网络和信息异常。Remote方法必须抛出RemoteException，从而可以处理只有在分布式系统中才会发生的异常。ExpenseServer接口提供两个方法：`getPolicy`方法一个返回Policy接口的实现类，`submitReport`提交一个完整的费用报表请求并且在报表发生任何问题时抛出异常。

Policy接口声明了一个方法，用来告知客户端向费用报表添加一个条目是否可接受：

```java
public interface Policy {
    void checkValid(ExpenseEntry entry) 
        throws PolicyViolationException;
}
```

如果条目通过验证（符合当前政策），方法正常返回。否则抛出异常。Policy接口是本地的，所以也由客户端本地对象（运行在客户端本地虚拟机，而不是通过网络）来实现。客户端可能有如下操作：

```java
Policy curPolicy = server.getPolicy();
start a new expense report
show the GUI to the user
while (user keeps adding entries) {
    try {
        curPolicy.checkValid(entry); // throws exception if not OK
        add the entry to the expense report
    } catch (PolicyViolationException e) {
        show the error to the user
    }
}
server.submitReport(report);
```

当用户请求客户端软件开始新的费用报表时，客户端通过`server.getPolicy`向客户端请求一个包含当前费用政策的对象。每个添加的条目要先获得policy对象的批准。如果report对象未抛出异常，条目则被添加到报表；否则错误信息会反馈给用户以进行更改。当用户添加完条目之后，提交整个报表。服务端看起来像下面这样：

```java
import java.rmi.*;
import java.rmi.server.*;
class ExpenseServerImpl 
    extends UnicastRemoteObject 
    implements ExpenseServer
{
    ExpenseServerImpl() throws RemoteException {
        // ...set up server state...
    }
    public Policy getPolicy() {
        return new TodaysPolicy();
    }
    public void submitReport(ExpenseReport report) {
        // ...write the report into the db...
    }
}
```

除了基本包外，我们还导入了服务器包。UnicastRemoteObject定义了服务器的对象类型，是单个服务而不是复制服务（稍后会介绍）。ExpenseServerImpl类实现了ExpenseServer接口，客户端可以通过RMI将消息发送到该类。

重点讨论一下`getPolicy`方法，该方法返回一个定义当前政策的对象。我们看一个policy的简单实现类：

```java
public class TodaysPolicy implements Policy {
    public void checkValid(ExpenseEntry entry) 
        throws PolicyViolationException
    {
        if (entry.dollars() < 20) {
            return; // no receipt required
        } else if (entry.haveReceipt() == false) {
            throw new PolicyViolationException;
        }
    }
}
```

TodaysPolicy确保没有条目小于20美元。如果明天政策放生变化，只有20美元以下的餐费不要收据，你可以提供一个新的实现：

```java
public class TomorrowsPolicy implements Policy {
    public void checkValid(ExpenseEntry entry)
        throws PolicyViolationException
    {
        if (entry.isMeal() && entry.dollars() < 20) {
            return; // no receipt required
        } else if (entry.haveReceipt() == false) {
            throw new PolicyViolationException;
        }
    }
}
```

编写此类，将其安装到服务器，并告诉服务器开始分发（hand out）TomorrowsPolicy对象而不是TodaysPolicy 对象，你的整个系统开始应用新的政策。当客户端调用服务器的getPolicy方法时，客户端的RMI检查反悔的是不是已知的对象类型。客户端第一次遇到（encounter）TomorrowsPolicy对象，在getPolicy返回之前RMI会将政策的实现下载下来（这样getPolicy返回的对象就可以立即被使用）。

RMI使用标准的Java对象序列化机制传递对象。与远程对象有引用关系（references）的参数（如果翻译成“引用远程对象的参数”会有歧义）作为远程引用被传递。如果方法的参数是基本类型或本地（非远程）对象，会向服务器发送一个深拷贝副本。返回值在相反的方向上做同样的处理。RMI允许传递和返回本地对象的完整对象图（full object graphs）和远程对象的引用。

*Policy接口在客户端和服务端都会用到，实际工作中，该接口会存在于jar包中，然后将jar包分发给客户端和服务端进行引用*

#### 计算服务器

​	费用报表的例子展示了客户端如何从服务器获取行为。行为可以双向流动，客户端同样可以向服务器（原文是user，我觉得他是想说server）传递行为。最简单的例子是如图2所示的计算服务器，服务器能够执行任何的任务所以客户端能够利用高端（high-end）或专门计算机的优势。

任务由本地（非远程）接口定义：

```java
public interface Task{
	Object run();
}
```

计算服务器的远程接口同样简单：

```java
import java.rmi.*;
public interface ComputeServer extends Remote{
	Object compute(Task task) throws RemoteException;
}
```

这个远程接口的唯一目的，就是允许客户端创建任务并传递给服务器进行计算，返回计算结果。下面是接口的一个基本实现：

```java
import java.rmi.*;
import java.rmi.server.*;
public class ComputeServerImpl
    extends UnicastRemoteObject
    implements ComputeServer
{
    public ComputeServerImpl() throws RemoteException { }
    public Object compute(Task task) {
        return task.run();
    }
    public static void main(String[] args) throws Exception {
        // use the default, restrictive security manager
        System.setSecurityManager(new RMISecurityManager());
        ComputeServerImpl server = new ComputeServerImpl();
        Naming.rebind("ComputeServer", server);
        System.out.println("Ready to receive tasks");
        return;
    }
}
```

compute方法也很简单，它仅仅返回了传递过来的task对象的run函数生成的任何结果。main函数包含服务器的设置代码：安装了RMI的默认安全管理器防止对本地系统（应该是指ComputeServerImpl以外的部分）的访问，创建ComputeServerImpl实例处理进来的请求，并将实例绑定到名称“ComputeServer”。这时服务器准备好接收任务来执行了。

如果你编写上述类，编译他们并启动，那么你就拥有了一台可以执行任何任务的计算服务器。

假设我们购买了一台高端服务器，上面运行着Java虚拟机，里面的ComputeServerImpl对象正在等待接收任务。现在有一个小组想要使用数据集训练神经网络以帮助制定购买策略。下面使他们将要经历的步骤：

* 定义一个PurchaseNet类，拥有数据集训练，并训练得到一个神经网络。PurchaseNet类需要实现Task接口，在run方法中完成计算。Neuron类用来描述返回的神经网络的节点。也许还有一些其他的类用来描述这个过程。run方法返回一个NeuralNet对象，作为被训练的Neuron对象的集合。
* 当这些类编写完成并可以在简单测试用例上工作的时候，使用PurchaseNet对象调用计算服务器的计算方法。
* 当ComputeServerImpl进程接收到PurchaseNet对象作为参数时，它会下载PurchaseNet的实现类并调用服务器的compute方法。
* PurchaseNet对象开始计算，当实现类需要新的类比如Neuron和NeuralNet时，它们也会被下载。
* 所有的计算在服务器进行，客户端等待计算结果。服务器计算完成之后向客户端返回NeuralNet对象。

简单的计算服务器架构为你的分布式系统提供了强大的转变。任务的计算可以转移到支持最好的系统上。等效的系统可用于：

* 支持数据挖掘应用（data mining application），其中ComputeServerImpl对象运行在需要挖掘的数据所在的主机上。这使你可以把计算轻松的移动到数据所在主机上。
* 在外部数据源直接馈送数据的服务器上运行计算，例如股票价格、发货信息或其他实时信息。（跟上面的差不多，只是数据来源的形式不一样）
* 通过一个不同的ComputeServer实现方式完成多服务器间的任务分发。获取请求任务并将其转发给负担最小的服务器。



#### 代理

​	由于RMI允许你下载使用Java实现类的行为，你可以使用RMI编写代理系统。最简单的形式如下：

```java
import java.rmi.*;
public interface AgentServer extends Remote {
    void accept(Agent agent)
        throws RemoteException, InvalidAgentException;
}
public interface Agent extends java.io.Serializable {
    void run();
}
```

启动一个代理，将会是创建一个实现了Agent接口的类，找到一个服务器，使用agent对象作为参数调用accept函数。agent的实现类将会下载到服务器并在那里运行。accept将会为agent启动一个新的线程，并调用它的run方法，然后返回，agent在方法返回后继续运行。通过调用其他主机上运行服务的accept方法，agent对象可以转移到该主机上，然后杀掉原主机上的进程。



#### 面向对象代码复用和设计模式（形容词只修饰and前的部分）

​	面向对象是代码复用的强大技术，很多组织使用面向对象编程来减轻创建项目的负担，并提高系统的灵活性。RMI在任何层面都是面向对象的：发送消息给远程对象，对象可以被发送和返回。

设计模式议案（movement）在描述面向对象设计的良好实践时非常成功。这些编程的模式是对特定问题的整体方案进行正式描述的一种方式。所有这些设计模式都依赖与创建一个或多个允许不同实现的抽象，从而实现和增强软件的复用。*软件复用是面向对象技术的核心承诺，设计模式是推动软件复用最流行的技术*。

所有设计模式都依赖面向对象的多态性：对象（比如Task）具有多个实现的能力。算法的一般部分（比如compute方法）不需要知道当前使用的是那一种实现，他只需要知道当它拿到一个对象是要如何处理这个对象。特别是，计算服务器是命令模式（Command pattern，行为型模式的一种）的示例，它允许你将请求封装为一个对象，并进行调度。

多态性只有当整个对象（包括实现）能够在客户端与服务器之间传递时才有效。传统的RPC系统，比如DCE和DCOM，以及基于对象的RPC系统，比如CORBA，不能下载和运行实现类，因为他们不能传递真实对象作为参数，只能传递数据。

相对而言，RMI传递的是完整的类型（包括实现），所以你可以在你的分布式计算系统的任何地方使用面向对象编程（包括设计模式）。如果没有RMI的完整面向对象系统，你只能在分布式计算系统中放弃设计模式。

*注*：虽然 server 只有“服务器”这一种中文解释，但是有些时候， 将 server 译为服务提供者或者简称为服务似乎更合适，但并不是指提供的服务本身，服务本身应该称为service。

#### 连接现有服务（Server）

RMI借助JNI和JDBC可以连接两层或三层架构系统，即使两边都不是使用Java编写的。

假设你有一个现有系统用来在关系数据库中存储消费者订单信息。在任何多层架构系统中你需要设计一个远程接口使得客户端可以访问服务器，使用RMI的话将会是一个Remote接口：

```java
import java.rmi.*;
import java.sql.SQLException;
import java.util.Vector;
public interface OrderServer extends Remote {
    Vector getUnpaid() throws RemoteException, SQLException;
    void shutDown() throws RemoteException;
    // ... other methods (getOrderNumber, getShipped, ...)
}
```

`java.sql`包包含了JDBC包。每一个远程方法都可以通过使用JDBC访问数据库的服务来实现，也可以通过使用其他数据库访问机制的本地方法来实现。getUnpaid方法将会返回一个Order对象的向量（列表），Order是在你的系统中保存客户订单的类。

接下来我们将向你展示如何使用JDBC实现getUnpaid和使用JNI实现shutDown。

#### JDBC-直连数据库

​	使用JDBC实现getUnpaid：

```java
import java.rmi.*;
import java.rmi.server.*;
import java.sql.*;
import java.util.Vector;
public class OrderServerImpl
    extends UnicastRemoteObject
    implements OrderServer
{
    Connection db;                  // connection to the db
    PreparedStatement unpaidQuery;  // unpaid order query
    OrderServerImpl() throws RemoteException, SQLException {
        db = DriverManager.getConnection("jdbc:odbc:orders");
        unpaidQuery = db.prepareStatement("...");
    }
    public Vector getUnpaid() throws SQLException {
        ResultSet results = unpaidQuery.executeQuery();
        Vector list = new Vector();
        while (results.next())
            list.addElement(new Order(results));
        return list;
    }
    public native void shutDown();
}
```

大部分是JDBC的工作。当RMI服务器对象OrderServerImpl的getUnpaid方法被调用的时候，预编译的查询被执行。

#### JNI-本地方法

​	RMI服务器和客户端可以利用本地方法作为连接现有系统的桥梁。你可以用本地方法实现没有直连数据库或使用现有代码更易实现的远程方法（RMI调用）。本地接口JNI使你能够写C或C++代码来实现Java方法，并且通过Java对象调用。下面是本地方法实现shutDown（应该是用C写的，C++一般会加`extern "C"`）：

```c
JNIEXPORT void JNICALL
Java_OrderServerImpl_shutDown(JNIEnv *env, jobject this)
{
    jclass cls;
    jfieldID fid;
    DataSet *ds;
    cls = (*env)->GetObjectClass(env, this);
    fid = (*env)->GetFieldID(env, cls, "dataSet", "J");
    ds = (DataSet *) (*env)->GetObjectField(env, this, fid);
    /* With a DataSet pointer we can use the original API */
    DSshutDown(ds);
}
```

这是假设了现有服务器可通过其API定义的DataSet类型被引用。一个DataSet指针被存储在dataSet属性中。当客户端调用shutDown的时候，会导致服务器的shutDown方法被调用。因为服务器实现声明了shutDown使用本地方法来实现，RMI会直接调用本地方法。本地方法找到对象的dataSet属性，使用它调用现有的API函数DSshutDown。

Sun目前正在与ILOG合作开发一款名为TwinPeaks的产品。TwinPeaks将采用现有的C和C++ API生成Java类包装对该API的调用，这允许你使用Java调用任何现有的API。所以，当TwinPeaks可用以后，你完全可以使用Java编写shutDown方法（相当于上面的JNI代码），而无需JNI。



#### 结构

​	RMI系统致力于为面向对象的分布式计算提供简单直接的基础。它的结构设计为将来可扩展服务和引用类型，因此RMI能够以一致的方式添加特性。

当服务被导出时，它的引用类型被定义好了。在上面的例子中，我们将服务导出为UnicastRemoteObject服务，他们是点对点的未复制（unreplicated）服务。对这些对象的引用适合此类型的服务。不同的服务类型会有不同的引用含义（semantics）。例如，MulticastRemoteObject的引用含义是允许复制服务（replicated service）。

当客户端收到服务器的引用，RMI下载一个存根（stub），该存根将对引用的调用翻译成对服务器的远程调用。如图3所示，存根（第一条竖线）使用对象序列化组织方法的参数，并向服务器发送组织好的调用。在服务器端，RMI系统接收到调用请求，并连接到框架（第二条竖线），框架负责反序列化参数并调用服务器方法的实现。当服务器的实现执行完毕，返回值或抛出异常，框架组织结果并回复客户端存根。存根将应答反序列化，返回结果或抛出异常。存根和框架由服务器实现生成，通常是使用`rmic`程序。存根使用引用和框架交互。这样的框架允许引用来定义交流的行为。UnicastRemoteObject服务使用的引用和单独的服务对象进行交流，这个对象在特定主机和端口上运行。用来处理复制服务的引用将会组播服务请求到一组复制服务上，然后收集响应，根据多个响应返回合适的结果。另外一种引用类型可以在服务未运行在虚拟机的情况下将其唤醒。这些引用类型对客户端是透明的（不可见的）。

#### 安全性

​	执行RMI请求时会有明显的安全隐患。RMI在客户端和服务器之间提供安全通道，并且下载实现在安全“沙箱”中隔离（isolation），以保护你的系统免受不信任客户端的攻击。

定义安全需求是必要的。如果你只是在企业内网部署一个类似于ComputeServer的东西，你只需要知道谁在使用计算周期以便检查是否有人滥用资源。如果你提供一个商业化的计算服务器，你需要提供更全面的保护。这直接影响接口的设计。内部服务器使你只需要请求任务附带姓名和部门信息就可以，商业服务器情形需要更严谨的安全性，包括数字签名验证和一些协议语言，以便能够杀死使用超过规定时间的非法任务。

你可能需要客户端和服务器间的安全通道。RMI为你提供了套接字（socket）工厂，你能够根据需要创建任何类型的套接字，包括加密的套接字。从JDK1.2开始你可以通过给出这些需求的描述来指定套接字的服务需求。这种新技术将会在小应用程序（applets），其中大多数浏览器不允许设置套接字工厂。套接字需求包括加密和其他需求。

下载的类也会出现安全问题，Java通过SecurityManager对象处理安全性，该对象会检查所有的安全敏感行为，比如打开文件或网络连接。通过要求你在导出任何服务对象或调用服务方法之前安装安全管理器的方式，RMI可以实现这种标准的Java安全机制。RMI提供的RMISecurityManager类型和其他小应用程序一样具有限制性（不能访问文件，仅与原主机连接等等）。这能够防止下载的实现读写主机数据，或连接防火墙后面的其他系统。你也可以编写和安装自己的安全管理器。

#### 防火墙

​	RMI为防火墙后面的客户端提供了与远程服务器交互的方法。这允许你使用RMI将客户端部署到互联网，例如万维网可用的小应用程序（applets）中。通过客户端的防火墙会降低通信速度，所以RMI使用最快的成功技术建立客户端和服务器的连接。这个最快的技术在第一次尝试对UnicastRemoteObject的引用时被发现，客户端依次尝试如下三种可能性来完成与服务器的交互：

* 使用套接字直连服务器端口。
* 如果失败，建立一个指向服务器和端口号的URL，并使用HTTP POST请求该URL，信息作为POST请求体发送给框架（skeleton）。如果成功，请求回来的结果就是框架对存根（stub）的响应。
* 如果依旧失败，建立指向服务器80端口（标准的HTTP端口）的URL，使用CGI脚本向服务器发送上一步发送的RMI请求。

三种技术中的任何先成功的一种将被用于后面的与服务器的交互。如果都失败，远程调用失败。

这种三阶后退方案允许客户端尽可能高效的交互，大多数情况下直接使用套接字连接。在没有防火墙的系统，或者交互位于防火墙后面的企业内部时，客户端将使用套接字直连服务器。辅助通讯技术明显慢于直连技术，但是它们允许你编写能够在互联网上广泛应用的客户端。



#### RMI在进化的企业中

​	你可以在新的Java应用（或小应用程序）和现有服务器之间使用RMI。当你这样做的时候，随着时间的推移，你的组织将会因使用可扩展的Java而受益。当你使用Java重写你的系统时，RMI允许Java的优势从现有系统流向新的Java代码。考虑两层架构系统中，一个请求发出并返回的路径：图。

在客户端和服务器之间使用RMI意味着你的整个系统都会因Java受益，即使服务端依旧使用非Java代码。如果你选择使用Java重写部分服务，你将从现有Java组件获取杠杆作用（leverage）。一些最重要的Java优势如下：

* 面向对象的代码复用。
* 传递行为。
* 安全性

少量代码连接了调用现有服务API的传统包装器。传统包装器是Java和现有API的桥梁，正如上面展示的getUnpaid和shutDown实现。可以使用JNI、JDBC或者将来的TwinPeaks。

将上图与使用接口描述语言（interface definition language-IDL）建立客户端与服务器连接的语言中立系统相比，如下图：图。

仍然需要写一个传统的包装器连接由IDL定义的现有服务API的调用。但是基于IDL的方案将Java的优势隔离在了客户端，因为客户端Java在连接服务器之前被削减到了最小公约（least common denominator）。这个能出于任何原因，比如希望提高系统的可靠性，或者希望降低移植成本。或者你的供应商提供了类似的升级。下图是基于RMI的图形：图。

现在更多的请求从Java中受益。你在客户端与服务器间传递的对象为整个系统带来更多的便利。将此与基于IDL的方法进行对比：图。

可能在服务器本地获得了Java的优势，但无法将Java的优势扩展到客户端和服务器的连接。Java的优势在IDL处被切断，因为IDL不能假设连接的另一端也是Java。如果你不丢掉IDL并使用RMI重写它，你不能获得Java的全部优势。

随着越来越多的使用Java，这种失去的机会（应该是指使用IDL导致失去Java的优势的机会）变得更大。

使用基于IDL的方法，使用Java重写服务仍只能带给你被隔离的局部优势。

#### 结论

以上。



#### 实践

​	上面的代码还不能直接运行，因为缺少很多必要的细节，比如安全策略、注册器。按照[第二份教程](https://docs.oracle.com/javase/tutorial/rmi/TOC.html)的步骤搭建示例基本顺利，只有两个地方需要注意：

* 在添加安全策略文件的时候，xxx.policy的中的类文件路径，即使是在Windows下依旧用“/”，比如`"file:e:/codes/rmi/src"`。
* 在启动服务的时候，`-Djava.rmi.server.hostname=mycomputer.example.com`中的域名需要在本机host文件中配置，否则客户端调用时无法解析。或者因为服务和客户端都在本机上，`-Djava.rmi.server.hostname=127.0.0.1`；客户端调用时`client.ComputePi 127.0.0.1 45`。

