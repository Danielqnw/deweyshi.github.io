---
layout: post
title: "Padavan路由器设置frp内网穿透"
date: 2018-10-08 
description: "frp，内网穿透，教程，Padavan，路由器，老毛子"
tag: 教程
---

前段时间把小米路由器青春版刷成了padavan的系统，主要用来挂ss，其实这个系统很强大。但是原来可以用小米路由器APP远程管理，刷机之后就不行了，于是捣鼓了一下frp，成功实现外网访问路由器管理界面，另外实现了windows桌面的远程访问。

### 1、需要准备的东西

#Linux VPS，推荐购买Vultr的，按小时计费，[**传送门**](https://www.vultr.com/?ref=7435080)（我的Linux系统环境是腾讯云学生机Ubuntu Server 16.04.1 LTS 64位）

##刷了Padavan固件的路由器（我的是小米路由器青春版R1CL,padavan固件最新版）
