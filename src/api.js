import axios from "axios";
//let domain = "http://101.132.226.216:8300";
let domain = "https://91pitu.com";
// 规格分类获取
function getSpecsClass() {
  return axios.get(domain + "/pc_client/specs_class");
}

// 规格搜索（输入关键字）
function searchKw(kw) {
  return axios.get(domain + "/pc_client/search_specs?keyword=" + kw);
}

// 首页固定规格展示
function getFixedRule() {
  return axios.get(domain + "/pc_client/get_specs");
}

// 首次请求（获取已登录用户的头像信息）
function getUser() {
  return axios.get(domain + "/web_client/get_user");
}

// 网站内嵌二维码微信登录
function wechatLogin() {
  return axios.get(domain + "/web_client/weichat_login_data");
}

// 充值接口（生成二维码）
function getQrcode(feeType) {
  let wechat = axios.get(
    domain + "/web_client/get_qrcode?pay_type=0&fee_type=" + feeType
  );
  let alipay = axios.get(
    domain + "/web_client/get_qrcode?pay_type=1&fee_type=" + feeType
  );
  return Promise.all([wechat, alipay]);
}

// 充值确认接口
function sureChong(woid, aoid) {
  let wotest = axios.get(
    // domain + "/pc_client/payment_confirm/" + woid + "?pay_type=0"
    domain + "/web_client/payment_confirm/" + woid + "?pay_type=0"
  ).then(res => {
    return res.data;
  })
  let aotest = axios.get(
    // domain + "/pc_client/payment_confirm/" + aoid + "?pay_type=1"
    domain + "/web_client/payment_confirm/" + aoid + "?pay_type=1"
  ).then(res => {
    return res.data;
  })
  return Promise.all([wotest, aotest]);
}

//图片上传
function uploadPic(data) {
  return axios.post(domain + "/web_client/upload_pic", data);
}

//原图抠图制作
function cutPic(key) {
  return axios.get(domain + "/pc_client/bg_cut_pic?key=" + key + "&is_web=1");
}

//证件照制作
function makePhoto(key, specid) {
  return axios.get(
    domain + "/web_client/cut_pic?key=" + key + "&spec_id=" + specid
  );
}
function setBeautiCount(keyname, lefteye_large, righteye_large, eyelift, eyebrow, lipcolor, skinwhite, skinsoft, contour, lightspot, remove_unbalancelight, oprnum) {
  let url =`${domain}/web_client/record_beautiful_data?key=${keyname}&lefteye_large=${lefteye_large}&righteye_large=${righteye_large}&eyelift=${eyelift}&eyebrow=${eyebrow}&lipcolor=${lipcolor}&skinwhite=${skinwhite}&skinsoft=${skinsoft}&contour=${contour}&lightspot=${lightspot}&remove_unbalancelight=${remove_unbalancelight}`;
  Object.keys(oprnum).forEach(item=>{
    url+=`&${item}=${oprnum[item]}`;
  })
  return axios.get(
    url
  );
}
//图片美颜
function setbeauti(picname, lefteye_large, righteye_large, eyelift, eyebrow, lipcolor, skinwhite, skinsoft, contour, lightspot, remove_unbalancelight) {
  let url =`${domain}/web_client/set_beautiful?pic_name=${picname}&lefteye_large=${lefteye_large}&righteye_large=${righteye_large}&eyelift=${eyelift}&eyebrow=${eyebrow}&lipcolor=${lipcolor}&skinwhite=${skinwhite}&skinsoft=${skinsoft}&contour=${contour}&lightspot=${lightspot}&remove_unbalancelight=${remove_unbalancelight}`;
  return axios.get(
    url
  );
}

//图片获取
function getPic(picname, key) {
  return axios.get(`${domain}/web_client/get_pic?pic_name=${picname}&key=${key}`);
}

export default {
  getSpecsClass: getSpecsClass,
  searchKw: searchKw,
  getFixedRule: getFixedRule,
  getUser: getUser,
  wechatLogin: wechatLogin,
  getQrcode: getQrcode,
  sureChong: sureChong,
  uploadPic: uploadPic,
  cutPic: cutPic,
  makePhoto: makePhoto,
  setbeauti: setbeauti,
  setBeautiCount: setBeautiCount,
  getPic: getPic
};
