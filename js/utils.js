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



function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = decodeURI(decodeURI(location.search)).substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

function StringToFloat(str) {
	return parseFloat(str).toFixed(2)
}

function getLocalTime(nS) {
	return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
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
