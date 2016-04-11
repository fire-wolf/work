# 更新静态资源

### 1. checkout 主干代码，并更新

SVN 签出
```sh
svn co ReposURL [TargetDir]
```

如: `svn co http://svn.bubugao.com/svn/bbg-code/ued/project/static5 /var/www/static5`

SVN 更新

```sh
svn up
```

static5(平台化): `<http://svn.bubugao.com/svn/bbg-code/ued/project/static5>`

static1(商城): `<http://svn.bubugao.com/svn/bbg-code/ued/project/bbg>`

### 2. SVN 合并主干

命令: `svn merge`

在主干上 merge to '分支地址'

### 3. 打包压缩到的发布目录，并提交 SVN(记得先更新RELEASE，再打包到此目录)

static5(平台化)  
提交的目录 `<http://svn.bubugao.com/svn/bbg-code/ued/release/static5>`  
打包命令` node r.js -o config.js`

static1(商城)   
提交的目录 `<http://svn.bubugao.com/svn/bbg-code/ued/release/static1>`  
打包命令 `npm link && db`

### 4. XShell 环境配置

解压 `Sessions.rar` 至 `C:\Users\bbgds\AppData\Roaming\NetSarang\Xshell\Sessions`

### 5. 服务器文件备份(tar 压缩)

```sh
tar -zcvf static5.bubugao.com.2014.10.16.tar.gz static5.bubugao.com/
```

### 6. 更新测试环境静态资源

```sh
cd /apps/data/web/working/static5.bubugao.com

# 更新svn
svn up
```

切换 SVN 分支到发布目录

```sh
# cleanup
rm -rf /apps/data/web/working/static5.bubugao.com/{*,.svn}

# replace svn url `{SVN_BRANCH_PATH}`
svn co {SVN_BRANCH_PATH} /apps/data/web/working/static5.bubugao.com
```

### 7. 清除 nginx 服务缓存

```sh
rm -rf /apps/svr/nginx/cache/proxy_cache_dir/*
```

### 8. SVN Create Tag and Branch

> svn 打 tag, branch 都是用 `svn cp`

如: 对当前主干打tag版本 `${date}`

```sh
svn cp http://svn.bubugao.com/svn/bbg-code/ued/project/static5 \
      http://svn.bubugao.com/svn/bbg-code/ued/tag/project/static5/${date} -m "Release 1.0"
```

平台化 tag 目录: `http://svn.bubugao.com/svn/bbg-code/ued/tag/project/static5/${date}`

商城 tag 目录: `http://svn.bubugao.com/svn/bbg-code/ued/tag/project/bbg/${date}`

分支基础路径: `http://svn.bubugao.com/svn/bbg-code/ued/branches/project/static5/${date}-${keyword}`

### 9. 异常情况处理 (Tips)

* 切换 root 权限: `sudo -i`

* 还原到特定版本到指定目录`./static`

  ```sh
  tar zxvf xxx.tar.gz -C ./static`
  ```

