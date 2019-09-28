Ubuntu 18.04 LTS + MySQL 8



#### Mysql基础知识

* 在[下载页](https://www.mysql.com/downloads/)可以看到：

  **MySQL的存储引擎**包括InnoDB和MyISAM两种，其中InnoDB支持事物而后者不支持，前者支持行级锁而后者不支持，因此InnoDB比后者更有优势（不仅限于上面两条），MySQL的默认引擎已经从MyISAM变更为InnoDB。

  **MySQL的连接器**包括JDBC和ODBC（“O”代表“Open”），其中前者使用Java而后者基于C/C++，前者跨平台而后者仅支持Windows，前者有更高的性能，因此在Java环境下强烈建议使用JDBC。

* 关于版本选择：

  MySQL Community Edition是社区版本，是免费的，也是我们日常使用的。

#### 使用APT仓库安装

[教程](https://dev.mysql.com/doc/mysql-apt-repo-quick-guide/en/)

1、进入[下载页面](https://dev.mysql.com/downloads/mysql/)选择OS为Ubuntu Linux，Version为18.04(x86,64-bit)，点击下方的图片连接跳转到deb下载页面，点击download跳转到新页面，忽略提示信息，直接点击下方的“no thanks, just start my download”。

2、下载的文件为`mysql-apt-config_0.8.13-1_all.deb`，安装软件包

```shell
$sudo dpkg -i mysql-apt-config_0.8.13-1_all.deb
```

跳出弹窗，显示默认安装的mysql版本和组件，如果版本是Mysql 8就不需要修改，点击OK。

3、更新apt仓库并安装Mysql Server

```shell
$sudo apt-get update
$sudo apt-get install mysql-server
```

中途会提示设置root密码，输入两次即可（安装5.7版本不会有这个提示，导致后面登陆出现问题）

另外一个弹窗提示选择权限认证插件版本，默认第一项为更新后的版本，选择第二项legacy版本，点击OK。

4、查看服务状态，登录

```shell
$sudo service mysql status
```

```shell
$sudo mysql -u root -p
```

之后输入密码会登陆成功。这里要注意因为安装的时候使用的sudo命令，登录时也要在前面加上sudo命令才可以，否则提示无法访问。





