<template>
  <div class="home" :class="{ shipei: isBigScreen }" v-loading="isLoading">
    <p class="rule">选择证件照规格</p>
    <div class="flexwrap">
      <div class="flexitem">
        <div
          class="ruleitem"
          :class="{ activeRule: selIndex === idx }"
          v-for="(item, idx) in rule"
          :key="item.spec_id"
          @click="selRule(idx)"
        >
          <p class="name">{{ item.name }}</p>
          <p>{{ item.width_mm }}x{{ item.height_mm }} mm</p>
          <p>{{ item.width_px }}x{{ item.height_px }} px</p>
          <img
            v-show="selIndex === idx"
            src="@/assets/selected.png"
            class="selImg"
          />
        </div>
      </div>
      <el-button
        class="btn"
        type="primary"
        icon="el-icon-search"
        @click="enterSearch"
      >
        搜索更多证件照规格
      </el-button>
    </div>
    <div class="bottom">
      <div class="left" :class="{ leftActive: drophover }">
        <p class="bname">上传原图</p>
        <div ref="uploadimg" class="uploadimg" v-loading="importImgLoading">
          <img v-show="!imageUrl" src="@/assets/yuantu1.png" class="yuantu" />
          <img v-show="imageUrl" :src="imageUrl" class="datu" :class="{ 'nidaozhuan': orientation === 8, 'shundaozhuan': orientation ===6, 'daozhuang': orientation === 3 }" />
        </div>
        <label for="fileipt" class="impoetImgBtn daopng">
          导入图片
          <input
            ref="fileipt"
            id="fileipt"
            type="file"
            name="file"
            accept="image/*"
            style="display:none"
          />
        </label>
      </div>
      <div class="middle">
        <p class="bname">人像抠图</p>
        <div class="xiaoguo" v-loading="cutLoading">
          <p class="info" v-show="!cutUrl">
            导入照片后查看效果
          </p>
          <img v-show="cutUrl" :src="cutUrl" class="cutimg" />
        </div>
      </div>
      <div class="right">
        <p class="bname">生成证件照</p>
        <div class="rmiddel">
          <div class="rml">
            <div class="rmlt">
              <p class="rmlinfo" v-show="!defaultMeiyan">
                导入照片后查看效果
              </p>
              <!-- <img
                v-for="(item, index) in pic_wm_url_list"
                v-show="index === defaultColor && !needMeiyanBol && cutUrl"
                :src="item"
                :key="index"
                class="makeimg"
                @dblclick="bigpicFn(item)"
              /> -->
              <img
                :src="defaultMeiyan"
                class="makeimg"
                v-show="defaultMeiyan"
                @dblclick="bigpicFn(defaultMeiyan)"
              />
            </div>
            <el-popover placement="right" v-model="visible2">
              <img
                v-show="!currentPrint"
                src="@/assets/yuantu.png"
                class="cyPic"
              />
              <img v-show="currentPrint" :src="currentPrint" class="cyPic" />
              <p class="pbxg" slot="reference">点击查看排版效果</p>
            </el-popover>
            <div class="btngroup">
              <div
                class="rmrbtn impoetImgBtn"
                type="primary"
                @click="setPicType(1)"
              >
                保存证件照
              </div>
              <div
                class="rmrbtn rmrbtnb impoetImgBtn"
                type="primary"
                plain
                @click="setPicType(2)"
              >
                冲印证件照
              </div>
            </div>
          </div>
          <div class="rmr">
            <div class="colorflex">
              <p
                class="ball"
                :class="{
                  whiteCls: item.isWhite,
                  activeBall: defaultColor === idx
                }"
                v-for="(item, idx) in selcolor"
                :key="idx"
                @click="defaultColorFn(idx)"
                :style="{
                  backgroundImage:
                    'linear-gradient(' +
                    item.start_color +
                    ', ' +
                    item.enc_color +
                    ')'
                }"
              ></p>
              <div v-if="selcolor.length === 0" class="ballflex">
                <p
                  class="ball"
                  :class="{
                    whiteCls: item.isWhite,
                    activeBall: defaultColor === idx
                  }"
                  v-for="(item, idx) in defaultClr"
                  :key="item.color_name"
                  @click="defaultColorFn(idx)"
                  :style="{
                    backgroundImage:
                      'linear-gradient(' +
                      item.start_color +
                      ', ' +
                      item.enc_color +
                      ')'
                  }"
                ></p>
              </div>
            </div>
            <div class="blockgroup">
              <div class="block">
                <span class="demonstration">左眼</span>
                <el-slider @change="meiyan('lefteye_large')" :max="5" class="blockr" v-model="lefteye_large"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">右眼</span>
                <el-slider @change="meiyan('righteye_large')" :max="5" class="blockr" v-model="righteye_large"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">美瞳</span>
                <el-slider @change="meiyan('eyelift')" :max="5" class="blockr" v-model="eyelift"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">眉毛</span>
                <el-slider @change="meiyan('eyebrow')" :max="5" class="blockr" v-model="eyebrow"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">嘴巴</span>
                <el-slider @change="meiyan('lipcolor')" :max="5" class="blockr" v-model="lipcolor"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">美白</span>
                <el-slider @change="meiyan('skinwhite')" :max="5" class="blockr" v-model="skinwhite"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">磨皮</span>
                <el-slider @change="meiyan('skinsoft')" :max="5" class="blockr" v-model="skinsoft"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">瘦脸</span>
                <el-slider @change="meiyan('contour')" :max="5" class="blockr" v-model="contour"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">祛亮斑</span>
                <el-slider @change="meiyan('lightspot')" :max="5" class="blockr" v-model="lightspot"></el-slider>
              </div>
              <div class="block">
                <span class="demonstration">阴阳脸</span>
                <el-slider
                  @change="meiyan('remove_unbalancelight')"
                  :max="5"
                  class="blockr"
                  v-model="remove_unbalancelight"
                ></el-slider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <iframe ref="ifm" src="" frameborder="0" style="display:none"></iframe>
    <div ref="drophoverwrap" class="drophover" v-show="drophover"></div>
    <div class="totalLoadingwrap" v-show="totalLoading">
      <img src="@/assets/loading2.gif" class="totalLoading">
    </div>
    <el-dialog
      :visible.sync="dpwnloadPicVis"
      width="30%"
      center>
      <p class="xiaTitle" v-show="!needcost">本次保存无需消耗订单次数</p>
      <div  v-show="needcost">
        <p class="xiaTitle">本次{{downLoadType === 1 ? "保存" : "冲印"}}需要消耗一次订单次数</p>
        <span class="xiasy">保存后，剩余订单数为{{ rest_total - 1 }}单</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="xiaBtn" type="primary" @click="getPic">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import api from "@/api.js";
import JsZip from "jszip";
import hfile from "@/dataToFile.js";
import zhfs from "@/FileSaver.js";
import { Promise } from 'q';
import { setTimeout } from 'timers';

let keyName = "";
let resultpicname = "";
let meiyanCache = {};
let singleClick = true;
export default {
  name: "home",
  data() {
    return {
      needcost: true,
      dpwnloadPicVis: false,
      oprNum: {
        lefteye_large_num: 0,
        righteye_large_num: 0,
        eyelift_num: 0,
        eyebrow_num: 0,
        lipcolor_num: 0,
        skinwhite_num: 0,
        skinsoft_num: 0,
        contour_num: 0,
        lightspot_num: 0,
        remove_unbalancelight_num: 0
      },
      downLoadType: 1,
      orientation: 0,
      lefteye_large: 2,
      righteye_large: 2,
      eyelift: 2,
      eyebrow: 3,
      lipcolor: 3,
      skinwhite: 2,
      skinsoft: 2,
      contour: 2,
      lightspot: 1,
      remove_unbalancelight: 1,
      isLoading: false,
      importImgLoading: false,
      cutLoading: false,
      makeLoading: false,
      totalLoading: false,
      needMeiyanBol: false,
      visible2: false,
      value1: 20,
      imageUrl: "",
      cutUrl: "",
      pic_wm_url_list: [],
      print_pic_wm_url_list: [],
      pic_wm_name_list: [],
      initIndex: false,
      defaultColor: 0,
      drophover: false,
      defaultMeiyan: '',
      defaultClr: [
        {
          enc_color: "#438edb",
          color_name: "蓝",
          start_color: "#438edb",
          isWhite: false
        },
        {
          enc_color: "#ffffff",
          color_name: "白",
          start_color: "#ffffff",
          isWhite: true
        },
        {
          enc_color: "#ff0000",
          color_name: "红",
          start_color: "#ff0000",
          isWhite: false
        },
        {
          enc_color: "#ffffff",
          color_name: "渐变蓝",
          start_color: "#438edb",
          isWhite: false
        },
        {
          enc_color: "#ffffff",
          color_name: "渐变灰",
          start_color: "#666666",
          isWhite: false
        }
      ]
    };
  },
  computed: {
    ...mapState(["rule", "isBigScreen", "selIndex", "changeIndexBol", "rest_total", "used_total", "is_wx_login", "notEnough"]),
    currentPrint() {
      let print_pic_wm_url_list = this.print_pic_wm_url_list;
      if (this.print_pic_wm_url_list.length === 0) {
        return "";
      }
      return print_pic_wm_url_list[this.defaultColor];
    },
    selObj() {
      if (this.selIndex < 0) {
        return null;
      }
      return this.rule[this.selIndex];
    },
    selcolor() {
      if (!this.selObj) {
        return [];
      }
      let arr = JSON.parse(this.selObj.background_color);
      arr.map(item => {
        item.isWhite =
          item.enc_color === 16777215 && item.start_color === 16777215
            ? true
            : false;
        item.enc_color = "#" + item.enc_color.toString(16);
        item.start_color = "#" + item.start_color.toString(16);
      });
      return arr;
    }
  },
  watch: {
    changeIndexBol(val) {
      console.log(val);
      if (val) {
        this.setChangeIndexBol();
        this.selRule(this.selIndex);
      }
    },
    notEnough(num) {
      console.log("啦啦啦")
      console.log(num);
      if(num === 3){
        this.setNotEnough(1);
        this.setPicType(this.downLoadType);
      }
    }
  },
  created() {
    this.getRule();
    this.$nextTick(() => {
      this.changeIpt();
      this.dropfile();
    });
  },
  methods: {
    ...mapMutations(["setNotEnough", "setRule", "setSelIndex", "setChangeIndexBol", "setBigUrl", "setresttotal", "setusedtotal", "setchongzhiVisible", "setloginVisible"]),
    meiyan(mtype) {
      let ths = this;
      if (!ths.imageUrl) {
        ths.$alert("请上传原图，再进行美颜操作哦！","提示");
        return;
      }
      if (mtype) {
        ths.oprNum[`${mtype}_num`]++;
        console.log(ths.oprNum);
        api.setBeautiCount(keyName, this.lefteye_large, this.righteye_large, this.eyelift, this.eyebrow, this.lipcolor, this.skinwhite, this.skinsoft, this.contour, this.lightspot, this.remove_unbalancelight, this.oprNum);
      }
      let cacheKey = `${this.defaultColor}${this.lefteye_large}${this.righteye_large}${this.eyelift}${this.eyebrow}${this.lipcolor}${this.skinwhite}${this.skinsoft}${this.contour}${this.lightspot}${this.remove_unbalancelight}`;
      ths.totalLoading = true;
      if (meiyanCache[cacheKey]) {
        console.log("拿到了缓存");
        console.log(meiyanCache[cacheKey].pic_url);
        console.log(ths.defaultMeiyan);
        console.log(ths.defaultMeiyan===meiyanCache[cacheKey].pic_url);
        // ths.pic_wm_url_list[ths.defaultColor] = meiyanCache[cacheKey].pic_url;
        //ths.pic_wm_url_list.splice(ths.defaultColor, 1, meiyanCache[cacheKey].pic_url);
        ths.defaultMeiyan = meiyanCache[cacheKey].pic_url;
        resultpicname = meiyanCache[cacheKey].pic_name;
        ths.totalLoading = false;
        return;
      }
      return api.setbeauti(this.pic_wm_name_list[this.defaultColor], this.lefteye_large, this.righteye_large, this.eyelift, this.eyebrow, this.lipcolor, this.skinwhite, this.skinsoft, this.contour, this.lightspot, this.remove_unbalancelight)
         .then(res => {
           meiyanCache[cacheKey] = res.data;
           console.log("设置了缓存");
           console.log(meiyanCache);
          //  ths.pic_wm_url_list[ths.defaultColor] = res.data.pic_url;
          // ths.pic_wm_url_list.splice(ths.defaultColor, 1, res.data.pic_url);
           ths.defaultMeiyan = res.data.pic_url;
           resultpicname = res.data.pic_name;
           ths.totalLoading = false;
           hfile.urltobase64(res.data.pic_url).then(res=>{
             meiyanCache[cacheKey].pic_url=res;
           })
           return res;
         })
         .catch(() => {
           ths.totalLoading = false;
         })
    },
    bigpicFn(url) {
      this.setBigUrl(url);
      this.$router.push("/bigpic");
    },
    //判断是否需要立即调用美颜
    needmeiyan() {
      return this.lefteye_large > 0 ||
             this.righteye_large > 0 ||
             this.eyelift > 0 ||
             this.eyebrow > 0 ||
             this.lipcolor > 0 ||
             this.skinwhite > 0 ||
             this.skinsoft > 0 ||
             this.contour > 0 ||
             this.lightspot > 0 ||
             this.remove_unbalancelight > 0;
    },
    dropfile() {
      let uploadObj = document.getElementById("app");
      let wrapObj = this.$refs["drophoverwrap"];
      let ths = this;
      wrapObj.ondrop = function(e) {
        e.stopPropagation();
        e.preventDefault();
        ths.drophover = false;
        var files = event.dataTransfer.files || [];
        var length = files.length;
        if (length == 0) {
          ths.$message.error("没有文件");
          return;
        }
        if(!ths.is_wx_login){
          ths.$alert("请登录后再进行其他操作","提示", {
            confirmButtonText: '确定',
            callback: action => {
              ths.setloginVisible(true);
            }
          });
          return;
        }
        if (!/^image/.test(files[0].type)) {
          ths.$message.error("请上传图片");
          return;
        }
        ths.uploadingImgFn(files[0]);
      };
      uploadObj.ondragenter = function(e) {
        e.stopPropagation();
        e.preventDefault();
        ths.drophover = true;
      };
      uploadObj.ondragover = function(e) {
        e.stopPropagation();
        e.preventDefault();
      };
      wrapObj.ondragenter = function(e) {
        e.stopPropagation();
        e.preventDefault();
        ths.drophover = true;
      };
      wrapObj.ondragover = function(e) {
        e.stopPropagation();
        e.preventDefault();
      };
      wrapObj.ondragleave = function(e) {
        e.stopPropagation();
        e.preventDefault();
        ths.drophover = false;
      };
    },
    printpaiBan(obj) {
      let source = "iframe.html?img=" + encodeURIComponent(obj.print_typed_pic_url);
      this.$refs["ifm"].src = source;
    },
    setPicType (type) {
      //可能会出错以后检查
      let picname = this.pic_wm_name_list[this.defaultColor];
      console.log(this.is_wx_login);
      if(!this.is_wx_login){
        this.$alert("请登录后再进行其他操作","提示", {
          confirmButtonText: '确定',
          callback: action => {
            this.setloginVisible(true);
          }
        });
        return;
      }
      if (!picname && !this.cutUrl) {
        this.$alert("请上传图片再进行其他操作","提示");
        return;
      }
      this.downLoadType = Number(type);
      let obj = sessionStorage.getItem(keyName + this.selObj.spec_id) || null;
      if (obj) {
        this.needcost = false;
      } else {
        this.needcost = true;
        if (this.rest_total <= 0) {
          this.$alert("您的下载订单次数不足，请进行充值","提示", {
            confirmButtonText: '确定',
            callback: action => {
              this.setNotEnough(2);
              this.setchongzhiVisible(true);
            }
          });
          return;
        }
      }
      this.dpwnloadPicVis = true;
      singleClick = true;
    },
    getPic() {
      if(!singleClick){
        return;
      }
      singleClick = false;
      this.dpwnloadPicVis = false;
      let picname = !resultpicname ? this.pic_wm_name_list[this.defaultColor] : resultpicname;
      console.log(`picname:${picname}`);
      console.log(`makepng:${this.pic_wm_name_list[this.defaultColor]}`);
      picname = encodeURI(picname); // 转码以下，有中文
      this.totalLoading = true;
      // downloadPic
      api.getPic(picname, keyName).then(res => {
        console.log(res);
        let key = keyName + this.selObj.spec_id;
        sessionStorage.setItem(key, JSON.stringify(res.data.pic_urls));
        if(this.needcost){
          this.setresttotal(this.rest_total - 1);
          this.setusedtotal(this.used_total + 1);
        }
        this.handleDownloadFn(res.data.pic_urls);
        this.totalLoading = false;
      }).catch(() => {
        this.totalLoading = false;
      })
    },
    handleDownloadFn(obj) {
      //消耗一次订单次数
      if (this.downLoadType === 1) {
        //保存证件照
        this.downloadPic(obj);
      } else {
        //冲印照
        this.printpaiBan(obj);
      }
    },
    downloadPic(obj) {
      location.href=obj.zip_file_url;
      // var zip = new JsZip();
      // var folder = zip.folder(new Date().getTime());
      // let color = this.selcolor[this.defaultColor].color_name;
      // let rule = this.selObj.name;
      // let img1 = hfile.imageToBlob(obj.id_pic_url, folder, `${rule}-${color}.jpg`);
      // let img2 = hfile.imageToBlob(obj.print_typed_pic_url, folder, `${rule}-${color}-排版.jpg`);
      // let img3 = hfile.imageToBlob(obj.beautiful_url, folder, `${rule}-${color}-原始尺寸.jpg`);
      // let img4 = hfile.imageToBlob(obj.bg_pic_url, folder, `原图抠图.png`);
      // Promise.all([img1, img2, img3, img4])
      //   .then(() => {
      //     return zip.generateAsync({ type: "blob" });
      //   })
      //   .then(function(content) {
      //     // see FileSaver.js
      //     zhfs.saveAs(content, "91pitu.zip");
      //   })
      //   .catch(() => {
      //     console.log(12334555);
      //   });
    },
    defaultColorFn(idx) {
      this.defaultColor = idx;
      this.meiyan();
    },
    cutPicHttp() {
      let ths = this;
      // 原图抠图接口
      return api
        .cutPic(keyName)
        .then(cutres => {
          ths.cutUrl = cutres.data.bg_cut_pic_url;
          ths.initIndex = true;
          return cutres;
        })
    },
    makephotoHttp() {
      let ths = this;
      let speciId = ths.selObj.spec_id;
      resultpicname = "";
      // 制作图像接口
      return api
        .makePhoto(keyName, speciId)
        .then(makeres => {
          console.log(makeres);
          if (makeres.data.code !== 200) {
            return makeres;
          }
          let { pic_wm_url_list, print_pic_wm_url_list, pic_name_list } = makeres.data.result;
          ths.pic_wm_url_list = pic_wm_url_list;
          ths.print_pic_wm_url_list = print_pic_wm_url_list;
          ths.pic_wm_name_list = pic_name_list;
          ths.initIndex = true;
          //清空美颜操作计数
          ths.oprNum = {
            lefteye_large_num: 0,
            righteye_large_num: 0,
            eyelift_num: 0,
            eyebrow_num: 0,
            lipcolor_num: 0,
            skinwhite_num: 0,
            skinsoft_num: 0,
            contour_num: 0,
            lightspot_num: 0,
            remove_unbalancelight_num: 0
          };
          meiyanCache = {}; // 清空美颜缓存
          ths.initMeiyanCache(pic_wm_url_list, pic_name_list);
          console.log(`美颜缓存`);
          console.log(meiyanCache);
          ths.defaultMeiyan = pic_wm_url_list[0];
          return makeres;
        })
    },
    initMeiyanCache(url_list, name_list) {
      // 初始化美颜缓存
      url_list.forEach((item, index) => {
        let keyname = index+"0000000000";
        meiyanCache[keyname] = {
          pic_name: name_list[index],
          pic_url: item
        }
      });
    },
    twoMakePic() {
      this.totalLoading = true;
      let needMeiyan = this.needmeiyan();
      let makePro = null;
      let ths = this;
      if (needMeiyan) {
        ths.needMeiyanBol = true;
        makePro = this.makephotoHttp().then(res => {
          return this.meiyan();
        })
      } else {
        makePro = this.makephotoHttp();
      }
      return Promise.all([this.cutPicHttp(),makePro]).then(res => {
        console.log(res);
        this.totalLoading = false;
        ths.needMeiyanBol = false;
      }).catch(() => {
        this.totalLoading = false;
        ths.needMeiyanBol = false;
        meiyanCache = {}; //制作失败也清楚缓存
      })
    },
    uploadingImgFn(f) {
      let ths = this;
      let selIndex = ths.selIndex;
      var setselIndex = ths.initIndex ? -1 : selIndex;
      ths.setSelIndex(setselIndex);
      if (ths.importImgLoading) {
        this.$alert("请等待上次操作结束后再进行这次操作哦~", "提示");
        return;
      }
      ths.importImgLoading = true;
      // console.log(f);
      var formData = new FormData();
      formData.append("file", f);
      var reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          api
            .uploadPic(formData)
            .then(res => {
              console.log(res);
              ths.importImgLoading = false;
              ths.orientation = hfile.getOrientation(reader.result);
              ths.imageUrl = reader.result;
              ths.initIndex = true;
              keyName = res.data.key;
              console.log(ths.selIndex);
              if (ths.selIndex < 0) {
                ths.$alert("请选择好规格哦~", "提示");
                ths.cutUrl = "";
                ths.pic_wm_url_list = [];
                ths.defaultMeiyan = '';
                ths.print_pic_wm_url_list = [];
                ths.pic_wm_name_list = [];
                ths.importImgLoading = false;
                return;
              }
              ths.twoMakePic();
            })
            .catch(() => {
              ths.importImgLoading = false;
            });
        },
        false
      );
      if (f) {
        reader.readAsDataURL(f);
      }
    },
    changeIpt() {
      let ths = this;
      this.$refs["fileipt"].onchange = function() {
        var f = this.files[0];
        if (!f) {
          return;
        }
        if(!ths.is_wx_login){
          ths.$alert("请登录后再进行其他操作","提示", {
            confirmButtonText: '确定',
            callback: action => {
              ths.setloginVisible(true);
            }
          });
          this.value= "";
          return;
        }
        ths.uploadingImgFn(f);
      };
    },
    selRule(index) {
      this.setSelIndex(index);
      this.defaultColor = 0;
      if (this.initIndex) {
        this.initIndex = false;
        this.twoMakePic();
      }
      this.importImgLoading = "";
      this.pic_wm_url_list = [];
      this.defaultMeiyan = "";
      this.print_pic_wm_url_list = [];
      this.pic_wm_name_list = [];
      this.cutUrl = "";
    },
    enterSearch() {
      this.$router.push("/search");
    },
    getRule() {
      this.isLoading = true;
      api
        .getFixedRule()
        .then(res => {
          this.setRule(res.data.result);
          this.isLoading = false;
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    getUser() {
      api.getUser().then(res => {
        console.log(res);
      });
    }
  }
};
</script>

<style lang="less">
.el-slider__bar {
  height: 1px !important;
}
.el-slider__runway {
  height: 1px !important;
}
.el-slider__button-wrapper {
  height: 30px !important;
}
.el-slider__button {
  width: 9px !important;
  height: 9px !important;
  background-color: #4c84ff !important;
  border: none !important;
}
.el-slider__button-wrapper {
  top: -14px !important;
}
@media screen and(min-width: 1450px) and (max-width: 1736px) {
  .el-slider__bar {
    height: 2px !important;
  }
  .el-slider__runway {
    height: 2px !important;
  }
}
@media screen and (min-width: 1736px) and (max-width: 2120px) {
  .el-slider__button {
    width: 12px !important;
    height: 12px !important;
  }
  .el-slider__bar {
    height: 3px !important;
  }
  .el-slider__runway {
    height: 3px !important;
  }
}
@media screen and (min-width: 2120px){
  .el-slider__button {
    width: 12px !important;
    height: 12px !important;
  }
  .el-slider__bar {
    height: 3px !important;
  }
  .el-slider__runway {
    height: 3px !important;
  }
}
.nidaozhuan {
  transform: rotate(-90deg) scale(1.37);
}
.shundaozhuan {
  transform: rotate(90deg) scale(1.37);
}
.daozhuang {
  transform: rotate(180deg);
}
</style>

<style lang="less" scoped>
.line("oneline") {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.impoetImgBtn {
  &.daopng {
    width: 140px;
    height: 35px;
    line-height: 35px;
  }
  display: inline-block;
  vertical-align: sub;
  cursor: pointer;
  width: 89px;
  height: 26px;
  border-radius: 3px;
  background-color: #4c84ff;
  color: white;
  font-size: 12px;
  text-align: center;
  line-height: 26px;
  border: 1px solid transparent;
  box-sizing: border-box;
  &:hover {
    background-color: rgba(76, 132, 255, 0.6);
  }
}
.xiaTitle {
  font-size: 16px;
  color: #363636;
  letter-spacing: 1px;
  margin-bottom: 16px;
}
.xiasy {
  font-size: 14px;
}
.xiaBtn {
  width: 148px;
}
.totalLoadingwrap {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2002;
}
.totalLoading {
  width:180px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.home {
  width: 1100px;
  overflow: hidden;
  margin:0 auto;
  &.shipei {
    padding: 0 82px;
  }
  .drophover {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 1002;
  }
  .bottom {
    display: flex;
    font-size: 14px;
    justify-content: space-between;
    height: 408px;
    align-items: stretch;
    margin: 0 31px 70px 27px;
    .bname {
      font-size: 18px;
      font-weight: bold!important;
      color: #363636;
      letter-spacing: 1px;
      font-weight: 500;
      margin-bottom: 18px;
    }
    .common() {
      border-radius: 3px;
      box-shadow: 4px 3px 23px rgba(228, 238, 250, 0.7);
      background-color: white;
      box-sizing: border-box;
      padding-top: 18px;
      text-align: center;
      flex-shrink: 0;
    }
    .juzhong() {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .left {
      width: 248px;
      border: 2px solid transparent;
      &.leftActive {
        border-color: #4c84ff;
      }
      .common();
      .uploadimg {
        width: 200px;
        height: 274px;
        border: 1px solid #ededed;
        box-sizing: border-box;
        margin: 0 auto 30px;
        position: relative;
        border-radius: 1px;
        overflow: hidden;
        display: flex;
        .yuantu {
          width: 67px;
          display: block;
          pointer-events: none;
          .juzhong();
        }
        .datu {
          width: 100%;
          align-self: center;
          // height: 100%;
          object-fit: contain;
        }
      }
    }
    .xiaoguoCommon() {
      border-radius: 1px;
      width: 200px;
      height: 274px;
      box-sizing: border-box;
      border: 1px solid #ededed;
      position: relative;
      font-size: 12px;
      color: #9e9e9e;
    }
    .middle {
      width: 248px;
      .common();
      .xiaoguo {
        .cutimg {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .xiaoguoCommon();
        margin: 0 auto;
        .info {
          .juzhong();
          width: 100%;
        }
      }
    }
    .right {
      width: 510px;
      .common();
      .rmiddel {
        display: flex;
        padding: 0 44px;
        justify-content: space-between;
        .rml {
          flex-shrink: 0;
          .btngroup {
            font-size: 10px;
            .rmrbtn {
              &.rmrbtnb {
                margin-left: 10px;
                background-color: white;
                box-sizing: border-box;
                border: 1px solid;
                color: #4c84ff;
                &:hover {
                  background-color: rgba(76, 132, 255, 0.6);
                  color: white;
                }
              }
            }
          }
          .rmlt {
            .xiaoguoCommon();
            .makeimg {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .rmlinfo {
              .juzhong();
              width: 100%;
            }
          }
          .pbxg {
            display: inline-block;
            font-size: 12px;
            color: #4c84ff;
            margin-top: 11px;
            margin-bottom: 15px;
            text-align: center;
            outline: none;
            cursor: pointer;
          }
        }
        .rmr {
          margin-left: 43px;
          flex-shrink: 0;
          width: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          .colorflex {
            display: flex;
            flex-shrink: 0;
            justify-content: center;
            .ballflex {
              display: flex;
              flex-shrink: 0;
              justify-content: center;
            }
            .ball {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              box-sizing: border-box;
              padding: 2px;
              margin-right: 13px;
              flex-shrink: 0;
              cursor: pointer;
              &.whiteCls {
                border: 1px solid #d4d4d4;
              }
              &.activeBall {
                border: 1px solid #438ed9;
                background-clip: content-box;
              }
            }
          }
          .blockgroup {
            flex-grow: 1;
            .block {
              margin-right: 30px;
              height: 32px;
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #363636;
              .demonstration {
                display: inline-block;
                flex-shrink: 0;
                text-align: right;
                font-size: 15px;
                color: #4a4a4a;
                width: 45px;
                margin-right: 15px;
              }
              .blockr {
                flex-grow: 1;
              }
            }
          }
        }
      }
    }
  }
  .rule {
    font-size: 18px;
    font-weight: bold;
    color: #363636;
    margin: 40px 0 18px 32px;
  }
  .flexwrap {
    display: flex;
    height: 56px;
    width: 100%;
    align-items: stretch;
    justify-content: space-between;
    margin-bottom: 10px;
    .btn {
      flex-shrink: 0;
      margin-right: 32px;
    }
    .flexitem {
      display: flex;
      flex-grow: 1;
      margin-right: 10px;
      margin-left: 32px;
      justify-content: space-between;
      .ruleitem {
        background-color: white;
        font-size: 8px;
        color: #363636;
        border-radius: 3px;
        width: 94px;
        position: relative;
        box-shadow: 4px 3px 21px rgba(228, 238, 250, 0.7);
        text-align: center;
        box-sizing: border-box;
        display: flex;
        align-content: center;
        flex-wrap: wrap;
        justify-content: center;
        box-sizing: border-box;
        border: 2px solid transparent;
        padding: 2px;
        cursor: pointer;
        &.activeRule {
          border-color: #4c84ff;
        }
        .selImg {
          width: 20px;
          position: absolute;
          bottom: -2px;
          right: -2px;
        }
        .name {
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          flex-basis: 100%;
          .line("oneline");
        }
        p {
          flex-basis: 100%;
        }
      }
    }
  }
}
.cyPic {
  width: 132px;
  height: 90px;
}
@media screen and (min-width: 1450px) and (max-width: 1736px) {
  #app {
    overflow-x: hidden;
  }
  .impoetImgBtn {
    &.daopng {
      width: 150px;
    }
    width: 100px;
    height: 34px;
    line-height: 34px;
  }
  .home {
    width: 1250px;
    .rule {
      font-size: 18px;
      margin: 28px 0 16px 27px;
    }
    .flexwrap {
      height: 70px;
      margin-bottom: 16px;
      .btn {
        margin-right: 30px;
      }
      .flexitem {
        margin-left: 27px;
        .ruleitem {
          font-size: 10px;
          width: 115px;
          .name {
            font-size: 12px;
          }
          .selImg {
            width: 25px;
          }
        }
      }
    }
    .bottom {
      height: 468px;
      margin: 0 27px 54px;
      .bname {
        font-size: 18px;
        margin-bottom: 22px;
      }
      .left {
        width: 291px;
        padding-top: 18px;
        .uploadimg {
          width: 229px;
          height: 314px;
          margin: 0 auto 36px;
          .yuantu {
            width: 78px;
            pointer-events: none;
          }
        }
      }
      .middle {
        width: 291px;
        .xiaoguo {
          width: 229px;
          height: 314px;
        }
      }
      .right {
        width: 585px;
        .rmiddel {
          .rmr {
            width: 257px;
            .colorflex {
              margin-left: 34px;
              margin-right: 69px;
              .ball {
                width: 23px;
                height: 23px;
                margin-right: 15px;
              }
            }
            .blockgroup {
              .block {
                height: 38px;
                margin-right: 60px;
                .demonstration {
                  font-size: 15px;
                  width: 48px;
                }
              }
            }
          }
          .rml {
            .rmlt {
              width: 229px;
              height: 314px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 1736px) and (max-width: 2120px) {
  #app {
    overflow-x: hidden;
  }
  .impoetImgBtn {
    &.daopng {
      width: 170px;
    }
    width: 110px;
    height: 40px;
    line-height: 40px;
  }
  .home {
    width: 1536px;
    .rule {
      font-size: 20px;
      margin: 32px 0 25px 67px;
    }
    .flexwrap {
      height: 82px;
      margin-bottom: 16px;
      .btn {
        margin-right: 67px;
      }
      .flexitem {
        margin-left: 67px;
        .ruleitem {
          font-size: 12px;
          width: 135px;
          .name {
            font-size: 14px;
          }
          .selImg {
            width: 25px;
          }
        }
      }
    }
    .bottom {
      height: 551px;
      margin: 0 67px 30px;
      .bname {
        font-size: 20px;
        margin-bottom: 30px;
      }
      .left {
        width: 343px;
        padding-top: 20px;
        .uploadimg {
          width: 270px;
          height: 370px;
          margin: 0 auto 45px;
          .yuantu {
            width: 78px;
            pointer-events: none;
          }
        }
      }
      .middle {
        width: 343px;
        .xiaoguo {
          width: 270px;
          height: 370px;
        }
      }
      .right {
        width: 688px;
        .rmiddel {
          .rmr {
            width: 330px;
            .colorflex {
              margin-left: 34px;
              margin-right: 96px;
              .ball {
                width: 31px;
                height: 31px;
                margin-right: 19px;
              }
            }
            .blockgroup {
              .block {
                height: 42px;
                margin-right: 60px;
                .demonstration {
                  font-size: 16px;
                  width: 48px;
                }
              }
            }
          }
          .rml {
            .rmlt {
              width: 270px;
              height: 371px;
            }
          }
        }
      }
    }
  }
}
@media screen and (min-width: 2120px) {
  .impoetImgBtn {
    &.daopng {
      width: 180px;
    }
    height: 40px;
    line-height: 40px;
    width: 120px;
  }
  .home {
    width: 1920px;
    .rule {
      font-size: 20px;
      margin: 67px 0 25px 82px;
    }
    .flexwrap {
      height: 82px;
      .btn {
        margin-right: 82px;
        width: 270px;
      }
      .flexitem {
        margin-left: 82px;
        .ruleitem {
          font-size: 12px;
          width: 169px;
          .name {
            font-size: 14px;
          }
          .selImg {
            width: 25px;
          }
        }
      }
    }
    .bottom {
      height: 690px;
      margin: 0 82px 69px;
      .bname {
        font-size: 20px;
        margin-bottom: 28px;
      }
      .left {
        width: 430px;
        padding-top: 32px;
        .uploadimg {
          width: 338px;
          height: 464px;
          margin: 0 auto 50px;
          .yuantu {
            width: 79px;
            pointer-events: none;
          }
        }
      }
      .middle {
        width: 430px;
        .xiaoguo {
          width: 338px;
          height: 464px;
        }
      }
      .right {
        width: 860px;
        .rmiddel {
          .rmr {
            width: 420px;
            .colorflex {
              .ball {
                width: 36px;
                height: 36px;
                margin-right: 22px;
              }
            }
            .blockgroup {
              .block {
                height: 54px;
                margin-right: 60px;
                .demonstration {
                  font-size: 18px;
                  width: 54px;
                }
              }
            }
          }
          .rml {
            .pbxg {
              margin-top: 20px;
              margin-bottom: 34px;
            }
            .rmlt {
              width: 338px;
              height: 464px;
            }
          }
        }
      }
    }
  }
}
</style>
