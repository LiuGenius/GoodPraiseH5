var host = "http://fans.20b.me/v1/";

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
