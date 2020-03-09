<template>
  <div class="col-nowrap" style="height:100%">
    <cus-header />
    <div class="flex-1 row-nowrap">
      <cus-sidebar />
      <!-- content -->
      <div class="flex-1">
        <cus-sub-header />
        <keep-alive>
          <transition name="fade-transform" mode="out-in">
            <router-view class="dashboard" />
          </transition>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import CusHeader from '@/nav/header'
import CusSubHeader from '@/nav/subheader'
import CusSidebar from '@/nav/slidebar'
export default {
  components: {
    CusHeader,
    CusSubHeader,
    CusSidebar
  }
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
.dashboard {
  height: 92vh;
  overflow-x: hidden;
  margin: 10px;
  background: #fff;
  @include scrollBar(4px);
}
.container{
  // margin:.6% auto;
  width:100%;
  height:96%;
  max-width:100%;
  overflow-y: hidden;
  overflow-x: hidden;
  @include scrollBar(7px);
  box-shadow: 0px 0px 6px rgb(182, 182, 182);
  background:white;
  }
</style>
