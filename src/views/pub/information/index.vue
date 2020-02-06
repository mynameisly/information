<template>
  <div id="information">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户名:">
            <el-input v-model="searchForm.number" placeholder="请输入用户名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="昵称:">
            <el-input v-model="searchForm.nickName" placeholder="请输入昵称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别:">
            <el-select v-model="searchForm.sex" placeholder="请输入性别" clearable>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col  :span="6">
          <el-form-item label="真实姓名:">
            <el-input v-model="searchForm.readName" placeholder="请输入真实姓名" clearable/>
          </el-form-item>
        </el-col>
        <el-col  :span="6">
          <el-form-item label="起始-生日:">
            <el-date-picker
                clearable
                v-model="searchForm.startBirthday"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入起始-生日"
              />
          </el-form-item>
        </el-col>
        <el-col  :span="8">
          <el-form-item label="结束-生日:">
            <el-date-picker
                clearable
                v-model="searchForm.endBirthday"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入结束-生日"
              />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getUserList(searchForm)">查询成绩</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- <el-button type="warning" size="mini" @click="$refs.addDialog.open(null)">新增</el-button> -->
    <!-- el-table中的height用于固定表头 -->
    <el-table border stripe :data="userList" height="250" @cell-mouse-enter="mouseEnter">
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
      <el-table-column label="隶属角色" prop="depict"/> <!-- 是否需要重新写一个dialog -->
      <el-table-column label="操作" prop="operation" width="150">
        <el-button
          type="primary"
          size="mini"
          @click="$refs.updateDialog.open(uploadData)">
          修改
        </el-button>
        <el-button
          type="danger"
          size="mini"
          @click="del">
          删除
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增文件" @confirmData="(item) => add(item)" />
    <update-dialog ref="updateDialog" title="修改文件" @confirmData="(item) => update(item)" />
  </div>
</template>

<script>
import AddDialog from './add'
import UpdateDialog from './add'
// import { getUserList, getSearchUserList, getUserListById,setUserRoleById, updateUser, deleteUser} from '@/api/information'
export default {
  components: {
    AddDialog,
    UpdateDialog
  },
  data () {
    return {
      uploadData: {},
      searchForm: [
        {
          number: '',
          nickName: '',
          sex: '',
          readName: '',
          startBirthday: '',
          endBirthday: '',
        }
      ],
      userList: [
        {
          number: '假数据1',
          headImg: '假数据2',
          nickName: '假数据3',
          readName: '假数据4',
          sex: '假数据5',
          birthday: '假数据6',
          telPhone: '假数据7',
          email: '假数据8',
          weiXin: '假数据9',
          qq: '假数据10',
          depict: '假数据11',
        }
      ]
    }
  },
  mounted () {
    this.userList = res.data
    this.getUserList();
  },
  methods: {
    getUserList () {
    //   this.$ajax.get('/json/login/direct?number=' + number + '&password=' + password)
    //     .then(res => {
    //       console.log('获取用户学籍信息成功');
    //       console.log(res);
    //       console.log(res.data);
    //     })
    },
    mouseEnter (data) {
      this.uploadData = Object.assign({}, data);
    },
    del () {

    }
  }
}
</script>

<style lang="scss">
  
</style>