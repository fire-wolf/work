前端开发流程与规范
==================

## 开发流程的目标

* 可以快速完成页面。
* 通过组件化的方式，保证代码重用，避免重复劳动。
* 保证页面上线后能够高效运行。
  
## 开发流程的范畴

* 文件的存放规范。
* 代码的组织结构和编码规范。
* 前后端联调约定，接口规范。
* 发布策略。
* 支持整个流程所必须的开发工具。

## 模块化开发模式

**公用库整理, 完善的组件体系**

js-framework, ui, sass-module, html

**js 模块粒度控制**

通过 git 子库的形式导入前端公用库

**HTML, CSS, JS 模块化**

页面模块划分, 分析页面功能和样式，挑选出页面中共用的部分，以便在后续开发中可以进行全局开发共用的 CSS 样式和 JS 模块

html 模块通过 SSI 导入生成, 保证 html 结构清晰易维护

## 前端资源发布

* 通过 git 分支管理发布版本  
* 前端发布系统的支持, (test, stage, online 环境) 自动化布署
* 发布流程: 开发环境 -> 仿真测试环境 -> online  
* 运维需要保证线上服务器高可用性
* 前端开发机/测试机服务器 ssh 赋权限（责任人）  

## 前端项目开发

### 开发流程

![开发流程](http://ww3.sinaimg.cn/bmiddle/6d5d6a55gw1elcuiy4rmij20vw0eewh4.jpg)

### 明确需求

项目启动会(评审会):

* 产品，设计，前后端等相关部门人员沟通会，确定部门对接人，建立邮件组，讨论组...
* 了解项目总体规划及关键时间点
* 前后端相关技术点初步评估完成

![需求](http://ww4.sinaimg.cn/bmiddle/6d5d6a55gw1elctje0d01j20su0codhg.jpg)

### UI/UE 交付

* UI Spec (尽可能详细)
* PNG/JPEG Mockup (视觉终稿) 及 psd 原图
* 评估前端开发工作量，定时，人员分配

### 页面模块 (Mockup-Module) 分解

![模块化分](http://ww2.sinaimg.cn/small/6d5d6a55gw1elcwl7ms0vj20go0c2abc.jpg)

**客户端视角**

* 视觉区块划分
* 定义最小单元
* 完整语义结构

完成页面模块分解（包括 html, css, js 模块的划分）

最小模块单元 html 结构如：

```html
<div class="mod-test">
    <div class="hd"></div>
    <div class="bd"></div>
    <div class="ft"></div>
</div>
```

### 团队成员协作开发

项目主导开发人员完成:

* 模块分配, 细化到最小单元模块级别
* 共用html结构，全局css样式，js变量定义
* 约定页面模块之间数据交互，广播事件管理
* 严格控制整站url, cookie, storage 等全局数据的使用

开发人员需要以模块为单位创建与其相关的 js, css, html 文件, 模块文件结构见 "文件目录结构" 中的 "`test/box`" 模块。

### 后端数据接口

1. 表单数据约定

  . Action URL  
  . Items' Name  
  . Submit Method(POST, GET, PUT, etc,.)  
   
2. 链接URL, 参数约定

3. 所有这些约定最终需要形成“数据接口文档”

  ![Alt text](http://ww4.sinaimg.cn/small/6d5d6a55gw1elcx39eazcj20c80g0t9d.jpg)

### 文件目录结构

```small-font
allex@allex-osx ../bbg/static5/union:master> tree -L 1
.
├── build.json
├── config.rb
├── css
├── fonts
├── html
│   ├── include/test/box.html
│   └── test.html
├── images
├── js
│   ├── app.js
│   ├── conf
│   │   └── test.js
│   ├── lib
│   └── module/test/box.js
└── sass
    ├── _inc.scss
    └── module
        ├── test/_box.scss
        └── test.scss
```

编码规范见 <http://fe.bubugao-inc.com/specs/project-specs.md>

## 前后端联调

1. 前端提交 HTML 页面给后端(SDE)套页面.
2. 发布静态资源到特定的前端公共开发环境.
3. 后端提供测试机地址，并提供 ssh 权限方便前端人员实时修改页面结构.

## 提交测试 & Bugfix

* 发布静态资源到仿真测试机环境
* 视觉确认 + 产品设计参与测试, 确认之后提交 QA 第一轮测试
* bugfix + 后期优化

## Codereview

项目测试完成后，负责人依照开发规范完成 codereview.

## 其他:

[前端开发的流程与规范.导图](http://ww2.sinaimg.cn/bmiddle/6d5d6a55gw1eld0v10w70j20h00dd3zu.jpg)
