<template>
  <div id="paywrap">
    <div class="pricewrap flexwrap">
      <div class="moneywrap">
        <p class="dczf">单次支付</p>
        <div class="price" :class="{ activePrice: priceIndex === 3 }" @click="selPrice(3)">
          <p class="money">
            <span class="totalmoney">3</span>元1单
          </p>
          <span class="zhekou">5元/单</span>
          <span class="tejia">特价3元/单</span>
          <img v-show="priceIndex === 3" src="@/assets/selected.png" class="duigou" />
          <img src="@/assets/tehui.png" class="tehui" />
        </div>
      </div>
      <div class="moneywrap">
        <p class="dczf zxcz">在线充值</p>
        <div class="price mr32" :class="{ activePrice: priceIndex === 1 }" @click="selPrice(1)">
          <p class="money">
            <span class="totalmoney">100</span>元100单
          </p>
          <span class="zhekou">3元/单</span>
          <span class="tejia">特价1元/单</span>
          <img v-show="priceIndex === 1" src="@/assets/selected.png" class="duigou" />
          <img src="@/assets/tehui.png" class="tehui" />
        </div>
        <div class="price" :class="{ activePrice: priceIndex === 2 }" @click="selPrice(2)">
          <p class="money">
            <span class="totalmoney">1000</span>元1000单
          </p>
          <span class="zhekou">3元/单</span>
          <span class="tejia">特价1元/单</span>
          <img v-show="priceIndex === 2" src="@/assets/selected.png" class="duigou" />
          <img src="@/assets/tehui.png" class="tehui" />
        </div>
      </div>
    </div>
    <p class="yfje">应付金额：<span>{{ totalMoney }}元</span></p>
    <div class="payway flexwrap">
        <div class="paylist">
            <div id="wechatPay" ref="wechatPay">
              <img :src="wechatCode" class="erweima" />
            </div>
            <img src="@/assets/wechat.png" class="wayimg" />
        </div>
        <div class="paylist">
            <div id="aliPay" ref="aliPay">
              <img :src="alipayCode" class="erweima" />
            </div>
            <img src="@/assets/alipay.png" class="wayimg" />
        </div>
    </div>
    <div class="shuoming">
        支付说明：
        <p>1、保存证件照，可以获得证件照片两张（含大图证件照和所选规格证件照），六寸排版照片一张和精细人像抠图一张。共计四张图片。</p>
        <p>2、证件照制作：完成一次制作证件照流程并保存证件照会消耗一次订单次数，仅更改颜色和美颜参数后再次保存不再额外消耗订单次数。</p>
        <p>3、重新上传图片或更改规格后，证件照片会重新制作，保存证件照需消耗一次订单。</p>
        <p>4、每次保存证件照时，均有弹窗提示是否消耗订单次数。</p>
        <p>5、单次支付证件照制作基础价格为5元/单，充值后证件照制作基础价格为3元/单。</p>
        <p>6、所有资费不含税，如需开具发票，请联系客服。开具6%的增值税专用发票，税额由充值方承担。</p>
        <p>7、本产品已经提供预览图片，证件照产品为个性化服务。一经付款概不退还。91PITU项目组感谢各位新老客户的支持。</p>
        <p>8、客服电话：13174060927，客服微信请添加微信号：LEQIPITU</p>
        <p style="text-align:center"><a target="_blank" href="https://91pitu.com/">无锡乐骐科技有限公司</a>拥有91pitu软件在法律范围内的最终解释权。</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: 'payment',
  props: ["priceIndex"],
  computed: {
    ...mapState(["wechatCode", "alipayCode"]),
    totalMoney() {
      let tm = this.priceIndex === 1 ? 100 : this.priceIndex === 2 ? 1000 : 3;
      return tm;
    }
  },
  methods: {
    selPrice: function(index) {
      this.$emit("selprice", index);
    }
  }
}
</script>

<style lang="less" scoped>
.flexwrap {
  display: flex;
}
.pricewrap {
  justify-content: space-between;
  .moneywrap {
    background-color: #f5f5f5;
    border-radius: 12px;
    padding: 16px 32px;
    &:last-child {
      margin-right: 17px;
      width: 508px;
      .price {
        float: left;
      }
    }
    &:first-child {
      margin-left: 27px;
    }
    .dczf {
      font-size: 14px;
      color: #4a4a4a;
      position: relative;
      line-height: initial;
      margin-bottom: 19px;
      &::before,
      &::after {
        display: inline-block;
        opacity: 0.4;
        content: "";
        width: 72px;
        height: 1px;
        background-color: #979797;
        vertical-align: middle;
      }
      &::before {
        margin-right: 19px;
      }
      &::after {
        margin-left: 19px;
      }
    }
    .zxcz {
      &::before,
      &::after {
        width: 207px;
      }
    }
  }
  .price {
    width: 238px;
    background-color: white;
    height: 89px;
    border-radius: 3px;
    box-sizing: border-box;
    border: 2px solid #c4d4f7;
    line-height: initial;
    padding-top: 20px;
    position: relative;
    cursor: pointer;
    &.mr32 {
      margin-right: 32px;
    }
    &.activePrice {
      border-color: #4c84ff;
    }
    .money {
      font-size: 16px;
      color:  #4c84ff;
      .totalmoney {
        font-size: 30px;
      }
    }
    .zhekou {
      color: #9e9e9e;
      font-size: 12px;
      text-decoration: line-through;
      margin-right: 5px;
    }
    .tejia {
      font-size: 12px;
      color: #fe4242;
    }
    .tehui {
        width: 68px;
        position: absolute;
        right: 0;
        top: 4px;
    }
    .duigou {
        width: 28px;
        position: absolute;
        right: -2px;
        bottom: -2px;
    }
  }
}
.yfje {
    margin-top: 16px;
    font-size: 12px;
    color: #363636;
    span {
        color: #FE4242;
        font-size: 20px;
    }
}
.payway {
    padding: 0 280px;
    justify-content: space-between;
    #wechatPay,
    #aliPay {
        width: 150px;
        height: 150px;
        border: 1px solid #67c239;
    }
    #aliPay {
        border-color: #1aaceb;
    }
    .erweima {
      width: 100%;
    }
}
.shuoming {
    font-size: 12px;
    color: #9e9e9e;
    letter-spacing: 1px;
    line-height: 22px;
    text-align: left;
    display: inline-block;
    p {
        text-indent: -1.7em;
        margin-left: 1.7em;
    }
}
</style>

