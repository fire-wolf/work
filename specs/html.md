# HTML代码规范

## 语言规范

  1. doctype 声明使用 html5。

    ```html
    <!doctype html>
    ```

  2. 统一页面编码格式为 utf-8 , meta 标签 charset 设置为 utf-8;

    ```html
    <meta charset="utf-8" />
    ```

  3. 标签、标签属性全部小写。

    **(√)**

    ```html
    <a href="/" data-attr="attr">Home</a>
    ```

    **(╳)**

    ```html
    <A HREF="/" attr="attr">Home</A>
    ```

  4. 所有html标签必须有结束符，<img />, <col />, <base />, <link />, <meta />, <input /> 除外。

  5. 标签自定义属性使用 data-name="value" 的形式来写, 如果自定义属性特别多, 可以考虑使用标准 json 的方式去写: data-json='{"a":"a", "b":"b"}'。

    **(√)**

    ```html
    data-json='"a":1, "b":true, "c":[1, 2]' 
    ```

    **(╳)**

    ```html
    data-json="a:1, b:true, c:[1, 2]" // 对于这样的写法, 在解析的时候很难搞清楚 value 值的类型（例如：boolean、数组、对象）
    ```

  6. 对于 JS 钩子, 以 jCamelCase 的驼峰形式来命名。

  7. 对于普通 class 或者 id 命名（此处id仅做样式，不做js钩子）, 统一使用小写字母, 第一个字符必须为字母, 连接符用中划线 '-'。

    **(√)**

    ```html
    class="sns-box"   
    class="box"
    ```

    **(╳)**

    ```html
    class="Sns-box"  
    class="snsBox"  
    class="Box"
    ```

  8. css 引用置于头部<head> 标签内。

  9. js 引用置于底部 </body> 标签前。

## 标签使用

  1. <base> 标签必须放在 <head> 内 (注: 否则在某些浏览器下可能会失效)。

  2. <strong> 标签用于强调重要性, <em> 标签用于表示内容的着重点。[[参考]](http://www.css88.com/archives/644)

  3. 当 link 元素用于引用CSS文档时, 默认 media 是 screen, 如为特殊终端提供样式, 请指定 media 属性, 如 media=“print”;

  4. img标签必须加alt，尤其是商品图片。

## 注释规范

  1. 主要的 html 模块需加注释

  2. 修改别人代码时, 加入修改信息。至少加入修改者大名和修改时间。

    ```html
    <!--@author djune--><!--@last-modified 2013-09-26 13:21-->
    ```

## 其他注意

  1. 页面不内嵌style、script代码，如特殊情况请标明并注释。

  2. 缩进以4个空格为基本单位，为每个块级元素或表格元素标签新起一行，并且对每个子元素进行缩进。[[参考]](http://www.cnblogs.com/kungfupanda/archive/2012/09/05/2671597.html)

## 参考文档

