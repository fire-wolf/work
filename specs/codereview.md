Code Review [代码走查]
======================

Version: 1.0


## Review 执行

1. 以业务线为单位派代表解读自己组内相关模块代码设计及实现(好的，不好的都可以讲), 参会人员可针对发表自己的看法。

2. Review 问题总结归档提交到 <http://git.bubugao.com/f2e/fe-sharing>


## 代码书写规范 (代码格式，缩进，变量定义等)

JSHint 自动化检测（仅供参考）


## 代码优化检测

1. 对象属性读写优化，内部变量的合理使用, 避免对象属性的多次读取 (2次以上的需要定义变量缓存)

    ```js
    // cache object property
    var next = this.data.current + 1, previous = this.data.current - 1;
    if (previous < 0) {
      previous = this.data.total - 1;
    }
    if (next > this.data.total - 1) {
      next = 0;
    }
    ```

    ```js
    var arr = [...]
    for (var i = 0; i < arr.length; ++i) { // for (var i = 0, l = arr.length; i < i; ++i)
      . . .
    }
    ```

2. 代码复用性检查，避免冗余代码段 (两次以上的重复代码段，需要考虑模块化封装)
   禁止跨模块的重复代码段，以提高后期易维护性。

    ```js
    var first = this.index > 0 ? this.index : 0;
    var last = this.index < this.size - 1 ? this.index : this.size - 1; 
    ```

3. 代码逻辑复杂度检查，if..else..else, 过多的分支处理需要考虑逻辑拆分或者表驱动法

    ```js
    // -------------------->>>
    var val = ?;
    if (val === 13) {
        . . .
    }
    else if (val === 56) {
        . . .
    }
    else if (val === 32) {
        . . .
    }
    // <<<-------

    var keys = {
        13: function() { },
        56: function() { },
        32: function() { }
    }
    if (keys[val]) {
        keys[val]();
    }
    ```

4. 模块结构合理性检查, 避免无用的的接口导出，模块化封装内紧外松原则

5. 变量, 函数访问权限控制 (internal, private, public)

    ```js
    (function() {

     // -------------------->>>
     var fadeObj = {
      internalVal: 1,
      addFoo: function(a, b) {
        return internalVal + a + b;
      }
     };
     // <<<-------

     var internalVal = 1;
     var addFoo = function(a, b) {
       return internalVal + a + b;
     };

     module.exports = {
      add: function(a, b) {
        // return fadeObj.addFoo(a, b);
        return addFoo(a, b)
      }
     }
    }());
    ```

6. 代码的扩展性，接口参数设计合理性检查等。

  ```js
  ```

>> 待续 . . .
