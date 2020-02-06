<template>
  <div class="subheader-bom">
    <breadcrumb class="breadcrumb-container" />
    <div class="bom-icon">
      <div @click="toggleSideBar">
        <i :class="{'el-icon-s-fold':sidebar.opened,'el-icon-s-unfold':!sidebar.opened}" />
      </div>
      <div @click="getFullScreen">
        <i class="el-icon-rank" />
      </div>
    </div>
  </div>
</template>
<script>
import Breadcrumb from '@/components/Breadcrumb'
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Breadcrumb
  },
  data () {
    return {
      n: 0
    }
  },
  computed: {
    ...mapGetters(["sidebar"])
  },
  methods: {
    // 全屏显示
    getFullScreen () {
      this.n++;
      this.n % 2 === 0
        ? this.exitFullScreen(document) : this.inFullScreen(document.documentElement)
    },
    // 全屏显示
    inFullScreen (element) {
      const el = element;
      const rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
        el.mozRequestFullScreen || el.msRequestFullScreen;
      if (typeof rfs !== "undefined" && rfs) {
        rfs.call(el);
      } else if (typeof window.ActiveXObject !== "undefined") {
        const wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    // 取消全屏
    exitFullScreen () {
      var el = document;
      var cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen;
      // typeof cfs != "undefined" && cfs
      if (cfs) {
        cfs.call(el);
      } else if (typeof window.ActiveXObject !== "undefined") {
        // for IE，这里和fullScreen相同，模拟按下F11键退出全屏
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
          wscript.SendKeys("{F11}");
        }
      }
    },
    ...mapActions("app/", ["toggleSideBar", "closeSideBar", "openSideBar"])
  }
}
</script>
<style lang="scss">
.subheader-bom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 2.6rem;
  border-bottom: 1px solid #e5e5e5;
  // 左边内阴影阴影效果
  box-shadow: inset 20px 0px 20px -20px rgba(0, 0, 0, 0.3);
  background: white;
  div.bom-icon {
    display: flex;
    align-items: center;
    justify-content: space-between;
    > div {
      width: 2.5rem;
      height: 2.5rem;
      margin: 0 1.6rem;
      font-size: 1.6rem;
      color: rgb(182, 182, 182);
      line-height: 2.5rem;
      text-align: center;
      cursor: pointer;
      &:hover {
        box-shadow: 0px 0px 6px 1px rgb(160, 160, 160);
        color: #e0620d;
      }
    }
    > div:first-child {
      border-bottom: 4px solid #0dc0e0;
    }
    > div:nth-child(2) {
      border-bottom: 4px solid #e0af0d;
    }
    > div:nth-child(3) {
      margin-right: 2rem;
      border-bottom: 4px solid #e0620d;
    }
  }
}
</style>
