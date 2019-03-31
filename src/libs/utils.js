//格式化日期
function dateFormat(date, format) {
    if (!date) {
        return '';
    }
    if (typeof date === 'number') {
        date = new Date(date);
    }
    var o = {
        "M+": date.getMonth() + 1, //month
        "D+": date.getDate(),    //day
        "h+": date.getHours(),   //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3),  //quarter
        "S": date.getMilliseconds() //millisecond
    };
    if (/(Y+)/.test(format)) format = format.replace(RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length === 1 ? o[k] :
                ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//设置cookie
function setCookie(cname, cvalue, cms) {
    var d = new Date();
    d.setTime(d.getTime() + cms);
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

//修改title
function setTitle(title) {
    document.title = title;
}

// 后台二进制excel流下载

function fileBlobDownload(url,name) {
  var xmlResquest = new XMLHttpRequest();
  xmlResquest.open("POST", url, true);
  xmlResquest.setRequestHeader("Content-type", "application/json");
  xmlResquest.setRequestHeader("Authorization", "Bearer 6cda86e3-ba1c-4737-972c-f815304932ee");
  xmlResquest.responseType = "blob";
  xmlResquest.onload = function (oEvent) {

    var content = xmlResquest.response;
    var elink = document.createElement('a');
    elink.download = name;
    elink.style.display = 'none';
    var blob = new Blob([content]);
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    document.body.removeChild(elink);
  };
  xmlResquest.send();
}

export default {
    dateFormat,
    setCookie,
    getCookie,
    setTitle,
    fileBlobDownload
}
