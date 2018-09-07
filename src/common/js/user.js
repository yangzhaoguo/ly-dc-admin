import axios from 'axios';
import {Loading} from 'element-ui';

const debug = true;
const baseUrl = 'http://ope.lingyi365.com:5608/cloud/';

//获取用户token
export const GetUserToken = () => {
  if (debug) {
    return "WZ8azGAUy5a-djIY8SxaBlqe*-384BCCqRXD-JFMOriFx-rPcZ5KrQ..";
  } else {
    return getUrlParams('token');
  }
};
//获取用户ID
export const GetUserID = () => {
  if (debug) {
    return "57a0136259242e1cd867f28e";
  } else {
    return browser().GetUserID();
  }
};
//ajax请求;地址,请求方式,提交数据,回调函数,超时时间（默认30秒）,请求时loading...(默认弹出)
export const ajax = (url = '', type = 'POST', data = {}, retCallback, timeout = 30000, loadingShow = true) => {
  type = type.toUpperCase();
  let opaction = {
    method: type,
    url: baseUrl + url,
    timeout: timeout,
    headers: {
      Authentication: GetUserToken()
    }
  };
  if (type === 'POST') {
    opaction.data = data;
  } else if (type === 'GET') {
    opaction.params = data;
  }
  showLoad();
  axios(opaction).then((response) => {
    closeLoad();
    retCallback(response.data);
  }, () => {
    alert('请求失败');
    closeLoad();
  });

  function showLoad() {
    if (loadingShow) {
      Loading.service({lock: true, text: 'Loading...'});
    }
  }

  function closeLoad() {
    if (loadingShow) {
      Loading.service({}).close();
    }
  }
};

// 获取当前时间
export const getNowFormatDate = function () {
  let date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month = date.getMonth() + 1;

  function addZero(strDate) {
    if (strDate >= 0 && strDate <= 9) {
      return "0" + strDate;
    }
    return strDate;
  }

  let currentdates = `${date.getFullYear()}${seperator1}${addZero(month)}${seperator1}${addZero(date.getDate())}  ${addZero(date.getHours())}${seperator2}${addZero(date.getMinutes())}${seperator2}${addZero(date.getSeconds())}`;
  return currentdates;
};

//获取url 参数
export function getUrlParams(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //定义正则表达式
  var r = window.location.search.substr(1).match(reg);
  if (r !== null) {
    return unescape(r[2]);
  } else {
    alert('请配置token');
  }
  return null;
}

//去除字符串两边空格
export function Trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}
