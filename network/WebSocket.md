#### 使用WebSocket实现长连接

##### 写在前面

* Java版的WebSocket不是JavaSE中实现的，而是在JavaEE、Jetty、Tomcat等容器中实现的，如 %TOMCAT_HOME%\lib\websocket-api.jar；

* 开发时需要引入辅助jar包，如果是maven项目，直接添加

  ```xml
  <dependency>  
      <groupId>javax.websocket</groupId>  
      <artifactId>javax.websocket-api</artifactId>  
      <version>1.1</version>  
      <scope>provided</scope>
  </dependency>
  ```

* [官方文档](https://docs.oracle.com/javaee/7/tutorial/websocket001.htm)

##### 基础版

* 连接建立后，客户端与服务端进行持续的信息交互

###### 服务端

```java
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/ws")
public class MyEndpoint {
    @OnOpen
    public void onOpen(Session session) throws IOException {
        System.out.println("client " + session.getId() +" online...");
    }
    
    @OnMessage    
    public void onMessage(Session session, String message) {        
        System.out.println("receive message: " + message);
        //回复客户端消息
        session.getBasicRemote().sendText(message);
    }    
    
    @OnError
    public void onError(Session session, Throwable t) {
        System.out.println("connection error ");
        t.printStackTrace();
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        System.out.println("connection close, reason is " + reason.toString());
    }
}
```

###### 客户端

```html
<button onclick="javascript:send()">send</button>
```

```javascript
var ws = new WebSocket("ws://ip:port/ws");
ws.onopen = function(){
	console.log("client online...")
}
ws.onmessage = function(event){
	console.log("receive message: " + event.data);
}
ws.onclose = function(event){
	console.log("WebSocketClosed!");
}
ws.onerror = function(event){
	console.log("WebSocketError!");
}
function send() {
    ws.send("message")
}
```



##### 聊天室版

* 客户端向服务端发送消息，服务端将消息转发给其他客户端
* SessionHolder类用于保存所有在线客户端信息，究其原因，在低版本Tomcat中`session.getOpenSessions()`可用于获取所有在线客户端，但是在高版本中不支持
* 客户端代码同上，服务端代码如下

###### 	服务端

```java
import javax.websocket.Session;
import java.util.HashMap;
import java.util.Map;
public class SessionHolder {    
    private static Map<String, Session> map = new HashMap<>();    
    public static void add(String id, Session session){map.put(id, session);}
    public static void remove(String id){map.remove(id);}
    public static Map<String, Session> getSessions(){return map;}
}
```

```java
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;

@ServerEndpoint("/ws")
public class MyEndpoint {
    @OnOpen
    public void onOpen(Session session) throws IOException {
        System.out.println("client " + session.getId() +" online...");
        //保存客户端信息
        SessionHolder.add(session.getId(), session);
    }

    @OnMessage
    public void onMessage(Session session, String message) {
        message = "client " + session.getId() + " message: " + message;
        System.out.println(message);
        //向其他客户端转发消息
        try {
            for(Map.Entry<String, Session> en : SessionHolder.getSessions().entrySet()){
                Session se = en.getValue();
                if(!se.getId().equals(session.getId())&&se.isOpen()){
                    se.getBasicRemote().sendText(message);
                }
            }
        }
        catch (IOException e){
            e.printStackTrace();
        }
    }
    
    @OnError
    public void onError(Session session, Throwable t) {
        System.out.println("connection error ");
        t.printStackTrace();
    }

    @OnClose
    public void onClose(Session session, CloseReason reason) {
        System.out.println("connection close, reason is " + reason.toString());
        //删除客户端信息
        SessionHolder.remove(session.getId());
    }
}
```

