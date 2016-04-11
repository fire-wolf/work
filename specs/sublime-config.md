sublimeText 用户级配置文档
==========================

## 安装步骤

解压 [sublime-config.rar](./assets/files/sublime-config.rar) 到安装目录如: `D:\licuiting\常用软件\Sublime Text3\Data\Packages\User\`

### 编辑器启用空格缩进 (replace tab with 4 spaces)

`$ vi Preferences.sublime-settings`

```json
{
    // 4 spaces
    "tab_size": 4,
    // Set to true to insert spaces when tab is pressed
    "translate_tabs_to_spaces": true
}
```

## 使用说明

### 新建文件快捷键

  1. html文件 ctrl+alt+h

    ```html
    <!doctype html>
    <html>
    <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>Examples</title>
    <meta name="description" content="">
    <meta name="keywords" content="">
    <link href="" rel="stylesheet">
    </head>
    <body>

    </body></html>
    ```

  2. js文件 ctrl+alt+j

    ```js
    /**
     * @description 
     * @author 250602615@qq.com
     * @date 2014-10-13 15:55:40
     * @version $Id$
     */
    define(function(require, exports, module) {
        'use strict';
    });
    ```

  3. css文件 ctrl+alt+c

    ```css
    /**
     * @description  
     * @author 250602615@qq.com
     */
    @charset "UTF-8";
    ```

  4. scss文件 ctrl+alt+s

    ```css
    /**
     * @description  
     * @author 250602615@qq.com
     * @date 2014-10-13 15:57:30
     */
    @charset "UTF-8";
    ```

### 生成片段快捷键

  1. cmd-info html: 修改html后的注释  

    `<!--@author --><!--@last-modified -->`

  2. cmd-init: js模块初始化 

    ```js
    /**
     * @description  
     * @author licuiting
     * @emall 250602615@qq.com
     */
    define(function(require, exports, module) {
        'use strict';
    }); 
    ```

  3. cmd-class: 初始化一个构造函数

    ```js
    /**
     * @description
     * @param {String} description.
     * @param {Array} description.
     * @constructor
     * @extends {goog.Disposable}
     */
     MyClass = function(opt) {
        
     };
     MyClass.prototype = {
       defaultSetting: {},
       init:function(){}
     }
     return new MyClass(opt);
    ```

  4. cmd-fn-comments: 复杂函数注释

    ```js
    /**
     * Converts text to some completely different text.
     * @param {String} arg1 An argument that makes this more interesting.
     * @return {String} Some return value.
     */
    ```
