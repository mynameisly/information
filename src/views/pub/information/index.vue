<template>
  <div id="information">
    <!-- el-table中的height用于固定表头 -->
    <el-table border stripe :data="infoList" height="250">
      <!-- <el-table-column label="序号" type="index" width="55"/> -->
      <el-table-column label="用户名" prop="number"/>
      <el-table-column label="头像" prop="headImg">
        <template slot-scope="scope">
          <img :src="scope.row.headImg" alt="用户头像" width="30" height="30">
        </template>
      </el-table-column>
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
      <el-table-column label="操作" prop="operation" width="100">
        <el-button
          type="info"
          size="mini"
          icon="el-icon-edit-outline"
          @click="updatePwd">
          修改密码
        </el-button>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Information',
  data () {
    return {
      infoList: [{}]
    }
  },
  mounted () {
    this.infoList[0].number = sessionStorage.getItem('number')
    this.infoList[0].headImg = sessionStorage.getItem('headImg')
    this.infoList[0].nickName = sessionStorage.getItem('nickName')
    this.infoList[0].readName = sessionStorage.getItem('readName')
    this.infoList[0].sex = sessionStorage.getItem('sex')
    this.infoList[0].birthday = sessionStorage.getItem('birthday')
    this.infoList[0].telPhone = sessionStorage.getItem('telPhone')
    this.infoList[0].email = sessionStorage.getItem('email')
    this.infoList[0].weiXin = sessionStorage.getItem('weiXin')
    this.infoList[0].qq = sessionStorage.getItem('qq')
    this.infoList[0].introduce = sessionStorage.getItem('introduce')
    this.infoList[0].depict = sessionStorage.getItem('depict')
  },
  methods: {
    updatePwd () { // 修改密码
      this.$router.push({name: 'updatePwd'})
    }
  }
}
</script>

<style lang="scss">

</style>
