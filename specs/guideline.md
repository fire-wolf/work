前端开发引导
============

## 入职指南

1. 拿到设备和邮箱帐号密码之后：

  加qq群: 99089479(前端)，369517105（UED），245502154（电商事业部）, 284671150 （高大上吐槽）

1. 工作周报模板：
  
  详情点击：[工作周报模板](./weekly-report-template.md)查看

1. 邮箱账号

  （直接在电商技术部群找罗鹏开通）

1. 技术部新入职指南

  <http://10.200.51.105:9000/confluence/pages/viewpage.action?pageId=19334908>

1. 本地hosts配置 

  ```
  10.200.51.181 svn.bubugao.com # svn
  10.200.51.105 git.bubugao.com # git
  ```

1. svn/git 账户和密码

  * git 帐号注册 <http://10.200.51.105/>, 用户名为 @yunhou.com 邮箱前缀,
  * svn 帐号申请，请在邮件指定需要开通权限的目录列表, 前端仅需开通 [/svn/bbg-code/ued/](http://10.200.51.181/svn/bbg-code/ued/) 读写权限

  发送邮件到 admin@bubugao.com，抄送给组长(蒋朝益)，运维创建帐号后会回复邮件

  <pre>
  to: admin@bubugao.com
  cc: jiangchaoyi@bubugao.com
  body: 我是 xxx, 前端开发工程师，申请 svn, git 用户权限
  </pre>

1. smb 账户和密码(ui设计目录)

  * 存放设计相关PSD文档

  <pre>
  smb://10.201.7.101/   
  账号：ui  
  密码：ui2014ui   
  </pre>

## 常用 URL

  (帐号一般都是找运维admin邮件申请,  抄送组长)

  * 前端技术文档：<http://fe.bubugao-inc.com/specs/>
  * 前端svn地址 <http://svn.bubugao.com/svn/bbg-code/ued/>
  * 前端分享资料归档 <http://git.bubugao.com/f2e/fe-sharing/tree/master>
  * Confluence (公司wiki): <http://10.200.51.105:9000/confluence/>
  * Jira (公司测试库管理): <http://10.200.51.145/login.jsp> (电商技术部群找阳著光开通)
  * 禅道 <http://pms.bubugao-inc.com/>
  * 点餐系统：<http://527.bubugao-inc.com/login/toLogin.do> (电商技术部群找吴政开通)
  * 520.bbg: <http://520.bubugao-inc.com/>

## 前端开发

### 开发环境塔建

* Nginx & php(x_64) [下载](http://pan.baidu.com/s/1kTCG6Rt) (提取码: kr9d)
* Xshell for windows [下载](http://pan.baidu.com/s/1kTmsktT) (提取码: 6fdx), 配置文件 [xshell_session](http://10.200.51.105/f2e/relay-session.git) 到 xshell profile 文件夹

UED项目列表: <http://svn.bubugao.com/svn/bbg-code/ued/project/>

前端静态资源项目:

git: <http://git.bubugao.com/groups/f2e-projects>

下面以 Nginx 配置为例，搭建 s1.bbgstatic.com.com 本地 test 项目:

1. checkout test 项目文件:

  ```
  git clone http://10.200.51.105/f2e/example-project.git ~/dev/bbg/static/test
  ```

2. 导入 Nginx 配置:

  最新配置参考: <http://git.bubugao.com/f2e/example-project/blob/master/README.md>

  附 [php-fpm.conf](https://gist.github.com/allex/8efc1e13448c2498a211) for PHP-FPM fast-cgi integrations.

### 设置本地 Git 配置 `~/.gitconfig`

**前端团队所有人员必须同步git化配**

```sh
$ git config --global user.name "Jack Ma"
$ git config --global user.email "jack_ma@domain.com"
```

```
[color]
    ui = auto
[filter "tabspace"]
    clean = expand --tabs=4 --initial
    smudge = unexpand --tabs=4 --first-only
[alias]
    st = status --porcelain -s
    ci = commit
    br = branch
    co = checkout
    df = diff -w
    dt = difftool
    l = log --stat --format=format:'"%C(yellow)%h %C(cyan)%an %C(blue)(%cn) %C(cyan)%ai\n%C(green)%s\n%b%N"'
    lg = log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr)%Creset' --abbrev-commit --date=relative
    shlog = log --pretty=\"%Cgreen%h%Creset - %Cred%ci%Creset - %s (%Cred%an%Creset)\"
    fshow = !sh -c 'git show --pretty="format:" --name-only $1 | grep -v "^$" | uniq'
    vim   = !sh -c 'vim `git fshow $1`'
    mate  = !sh -c 'mate `git fshow $1`'
    subl  = !sh -c 'subl `git fshow $1`'
    wtf   = !git-wtf
    rmbranch = "!f(){ git branch -d ${1} && git push origin --delete ${1}; };f"
    rmtag = "!f(){ git tag -d ${1} && git push origin :${1}; };f"
    up = "!f(){ args=\"$@\"; [ -n \"$args\" ] || { args=\"origin `git rev-parse --abbrev-ref HEAD`\"; } ; git remote prune origin && git pull $args && git submodule update --init; git submodule foreach \"git fetch origin -p; git reset origin/master --hard\"; };f"
[core]
    autocrlf = false
    whitespace = -trailing-space,-indent-with-non-tab,-tab-in-indent
    pager = less -R
    warnambiguousrefs = false
    excludesfile = ~/.gitignore
[branch]
    autosetuprebase = always
```

### Git Installation

![TortoiseGit](http://download.tortoisegit.org/logo.png)

- [Git Bash](http://git-scm.com/downloads/)
- [TortoiseGit for Windows GUI](http://download.tortoisegit.org/tgit/1.8.13.0/)
- [TortoiseGit 之配置密钥](http://blog.csdn.net/bendanbaichi1989/article/details/17916795)

### Sass, compass Installation

<http://fe.bubugao-inc.com/specs/scss-use.md>

### 开发规范

<http://fe.bubugao-inc.com/specs/project-specs.md>

### 项目发布

开发机列表: <http://fe.bubugao-inc.com/specs/fe-vms.md>

1. 初始化项目

  登陆开发机 `ssh apps@10.200.51.142`

  ```sh
  cd /apps/data/web/working/s1.bbgstatic.com/
  git clone <GIT_REPOS_URL> <PROJECT_DIR>
  ```

2. 发布release分支

  (142环境) 进到项目根目录下执行 `git release`

3. 发布测试环境

  (142环境) 进入项目根目录发布测试 `git deploy`

  手动发布测试:

  ```sh
  # init release
  git clone -b release <GIT_REPOS_URL> /apps/data/web/working/s1.bbgstatic.com/<PROJECT_DIR>
  # update release
  cd /apps/data/web/working/s1.bbgstatic.com/<PROJECT_DIR> && git up
  ```

4. 上线流程

  <http://fe.bubugao-inc.com/specs/release.md>
