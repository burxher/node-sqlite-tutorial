let fs = require('fs')

let Logger = {
    log(val, callback) {
        let time = "["+ getDate() + "] "
        let logText = "\n"
        if (typeof (val) == 'string') {
            logText += time + val
        }else {
            logText += time + JSON.stringify(val)
        }
        console.log(logText)
        
        fs.appendFile('./log/normal.log', logText, function () {
            callback && callback()
        });
    }
}
// 获取时间
function getDate() {
    let now = new Date().Format('yyyy-MM-dd HH:mm:ss')
    return now
}
Date.prototype.Format = function (fmt) { //yyyy-MM-dd HH:mm:ss
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    var year = this.getFullYear();
    var yearstr = year + '';
    yearstr = yearstr.length >= 4 ? yearstr : '0000'.substr(0, 4 - yearstr.length) + yearstr;

    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (yearstr + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

module.exports = Logger
