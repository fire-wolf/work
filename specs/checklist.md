#前端checklist

1. 价格标签问题：所有价格必须是这种【￥】符号表示，请注意字体设置
2. 所写代码符合以下规范：[《JS语法&格式篇》](project-specs.md)、[《前端项目规范》](project-specs.md)、[《JS语法&格式篇》](js.md)、[《CSS规范》](css.md)、[《HTML规范》](html.md)
2. 体验性问题，必须提前过滤
3. 基本操作都无法点击，或者报错，或者无法操作；例如：点击删除按钮，直接报错；
4. 基本的流程无法运行，或者阻塞；例如：页面都无法展示，以及样式直接变形；
5. 基本的功能都没有实现，或者与原需求的设计不一致；例如：需要完成一个树形结构的展示，做成了其他的展示方式，而且是与原需求不符合的；
6. 如果我们要改动线上已经推广的页面（包含专题页），请通知相关测试，然后同步到蒋朝益！
7. 所有ajax的提交的按钮必须做防止重复提交
8. 重要的表单数据，需要去掉前后端空格。
9. 弹窗开发请遵循[《前端弹对话框应用规范》](dialog-specs.md)，如果发现设计与此规范冲突，请找交互确认再动手！
10. 兼容性测试请参考[《浏览器兼容性说明》](browser.md)
11. 所有上线的项目，如果必须通知测试测试，测试通过后方能走人。
12. 所有上线的项目，再没有特殊通知的情况下，必须加如下统计代码。

```html
<!--bbg start-->
<script>
	(function(f,c,d,e,g,a,b){a=c.createElement(d);b=c.getElementsByTagName(d)[0];a.async=1;a.src=e;b.parentNode.insertBefore(a,b)
	})(window,document,"script","//"+(location.protocol=="http:"?"s1":"ssl")+".bbgstatic.com/tracer/bpm.js","bpm");
</script>
<!--bbg end-->  
```	


++未完待续，后续会增加优先级++ 

