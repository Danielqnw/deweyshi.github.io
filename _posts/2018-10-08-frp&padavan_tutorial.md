---
layout: post
title: "Padavan路由器设置frp内网穿透"
date: 2018-10-08 
description: "frp，内网穿透，教程，Padavan，路由器，老毛子"
tag: 教程
---

　　前段时间把小米路由器青春版刷成了padavan的系统，主要用来挂ss，其实这个系统很强大。但是原来可以用小米路由器APP远程管理，刷机之后就不行了，于是捣鼓了一下frp，成功实现外网访问路由器管理界面，另外实现了windows桌面的远程访问。

### 1、需要准备的东西

- Linux VPS，推荐购买[Vultr](https://www.vultr.com/?ref=7435080)的，按小时计费（我的是腾讯云学生机，Linux系统环境是Ubuntu Server 16.04.1 LTS 64位）

- 刷了Padavan固件的路由器（我的是小米路由器青春版R1CL,padavan固件最新版）

### 2、配置服务端(frps.ini)

- **下面所有操作在服务器上完成**
- **用putty连接服务器**
- **root用户下操作**

![](/images/posts/2018-10-08-frp&padavan_tutorial/1.png)

#####1.输入命令查看自己VPS的架构

```sh
arch
```

##### 2.下载对应版本的压缩包解压安装

如果输出 ×86_64 那么就说明架构是 arm64 ，即需要下载带linux_amd64的那个压缩包；
如果输出的是其他的，就需要[**在这里**](https://github.com/fatedier/frp/releases)找 linux 的对应架构的压缩包

```sh
#下载最新的版本v0.21.0
wget https://github.com/fatedier/frp/releases/download/v0.21.0/frp_0.21.0_linux_amd64.tar.gz
解压压缩包
```

3. 在ubuntu上登录，依次输入如下命令

```python
第三方
import os
```



