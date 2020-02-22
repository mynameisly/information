<template>
  <div class="menu-dir" @mouseenter="hovershow" @mouseleave="hoverhide">
    <!-- sidebar收缩hover效果 -->
    <transition name="fade-transform" mode="in-out">
      <div v-if="hover&&!sidebar.opened" class="hover-menu">
        <!-- title -->
        <div class="title">{{ item.name }}</div>
      </div>
    </transition>
    <!-- self -->
    <div class="menu-dir-h" @click="dirClick(item.id)">
      <!-- 一级菜单hover时左边框 -->
      <div class="hover-left"/>
      <span class="single-line">
        <i class="el-icon-menu" />
        <span v-show="sidebar.opened">{{ item.name }}</span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "MenuDir",
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      ulshow: false,
      hover: false
    };
  },
  computed: {
    ...mapGetters(["sidebar", "themeColor"])
  },

  methods: {
    hovershow() {
      this.hover = true;
    },
    hoverhide() {
      this.hover = false
    },
    dirClick(num) {
      this.ulshow = !this.ulshow;
    },

    ...mapActions("app/", ["toggleSideBar", "closeSideBar", "openSideBar"])
  }
};
</script>

<style lang="scss">
$hei: 2.6rem; //菜单高度e
$bg1:#33a0bb;
$bg2:rgb(228, 147, 26);
$bg3:rgb(76, 103, 136);
.menu-dir {
  .menu-dir-h {
    padding:0 0 0 1.5rem;
    height:41px;
    line-height: 41px;
    border-bottom:1px solid #f3f3f3;
    cursor: pointer;
    &:hover {
      background: rgb(245, 245, 245);
      color: black!important;
      .hover-left{
        // background:rgb(219, 68, 13) 
        background: #09C
      }
    }
    span{
      span{
        margin:0 6.2rem 0 .3rem
      }
      i:nth-child(3){
        font-size:.1rem;
        font-weight:bold
        }
    }
  }
  ul {
    list-style: none;
    background:#fcfcfc;
    margin:0;
    box-shadow: inset 0px 0px 6px 0 rgb(175, 175, 175);
    width:13.7rem;
    position:relative;
    left:-1px;
    top:-1px;
  }
}
.single-line{overflow: visible;}
.hover-menu{
  background:white;
  position:absolute;
  left:3.8rem;
  box-shadow:2px 0 5px 0 gray;
  z-index:200;
  div.title{
    height:41px;
    background:#f3f3f3;
    line-height:$hei;
    padding:0 0 0 1.5rem;
    color:balck;
  }
  ul{
    width:10rem;
    padding:0 0 0 .5rem;
    box-shadow:none;
    top:0px;
    left:0px;
    background:white;
    .single-line{
      padding:0 0 0 1rem;
    }
    div.hoverLeft,div.circle{display:none};
    div.menu-item{
      border-left:0;
    }
  }
}
</style>
