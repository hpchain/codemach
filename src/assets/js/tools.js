/* eslint-disable */
const gettype = Object.prototype.toString
const tools = {
  protocol: 'http',
  setLang (lang) {
    var str = JSON.stringify(lang)
    var storage = window.localStorage
    storage.setItem('bumo-browser-lang', str)
  },
  getLang () { // get local language
    var storage = window.localStorage
    var lang = storage.getItem('bumo-browser-lang')
    if (lang === null || lang === '') {
      this.setLang('en')
      return 'en'
    } else {
      return JSON.parse(lang)
    }
  },
  getLocalLang () {
    var hostname = window.location.hostname
    if (hostname === 'forum-en.bubi.cn') {
      return 'en'
    } else if (hostname === 'forum-cn.bubi.cn') {
      return 'cn'
    } else {
      return 'en'
    }
  },
  getUrl () { // 获取域名
    const url = document.location.href
    let path = url.split('//')[1]
    let result = path.substring(0, path.indexOf('/'))
    return url.split('//')[0] + '//' + result
  },
  isString (o) {
    return gettype.call(o) === '[object String]'
  },
  isNumber (o) {
    return gettype.call(o) === '[object Number]'
  },
  // 是否为正整数
  isPositiveInteger (value) {
    var patrn = /^(-)?\d+(\.\d+)?$/
    if (patrn.exec(value) === null || value === '') {
      return false
    } else {
      return true
    }
  },
  isBoolean (o) {
    return gettype.call(o) === '[object Boolean]'
  },
  isMobile (o) {
    var reg = /^1[34578]\d{9}$/
    return reg.test(o)
  },
  isEmail (o) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    return reg.test(o)
  },
  isObject: function (o) {
    return gettype.call(o) === '[object Object]'
  },

  isArray: function (o) {
    return gettype.call(o) === '[object Array]'
  },

  isNULL: function (o) { // 空字符串  null  undefined
    return gettype.call(o) === '[object Null]' || gettype.call(o) === '[object Undefined]' || o === ''
  },

  isUndefined: function (o) {
    return gettype.call(o) === '[object Undefined]'
  },

  isDocument: function (o) { // ?
    return gettype.call(o) === '[object Document]' || '[object HTMLDocument]'
  },
  toString (value) {
    if (this.isNumber(value)) {
      return value + ''
    }
    if (this.isObject(value) || this.isArray(value)) {
      return JSON.stringify(value)
    }
  },
  IEVersion () {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器  
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; // 判断是否IE的Edge浏览器  
    if (isIE) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion == 7) {
        return "IE7";
      } else if(fIEVersion == 8) {
        return "IE8";
      } else if(fIEVersion == 9) {
        return "IE9";
      } else if(fIEVersion == 10) {
        return "IE10";
      } else if(fIEVersion == 11) {
        return "IE11";
      } else {
        return "0"
      } // IE版本过低  
    } else if (isEdge) {
      return "Edge";
    } else {
      return "-1"; // 非IE  
    }
  },
  BrowserType() {
    var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串  
    var isOpera = userAgent.indexOf("Opera") > -1; // 判断是否Opera浏览器  
    var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; // 判断是否IE浏览器  
    var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; // 判断是否IE的Edge浏览器  
    var isFF = userAgent.indexOf("Firefox") > -1; // 判断是否Firefox浏览器  
    var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; // 判断是否Safari浏览器  
    var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1; // 判断Chrome浏览器  
    if(isIE) {
      var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
      reIE.test(userAgent);
      var fIEVersion = parseFloat(RegExp["$1"]);
      if(fIEVersion == 7) {
        return "IE7";
      } else if(fIEVersion == 8) {
        return "IE8";
      } else if(fIEVersion == 9) {
        return "IE9";
      } else if(fIEVersion == 10) {
        return "IE10";
      } else if(fIEVersion == 11) {
        return "IE11";
      } else {
        return "0"
      } // IE版本过低  
    } // isIE end  
    if(isFF) {
      return "FF";
    }
    if(isOpera) {
      return "Opera";
    }
    if(isSafari) {
      return "Safari";
    }
    if(isChrome) {
      return "Chrome";
    }
    if(isEdge) {
      return "Edge";
    } else {
      return "-1" // 无法识别
    }
  },
  testPwd(val) {
    var reg = /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]]+$)[~!@#$%^&*()_+{}|:"<>?/*-.`\[';,/\]0-9A-Za-z]{8,20}$/;
    return reg.test(val)
  },
/** 
 * 串联加载指定的脚本
 * 串联加载[异步]逐个加载，每个加载完成后加载下一个
 * 全部加载完成后执行回调
 * @param array|string 指定的脚本们
 * @param function 成功后回调的函数
 * @return array 所有生成的脚本元素对象数组
 */
  seriesLoadScripts (scripts,callback) {
    if(typeof(scripts) != "object") var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement;
    var s = new Array(), last = scripts.length - 1, recursiveLoad = function(i) { //递归
      s[i] = document.createElement("script");
      s[i].setAttribute("type","text/javascript");
      s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
        if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
          this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this); 
          if(i != last) recursiveLoad(i + 1); else if(typeof(callback) == "function") callback();
        }
      }
      s[i].setAttribute("src",scripts[i]);
      HEAD.appendChild(s[i]);
    };
    recursiveLoad(0);
  },
/**
 * 并联加载指定的脚本
 * 并联加载[同步]同时加载，不管上个是否加载完成，直接加载全部
 * 全部加载完成后执行回调
 * @param array|string 指定的脚本们
 * @param function 成功后回调的函数
 * @return array 所有生成的脚本元素对象数组
 */
  parallelLoadScripts (scripts,callback) {
    if(typeof(scripts) != "object") var scripts = [scripts];
    var HEAD = document.getElementsByTagName("head").item(0) || document.documentElement, s = new Array(), loaded = 0;
    for(var i=0; i<scripts.length; i++) {
      s[i] = document.createElement("script");
      s[i].setAttribute("type","text/javascript");
      s[i].onload = s[i].onreadystatechange = function() { //Attach handlers for all browsers
        if(!/*@cc_on!@*/0 || this.readyState == "loaded" || this.readyState == "complete") {
          loaded++;
          this.onload = this.onreadystatechange = null; this.parentNode.removeChild(this); 
          if(loaded == scripts.length && typeof(callback) == "function") callback();
        }
      };
      s[i].setAttribute("src",scripts[i]);
      HEAD.appendChild(s[i]);
    }
  }
}
export default tools
