[JVM技术](https://www.oracle.com/technetwork/java/javase/tech/index-jsp-136373.html)之[引擎结构](https://www.oracle.com/technetwork/java/whitepaper-135217.html)



<a href="#1">Chapter 1. Introduction and Overview</a>

* <a href="#solid">Java HotSpot VM -- Built on a Solid Foundation</a>

<a href="#2">Chapter 2. The Java HotSpot VM Architecture</a>

* [Overview](https://www.oracle.com/technetwork/java/whitepaper-135217.html#overview)
* [Memory Model](https://www.oracle.com/technetwork/java/whitepaper-135217.html#memory)
* [Garbage Collection](https://www.oracle.com/technetwork/java/whitepaper-135217.html#garbage)
* [Ultra-Fast Thread Synchronization](https://www.oracle.com/technetwork/java/whitepaper-135217.html#ultra)
* [64-bit Architecture](https://www.oracle.com/technetwork/java/whitepaper-135217.html#64)





### <a id="1"> </a>第一章 概述

Java HotSpot VM（virtual machine）是由太阳微系统公司的高性能Java平台VM。Java HotSpot技术是Java SE平台的基础，是快速开发和部署业务关键型桌面和企业应用程序的首选解决方案。Java SE技术支持Solaris（太阳微系统公司研发的操作系统）、Linux和Windows等系统。

Java平台已成为软件开发和部署的主流工具。随着开发人员和用户的增多，Java平台在很多方面爆炸式增长：从信用卡到无线设备，从桌面系统到大型机。它是部署Web页面小程序、Web services、大型商业软件的基础。

Java HotSpot VM基于Java技术的跨平台支持和健壮的安全模型，并在扩展性、质量和性能方面增加新的功能和特性。

Java HotSpot VM几乎支持企业应用的开发、部署和管理所有方面。它被应用于：

* 集成开发环境（Integrated development environments），包括Sun Java Studio Tools、NetBeans、IBM的Eclipse、IntelliJ IDEA、Oracle JDeveloper等。
* 应用服务供应商包括Sun Sun Java System Application Server, BEA Systems' WebLogic software, IBM's WebSphere software, Apple Computer, Inc.'s WebObjects software等。

太阳微系统公司还通过使用各种业界标准和内部开发的基准来推动性能提升。 这些改进适用于客户端和服务器端Java VM环境。

Java SE平台包含两种虚拟机实现：

* Java  HotSpot客户端虚拟机，在客户端环境中运行应用程序时通过减少应用程序启动时间和内存占用来获得最佳性能。
* Java HotSpot 服务器虚拟机，旨在最大程度地提高服务器环境中运行的应用程序的执行速度。

#### <a id="solid"> </a>Java HotSpot VM建立在坚实的基础之上

Java HotSpot VM建立在强大的功能和特性基础之上。 体系结构支持动态、面向对象的优化，拥有世界一流的性能。 即使是在当今最大的计算系统上VM的多线程支持也能实现高可扩展性。 优越的可靠性\可用性和可维护性（RAS-Reliability,Availability and Serviceability）可提供企业级可靠性，同时实现快速开发，自省和管理。

### <a id="2"> </a>第二章 Java HotSpot VM 体系结构

#### 概述

Java HotSpot VM使用许多先进技术为Java应用程序提供最佳性能，包括最先进的（state-of-the-art）内存模型、垃圾回收、自适应优化器。它以高级的面向对象风格编写，并具有一下特点：

* 统一的对象模型
* 解释、编译和本地帧（native frame）都适用相同的栈（stack）
* 基于本地线程的抢占式（preemptive）多线程
* 垃圾回收
* 极其快速的线程同步
* 动态去除最优化（de-optimization）和积极的编译器优化
* VM启动时生成的特定系统的运行时例程
* 支持并行编译的编译器接口
* 运行时的概要将编译工作聚焦到“hot”方法（Run-time profiling focuses compilation effort only on "hot" methods）

JDK包括两种特色的VM——客户端产品和针对服务器应用进行调整的VM。这两种解决方案共享Java HotSpot运行环境代码库，但是用不同的编译器，两种编译器分别适用于客户端和服务器的独特性能特征。这些差异包括编译内敛策略和堆（heap）默认值。

JDK在发行版中包含这两个系统，因此开发人员可以通过指定-client或-server来选择他们想要的。

虽然服务器和客户端VMs类似，但是服务器VM专门调整以获得最大的峰值运行速度。它用于执行长时间运行的服务器应用，这些应用程序需要尽可能快的运行速度，而不是更快的启动速度和更小的内存占用。

客户端VM编译器是经典VM和老版本的JDK使用的实时（JIT）编译器的升级版。客户端VM为应用程序和小应用程序提供了更好的运行时性能。Java HotSpot客户端VM进行了专门的调整以减少应用程序的启动时间和内存占用，使其更适合客户端环境。一般来说，客户端系统更适合图形用户界面（GUI）。

客户端VM编译器不会去尝试执行许多更复杂的优化（这些优化在服务器VM编译器中将会执行），作为交换，它只需更少的时间来分析和编译一段代码。这意味着客户端VM可以更快地启动并且需要更小的内存占用。

服务器VM包含一个先进的自适应编译器，它支持许多优化C++编译器时使用的优化类型，以及一些传统编译器无法完成的优化，比如跨虚拟方法调用的积极内联。这是相对于静态编译器的竞争和性能优势。自适应编译技术在方法方面非常灵活，甚至超越了高级静态分析和编译技术。

两种解决方案均承诺极度的可靠性、安全性和可维护的环境，以满足当今企业客户的要求。

#### 内存模型

##### 无句柄对象

在之前版本的Java VM（比如经典 VM）中，间接句柄用于表示对象引用。虽然这使得在垃圾收集期间重新定位对象变得容易，它意味着一个重要的性能瓶颈，因为访问Java编译编程语言对象的实例变量需要两层的间接引用。

在Java HotSpot VM中，Java代码不使用句柄。对象引用由直接指针来实现。这实现了对实例变量的C-speed（像C一样快？）访问。当对象在内存回收期间被重定位时，垃圾回收器负责查找和更新对象的所有引用。

##### 双字对象头

Java HotSpot VM 使用两个机器字对象头，而不是经典VM中的三个字。由于Java 对象的平均大小很小，这对空间占用有很大的影响（对象占用空间越小，减少一个字节带来的收益比例就越大），对于典型的应用程序，可以节省大约8%的堆空间占用。对象头部第一个字包含诸如标识哈希码和GC状态之类的信息。第二个字节是对象的类的引用。只有数组有三个字节的头，为了存放数组的元素个数。

##### 反射数据表示为对象

类、方法和其他内部反射数据直接表示为堆上的对象（尽管这些对象可能无法直接访问基于Java技术的程序）。这不仅简化了VM内部的对象模型，并且允许类对象被其他 Java对象使用的垃圾收集器进行回收。

##### 本地线程支持，包括抢占式和多线程

每个线程方法激活栈都使用主机操作系统的的栈和线程模型来表示。Java语言方法和本地方法共享栈，允许C和Java之间快速调用。使用主机操作系统的线程调度机制来支持完全抢占式的（Fully preemptive）Java语言线程。

使用本地操作系统线程和调度的一个主要优势是能够透明地利用本地操作系统的多线程支持。Java HotSpot VM被设计为在执行Java代码时对抢占和多线程引起的竞争条件不敏感，因此Java线程将自动利用本地操作系统提供的任何调度和处理器分配策略。

#### 垃圾回收

Java HotSpot VM内存系统的代属性带来的灵活性，能够使用特定的垃圾收集算法来适应各种应用的需求。Java HotSpot VM支持几种不同的垃圾收集算法，旨在满足不同的暂停时间和吞吐量要求。

##### 背景

Java语言提供了内置的自动内存管理（或者垃圾收集）对于程序员来说是一个重要的吸引力。在传统语言中，动态内存由显式的分配/释放（allocate/free）模型来分配。在实践中，这被证明不仅是传统语言中内存泄漏、程序BUG和崩溃的主要来源，而且是模块化、代码复用的性能瓶颈和主要障碍（如果模块之间没有明确的和难以理解的合作，决定跨模块边界的自由点几乎不可能）。在Java语言中，垃圾收集也是支持安全模型的“safe”执行语义的重要组成部分。

只有当一个对象被证明不再被运行程序访问的时候，垃圾回收器通过回收对象，在后台（behind the scenes）自动释放未被使用的内存。



传统上，相对于显式释放（explicit-free）模型，垃圾收集被认为是阻碍性能的低效过程。事实上，使用现代垃圾收集技术，其性能已经提高了很多，以至于整体上比显式释放对象所提供的性能要好很多。

##### Java HotSpot 垃圾回收

除了包含下面描述的最先进的特性，内存系统被设计为干净的、面向对象的框架，可以很容易的检测、试验或者扩展以使用新的垃圾收集算法。

Java HotSpot 垃圾收集器的主要功能如下。总的来说，这些特性在两种情形下都非常适合，无论是希望获得最高性能的应用程序，还是长期运行的程序，在长期运行的程序中，由于碎片导致的内存泄漏或内存不可用是无法忍受的。

##### 准确性

Java HotSpot垃圾收集器是一个完全准确的收集器。相比之下，许多其他的垃圾收集器是保守的或部分准确的。











