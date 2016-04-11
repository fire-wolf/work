CSS 之 class 使用约定
============

Author: 谢璇

## 目的
* 保证命令空间唯一，避免样式冲突
* 良好的可读性，从 class 可以定位到具体是哪个模块

## 页面代码示例

    <div class="pc-block-1">
        <div class="pc-template-title jImg" data-bg="lazyload"
            data-url="http://img04.bubugao.com/14eb372cc79_bc_ef25dd5cbdca3a82cf3183cf2634fadd_1000x86.jpeg"></div>
        <div class="pc-template-middle mod-commodity-list-3-commodities-each-line-container">
            <div class="pc-template-grid spec-mod">
                <div class="com-bd jFloor">
                    <!--#include file="/include/demo/commodities.html"-->
                </div>
            </div>
        </div>
    </div>

## 命令空间
* 页面（pc-\*\*\* 的格式，除了下面的模板占用的 pc-template）：
  * pc-block-1

* 模板（template），[参考源码](http://git.bubugao.com/fe-topic/pc-topic/blob/master/sass/template/1.0.0/common.scss)：
  * pc-template-title
    <br />
    **标题图片**（占一行的图片背景）
        .pc-template-title {
            background-repeat: no-repeat;
            background-position: 50% 50%;
        }
            
  * pc-template-middle
    <br />
    **页面居中**
        .pc-template-middle {
            margin: 0px auto;
            width: $middleWidth;
            position: relative;
        }
            
  * pc-template-grid
  <br />
  **列表容器**（商品、图片……）
        .pc-template-grid {
            padding-left: 8px;
            padding-top: 8px;
            
            li {
                margin-right: 4px;
            }
        }

* 组件（module），以 【mod-组件关键字】 开头：
  * mod-commodity-list-3-commodities-each-line-container（[参考源码](http://git.bubugao.com/fe-topic/pc-topic/blob/master/sass/module/commodity-list/1.0.0/style.scss)）
  <br />
  **控制一行 3 个商品**

* 旧代码组件，[参考源码](http://git.bubugao.com/fe-topic/pc-topic/blob/master/sass/app.scss)：
  * com-bd
  * jImg（图片懒加载定位用，无样式）
  * jFloor（楼层定位用，无样式）
