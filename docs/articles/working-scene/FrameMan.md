从零到一，问题总结：

* day1
  
  MySQL5.7之后默认开启了SSL，使用JDBC连接时，jdbcUrl中添加useSSL=false可解决连接失败问题。

* day2

  Springboot+Mybatis，在application.properties中添加SQL文件路径配置，提示找不到文件。

  ```xml
  mybatis.mapper-locations=classpath:com/example/demo/mapper/*.xml
  ```

  因为在默认情况下，src/main/java包下的xml类型文件未被编译进target。解决办法是在pom文件中声明要编译的文件。

  ```xml
  <build>
      <resources>
          <resource>
              <directory>src/main/java</directory>
              <includes>
                  <include>**/mapper/*.xml</include>
              </includes>
          </resource>
      </resources>
      ...
  ```

  

  