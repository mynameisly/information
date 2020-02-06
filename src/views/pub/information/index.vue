<template>
  <div id="information">
    <!-- el-table中的height用于固定表头 -->
    <el-table border stripe :data="infoList" height="250" @cell-mouse-enter="mouseEnter">
      <el-table-column label="序号" type="index" width="55"/>
      <el-table-column label="用户名" prop="number"/>
      <el-table-column label="头像" prop="headImg"/>
      <el-table-column label="昵称" prop="nickName"/>
      <el-table-column label="真实姓名" prop="readName"/>
      <el-table-column label="性别" prop="sex"/>
      <el-table-column label="出生日期" prop="birthday"/>
      <el-table-column label="手机号码" prop="telPhone"/>
      <el-table-column label="邮箱" prop="email"/>
      <el-table-column label="微信" prop="weiXin"/>
      <el-table-column label="QQ" prop="qq"/>
      <el-table-column label="简介" prop="introduce"/>
      <el-table-column label="隶属角色" prop="depict"/>
      <!-- 是否需要重新写一个dialog -->
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Information',
  data () {
    return {
      infoList: []
    }
  },
  mounted () {
    this.infoList[0] = this.$route.params.infoList.data
    this.infoList[0].depict = this.$route.params.infoList.data.role.depict
  },
  methods: {
  }
}
</script>

<style lang="scss">

</style>
