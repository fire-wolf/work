# 专题发布

### 1.图片尺寸最大为不能超过250k；

### 2.首图图文为title标题及h1标签内容；

### 3.html专题文件地址

* html文件为：`http://10.200.51.181/svn/bbg-code/ued/project/active/active/年份/月份/标题名称.php`

* 模板文件为：`http://10.200.51.181/svn/bbg-code/ued/project/active/active/年份/月份/标题名称.tpl`

* app专题html文件地址：`http://10.200.51.181/svn/bbg-code/release/app.bubugao.com/topic/年份/月份/标题名称.html`

####商城tpl格式

```html
<!DOCTYPE html>
<html>
<head>
<{header}>
<{require file="block/css.html"}>
<link rel="stylesheet" type="text/css" href="//static1.bubugao.com/css/active/common.css?3">
<link rel="stylesheet" type="text/css" href="//static1.bubugao.com/active/2014/11/food/css/style.css">
<title>头图文名称—步步高商城</title>
</head>
<body>
<{require file="block/header_single.html" }>
<div class="bn jImg" data-bg="lazyload" style="height:513px;" data-url="//static1.bubugao.com/active/2014/11/food/img/bn-1.jpg">
		<h1 class="hidden">头图文名称</h1> 
	</div>  
	<!-- 商品块区START -->
	<div class="spec-mod" id="com1">
		<div class="com-hd jImg" style="background-position:-8px 0;" data-bg="lazyload" data-url="//static1.bubugao.com/active/2014/11/food/img/hd-1.jpg">
			<{widgets id="fl-title-1" }> 
		</div>
		<div class="com-bd">  
			<ul class="clearfix">
				<{widgets id="fl-goods-1" }> 
			</ul> 
		</div> 
	</div>
	<!-- 商品块区END -->
	<!-- 商品块区START -->
	<div class="com-mod" id="com2">
		<div class="com-hd jImg" data-bg="lazyload" data-url="//static1.bubugao.com/active/2014/11/food/img/hd-2.jpg">
			<{widgets id="fl-title-2" }>
		</div>
		<div class="com-bd"> 
			<ul class="clearfix">
				<{widgets id="fl-goods-2" }>  
			</ul> 
		</div> 
	</div>
	<!-- 商品块区END --> 
	<div id="jRightNav" class="right-nav anim-nav anim-nav-show">
		<{widgets id="fl-nav-1" }>
	</div>	 
<{widgets id="fl-share-1" }>
<{require file="block/footer.html"}>
<{require file="block/js.html"}>
<{require file="block/active/act-index-js.html"}>
<!--[if IE 6]>
<script type="text/javascript" src="//static1.bubugao.com/js/png-transparent.js"></script> 
<script type="text/javascript">
window.addEvent('domready',function(){
      DD_belatedPNG.fix('.right-nav,.right-nav a,.right-nav .top, .com-hd, .com-ft');
});
</script>
<![endif]-->
</body>
</html>
```

####自营tpl格式

```html
<!DOCTYPE html>
<html>
<head>
{template 'meta'}
<title>满一百减二十—步步高商城</title>
<meta name="keywords" content="满一百减二十" />
<meta name="description" content="长沙九大门店全场满一百减二十" />
<link href="http://static5.bubugao.com/mall/topic/2014/10/mj/style.css" rel="stylesheet"/>
</head>
<body>
{template 'hd_for_topic'}
<!-- START content -->
<div class="bn jImg" id="com1" data-bg="lazyload" style="height:300px;" data-url="//static5.bubugao.com/mall/topic/2014/10/mj/img/bn-1.jpg">
	<h1 class="hidden">长沙九大门店全场满一百减二十</h1>
</div>
<div class="bn jImg" data-bg="lazyload" style="height:244px;" data-url="//static5.bubugao.com/mall/topic/2014/10/mj/img/bn-2.jpg">
	<div class="layout rel" style="height:100%;">
		<a href="" target="_blank" title="洗护专场" style="width:195px;height:155px;top: 80px;left: 410px;" class="hid abs">洗护专场</a>
	</div>
</div>
 
<!-- 商品块区START -->
<div class="spec-mod" id="com2" >
	<div class="com-hd jImg" data-bg="lazyload" style="height:64px;" data-url="//static5.bubugao.com/mall/topic/2014/10/mj/img/com-hd1.jpg">
		 <h2 class="hidden">牛奶特惠 整箱立减8元+满一百减二十</h2> 
	</div>
	<div class="com-bd"> 
		 {bbg:shopProduct  action='lists' defaultProduct='' defaultIsShow='' productBn='800003583,800237185,800002914,800354714' shopids='11892,11896,11899,11900,11901,11902,11903' class='' cache='' }
{$data}
{/bbg}
	</div> 
</div>
<!-- 商品块区END -->  

<div id="jRightNav" class="right-nav anim-nav anim-nav-show">
		<a href="#com1" title="满百减二十">满百减二十</a>
		<a href="#com2" title="牛奶特惠">牛奶特惠</a> 
		<a href="#com3" title="粮油生鲜">粮油生鲜</a> 
		<a href="#com4" title="食品饮料">食品饮料</a> 
		<a href="#com5" title="个人清洁">个人清洁</a>  
	</div>
<!-- END content -->
{template 'footer'}
{template 'min_bar'}
{template 'js_for_topic'}
<script>
require(['mall/topic/2014/10/mj/script']);
</script>
</body>
</html>
```

### 4.静态文件提交地址

* 商城地址：`http://10.200.51.181/svn/bbg-code/ued/project/active/static/active/年份/月份/标题名称/img | js | css /文件`

* 自营地址：`http://10.200.51.181/svn/bbg-code/ued/project/static5/mall/topic/年份/月份/标题名称/img | js | css /文件`

* app地址：`http://10.200.51.181/svn/bbg-code/ued/project/static5/app-topic/年份/月份/标题名称/img | js | css /文件`


### 5、静态文件打包后地址

* 商城地址：`http://10.200.51.181/svn/bbg-code/ued/release/active/年份/月份/标题名称/img | js | css /文件`

* 自营地址：`http://10.200.51.181/svn/bbg-code/ued/release/static5/mall/topic/年份/月份/标题名称/img | js | css /文件`

* app地址：`http://10.200.51.181/svn/bbg-code/ued/release/static5/app-topic/年份/月份/标题名称/img | js | css /文件`

### 6、打包压缩到的发布目录，并提交 SVN(记得先更新RELEASE，再打包到此目录)

a、安装node 地址：`http://www.nodejs.org/download/`

b、下载打包文件 

* 商城为附件内容;
* app、自营打包文件地址：`http://10.200.51.181/svn/bbg-code/ued/build`

c、配置打包文件

* #####商城打开文件config.js

```json
({
    appDir: "商城静态地址",
    baseUrl: "./",
    dir: "商城打包后地址",
    keepBuildDir: false,
    skipModuleInsertion: true,
    removeCombined: true, 
    fileExclusionRegExp: /^(\.|build|demo|output|svn|git)/,
    optimizeCss: "standard",
    optimize: "uglify"
})
```
    
> 命令：node r.js -o config.js;


* #####app、自营打开config.json

```json
{
	"appDir"  :"静态地址",
	"baseUrl" :"../",
	"optimizeCss" : "standard",//开发：standard.keepComments.keepLines/none 生产：standard
	"optimize" : "uglify",//开发：none 生产：uglify
	"dir"     : "打包后地址",
	//"module" : ["admin","bc","help","mall","public","uc"]
	"module" : ["模块名称"] （app-topic | mall）
}
```

 > 命令：npm link  回车 db;