Ubuntu 18.04 LTS + MySQL 8



#### MySQL基础知识

* 在[下载页](https://www.mysql.com/downloads/)可以看到一些信息，顺便Google下：

  **MySQL的存储引擎**包括InnoDB和MyISAM两种，其中InnoDB支持事物而后者不支持，前者支持行级锁而后者不支持，因此InnoDB比后者更有优势（不仅限于上面两条），MySQL的默认引擎已经从MyISAM变更为InnoDB。

  **MySQL的连接器**包括JDBC和ODBC（“O”代表“Open”），其中前者使用Java而后者基于C/C++，前者跨平台而后者仅支持Windows，前者有更高的性能，因此在Java环境下强烈建议使用JDBC。

* 关于版本选择：

  MySQL Community Edition是社区版本，是免费的，也是我们日常使用的。

#### 使用APT仓库安装

根据[官方教程](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/)指引：

1、进入[下载页面](https://dev.mysql.com/downloads/mysql/)选择OS为Ubuntu Linux，Version为18.04(x86,64-bit)，点击下方的图片连接跳转到deb下载页面，点击download跳转到新页面，忽略提示信息，直接点击下方的“no thanks, just start my download”。

2、下载的文件为`mysql-apt-config_0.8.13-1_all.deb`，安装软件包

```shell
$sudo dpkg -i mysql-apt-config_0.8.13-1_all.deb
```

跳出弹窗，显示默认安装的mysql版本和组件，如果版本是MySQL 8就不需要修改，点击OK。

3、更新apt仓库并安装MySQL Server

```shell
$sudo apt-get update
$sudo apt-get install mysql-server
```

中途会提示设置root密码，输入两次即可（安装5.7版本不会有这个提示，导致后面登陆出现问题）。如果不是经常用的话，设置`123456`吧。

另外一个弹窗提示选择权限认证插件版本，默认第一项为更新后的版本，选择第二项legacy版本，点击OK。

4、查看服务状态，登录

```shell
$sudo service mysql status
```

```shell
$sudo mysql -u root -p
```

**注**：1、使用`sudo`登录可能需要输入两次密码，第一次是计算机用户密码，第二次才是数据库密码。2、因为安装的时候使用的sudo命令，登录时也要在前面加上sudo命令才可以，否则提示无法访问。

#### 创建用户并允许远程登录

MySQL数据库自带的`mysql`库中的`user`表用于存放用户信息，其中`host`字段表示用户可以进行登录的主机，默认情况下，`root`用户只可以从`localhost`进行登录。

1、使用root用户在本机登录后，创建一个可以任意主机进行登录的用户dinl，密码是`654321`

```mysql
mysql> create user 'dinl'@'%' identified by '654321';
```

2、赋予新用户所有库的查询权限

```mysql
mysql> grant select on *.* to 'dinl'@'%';
mysql> flush privileges;
```

3、删除用户

```mysql
mysql> drop user 'dinl'@'%';
```

