var host = "http://fans.20b.me/v1/";//fans.yc699.com


var register_url = "http://fans.20b.me/reg/register.html";
var access_token = "";
//登录
var LOGIN = host + "member/login";
//用户注册
var REGISTER_USER = host + "member/register";
//获取验证码
var GET_VERIFICATION_CODE = host + "member/phone-code";
//首页数据
var TASK_HOME = host + "home/task-home";
//任务列表
var TASK_LIST = host + "home/task-list";
//提交任务
var RECEIVE_TASK = host + "task/receive-task";
//我的任务列表
var MY_TASK_LIST = host + "task/my-task-list";
//等级列表
var PACKAGE_LIST = host + "level/level-list";
//提交任务
var SUBMIT_TASK = host + "task/submit-task";
//我的团队  有问题 字段模式
var MY_TEAM = host + "member/my-team";
//修改密码
var CHANGE_PWD = host + "member/update-password";
//我的信息  有问题 少字段
var USER_INFO = host + "member/info";
//支持的银行列表
var BANK_LIST = host + "member/bank-list";
//我的银行信息
var MY_BANK_INFO = host + "member/my-bank";
//新闻列表
var NEWS_LIST = host + "home/news-list";
//新闻详情
var NEWS_INFO = host + "home/news-info";
//上传图片
var UPDATA_IMAGE = host + "image/upload";
//获取支付宝支付码
var ALIPAY_QRCODE = host + "level/alipay-code";
//升级记录
var UPDATA_HISTORY = host + "level/pay-detail";
//修改用户信息
var EDIT_USERINFO = host + "member/edit";
//资金明细
var CAPITAL_INFO = host + "member/funds-detail";
//购买升级套餐
var UPDATA_PAY = host + "level/upgrade";
//申请提现
var APPLY_CAPTITAL = host + "member/apply-withdraw";
//提现记录
var CASH_LIST = host + "member/withdraw-detail";
//更新
var UPDATA_INDEX = host + "update/update-index";
//更新提现二维码
var UPDATA_QRCODE = host + "member/withdraw-image";
//
var sss = host + "member/source-info";


var longTime = 0;
var currentUrl;
// 监听“返回”按钮事件
function addEventTest() {
	document.addEventListener('plusready', function() {
		var webview = plus.webview.currentWebview();
		plus.key.addEventListener('backbutton', function() {
			currentUrl = window.location.href;
			console.log("url: " + currentUrl);
			if(isMainPage(currentUrl)){
				//当前在一级页面
				if(new Date().getTime() - longTime > 2000){
					longTime = new Date().getTime();
					plus.nativeUI.toast('再次点击退出')
				}else{
					webview.close();
				}	
			}else{
				//不在一级页面
				window.history.back();
			}
		});
	}, false);
}


function isMainPage(str){
	if(str.indexOf("/task.html") != -1){
		return true;
	}
	if(str.indexOf("/main.html") != -1){
		return true;
	}
	if(str.indexOf("/update_pay.html") != -1){
		return true;
	}
	if(str.indexOf("/me.html") != -1){
		return true;
	}
	if(str.indexOf("/login.html") != -1){
		return true;
	}
	return false;
}

/* 封装ajax函数
 * @param {string}opt.type http连接的方式，包括POST和GET两种方式
 * @param {string}opt.url 发送请求的url
 * @param {boolean}opt.async 是否为异步请求，true为异步的，false为同步的
 * @param {object}opt.data 发送的参数，格式为对象类型
 * @param {function}opt.success ajax发送并接收成功调用的回调函数
 */
function ajax(opt) {
	opt = opt || {};
	opt.method = opt.method.toUpperCase() || 'POST';
	opt.url = opt.url || '';
	opt.async = opt.async || true;
	opt.data = opt.data || null;
	if(opt.data != null){
		opt.data.pageSize = 1000;
		opt.data.page = 1;
	}
	opt.success = opt.success || function() {};
	var xmlHttp = null;
	if (XMLHttpRequest) {
		xmlHttp = new XMLHttpRequest();
	} else {
		xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
	}
	var params = [];
	for (var key in opt.data) {
		params.push(key + '=' + opt.data[key]);
	}
	var postData = params.join('&');
	if (opt.method.toUpperCase() === 'POST') {
		xmlHttp.open(opt.method, opt.url, opt.async);
		xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');
		// xmlHttp.setRequestHeader('Access-Control-Allow-Origin', '*')
		xmlHttp.send(postData);
	} else if (opt.method.toUpperCase() === 'GET') {
		xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
		console.log(opt.url + '?' + postData)
		xmlHttp.send(null);
	}

	xmlHttp.onreadystatechange = function() {
		if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
			console.log()
			if(xmlHttp.responseText.indexOf("access-token无效") != -1){
				alert("当前账号在其他设备登录!!!");
				location.href = "login.html";
				localStorage.setItem("access-token","");
			}else{
				opt.success(JSON.parse(xmlHttp.responseText)); //如果不是json数据可以去掉json转换
			}
		}
	};
}


function checkVersionUpdata(updataUrl) {
	document.addEventListener('plusready', function() {
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
			// console.log(JSON.stringify(widgetInfo))
			// console.log("version: " + version + "  versionCode:" + versionCode)
			ajax({
				method: 'GET',
				dataType: "json",
				url: updataUrl, //+ "?access-token=" + localStorage.getItem('access-token'),
				data: {
					// versionCode: plus.runtime.versionCode,
					// version:plus.runtime.version,
					name: 'fans',
					version: widgetInfo.version,
					versionCode: widgetInfo.versionCode
				},
				success: function(obj) {
					var data = obj.data;
					console.log(JSON.stringify(obj));
					var isNeedUpdata = data.update; //是否需要更新
					if (isNeedUpdata) {
						var downloadUrl = data.wgtUrl;
						if (downloadUrl == '') {
							
							return;
						}
						downfile(downloadUrl, (res, url) => {
							if (res == 1) {
								plus.runtime.install(url, {}, function() {
									// plus.nativeUI.toast("升级成功,正在重启应用");
									plus.runtime.restart();
								}, function(e) {
									plus.nativeUI.toast("更新失败" + e.message);
								});
							} else {
								plus.nativeUI.toast("更新失败" + e.message);
							}
						})
						return;
						//开始下载
						// var dtask = plus.downloader.createDownload(downloadUrl, {}, function(file, status) {
						// 	// 下载完成
						// 	if (status == 200) {
						// 		console.log(file.filename)
						// 		//开始安装
						// 		plus.runtime.install(file, {
						// 			force: true
						// 		}, function() {
						// 			plus.nativeUI.toast("升级成功,正在重启应用");
						// 			plus.runtime.restart();
						// 		}, function(e) {
						// 			plus.nativeUI.toast("更新失败" + e.message);
						// 			console.log(e.message)
						// 		});
						// 	} else {
						// 		plus.nativeUI.toast("下载更新文件失败");
						// 	}
						// });
						// dtask.start();
					}
				}
			})
		})

	}, false);

}

function downfile(photoPath, callback) {
	var dtask = plus.downloader.createDownload(photoPath, {}, function(d, status) {
		// 下载完成
		if (status == 200) {
			plus.io.resolveLocalFileSystemURL(d.filename, function(entry) {
				callback(1, entry.fullPath)
			});
			//dtask.clear()
		} else {
			callback(0)
		}
	});
	dtask.start();
}
