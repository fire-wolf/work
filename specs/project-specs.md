前端项目规范
============

> 这里面所有的开发规范及流程都是必须了解的，请大家仔细阅读（包括相关链接）

## f2e项目流程

开发流程(重要): <http://fe.bubugao-inc.com/specs/f2e-dev-specs.md>

## 代码管理 (Source Conventions)

1. 前端所有代码通过 git 管理，合理划分项目 git 库。

1. git 分支管理:

    分支开发，dev 分支测试， master 上线

    ```
          A---B---C dev-topic
         /         \
    D---E---F---G---H master
    ```

1. 代码合并，通过 git WebUI 创建 `Merge Request` 协同合并。

1. 代码回滚 git revert <COMMIT>, 杜绝用本地文件系统还原代码提交。

1. You should sync your local repository with our master branch as new as possible, try
  to make the commits' parent be new.

  Please use `git pull --rebase` instead of git pull, use `git rebase upstream/master`
  instead of `git merge upstream/master`, so that we can avoid of meaningless merging.

1. Only do one meaningful thing in one commits, don't mix different things into the same
  commit, like add two libs in a commit.

1. Every commits should be meaningful, don't cut one thing into multiple commits, like
  add a lib in 3 commits.

1. Inspect your work by `git diff` & `git status` before commit your change.

1. Inspect your commit by `git log --stat` & `git log -p` before sending a pull request.

## JS代码规范

### 目录结构

```small-font
.
├── app.js
├── lib <<-- [FE libs, business-less]
│   ├── backbone
│   ├── dialog
│   ├── jquery
│   ├── plugins
│   ├── require.js
│   ├── ui
│   └── underscore
├── common <<--[project common module (business-less)]
│   ├── base
│   │   ├── config.js
│   │   ├── core.js
│   │   └── template.js
│   ├── kit
│   │   ├── dom
│   │   ├── extra
│   │   └── io
│   ├── ui
│   │   └── box.js
│   └── widget
│       └── plugins
├── conf <<--[Page entry module]
│   ├── home
│   ├── feed
│   └── ...
└── module <<--[business module]
    ├── navigation
    ├── topbar
    ├── photo-slider
    └── ...
```

### 编码(coding)

参考: <http://fe.bubugao-inc.com/specs/js.md>

补充:

  1. 代码使用 `use strict;` 模式, 前期对自己要求严格多一点，后期bug少一些.
  2. 缩进用空格 ' ' 替换tab符 '\t' (一个tab设置为4个空格), 以保证我们的代码在所以平台显示正常.
  3. 代码格式化不要去依赖三方工具来完成, 除非接口数据的格式化.
  4. 代码 commit 之前，请保证代码整洁.（不要有 debug 语句，不要有注释掉的代码片段）

### 模块代码整体格式: AMD 模块化管理

模块代码 (一个模块一个文件，禁止一个文件多个模块的写法)

```js
define([ id, [deps, ] ] factroy);
```

### 模块依赖 (commonjs require syntax)

```js
define(function(require, exports, module) {
  'use strict';

  var fs = require('fs');
  var hash = require('clib/lang/hash');

  ...

  exports.foo = 1;
});
```

模块的依赖用相对路径导入，尽可能缩小模块之间的依赖范围，禁止引用非当前模块所需要的模块(只需要导入当前用到的模块路径)，

### 模块定义 (module definations)

公用模块尽量不要捆绑到三方模块上面，直接 `module.exports` 导出 (不要捆绑在jQuery对象).

多实例通用模块封装成实例对象(Constructor构造模块), 单例模块和实例对象要酌情设计

```js
// static module
var Module = function() {
    function setFoo() {
    }
    return {
        setFoo: setFoo 
        ...
    };
}());

// constructor class
var ModuleCart = function(opts) {
    ...
};
ModuleCart.property.setFoo = function() { ...  };
ModuleCart.property.destroy = function() { ... };
```

公用模块配置参数以 k/v 对象传值，形参方式仅适合于简单的接口参数。

```js
var pager = new Page(container, pageSize, total, ...);
var pager = new Page(container, {
    pageSize: 10,
    total: 1000,
    ...
});
```

## CSS/HTML 规范

### 编码(coding)

具体参考: [css.md](http://fe.bubugao-inc.com/specs/css.md), [html.md](http://fe.bubugao-inc.com/specs/html.md)

### 模块化

- [html & css 原子模块](http://fe.bubugao-inc.com/specs/css.md#css-module) **(重要)**

- class 和 id 的使用方法, 不要随意使用Id

- id 在 JS 是唯一的，不能多次使用，而使用class类选择器却可以重复使用，另外id的优
先级优先与class，所以id应该按需使用，而不能滥用。

- 模块标识尽量用class约束，业务性模块可以用id

- 模块内部禁止使用id

- 推荐使用模块最小单元 class 命名规范 `#mod-foo { .hd, .bd, .ft }`

### 样式 class 命名

以下 class 名字定义的时候**必须有父级样式限制**，防止定义为全局样式:

```txt
.hd .bd .ft
.cnt .title .name .type
.items .item .list .nav 
.text .txt .desc .info .img .table 
.current .active .on .off .hover
```

如:

```css
#mod-test .hd { color: #ddd; }
```

推荐使用 class 命名:

```txt
.head .body .content .foot .menu .section .list .result .author
```

注意避免常见广告插件黑名单 class 命名:

```txt
.ad-*, .ad, .advertisement, .advert
```

预编译工具选择, sass, less, style etc,.

sass libs: [compass](http://compass-style.org/), [bourbon](http://bourbon.io/)


### html 模块与 js 整合

对于比较独立的 DOM 节点，基于 jCamelCase 的驼峰形式来命名 class (仅用于 js 选取元素，不带样式) 获取节点

```html
<button class="btn jSearchButton>Submit</button>
```

```js
$('.jSearchButton').click(function() {
    ...
});
```

组件化的 js 整合 (node-type) 获取节点 map 表用法:

```html
<div id="mod-test" class="photo-sliders">
    <div class="hd"></div>
    <div class="bd" node-type="desktop">
        <div node-type="display"></div>
        <div node-type="carousel">
            <ul node-type="list"> ... </ul>
        </div>
    </div>
</div>
```

```js
var build = require('common/kit/dom/build');

function initModule() {
    var moduleEl = $('#mod-test');

    // Get node map based on `[node-type]`
    var nodeList = build.parseNodes(moduleEl);

    var desktopEl = nodeList.desktop,
        carouselEl = nodeList.carousel,
        listEl = nodeList.list;
    ...
}
```

### 数据交互接口规范

<http://fe.bubugao-inc.com/specs/json-api.md>
