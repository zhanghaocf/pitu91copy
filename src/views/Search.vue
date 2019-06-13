<template>
  <div class="search">
    <i class="el-icon-close" @click="closeSearch"></i>
    <div
      v-show="showSearch"
      @click="showSearch = false"
      class="whitemask"
    ></div>
    <div class="searchWrap">
      <input
        type="text"
        class="ipt"
        v-model="kw"
        ref="searchIpt"
        placeholder="输入证件照规格名称或尺寸，例如“一寸”或“413”"
      />
      <div class="searcIcon" @click="searchFn">
        <i class="el-icon-search"></i>
      </div>
      <div class="kwwrap" v-show="showSearch" v-loading="searchLoading">
        <div class="noinfo" v-show="searchList.length === 0 && !searchLoading">
          <img src="@/assets/yuantu.png" class="noimg" />
          <p>没有找到您想要的规格</p>
        </div>
        <div
          class="kwlist"
          v-for="(item, index) in searchList"
          :class="{ activeCls: aslIndex === index }"
          :key="item.spec_id"
          @click="setActiveIndex(index)"
          @dblclick="okFn"
        >
          <p class="kwname" :title="item.name">{{ item.name }}</p>
          <p class="mr10">{{ item.width_px }}x{{ item.height_px }} px</p>
          <p class="mr10">{{ item.width_mm }}x{{ item.height_mm }} mm</p>
          <p
            :title="item.file_size_max | changsize"
            v-if="item.file_size_min && item.file_size_max"
          >
            {{ item.file_size_min | changsize }}-
            {{ item.file_size_max | changsize }}KB
          </p>
          <p
            :title="item.file_size_min | changsize"
            v-if="item.file_size_min && !item.file_size_max"
          >
            不小于{{ item.file_size_min | changsize }}KB
          </p>
          <p
            :title="item.file_size_max | changsize"
            v-if="!item.file_size_min && item.file_size_max"
          >
            {{ item.file_size_max | changsize }}KB以下
          </p>
          <p v-if="!item.file_size_max && !item.file_size_min"></p>
        </div>
      </div>
    </div>
    <div class="muluwrap" v-loading="isLoading">
      <div class="mulu" v-for="item in listClassify" :key="item">
        <p class="muluname">{{ item | getClassifyName }}</p>
        <div class="classifyWrap">
          <div
            class="classifyItem"
            v-for="(classify, cidx) in list[item]"
            :class="{ activeCls: cidx + item === aslIndex }"
            :key="classify.spec_id"
            @click="setActiveIndex(cidx, item)"
            @dblclick="okFn"
          >
            <p :title="classify.name" class="classifyname">
              {{ classify.name }}
            </p>
            <div class="itemrule">
              <p :title="classify.width_px + 'x' + classify.height_px + 'px'">
                {{ classify.width_px }}x{{ classify.height_px }}px
              </p>
              <p :title="classify.width_mm + 'x' + classify.height_mm + 'mm'">
                {{ classify.width_mm }}x{{ classify.height_mm }}mm
              </p>
              <p
                :title="classify.file_size_max | changsize"
                v-if="classify.file_size_min && classify.file_size_max"
              >
                {{ classify.file_size_min | changsize }}-
                {{ classify.file_size_max | changsize }}KB
              </p>
              <p
                :title="classify.file_size_min | changsize"
                v-if="classify.file_size_min && !classify.file_size_max"
              >
                不小于{{ classify.file_size_min | changsize }}KB
              </p>
              <p
                :title="classify.file_size_max | changsize"
                v-if="!classify.file_size_min && classify.file_size_max"
              >
                {{ classify.file_size_max | changsize }}KB以下
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-button type="primary" class="okBtn" @click="okFn">确定</el-button>
  </div>
</template>

<script>
import api from "@/api.js";
import { mapMutations } from "vuex";
let selectedResult = null;
export default {
  name: "search",
  data() {
    return {
      isLoading: false,
      searchLoading: false,
      showSearch: false,
      kw: "",
      list: null,
      listClassify: [],
      searchList: [],
      aslIndex: "" // 选中的索引
    };
  },
  mounted() {
    this.$refs["searchIpt"].onkeydown = e => {
      let event = e || window.event;
      event.keyCode === 13 && this.searchFn();
    };
  },
  deactivated() {
    this.aslIndex = "";
    selectedResult = null;
    this.kw = "";
    this.showSearch = false;
  },
  methods: {
    ...mapMutations(["changeRule"]),
    setActiveIndex(index, parentName) {
      let suoyin = index;
      if (parentName) {
        suoyin += parentName;
      }
      this.aslIndex = suoyin;
    },
    okFn() {
      let index = this.aslIndex;
      if (index === "") {
        return;
      }
      if (typeof index === "number") {
        // 搜索列表选中的
        selectedResult = this.searchList[index];
      } else {
        let resultArr = index.match(/^\d+/);
        let sidx = Number(resultArr[0]); // 大类里小类的索引
        let classifyname = index.replace(new RegExp("^" + sidx), "");
        selectedResult = this.list[classifyname][sidx];
      }
      this.changeRule(selectedResult);
      this.$router.back();
    },
    closeSearch() {
      this.$router.back();
    },
    searchFn() {
      let kw = this.kw;
      if (kw === "") {
        return;
      }
      this.showSearch = true;
      this.searchLoading = true;
      api
        .searchKw(kw)
        .then(res => {
          console.log(res);
          this.searchList = res.data.result;
          this.searchLoading = false;
        })
        .catch(() => {
          this.searchLoading = false;
        });
    }
  },
  created() {
    this.isLoading = true;
    api
      .getSpecsClass()
      .then(res => {
        let result = res.data.result;
        console.log(result);
        this.list = result;
        this.listClassify = Object.keys(result);
        this.isLoading = false;
      })
      .catch(() => {
        this.isLoading = false;
      });
  },
  filters: {
    getClassifyName(val) {
      let obj = {
        standard_specs: "标准证件类",
        school_specs: "新生入学类",
        identify_specs: "身份证件类",
        visa_specs: "签证类",
        exam_specs: "考试报名类"
      };
      return obj[val];
    },
    changsize(val) {
      return Math.floor(val / 1024);
    }
  }
};
</script>

<style lang="less" scoped>
.activeCls {
  background-color: #4c84ff !important;
  color: white !important;
}
.line("oneline") {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.line(@count) {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: @count;
}
.search {
  width: 1100px;
  margin: 14px auto 0;
  font-size: 14px;
  .el-icon-close {
    font-size: 28px;
    color: #4c84ff;
    cursor: pointer;
  }
  .okBtn {
    width: 148px;
    text-align: center;
    font-size: 16px;
    background-color: #4c84ff;
    color: white;
    display: block;
    cursor: pointer;
    margin: 28px auto;
    position: relative;
    z-index: 1;
  }
  .muluwrap {
    display: flex;
    min-height: 390px;
    justify-content: space-between;
    width: 1100px;
    margin:0 auto;
    .mulu {
      overflow: hidden;
      border-radius: 5px;
      font-size: 16px;
      color: #2764eb;
      letter-spacing: 1px;
      box-shadow: 0 7px 7px rgba(224, 123, 203, 0.21);
      width: 210px;
      &:last-child {
        margin-right: 0;
      }
      .muluname {
        height: 42px;
        line-height: 42px;
        text-align: center;
        background-color: #c5d7ff;
      }
      .classifyWrap {
        height: 348px;
        overflow-x: hidden;
        overflow-y: auto;
        text-align: center;
        background-color: white;
        .classifyItem {
          overflow: hidden;
          align-items: center;
          padding: 16px 0 4px;
          border-bottom: 1px solid #b0bee0;
          cursor: pointer;
          &:hover {
            outline: 2px solid #4c84ff;
            outline-offset: -2px;
          }
          .classifyname {
            .line("oneline");
          }
          .itemrule {
            margin-top: 12px;
            font-size: 10px;
            color: #b0bee0;
            letter-spacing: 1px;
            display: flex;
            overflow: hidden;
            justify-content: space-around;
            p {
              .line("oneline");
            }
          }
        }
      }
    }
  }
  .whitemask {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.8);
    left: 0;
    top: 0;
  }
  .searchWrap {
    width: 480px;
    margin: 0 auto 48px;
    box-sizing: border-box;
    display: flex;
    height: 35px;
    align-items: stretch;
    position: relative;
    z-index: 2;
    .kwwrap {
      position: absolute;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 430px;
      background-color: white;
      box-shadow: 0 3px 12px #cddcfe;
      top: 45px;
      border-radius: 3px;
      overflow-x: hidden;
      .noinfo {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        .noimg {
          width: 240px;
        }
      }
      .kwlist {
        display: flex;
        height: 50px;
        align-items: center;
        font-size: 12px;
        color: #363636;
        border-bottom: 1px solid #c3d6ff;
        p {
          flex-shrink: 0;
          width: 80px;
        }
        &:hover {
          background-color: #e4ecff;
        }
        .kwname {
          font-size: 16px;
          flex-grow: 1;
          .line(1);
          flex-basis: 96px;
          margin-left: 19px;
          margin-right: 30px;
        }
        .mr10 {
          margin-right: 12px;
        }
      }
    }
    .ipt {
      flex-grow: 1;
      border: 2px solid #4c84ff;
      outline: none;
      box-sizing: border-box;
      padding-left: 1em;
      border-top-left-radius: 3px;
      border-bottom-left-radius: 3px;
      &:focus {
        border-color: rgba(76, 132, 255, 0.7);
      }
    }
    .searcIcon {
      width: 35px;
      background-color: #4c84ff;
      font-size: 16px;
      color: white;
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      border-top-right-radius: 3px;
      border-bottom-right-radius: 3px;
      cursor: pointer;
      &:hover {
        background-color: rgba(76, 132, 255, 0.7);
      }
    }
  }
}
@media screen and (min-width: 1736px) {
  .search{
    width:1536px;
    .okBtn {
      width: 181px;
      height: 42px;
    }
    .searchWrap {
      width: 520px;
      height: 43px;
      .ipt {
        font-size: 18px;
      }
      .searcIcon {
        width: 42px;
      }
      .kwwrap {
        .kwlist {
          height: 59px;
          font-size: 15px;
          .kwname {
            font-size: 16px;
          }
        }
      }
    }
    .muluwrap {
      width:1536px;
      justify-content: center;
      .mulu {
        width: 264px;
        margin-right: 23px;
        &:last-child {
          margin-right: 0;
        }
        .muluname {
          height: 56px;
          line-height: 56px;
          font-size: 22px;
        }
        .classifyWrap {
          height: 468px;
          .classifyItem {
            padding: 22px 0 8px;
            .classifyname {
              font-size: 20px;
            }
            .itemrule {
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
