# 浏览器兼容性说明

## PC端浏览器兼容性

我们公司PC端需要做浏览器兼容可以分为3大类：

1. 面向用户的系统，我们简称A类
2. 面向内部的系统，我们简称B类
3. 其他系统，我们简称C类（暂时我们公司还没有此类项目）

### 划分原则：

1. 不用80%的人力做20%的活
2. A类我们主要面对用户，所以需要兼容性严格
3. B类属于我们内部系统，指定浏览器
4. C类特殊定制这一类，目前我们还没有此类项目

### A类需要兼容的浏览器：

<img src="http://img0.bbgstatic.com/1526741ec96_bc_d1d86dc8a1d7a0c6e35e5b31703571d5_1140x238.jpeg" width="500"/>

1. webkit (safari 5.0+ 360极速浏览器7.0+)
2. Trident 内核 (IE8 - IE11)
3. Gecko 内核 (firefox 20.0+)
4. Blink 内核 (chrome 27.0+)
5. 国内双内核 (360 安全浏览器 6.0+, 搜狗浏览器 5.0+, QQ 浏览器 7.0+, 猎豹浏览器 5.0+)

### B类需要兼容的浏览器：

1. Blink内核 (chrome 27.0+) 

chrome 27.0+

### 附件pc端兼容性测试虚拟机（账号和密码都是admin/admin）

10.200.51.120  IE7
10.200.51.121  IE8
10.200.51.122  IE9
10.200.51.102  IE10

## 移动端兼容性说明

### 划分原则：

我们的面向用户人群要相对高端一点，所以目前我们内部讨论（跟香香姐有确认）的是按照主流操作系统自带浏览器走，还有目前国内手机端占比比较高的qq浏览器、uc浏览器:

##手机端兼容浏览器版本：

1. Android 4.0+ 原生浏览器
2. IOS 4.0+ 原生浏览器
3. QQ浏览器手机版5.0+（Android、ios）
4. UC浏览器手机版10.0+ （Android、ios）
5. 微信5.0+ 内置浏览器 （Android、ios）

PS：目前手机端不做winPhone、黑莓等其他手机操作系统的的兼容性测试。
