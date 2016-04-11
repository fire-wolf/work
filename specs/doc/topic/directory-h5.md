开发环境（H5） - 目录说明
============

Author: 谢璇

## 涉及项目
- **m-topic**（<a href="http://git.bubugao.com/fe-topic/m-topic">http://git.bubugao.com/fe-topic/m-topic </a>）
<br />
专题 H5 端（包括了 H5 + APP）相关资源。

## m-topic
根目录下，我们需要关注的，主要是 4 个：
<br />
（如果，文件目录不在下述清单的，很可能就是旧的依赖，放着不影响，但不能随便删）

1. **include**
<br />
只提供给本地开发环境用，用于一些占位符：
    + **common**
    <br />
    公共头尾
    + **demo**
    <br />
    BMMS 里面的一些挂件替换（比如，商品挂件）
    + **template**
    <br />
    当创建新模板时，用来复制用（即，模板的模板）

2. **js**
<br />
顾名思义，放 JavaScript 的
    + **module**
    <br />
    组件
    + **template**
    <br />
    模板的模板的 JS
    + **app.js**
    <br />
    RequireJS 配置文件

3. **page**
<br />
线上专题资源，组件示例资源
<br />
（注：只有这里的 sass 在打包的时候，会被编译出 CSS 文件，供线上页面引用）
    + **2015**
    <br />
    日期目录格式，放线上专题依赖资源（CSS、JavaScript），对应本地开发页面（HTML）
    + **base**
    <br />
    模板的模板依赖资源（CSS）
    + **demo**
    <br />
    模板的模板（test-example），及各插件的使用示例
    （开发环境可以页面打开）

4. **sass**
<br />
（注：这里的 sass 在打包的时候，不会被编译出 CSS 文件，只供 page 目录下的 sass 文件依赖用）
    + **module**
    <br />
    组件的 sass 资源
    + **template**
    <br />
    模板的模板依赖的 sass 资源
