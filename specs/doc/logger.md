# logger.js —— 前端日志收集系统

## 用途

1. 统计超时接口
2. 统计异常信息
3. 统计window.error信息反馈（Logger.js暂时不支持） 

## 引用方式

1. 支持requirejs和传统引用。

	//require 引用	
	var Logger = require('lib/logger/0.0.1/logger');

	//页面直接引用，不推荐
	<script src="//s1.bbgstatic.com/lib/logger/0.0.1/logger.js"></script>

## 参数说明

	var logger = new Logger({
	    pid: 'fe_pc', //{string} 数据来源,前端目前只有这两种：fe_pc|fe_mb
	    app: 'default', //{string} 内部项目的命名，项目自己定制，但是不能冲突
	    level: 'error', //{string} 日志输出等级,error:只发送error日志；warn：发送error、warn日志；info:发送error、warn、info日志；log：发送error、warn、info、log日志
	    debug: false, //{bool} 是否调试，true|false，false：发送到服务器，true:用console.log输出，请在支持console.log的环境调试否则报错
	    devId: 0, //{string} 开发者id，0：默认，表示无开发者信息
	    url: '//api.sleuth.yunhou.com/c.gif' //{string} 日志服务器地址
	});

## 实例方法

	var logger = new Logger();
	/**
	 * 错误日志
	 * @param data {json|Error|string|number} 日志的详情
	 * @param opts {json} 日志的补充，
	 */
	logger.error(data,opts);//错误日志
	logger.warn(data,opts);//警告日志
	logger.info(data,opts);//info日志
	logger.log(data,opts);//log日志

## 静态方法

	
	//返回16位的唯一用户标示，用于后端接口日志跟踪
	Logger.getUID();

## 前端预警监控规则配置

1、超时的预警，必须把超时的接口url和超时时间上传。例如：

	var logger = new Logger();
	logger.warn({
		url: 'http://api.yunhou.com/getCurrentTime' //超时的url
	},{
		timeout: '' //超时时长
	});

2、异常的数据接口，需要把重要的排错堆栈信息上传，例如:

	var logger = new Logger();
	try{
		var c = null;
		console.log(c.name);
	}catch(e){
		logger.warn(e,{
			data : '' //为了方便排错我们还可以把更多重要的信息放入data里面  
	    });
	}

## 预警说明

所有加了监控的项目，必须归档。归档模板如下(分割线下)：


# =========================模板分割线============================


# 《xx项目》logger埋点说明

## 全局配置
	var logger = new Logger({
	    pid: 'fe_pc', //{string} 数据来源,前端目前只有这两种：fe_pc|fe_mb
	    app: 'default', //{string} 内部项目的命名，项目自己定制，但是不能冲突
	    level: 'error', //{string} 日志输出等级,error:只发送error日志；warn：发送error、warn日志；info:发送error、warn、info日志；log：发送error、warn、info、log日志
	    debug: false, //{bool} 是否调试，true|false，false：发送到服务器，true:用console.log输出，请在支持console.log的环境调试否则报错
	    devId: 0, //{string} 开发者id，0：默认，表示无开发者信息
	    url: '//10.200.51.114/c.gif' //{string} 日志服务器地址
	});


## 特殊情况说明
xxxxx,xxxxx,xxxxx