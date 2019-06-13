<template>
    <div class="bigwrap">
        <div class="bigpic">
            <i class="el-icon-close" @click="closeSearch"></i>
            <img :src="bigUrl" class="tupian" />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
export default {
    name: "bigpic",
    computed: {
        ...mapState(["bigUrl"])
    },
    methods: {
      closeSearch() {
        this.$router.back();
      }
    }
}
</script>

<style lang="less" scoped>
.bigwrap {
    width: 100%;
    height: 100%;
}
.bigpic {
    text-align: right;
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
}
.el-icon-close {
    font-size: 28px;
    color: #4c84ff;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: -28px;
}
.tupian {
    height: 80vh;
    display: block;
}
</style>



