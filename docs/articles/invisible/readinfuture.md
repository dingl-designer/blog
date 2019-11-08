#### *Become a Java GC Expert* Serials：

[Understanding Java Garbage Collection](https://www.cubrid.org/blog/understanding-java-garbage-collection)

[How to Monitor Java Garbage Collection](https://www.cubrid.org/blog/how-to-monitor-java-garbage-collection)

[How to Tune Java Garbage Collection](https://www.cubrid.org/blog/how-to-tune-java-garbage-collection)





#### lock

[Java -- bias lock, lightweight lock, spin lock, heavyweight lock](http://www.programmersought.com/article/407747922/)





```java
private static int end = 1000001;
private static int[] primes = new int[end];
private static void init(){
    for(int i=2;i<end;i++){
        if(primes[i] == 0){
            for(int j=i+i;j<end;j+=i){
                primes[j] = 1;
            }
        }
    }
}
```

