<template>
  <el-container id="app">
    <el-header class="headwrap">
      <div class="head">
        <img src="@/assets/logo.png" class="logo" />
        <el-popover
          v-if="is_wx_login"
          placement="bottom"
          width="178"
          v-model="visible"
        >
          <div class="txtcenter">
            <p>已使用订单次数：{{ used_total }}次</p>
            <p class="shengyu">剩余订单次数：{{ rest_total }}次</p>
            <el-button type="primary" size="mini" @click="openChongzhi">
              充值
            </el-button>
          </div>
          <div slot="reference" class="hright">
            <img :src="personInfo.head_img_url" class="headImg" />
            <p class="nickname">{{ personInfo.nickname }}</p>
            <i class="el-icon-caret-bottom"></i>
          </div>
        </el-popover>
        <div v-if="!is_wx_login" class="hright" @click="login">
          <img src="@/assets/defaultImg.png" class="headImg" />
          <p class="nickname">登录</p>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dialog
          :visible.sync="chongzhiVisible"
          width="966px"
          :before-close="closepay"
        >
          <pay
            v-loading="qrcodeloading"
            :priceIndex="payType"
            @selprice="selPrice"
          ></pay>
        </el-dialog>
      </div>
    </el-header>
    <el-main>
      <keep-alive>
        <router-view />
      </keep-alive>
      <el-dialog
        title="提示"
        :visible.sync="centerDialogVisible"
        width="450px"
        center
      >
        <span>{{ errmess }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="handleMess">
            确 定
          </el-button>
        </span>
      </el-dialog>
      <el-dialog
        :visible.sync="loginVisible"
        width="350px"
        :show-close="false"
        center
        v-loading="loginlogining"
        :before-close="closels"
      >
        <div style="min-height : 380px">
          <wxlogin
            class="wxlogin"
            v-if="!loginlogining && loginVisible"
            :appid="wx_param.appid"
            :self_redirect="true"
            :scope="wx_param.scope"
            :redirect_uri="wx_param.redirect_uri"
            state="is_web"
            :theme="wx_param.style"
          ></wxlogin>
        </div>
      </el-dialog>
    </el-main>
    <el-footer class="footer">
      <el-dialog :show-close="false" class="outerwrap" width="400px" title="" :visible.sync="outerVisible">
        <el-dialog
          class="innerwrap"
          width="400px"
          title="提示"
          center
          :visible.sync="innerVisible"
          append-to-body>
          <span class="fzcg">{{copyMes}}</span>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="innerVisible = false">确定</el-button>
          </div>
        </el-dialog>
        <p class="uwtitle">以下链接已复制链接至剪切版内可以分享给您的朋友</p>
        <div class="uwwebsite">
          91PITU官方网站
          <span class="uwspan">
            https://www.91pitu.com
          </span>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="outerVisible = false">取 消</el-button>
          <el-button class="copybtn" type="primary" @click="copyFn">复制链接</el-button>
        </div>
      </el-dialog>
      <div class="footp">
        ©2019 Leqi Inc. All Rights Reserved
        <p class="optgroup" @click="outerVisible = true" >推荐给好友</p>
        <el-popover
          class="optgroup"
          placement="top"
          title=""
          width="232"
          trigger="click">
          <p class="jfbz">计费标准：</p>
          <p class="jfbz">完成一次制作证件照流程并保存证件照会消耗一次订单（支付一次费用），仅更改颜色和美颜参数后再次保存不再额外消耗订单（也无需额外支付费用）。</p>
          <p class="jfbz">重新上传图片或更改规格后，证件照片会重新制作，保存证件照需消耗一次订单。</p>
          <p slot="reference">计费标准</p>
        </el-popover>
        <el-popover
          class="optgroup"
          placement="top"
          title=""
          width="164"
          trigger="click">
          <img class="ewm" src="@/assets/ewm.jpg" />
          <p slot="reference">微信客服</p>
        </el-popover>
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import axios from "axios";
import api from "@/api.js";
import wxlogin from "vue-wxlogin";
import pay from "@/components/pay.vue";
import { setTimeout, clearTimeout } from "timers";
import { mapMutations, mapState } from "vuex";
import Clipboard from 'clipboard';
let stopHeart = true;
let erdcode = 0;
let timer = null;
export default {
  data() {
    return {
      outerVisible: false,
      innerVisible: false,
      visible: false,
      centerDialogVisible: false,
      loginlogining: false,
      errmess: "",
      wx_param: null,
      personInfo: null,
      qrcodeloading: false,
      payType: 1, // 默认为100元
      wechatObj: null,
      alipayObj: null,
      copyMes: ''
    };
  },
  components: {
    wxlogin,
    pay
  },
  computed: {
    ...mapState(["rest_total", "used_total", "chongzhiVisible", "is_wx_login", "loginVisible", "notEnough"])
  },
  watch: {
    chongzhiVisible(bol) {
      bol && this.getQrcode();
    },
    loginVisible(bol) {
      if (bol) {
        this.loginlogining = true;
        api.wechatLogin().then(res => {
          console.log(res);
          this.wx_param = res.data.qr_code_data;
          console.log(this.wx_param);
          this.loginlogining = false;
        });
      }
    },
    visible(bol) {
      //如果为true调用获取用户信息接口
      bol && this.getUser();
    }
  },
  methods: {
    ...mapMutations(["setBigScreen", "setCode", "setresttotal", "setusedtotal", "setchongzhiVisible", "setLogin", "setloginVisible", "setNotEnough"]),
    copyFn() {
      let cotent = "https://www.91pitu.com";
      let ths = this;
      var clipboard = new Clipboard('.copybtn', {
            text: function() {
                return cotent;
            }
        });
        clipboard.on('success', e => {
          ths.copyMes = "复制成功！";
          ths.innerVisible = true;
          // 释放内存
          clipboard.destroy();
        })
        clipboard.on('error', e => {
          // 不支持复制
          ths.copyMes = "该浏览器不支持自动复制!";
          ths.innerVisible = true;
          // 释放内存
          clipboard.destroy();
        })
    },
    handleMess() {
      erdcode === 450 && this.setloginVisible(true);
      this.centerDialogVisible = false;
    },
    openChongzhi() {
      this.payType = 1;
      this.setchongzhiVisible(true);
    },
    selPrice(index) {
      this.payType = index;
      this.getQrcode();
    },
    closepay() {
      console.log("弹窗关闭了");
      stopHeart = true;
      this.setchongzhiVisible(false);
    },
    closels() {
      this.setloginVisible(false);
    },
    heartSureOrder() {
        if(stopHeart){
          return;
        }
        let woid = this.wechatObj.order_id;
        let aoid = this.alipayObj.order_id;
        let ths = this;
        let count = ths.payType === 1 ? 100 : ths.payType === 2 ? 1000 : 1;
        api
          .sureChong(woid, aoid)
          .then(res => {
            let bol = res.some((item)=>{
              return item.code === 200;
            })
            console.log(bol);
            if (bol) {
              //确认支付成功
              ths.setchongzhiVisible(false);
              let rt = ths.rest_total + count;
              console.log(ths.rest_total)
              console.log(count);
              console.log(rt)
              ths.setresttotal(rt);
              ths.notEnough === 2 && ths.setNotEnough(3);
              stopHeart = true;
            } else {
              timer = setTimeout(() => {
                this.heartSureOrder();
              }, 1000)
            }
          })
          .catch((err) => {
            stopHeart = true;
            this.$alert('支付出错', '提示', {
              confirmButtonText: '确定'
            });
            // console.log("来啊老弟");
            // console.log(err);
            
          });
      
    },
    getQrcode() {
      this.qrcodeloading = true;
      stopHeart = true; 
      clearTimeout(timer); // 清除计时器
      return api
        .getQrcode(this.payType)
        .then(res => {
          // console.log(res);
          let wo = res[0].data;
          let ao = res[1].data;
          this.wechatObj = wo;
          this.alipayObj = ao;
          this.qrcodeloading = false;
          let wqrcode = "data:image/png;base64," + wo.qrcode;
          let aqrcode = "data:image/png;base64," + ao.qrcode;
          this.setCode([wqrcode, aqrcode]);
          stopHeart = false;
          this.heartSureOrder(); // 添加心跳包测试支付
        })
        .catch(() => {
          this.qrcodeloading = false;
        });
    },
    getUser() {
      api
        .getUser()
        .then(res => {
          console.log(res);
          this.setLogin(res.data.is_wx_login);
          this.personInfo = res.data;
          this.setresttotal(res.data.rest_total);
          this.setusedtotal(res.data.used_total);
        })
        .catch(err => {
          this.setLogin(err.is_wx_login);
        });
    },
    login() {
      this.setloginVisible(true);
    }
    // setHtmlFootsize() {
    //   let screenWidth = document.documentElement.clientWidth;
    //   let chu = screenWidth > 1600 ? 1300 : 1100;
    //   if (screenWidth > 1600) {
    //     this.setBigScreen(true);
    //   } else {
    //     this.setBigScreen(false);
    //   }
    //   let fontsize = screenWidth / chu *100;
    //   fontsize = fontsize < 100 ? 100 : fontsize;
    //   document.documentElement.style.fontSize = fontsize+"px";
    // },
    // throttle(fn) {
    //   let timer = "";
    //   return () => {
    //     if (timer) {
    //       return;
    //     }
    //     timer = setTimeout(() => {
    //       fn();
    //       timer = "";
    //     },500)
    //   }
    // }
  },
  created() {
    let ths = this;
    // ths.$nextTick(() => {
    //   ths.setHtmlFootsize();
    //   let throttleFn = ths.throttle(ths.setHtmlFootsize);
    //   window.onresize = function() {
    //     throttleFn();
    //   }
    // })
    axios.interceptors.request.use(
      config => {
        config["withCredentials"] = true;
        config["timeout"] = 1000*60*2;
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      function(response) {
        let erd = response.data;
        switch (erd.code) {
          case 507:
            ths.errmess = erd.result;
            ths.centerDialogVisible = true;
            break;
        }
        // 对响应数据做点什么
        return response;
      },
      function(error) {
        let erd = error.response.data;
        erdcode = erd.code;
        // console.log(erdcode)
        switch (erdcode) {
          case 410:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
            break;
          case 420:
            ths.errmess = "参数错误";
            ths.centerDialogVisible = true;
            break;
          case 430:
            ths.errmess = "参数过期";
            ths.centerDialogVisible = true;
            break;
          case 440:
            ths.errmess = "参数对应的数据不存在";
            ths.centerDialogVisible = true;
            break;
          case 450:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
            break;
          case 507:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
            break;
          case 510:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
          break;
          case 520:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
          break;
          // case 530:
          //   ths.errmess = "数据类型转换提示";
          //   ths.centerDialogVisible = true;
          // break;
          case 540:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
          // break;
          case 550:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
          break;
          // case 610:
          //   ths.errmess = "微信登录提示";
          //   ths.centerDialogVisible = true;
          // break;
          // case 620:
          //   ths.errmess = "微信支付提示";
          //   ths.centerDialogVisible = true;
          // break;
          // case 630:
          //   ths.errmess = "支付宝支付提示";
          //   ths.centerDialogVisible = true;
          // break;
          case 640:
            ths.errmess = erd.msg;
            ths.centerDialogVisible = true;
            break;
          case 650:
            ths.errmess = "oss存储提示";
            ths.centerDialogVisible = true;
          break;
        }
        // 对响应错误做点什么
        return Promise.reject(erd);
      }
    );
    ths.getUser();
  }
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  user-select: none;
}
html,
body {
  height: 100%;
}
.el-dialog {
  position: absolute!important;
  margin: 0!important;
  left:50%!important;
  top:50%!important;
  transform: translate(-50%,-50%)!important;
}
.innerwrap .el-dialog__body {
  padding-top: 0!important;
  padding-bottom: 0!important;
}
.outerwrap .el-dialog__body {
  padding-top: 0!important;
  padding-bottom: 0!important;
}
.el-main {
  padding: 0 !important;
  overflow-x: hidden!important;
  // margin: 0 auto !important;
}
.el-dialog__body {
  text-align: center !important;
}
.line("oneline") {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.maxmin(@minw,@maxw) {
  min-width: @minw;
  max-width: @maxw;
}
.maxmin(@minw) {
  min-width: @minw;
}
#app {
  min-height: 100%;
  background-color: #f5f6fa;
  overflow-x: hidden;
  position: relative;
  .maxmin(1100px);
  .headwrap {
    background-color: #ffffff;
    height: 50px!important;
    line-height: 50px;
    box-shadow: 0 2px 4px rgba(226, 226, 226, 0.5);
  }
  .head {
    width: 1000px;
    height: 50px;
    margin:0 auto;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .logo {
      width: 129px;
    }
    .hright {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 130px;
      font-size: 14px;
      color: #363636;
      letter-spacing: 1px;
      overflow: hidden;
      cursor: pointer;
      .headImg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }
      .nickname {
        .line("oneline");
        margin-left: 5px;
      }
      i {
        flex-shrink: 0;
      }
    }
  }
  .footer {
    background-color: #ffffff;
    line-height: 50px;
    height: 50px!important;
    font-size: 12px;
    color: #9e9e9e;
    letter-spacing: 1px;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    .footp {
      width: 1000px;
      margin: 0 auto;
    }
  }
}
@media screen and (min-width: 1450px) and (max-width: 1736px) {
  #app {
  .headwrap {
      height: 50px!important;
    }
    .head {
      height: 50px;
      width: 1250px;
    }
    .footer {
      height: 50px!important;
      line-height: 50px!important;
      .footp {
        width: 1250px;
      }
    }
  }
}
@media screen and (min-width: 1736px) and (max-width: 2120px) {
  #app {
  .headwrap {
      height: 60px!important;
    }
    .head {
      height: 60px;
      width: 1436px;
    }
    .footer {
      .footp {
        width: 1436px;
      }
    }
  }
}
@media screen and (min-width: 2120px) {
  #app {
  .headwrap {
      height: 60px!important;
    }
    .head {
      height: 60px;
      width: 1820px;
    }
    .footer {
      .footp {
        width: 1820px;
      }
    }
  }
}
</style>
<style lang="less" scoped>
.txtcenter {
  text-align: center;
  font-size: 12px;
  color: #363636;
  letter-spacing: 1px;
  .shengyu {
    margin: 3px 0 12px;
  }
}
.optgroup {
  float: right;
  cursor: pointer;
  font-size: 12px;
  color: #9E9E9E;
  margin-left: 48px;
  &:hover {
    color: #4C84FF;
  }
}
.ewm {
  width: 100%;
}
.jfbz {
  font-size: 10px;
  color: #363636;
  text-indent: 2em;
  &:first-child {
    text-indent: 0;
  }
}
.fzcg {
  font-size: 18px;
}
.uwtitle {
  color: #363636;
  font-size: 14px;
  line-height: initial;
}
.uwwebsite {
  font-size: 10px;
  color: #9E9E9E;
  height: 35px;
  line-height: 35px;
  background-color: #EEF4FF;
  border-radius: 2px;
  margin-top: 24px;
  text-align: left;
  box-sizing: border-box;
  padding-left: 8px;
  user-select: auto;
}
.uwspan {
  font-size: 12px;
  color: #363636;
  margin-left: 25px;
}
</style>
