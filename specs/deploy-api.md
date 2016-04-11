Front-End Deploy API
====================

## 背景

> 项目的不断迭代发布上线，项目上线任务需要前后端分离部署发布, 这中间存在一个问
> 题就是 **需要前端静态资源发布的版本和后端(jsp,php)模板页所引用的静态资源url版本保持一致**

## 前端静态资源版本接口

**http://**fe.bubugao-inc.com/deploy/revinfo/**<${project_id}>**?[dist=dev|test|pro]

**参数说明**:

  * project_id - 项目名称，前后端唯一标识, 参考 `前端项目标识列表`
  * dist - (Optional) 发布环境标识, dev | test | pro. (默认不传值为线上环境pro)

**接口返回**:

  前端静态资源 (文件 Hash 值, CDN Url等) 相关属性

**用法**:

  后端可通过部署脚本完成项目中对前端资源引用路径的自动化替换操作

  如: $ curl <http://fe.bubugao-inc.com/deploy/revinfo/union>

  ```json
  {
      "union/css/fonts/union.css": {
          "hash": "5db052a0555f61baafda0e474d69d35255582db5",
          "url": "http://s1.bbgstatic.com/union/css/fonts/union.css?v=5db052a"
      },
      "union/css/module/dashboard.css": {
          "hash": "bdbf498d411c5f5b40c69dd52d0d516bb58bc030",
          "url": "http://s1.bbgstatic.com/union/css/module/dashboard.css?v=bdbf498"
      },
      "union/js/conf/dashboard.js": {
          "hash": "6ac2b473f7ee026d2f5c9d86a248676d6b066fad",
          "url": "http://s1.bbgstatic.com/union/js/conf/dashboard.js?v=6ac2b47"
      },
      ....
  }
  ```

## 前端项目标识列表

* lib - 前端基础库
* public - 平台化公用模块
* bc - 商家中心
* uc - 用户中心
* help - 帮助中心
* mall - 商城
* admin - 小二后台
* events - 专题
* union - 网盟
* openapi - 开放平台

