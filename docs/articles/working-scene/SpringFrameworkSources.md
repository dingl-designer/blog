#### IOC的依赖注入

众所周知，IOC的重要入口，是`AbstractApplicationContext.refresh()`。所以，从这里开始，寻找依赖注入的实现。

从`refresh()`找到：

```java
// Instantiate all remaining (non-lazy-init) singletons.
finishBeanFactoryInitialization(beanFactory);
```

`finishBeanFactoryInitialization`中：

```java
// Instantiate all remaining (non-lazy-init) singletons.
beanFactory.preInstantiateSingletons();
```

`preInstantiateSingletons()`来源于接口，在`DefaultListableBeanFactory`中实现，在其实现中有：

```java
getBean(beanName);
```

该函数定义为：

```java
@Override
public Object getBean(String name) throws BeansException {
  return doGetBean(name, null, null, false);
}
```

在`doGetBean`函数中找到了真相：

```java
try {
  final RootBeanDefinition mbd = getMergedLocalBeanDefinition(beanName);
  checkMergedBeanDefinition(mbd, beanName, args);

  // Guarantee initialization of beans that the current bean depends on.
  String[] dependsOn = mbd.getDependsOn();
  if (dependsOn != null) {
    for (String dep : dependsOn) {
      if (isDependent(beanName, dep)) {
        throw new BeanCreationException(mbd.getResourceDescription(), beanName,
          "Circular depends-on relationship between '" + beanName + "' and '" + dep + "'");
      }
      registerDependentBean(dep, beanName);
      try {
        getBean(dep);
      }
      catch (NoSuchBeanDefinitionException ex) {
        throw new BeanCreationException(mbd.getResourceDescription(), beanName,
              "'" + beanName + "' depends on missing bean '" + dep + "'", ex);
      }
    }
  }

  // Create bean instance.
  if (mbd.isSingleton()) {
    sharedInstance = getSingleton(beanName, new ObjectFactory<Object>() {
      @Override
      public Object getObject() throws BeansException {
        try {
          return createBean(beanName, mbd, args);
        }
        catch (BeansException ex) {
          // Explicitly remove instance from singleton cache: It might have been put there
          // eagerly by the creation process, to allow for circular reference resolution.
          // Also remove any beans that received a temporary reference to the bean.
          destroySingleton(beanName);
          throw ex;
        }
      }
    });
    bean = getObjectForBeanInstance(sharedInstance, name, beanName, mbd);
  }

  else if (mbd.isPrototype()) {
    // It's a prototype -> create a new instance.
    Object prototypeInstance = null;
    try {
      beforePrototypeCreation(beanName);
      prototypeInstance = createBean(beanName, mbd, args);
    }
    finally {
      afterPrototypeCreation(beanName);
    }
    bean = getObjectForBeanInstance(prototypeInstance, name, beanName, mbd);
  }

  else {
    String scopeName = mbd.getScope();
    final Scope scope = this.scopes.get(scopeName);
    if (scope == null) {
      throw new IllegalStateException("No Scope registered for scope name '" 
                                      + scopeName + "'");
    }
    try {
      Object scopedInstance = scope.get(beanName, new ObjectFactory<Object>() {
        @Override
        public Object getObject() throws BeansException {
          beforePrototypeCreation(beanName);
          try {
            return createBean(beanName, mbd, args);
          }
          finally {
            afterPrototypeCreation(beanName);
          }
        }
      });
      bean = getObjectForBeanInstance(scopedInstance, name, beanName, mbd);
    }
    catch (IllegalStateException ex) {
      throw new BeanCreationException(beanName,
        "Scope '" + scopeName + "' is not active for the current thread; consider " +
        "defining a scoped proxy for this bean if you intend to refer to it from a singleton", ex);
    }
  }
}
catch (BeansException ex) {
  cleanupAfterBeanCreationFailure(beanName);
  throw ex;
}
```

从上面代码可以看出，在创建一个bean的instance之前，从`RootBeanDefinition mbd`对象获取了依赖的类数组`String[] dependsOn = mbd.getDependsOn();`，如果依赖不为空，就遍历依赖的类，依次进行循环依赖校验和示例化。依赖的类都实例化之后，才进行类本身的实例化。

在创建当前类的时候，在单例模式、原型模式和其他模式下分别调用了`createBean(beanName, mbd, args);`，所以我们继续查找实际注入的过程。`createBean`的实现在抽象类`AbstractAutowireCapableBeanFactory`中，其中有：

```java
Object beanInstance = doCreateBean(beanName, mbdToUse, args);
```

`doCreateBean`函数中：

```java
populateBean(beanName, mbd, instanceWrapper);
```

`populateBean`函数中：

```java
if (mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_NAME ||
    mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_TYPE) {
  MutablePropertyValues newPvs = new MutablePropertyValues(pvs);

  // Add property values based on autowire by name if applicable.
  if (mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_NAME) {
    autowireByName(beanName, mbd, bw, newPvs);
  }

  // Add property values based on autowire by type if applicable.
  if (mbd.getResolvedAutowireMode() == RootBeanDefinition.AUTOWIRE_BY_TYPE) {
    autowireByType(beanName, mbd, bw, newPvs);
  }

  pvs = newPvs;
}
```

可以看到注入方式有两种，按照名称和类型注入。并且依赖的实例放进了`MutablePropertyValues pvs`中，这个看注释，似乎是给构造器用的。总之，依赖的注入就完成了。



