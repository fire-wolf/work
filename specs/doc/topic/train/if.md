JavaScript 约定（if 逻辑判断）
============

Author: 谢璇

## 逻辑判断
* **不推荐的方式**
    * 三元表达式
        <br />
        如：
            isBlank() ? console.log('isBlank') : console.log('isNotBlank')
        <br />
        又如：
            isBlank() && console.log('isBlank')
        <br />
        * 优点：
            * 只占一行，代码量少。
        * 缺点：
            * 不利于调试，当页面 Debugger 断点调试时，不直接。
            * 当需要在逻辑判断里面，增加代码时，不方便。
    * 逻辑提前结束
        <br />
        如：
            var isBlank = isBlank();
            if (isBlank) {
                console.log('isBlank');
                return;
            }
            console.log('isNotBlank');
        * 优点：
            * 局部代码，好维护。
        * 缺点：
            * 逻辑可读性下降。
            * 当增加功能代码时，逻辑不清晰。
* **推荐的方式**
    * if else
            var isBlank = isBlank();
            if (isBlank) {
                console.log('isBlank');
            } else {
                console.log('isNotBlank');
            }
        * 优点：
            * 当页面 Debugger 断点调试时，可以直接获取 isBlank() 方法返回。
            * 当需要在 isBlank == true 时，加代码时，对目前代码影响较小。
            * 当有 else if 情况需要加进来的时候，对目前代码影响较小。
        * 缺点：
            * 临时变量会增加。
            * 代码行数会增多。