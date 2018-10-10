---
layout: post
title: "Padavan路由器设置frp内网穿透实现外网访问路由器管理页面+外网远程访问内网下的Windows桌面"
date: 2018-10-08 
description: "frp，内网穿透，教程，Padavan，路由器，老毛子"
tag: 教程
---
前段时间把小米路由器青春版刷了padavan固件，主要用来挂ss，其实这个系统很强大。但是原来可以用小米路由器APP远程管理，刷机之后就不行了，于是捣鼓了一下frp，成功实现外网访问路由器管理界面，另外实现了windows桌面的远程访问。
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
#如果输出×86_64那么就说明架构是arm64，即需要下载带linux_amd64的那个压缩包,目前最新的版本是v0.21.0

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

#frp服务端密码（建议必须）
token = 12345678

#frp穿透访问内网中的http网站需要的端口（建议必须）
vhost_http_port = 10080

#frp穿透访问内网中的https网站需要的端口（建议必须）
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

假设此项设置为 :example.com，后面的客户端配置(padavan路由器配置） web时将 subdomain设置为 r，然后你将r.example.com解析到服务端后，可以使用r.example.com:10080来访问路由器管理页面。
#### **4、让服务端持续运行**
输入下面命令运行服务端

```sh
./frps -c frps.ini
```

如果没有报错，那服务端运行正常。

但是现在还不行，现在frps只是在前台运行，一旦关闭putty，frps就会关闭。

由于VPS一般是不关机的，所以只需要让frps持续在后台运行就行了，输入下面这条命令即可让frps后台运行。

```sh
nohup /root/frp/frps -c /root/frp/frps.ini &
```

### 3、配置padavan路由器客户端（frpc.ini）
#### **1、实现外网访问路由器管理页面**
![](/images/posts/2018-10-08-frp&padavan_tutorial/5.png)
padavan的WiFi下打开192.168.123.1

扩展功能-花生壳内网版-frp-启用frp内网穿透和frpc客户端

然后点frp_script配置，这个里面已经预先写好了脚本，只需要我们修改#客户端配置下的[common]和[web]

我的配置如下：

```
#!/bin/sh
export PATH='/etc/storage/bin:/tmp/script:/etc/storage/script:/opt/usr/sbin:/opt/usr/bin:/opt/sbin:/opt/bin:/usr/local/sbin:/usr/sbin:/usr/bin:/sbin:/bin'
export LD_LIBRARY_PATH=/lib:/opt/lib
killall frpc frps
mkdir -p /tmp/frp

#启动frp功能后会运行以下脚本
#使用方法请查看论坛教程地址: http://www.right.com.cn/forum/thread-191839-1-1.html
#frp项目地址教程: https://github.com/fatedier/frp/blob/master/README_zh.md
#请自行修改 auth_token 用于对客户端连接进行身份验证
# IP查询： http://119.29.29.29/d?dn=github.com

#客户端配置：
cat > "/tmp/frp/myfrpc.ini" <<-\EOF
[common]
server_addr = 你的VPS的公网IP
server_port = 上面服务端frps.ini的bind_port
token = 上面服务端frps.ini的token

[web]
type = http
local_ip = 127.0.0.1
local_port = 80
use_encryption = true
use_compression = true

#路由器管理页面用户名和密码，自行设置，此处
#设置的与路由器本身的登录名和密码不同
http_user = admin（路由器管理页面的用户名）
http_pwd = 941009941（路由器管理页面的密码）

remote_port = 6000
subdomain = r
#假设此项设置为 :r，前面的服务端配置frps.ini时
#将subdomain_host设置为example.com，然后你将
#r.example.com解析到服务端后，可以使用r.example.com:10080
#来访问路由器管理页面。
EOF

#启动：
frpc_enable=`nvram get frpc_enable`
frpc_enable=${frpc_enable:-"0"}
frps_enable=`nvram get frps_enable`
frps_enable=${frps_enable:-"0"}
if [ "$frpc_enable" = "1" ] ; then
    frpc -c /tmp/frp/myfrpc.ini &
fi
if [ "$frps_enable" = "1" ] ; then
    frps -c /tmp/frp/myfrps.ini &
fi
```

[common]和[web]根据我的描述填写，其他的不用修改。
![](/images/posts/2018-10-08-frp&padavan_tutorial/7.png)
这是我的padavan的运行日志，[web] start proxy success就说明内网穿透成功啦~
外网情况下浏览器输入 *你的公网ip:10080* 或 *r.example.com:10080*即可访问路由器管理页面啦~
这是我外网访问成功的界面
![](/images/posts/2018-10-08-frp&padavan_tutorial/6.png)
如果不行，检查你的防火墙设置和端口占用情况，分析服务端和客户端的运行日志。
#### **2、实现外网远程访问内网下的Windows桌面**
先说一下我在这上门踩的坑，Windows 家庭版中的远程桌面被微软阉割了，所以如果被访问的主机装的这个版本是不能被远程控制的，但是道高一尺魔高一丈，[**解决方案在这**](https://www.jianshu.com/p/bf3001099cc4)。

```
[rdpqiang]
type = tcp
local_ip = 被控制主机的本地ip，例如（192.168.123.215）
local_port = Windows3389
remote_port = 5200
subdomain = r
```












更多请访问 [**frp中文文档**](https://github.com/fatedier/frp/blob/master/README_zh.md)



