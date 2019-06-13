import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    rule: [],
    isBigScreen: false,
    wechatCode: "",
    alipayCode: "",
    selIndex: 0, // 默认尺寸
    changeIndexBol: false, //用来处理更多规格出双击选中规格首页有原图就开始调制作接口
    bigUrl: "", //放大图片连接
    rest_total: 0,
    used_total: 0,
    chongzhiVisible: false,
    is_wx_login: false,
    loginVisible: false,
    notEnough: 1, // 是不是点击下载不够次数显示的充值页面1为够的正常的2为不够3为充值成功
  },
  mutations: {
    setNotEnough(state, num) {
      state.notEnough = num;
    },
    setloginVisible(state, bol) {
      state.loginVisible = bol;
    },
    setLogin(state, bol) {
      state.is_wx_login = bol;
    },
    setresttotal(state, num) {
      state.rest_total = num;
    },
    setchongzhiVisible(state, bol) {
      state.chongzhiVisible = bol;
    },
    setusedtotal(state, num) {
      state.used_total = num;
    },
    setSelIndex(state, index) {
      state.selIndex = index;
    },
    setBigUrl(state, url) {
      state.bigUrl = url;
    },
    setCode(state, arr) {
      state.wechatCode = arr[0];
      state.alipayCode = arr[1];
    },
    setBigScreen(state, bol) {
      state.isBigScreen = bol;
    },
    setRule(state, arr) {
      state.rule = arr;
    },
    setChangeIndexBol(state) {
      state.changeIndexBol = false;
    },
    changeRule(state, obj) {
      let rule = state.rule;
      for (var i = 0, len = rule.length; i < len; i++) {
        if (rule[i].spec_id === obj.spec_id) {
          break;
        }
      }
      if (i === rule.length) {
        rule.splice(5, 0, obj);
        rule.pop();
        state.rule = rule;
        state.selIndex = 5;
      } else {
        state.selIndex = i;
      }
      state.changeIndexBol = true;
    }
  },
  actions: {}
});
