#### 安装Ubuntu 18.04.2 LTS

1、下载系统镜像IOS

<https://ubuntu.com/download/desktop>

2、（Windows下）使用Rufus制作启动盘

官方教程<https://tutorials.ubuntu.com/tutorial/tutorial-create-a-usb-stick-on-windows?_ga=2.146803703.1584177293.1560691945-887382654.1560255339#0>

3、（朴赛组装机）从U盘启动安装

官方教程<https://tutorials.ubuntu.com/tutorial/tutorial-install-ubuntu-desktop#0>

3.1 按DELETE进入BIOS，第一启动项设置为UEFI USB Key : UEFI : USB Name

3.2 安装列表第一项为试用（Try Ubuntu without Installing），第二项才是真正安装

3.2.1 安装设置的第四个页签，其他选项“为图形或无线设备，以及其他媒体格式安装第三方软件”，本以为勾选以后就会自动安装Nvidia的专用驱动了，事实上，并没有，所以，勾不勾选随意

3.3 安装设置的第五个页签，选择其他可以重新磁盘分区：

3.3.1 第一个分区  主分区  EFI格式  一个G够了

3.3.2 第二个分区  逻辑分区  EXT4格式  挂载点 /  放系统文件  50G

3.3.3 第三个分区  交换分区  内存大小一到两倍

3.3.4 第四个分区  逻辑分区  EXT4格式  挂载点 /home  剩余全部大小

3.4 安装完成后，重启，提示Reboot and select proper Boot device。进入BIOS，第一启动项恢复为UEFI Hard Disk:UEFI OS (P0: Samsung SSD 860 EVO 250GB)。括号里是磁盘

4、结语：建议按照官方教程操作（非官方文档会浪费很多时间和精力）



#### 安装Nvidia显卡驱动

在默认情况下，系统使用的显卡驱动为Nouveau，为了尽可能发挥N卡的功效，改用Nvidia专用驱动

1、查看Nvidia显卡信息：

$`lspci | grep -i nvidia`

2、查看N卡驱动，此时未装N卡驱动，会提示not found：

$`nvidia-smi -a`

3、打开应用程序里的软件和更新（不是软件更新器），附加驱动，显示GTX 1080 Ti有两个驱动可用，默认第二个通用驱动，改为第一个Nvidia专用驱动。安装完成后需要重启计算机，之后可以用上一步命令验证一下。

4、结语：更新驱动要放在OpenGL环境安装之前，等OpenGL环境配置好之后再回来改驱动，会出现apt管理器无法自动解决的包依赖问题。（我已经付出了重装系统的代价）



#### 无法忽视的两个问题

问题一：启动之后的提示错误信息

Trying location provider `geoclue2’

Using provider `geoclue2’.

Unable to start GeoClue client:

GDBus.Error:org.freedesktop.DBus.Error.AccessDenied: Geolocation disabled for UID 1000.

Unable to connect to GeoClue.

Unable to get location from provider.

解决：设置〉隐私〉打开定位服务

问题二：屏幕亮度无法调节

根据教程<https://blog.csdn.net/lingyunxianhe/article/details/81116157>进行设置

1、brightness-controller是一个GitHub上的开源软件，添加源并安装

$`sudo add-apt-repository ppa:apandada1/brightness-controller `

$`sudo apt install brightness-controller-simple`

tip：很多教程里习惯用apt-get命令，是为了兼容以前的操作系统，Ubuntu18下用apt就可以。

2、如果出现apt无法获得锁问题

2.1 查看apt进程锁：

$`ps aux | grep apt`

2.2 杀掉进程：

$`kill -9 pid`

3、如果出现无法下载包问题，添加—fix-missing

$`sudo apt —fix-missing install brightness-controller-simple`

4、安装完成上面两个东西后，启动brightness-controller：

$`brightness-controller-simple`

跳出调节菜单



#### NeHe教程源码下载

NeHe的OpenGL教程很出名，而且有源码，无需修改或做少量改动就可以编译使用，我fork了一份，这份仓库里有多种语言的实现，/linux文件夹下是cpp版的<https://github.com/dingl-designer/nehe-opengl/tree/master/linux>

1、安装git，官方教程<https://git-scm.com/book/en/v2/Getting-Started-Installing-Git>

$`sudo apt install git-all`

2、验证一下

$`git —version`

现在安装的是2.17.1

3、下载教程源码到project/nehe目录下

$`mkdir -p project/nehe`

$`cd project/nehe/`

$`git clone https://github.com/dingl-designer/nehe-opengl.git`



#### C/C++版OPENGL环境配置

按照Linux公社教程操作：<https://www.linuxidc.com/Linux/2017-03/141555.htm>

1、安装编译器和基本的函数库

$`sudo apt install build-essential`

2、安装OpenGL Library

$`sudo apt install libgl1-mesa-dev`

3、安装OpenGL Utilities，OpenGL Utilities 是一组建构于 OpenGL Library 之上的工具组，提供许多很方便的函数，使 OpenGL 更强大且更容易使用。

$`sudo apt install libglu1-mesa-dev`

4、安装OpenGL Utility Toolkit，OpenGL Utility Toolkit 是建立在 OpenGL Utilities 上面的工具箱，除了强化了 OpenGL Utilities 的不足之外，也增加了 OpenGL 对于视窗介面支援。

$ `sudo apt install freeglut3-dev`

5、到此为止，网站给出的测试用例事可以跑的。但是在make lesson1时，提示找不到lXi和lXmu，得知是缺少依赖包，安装一下

$ `sudo apt install libxi-dev libxmu-dev`

6、重新编译lesson1

$`cd nehe-opengl/linux/lesson1/`

$`make`

7、执行编译结果

$`./lesson1`