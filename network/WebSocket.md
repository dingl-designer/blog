#### 使用WebSocket实现长连接

##### 写在前面

* Java版的WebSocket不是Java SE中实现的，而是在Jetty或者Tomcat等容器中，如 %TOMCAT_HOME%\lib\websocket-api.jar；

* 开发时需要引入辅助jar包，如果是maven项目，直接添加

  ```xml
  <dependency>  
      <groupId>javax.websocket</groupId>  
      <artifactId>javax.websocket-api</artifactId>  
      <version>1.1</version>  
      <scope>provided</scope>
  </dependency>
  ```

##### 基础版

* 客户端建立连接后，服务端陆续推送20条消息

  ###### 客户端（JS）

```javascript
var ws = new WebSocket("ws://127.0.0.1:8080/hello");
ws.onopen = function(){
	console.log("client online...")
}
ws.onmessage = function(event){
	console.log(event.data);
}
ws.onclose = function(event){
	console.log("WebSocketClosed!");
}
ws.onerror = function(event){
	console.log("WebSocketError!");
}
```

###### 服务端（Java）

```java
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/hello")
public class Endpoint {    
    @OnOpen
    public void onOpen(Session session) throws IOException {
        System.out.println("client online...");
        int times = 20;
        try {
            for(int i=0;i<times;i++){
                session.getBasicRemote().sendText("server message "+i);
                Thread.sleep(1000);
            }
        }
        catch (InterruptedException e){            
            e.printStackTrace();        
        }
    }
    
    @OnMessage    
    public void onMessage(String message) {        
        System.out.println("client message : " + message);
    }    
    
    @OnError    
    public void onError(Throwable t) { 
        System.out.println("connection error, error is " + t.getMessage());
    }    
    
    @OnClose
    public void onClose(Session session, CloseReason reason) {
        System.out.println("connection close, reason is " + reason.getReasonPhrase());
    }
}
```

