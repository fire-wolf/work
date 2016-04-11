# 前端面试考核

1. 给出代码片段结果: `var arr = [1, 2, 3].map(parseInt);`

1. 快速实现如下对象数组按 `level` 属性升序排序:

  ```js
  // sort by property `level`
  function sortArray(arr) {
      // TODO: implement
  }

  var dataArr = [
    {id: 1, name: 'a', level: 3},
    {id: 2, name: 'b', level: 2},
    {id: 3, name: 'c', level: 4},
    {id: 4, name: 'd', level: 1},
    {id: 5, name: 'e', level: 5},
  ];

  var sortedArray = sortArray(dataArr);
  ```

1. 请利用正则表达式判断手机号码

1. 请描述一下跨域请求的几种实现方式和原理

1. 模拟一个 `HashTable` 类，包含有 add, remove, contains, length 方法

1. 请描述一下 `cookies`，`sessionStorage` 和 `localStorage` 的区别?

1. CSS中元素的定位方式 (position) 以及各种方式的应用场景

1. 如何实现兼容IE的 `DOMContentLoad` 事件

1. 最后三行，问号处分别可以填哪些值让表达式成立

  ```js
  function Foo(name) {
      this.name = name;
  }

  function Bar(name, age) {
      Foo.apply(this, arguments);
      this.age = age;
      this.getName = function() {
          console.log(this.name)
      };
  };
  Bar.prototype = {
      getAge: function() {
          console.log(this.age);
      }
  };

  var obj = new Bar('bob', '22');

  obj instanceof ? === true;
  obj.constructor === ?;
  obj.hasOwnProperty( ? ) === true;
  ```

1. 请说明事件代理的好处以及实现思路

# 前端(应用)

1. 请实现一个简单的发布/订阅模式, 并说明该模式的优缺点

1. 综合代码考核

  请看下面的 HTML 结构, 请完成以下代码段中的 **`TODO`** 方法，并修复 **`FIXME`** 代码的实现，要求给所有的li
  绑定 click 事件，并将点击的 li 序号发送到后端接口。

  HTML:

  ```html
  <ul id="list">
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
  </ul>
  <div id="result"></div>
  ```

  JS Code:

  ```js
  /**
   * Add event handle listener to DOM element.
   *
   * @param {HTMLElement} el The target dom element to binding
   * @param {String} type The event type.
   * @param {Function} fn The event handle
   * @param {Object} scope (Optional) Set the runtime context object **this** for the callback.
   * @author Allex Wang
   * @void
   */
  function addEvent(/* HTMLElement */ el, /* String */ type, /* Function */ fn, /* Object */ scope) {
      // TODO: implement it

  }

  /**
   * Stop event propagation and bubbling behaviors.
   *
   * @param {EventObject} e The DOM event source object instance.
   * @void
   */
  function stopEvent(/* EventObject */ e) {
      // TODO: implement it

  }

  /**
   * Send data to backend by async request with specific method type.
   *
   * @param {String} url The backend api url to send.
   * @param {String} method The request method. i.e. [GET, POST]
   * @param {Object} data The data to send by ajax.
   * @param {Function} callback The ajax response handler with response text parameter.
   * @void
   */
  function sendRequest(url, method, data, callback) {
      // TODO: implement it

  }

  /**
   * Returns a new function that, when called, has its ‘this’ scope set to the
   * provided context.
   *
   * @param {Function} fn The original function to warp.
   * @param {Object} The context to be passed as the `this` parameter to the target function when the bound function is called.
   * @return {Function}
   */
  function bind(fn, context) {
      // TODO: implement it

  }

  var InnerModule = {
      url: '/getdata.do',

      // handle click request result.
      handleClickRequest: function(response) {
          console.log(response);
      },

      // Handle item click event
      handleItemClick: function(e, index, el) {
          el.className = 'clicked';
          sendRequest(this.url, 'post', {index: i}, bind(this.handleClickRequest, this));
          console.log('The clicked item index: ' + i); // print the item index
      }
  };

  // module entry
  function init() {
      var ul = document.getElementById('list');
      var items = ul.querySelectors('li');
      for (var i = 0, l = items.length, el; i++ < l; ) {
          el = item[i];

          // FIXME: This event binding not work as expected. Please bind click event for each‘li‘to
          // print item index value‘i’. Also please stop event propagation and bubbling behaviors.

          addEvent(el, 'click', function(e) {
              stopEvent(e); // stop propagation and bubbles
              this.handleItemClick(e, i, el);
          }, InnerModule);
      }
  }

  exports.init = init;
  ```
