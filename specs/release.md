# 前端发布 #
1. 流程图 

<iframe style="width: 100%; height: 743px; border: 0;" src="./files/fe-delopy-v0.1.svg">Your browser does not support iframes</iframe>

<iframe style="width: 100%; height: 368px; border: 0;" src="./files/fe-release-v0.1.svg">Your browser does not support iframes</iframe>

1. static5 (pc)

	```sh
	主干 git@10.200.51.105:f2e-projects/static5.git
	发布 http://svn.bubugao.com/svn/bbg-code/ued/release/static5
	打包 142, /home/apps/build/build -e pro
	命令 release-static static5
	```
1. static1 (login)

	```sh
	主干 http://10.200.51.181/svn/bbg-code/ued/project/bbg/static
	发布 http://10.200.51.181/svn/bbg-code/ued/release/static1
	打包 (node r.js -o config.js) /home/apps/static1/release.sh
	命令 cd /apps/data/web/working/s1.bbgstatic.com/login && svn up
	```
1. s1/* (gshop)
	
	```sh
	主干 git@10.200.51.105:f2e-projects/project_name.git
	发布 git clone -b release git@10.200.51.105:f2e-projects/project_name.git
	打包 142, release-build
	命令 release-static gshop
	```

1. page (login,h5-login)

	```sh
	(1)pc/ph
	主干 http://10.200.51.181/svn/bbg-code/ued/project/login
	发布 http://10.200.51.181/svn/bbg-code/ued/publish/login
	命令 svn up /apps/data/web/working/ssl.yunhou.com/login
	```
1. page (cart,pay)

	```sh
	(1)pc
	主干 git@10.200.51.105:f2e-projects/cart.yunhou.com.git
	发布 http://svn.bubugao.com/svn/bbg-code/ued/release/cart
	重置 git reset origin/master --hard
	提交 ./release.sh
	命令 svn up /apps/data/web/working/cart.yunhou.com/
	
	(2)ph
	主干 git@10.200.51.105:f2e-projects/gshop.git
	发布 git@10.200.51.105:f2e-projects/gshop.git
	命令 /apps/data/web/working/m.yunhou.com/public/html/.bin/sync_html.sh
	```


## 常用命令 ##
```js
1. refresh-static-url //142上刷新static5 url
2. refresh-static-url -p gshop //刷新gshop url
3. refresh-static-url -p topic //刷新专题url
4. release-static [project_name] // static5, h5-login, union, lib,... //正式环境上多台同步更新静态资源
5. svn copy 主干 tag目录 -m 'v3.0.9' //svn 上打tag
6. git tag '' //git上打tag
7. git revert tag号 //git上回滚;
```
## 注意 ##
```js
1.master分支 一定要先更新
2.out目录 一定要提交
3.专题一定要单独更新topic目录
4.登陆注册界面和h5界面记得更新版本号
```
## 环境ip ##

```js
测试ip 10.200.51.223
预演ip 10.200.52.102 --static5
预演ip 10.200.52.101/10.200.52.151 --cart 
```


