---
layout: post
title: "Padavan路由器设置frp内网穿透实现外网访问路由器管理页面+外网远程访问内网下的Windows桌面"
date: 2018-10-08 
description: "frp，内网穿透，教程，Padavan，路由器，老毛子"
tag: 教程
---

　　前段时间把小米路由器青春版刷成了padavan的系统，主要用来挂ss，其实这个系统很强大。但是原来可以用小米路由器APP远程管理，刷机之后就不行了，于是捣鼓了一下frp，成功实现外网访问路由器管理界面，另外实现了windows桌面的远程访问。

### 1、需要准备的东西

- Linux VPS，推荐购买[**Vultr**](https://www.vultr.com/?ref=7435080)的，按小时计费（我的是腾讯云学生机，Linux系统环境是Ubuntu Server 16.04.1 LTS 64位）

- 刷了Padavan固件的路由器（我的是小米路由器青春版R1CL,padavan固件最新版）

### 2、配置服务端(frps.ini)

- **下面所有操作在服务器上完成**
- **用putty连接服务器**
- **root用户下操作**

![](/images/posts/2018-10-08-frp&padavan_tutorial/1.png)

#### **1、输入命令查看自己VPS的架构**

```sh
arch
```

#### **2、下载对应版本的压缩包解压**

```sh
#如果输出 ×86_64 那么就说明架构是 arm64，即需要下载带linux_amd64的那个压缩包,目前最新的版本是v0.21.0
wget https://github.com/fatedier/frp/releases/download/v0.21.0/frp_0.21.0_linux_amd64.tar.gz
```

如果输出的是其他的，就需要[**在这里**](https://github.com/fatedier/frp/releases)找 linux 的对应架构的压缩包

```sh
#解压压缩包
tar -xzvf frp_0.21.0_linux_amd64.tar.gz
#将解压出来的文件夹名改成frp，方便后面操作
mv frp_0.18.0_linux_amd64 frp
#打开文件夹frp
cd frp
```

#### **3、修改配置文件frps.ini**

![](/images/posts/2018-10-08-frp&padavan_tutorial/2.png)

```sh
#用vim修改frps.ini
vim frps.ini
```

![](/images/posts/2018-10-08-frp&padavan_tutorial/3.png)

在frps.ini文件中写入如下内容
example.com替换成自己的域名
```vim
#（必须）
[common]
#frp服务端端口（必须）
bind_port = 7000
#frp服务端密码（必须）
token = 12345678
#frp穿透访问内网中的http网站需要的端口
vhost_http_port = 10080
#frp穿透访问内网中的https网站需要的端口
vhost_https_port = 10443
```

下面的可选填写

```vim
#可视化仪表盘端口（非必须）
dashboard_port = 7500
#访问可视化仪表盘的用户名密码，可自行修改（非必须）
dashboard_user = admin
dashboard_pwd = admin
```

![](/images/posts/2018-10-08-frp&padavan_tutorial/4.png)
↑仪表盘如上，访问 *你的VPS的公网ip*:*端口号* ，如45.63.1.211:7500

```sh
#设置自己的域名（非必须）
subdomain_host = example.com
```

假设此项设置为 :example.com，后面的客户端配置(padavan路由器配置） web时将 subdomain设置为 r，然后你将r.example.com解析到服务端后，可以使用r.example.com:10080来访问客户端对应



