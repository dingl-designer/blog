### PNG存储规则

* <https://en.wikipedia.org/wiki/Portable_Network_Graphics>

### PNG示例

<img src="./pic/mm/png.png" alt="BMP示例" width="70%">

#### File Header

​	**1**> 0~7字节，类型签名，0x504e47（PNG）；

#### IHDR Chunk

​	**2**> 8~11字节，chunk data length，chunk data (4)、(5)、(6) 的总长度，示例为0x0000000d（13字节）；

​	**3**> 12~15字节，chunk name，示例为0x49484452（IHDR，critical chunk）；

​	**4**> 16~19字节，image's width，示例为0x000002ee（750像素）；

​	**5**> 20~23字节，image's height，示例为0x00000291（657像素）；

​	**6**> 24~28字节，bit depth、color type、compression method、filter method、interlace method；

​	**7**> 29~32字节，(3)、(4)、(5)、(6)的CRC校验值；

#### bKGD Chunk

​	**8**> 33~36字节，chunk data length，示例为0x00000006（6字节）；

​	**9**> 37~40字节，chunk name，示例为0x624b4744（bKGD，ancillary chunk）；

​	**10**> 41~46字节，chunk data，gives the default background color，示例为0x00ff00ff00ff（白色）；

​	**11**> 47~50字节，(9)、(10)的CRC校验值；

#### pHYs Chunk

​	**12**> 50~53字节，chunk data length，示例为0x00000009（9字节）；

​	**13**> 54~57字节，chunk name，示例为0x70485973（pHYs，ancillary chunk）；

​	**14**> 58~67字节，chunk data；

​	**15**> 68~71字节，(13)、(14)的CRC校验值；

#### IDAT Chunk

​	**16**> 72~75字节，chunk data length，示例为0x00002000（8192字节）；

​	**17**> 76~79字节，chunk name，示例为0x70485973（IDAT，critical chunk）；

​	**18**> 80~8271字节，chunk data；

……

