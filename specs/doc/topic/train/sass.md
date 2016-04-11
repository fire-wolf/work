SASS 使用
============

Author: 谢璇

## 目的
* 提高 css 编写效率。
* 合理管理，各模块之间的依赖。

## 关于 sass
* 遵循其语法，写个 xx.scss 文件
* 调用命令行，编译出 xx.css 文件
* 页面引用的，是编译出的结果文件（xx.css）

## 环境简介
* 安装说明，自行网上查（关键字：sass、compass）
* 最终确保，在 config.rb 存在的目录，下述命令顺利执行：
        compass compile

## 技巧
* & 和 @at-root
  * HTML 结构
    
            <div class="pc-group">
                <a href="#" class="pc-link-1"></a>
                <a href="#" class="pc-link-2"></a>
            </div>
            <div class="pc-group pc-group-special">
                <a href="#" class="pc-link-1"></a>
                <a href="#" class="pc-link-2"></a>
            </div>
            
  * &
    * sass
            .pc-link {
                &-1 {
                    color: red;
                }
            }
                
    * css
        
            .pc-link-1 {
              color: red;
            }
                
  * @at-root
    * sass
            .pc-link {
                @at-root .special &-1 {
                    color: blue;
                }
            }
                
    * css
            .pc-links-special .pc-link-1 {
                color: blue;
            }

* **compass watch 时，关联文件变更时的表现**
    1. sass 文件夹中，存在文件：index.scss、index-1.scss、index-1-1.scss
        * index.scss
        
                @import 'a-1';
        * index-1.scss
        
                body {
                    color: gray;
                }
                @import 'index-1-1';
        * index-1-1.scss
        
                body {
                    background-color: gray;
                }
    2. 另外和 sass 同目录的 sass-import 文件夹，存在：import-1.scss
        * import-1.scss

                body {
                    color: darkgray;
                }
    3. 执行命令 compass watch
    4. 修改关联文件时：
        * 修改 sass/index-1.scss 时，index.scss 生成的 css 文件会“感应”到变化，并重新生成
        * 修改 sass/index-1-1.scss 时，index.scss 生成的 css 文件会“感应”到变化，并重新生成
        * 修改 sass-import/import-1.scss 时，index.scss 生成的 css 文件不会发生变化

* **变量引用**
  * 正确用法：
            .pc-block-1 {
                width: $blockWidth + 1;
                height: $blockHeight1 + $blcokHeight2;
                top: ($blockTop1 + $blockTop2) * 10;
            }
            
  * 错误场景：
    * 错误的用法：
            .pc-block-$blockNumber {
                width: 0px;
            }
    * 纠正之后……
            .pc-block-#{$blockNumber} {
                width: 0px;
            }

* **for**
  * 下述代码，会执行 3 次（i 的值分别是：1、2、3），【我们约定用这一种】
    
            @for $i from 1 through 3 {
                .pc-block-#{$i} {
                    width: 0px;
                }
            }
            
  * 下述代码，会执行 2 次（i 的值分别是：1、2）
    
            @for $i from 1 to 3 {
                .pc-block-#{$i} {
                    width: 0px;
                }
            }
