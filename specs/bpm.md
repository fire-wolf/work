Bubugao Analytics Manager - bpm.js
==================================

## Install 安装

> 将下面代码放在 `</body>` 结束符之前

```html
<script>
(function(f,c,d,e,g,a,b){a=c.createElement(d);b=c.getElementsByTagName(d)[0];
a.async=1;a.src=e;b.parentNode.insertBefore(a,b)
})(window,document,"script","//"+(location.protocol=="http:"?"s1":"ssl")+".bbgstatic.com/tracer/bpm.js?v=1.0.3","bpm");
</script>
```

### 安装

1. HTML 页面自动打点:

    ```html
    <a href="http://baidu.com" data-bpm="2014.456322.10">Baidu</a>
    ```

2. 编程方式打点:

    ```js
    $('#btnSearch').click(function(e) {
      var bpmCode = '2014.sEd08.xxfd'; // BPM code
      var q = $('input[name="keyword"]').val(); // Get input value
      if (q) {
          BPM.uaTrack(bpmCode, q); // send track
      }
    });
    ```

## PV 打点 API

API: http://beacon.bubugao.com/a.gif

接口参数说明:

```
api?CI=${DATA}&PI=${DATA}&UI=${DATA}&EX={JSON}
```

PV数据类型:

  1. 公共(CI)
  1. 页面(PI)
  1. 用户(UI)
  1. 页面个性化数据(EX)

### CI 参数说明

1. ss - screen size,
1. ws - window size,
1. ac - browser app code
1. an - browser app name
1. pf - platform
1. lg - browser language
1. tz - client timezone
1. fv - flash version

> 示例: `ss:1280x800|ws:1280x150|ac:Mozilla|an:Netscape|pf:MacIntel|lg:en-US|tz:-8|fv:15`

### PI 参数说明

1. url - current page url
1. pid - page identify, retrive from <meta name="pageid" content="x.x.x" />
1. ref - referrer url
1. nld - page load time (make sure page global config `$PAGE_DATA['startTime']` exits)

> 示例: `url:http://s1.bbgstatic.com/tracer/test.html|pid:101033.12344.23|ref:|nld:428`


```html
<head>
<!-- page identify -->
<meta name="pageid" content="101033.12344.23">
<script>
var $PAGE_DATA = {
  startTime: new Date,
  serverTime: 1416383542

  // also some other page settings for F2E developer interface.
  // ....
};
</script>
</head>
```

### UI 参数说明

1. vid - vister id (client global id, guid if not exists)
1. sid - session id (retrive from cookie `BBGSESSID`)
1. lv  - last visit info => "$datestamp:$day:$month:$week"
1. un  - user name, retrive from cookie `loginName` (guest if not exists)

> 示例: `vid:269ae031273a8cea|sid:269ae031273a8cea|lv:1416384399451:7:7:7|un:guest`

### 页面个性化数据(EX)

通过读取页面隐藏域 <input type="hidden" name="bpm-extra-params" /> 取值, 如:

```html
<input type="hidden" name="bpm-extra-params" value="{k1:v1}" />
<input type="hidden" name="bpm-extra-params" value="{k2:v2}" />
```

> 示例: `{k1:v1,k2:v2,....}`

## 用户行为打点接口

API: http://beacon.bubugao.com/e.gif

参数说明:

```
api?ua=${DATA} (注: DATA 以 "|" 分隔)
```

> $DATA 示例: `ua269ae031273a8cea|269ae031273a8cea|guest|http://s1.bbgstatic.com/tracer/test.html|||2014.456322.11|43,35|http://sina.com/|k=v`

```js
$ node
node> var s =
"ua269ae031273a8cea|269ae031273a8cea|guest|http://s1.bbgstatic.com/tracer/test.html|||2014.456322.11|43,35|http://sina.com/|k=v"
node> s.split('|')
[ 'ua269ae031273a8cea', -> vid
  '269ae031273a8cea', -> sid
  'guest', -> un
  'http://s1.bbgstatic.com/tracer/test.html', -> url
  '', -> ref
  '1.6.23' -> page id
  '2014.456322.11', -> ${BPM_CODE} eg. data-bpm="xxx"
  '43,35' -> xy
  'http://sina.com/', -> go url
  '1' -> type: 默认为1, 页面退出为2
  'k=v' -> optional data querystring
]
node>
$
```

> 注: 第 6 位为 ${BPM_CODE}, 通常该值对应页面 `data-bpm` 属性值，(其中 `pageExit`, `pageError` 为保留字段，用来记录页面退出，出错信息打点)

HTML通用打点:

```html
<div class="links">
  <a href="http://baidu.com" data-bpm="2014.456322.10">Baidu</a>
  <a href="http://sina.com" data-bpm="2014.456322.11">Sina</a>
  <a href="http://qq.com" data-bpm="name=2014.456322.12&value=test_value">QQ</a>
</div>
```

## 页面行为打点接口

API: http://beacon.bubugao.com/e.gif

参数说明:

```
api?ua=${DATA} (注: DATA 以 "|" 分隔)
```

接口数据格式同 `用户行为` 打点接口

${BPM_CODE} 保留值列表:

* pageExit - 页面退出，参数: ts
* pageError - 页面 js 错误捕获, 参数: ex.

