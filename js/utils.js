



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

