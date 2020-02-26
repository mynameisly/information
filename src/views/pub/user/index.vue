<template>
  <div id="information">
    <!-- <el-form v-model="searchUserForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="用户名/昵称:">
            <el-input v-model="searchUserForm.searchStr" placeholder="请输入用户名或昵称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-form-item>
            <el-button type="success" size="medium" icon="el-icon-search" @click="searchUser(searchUserForm)">模糊搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->

    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="用户名:">
            <el-input v-model="searchForm.number" placeholder="请输入用户名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="昵称:">
            <el-input v-model="searchForm.nickName" placeholder="请输入昵称" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="性别:">
            <el-select v-model="searchForm.sex" placeholder="请输入性别" clearable>
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
      <el-row>
        <el-col  :span="7" :offset="1">
          <el-form-item label="真实姓名:">
            <el-input v-model="searchForm.readName" placeholder="请输入真实姓名" clearable/>
          </el-form-item>
        </el-col>
        <el-col  :span="7">
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
        <el-col  :span="7">
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
        <el-col :span="2">
          <el-form-item>
            <el-button type="success" size="medium" icon="el-icon-search" @click="getUserList(searchForm)">查询用户</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- <el-button type="warning" size="mini" @click="$refs.addDialog.open(null)">新增</el-button> -->
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      stripe
      :data="userList"
      height="65%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
      >
      <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- （当前页 - 1）* 这页显示条数 + 序号 + 1-->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }} </span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" prop="operation" width="240">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="$refs.updateDialog.open(userData)">
          修改
        </el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="del">
          删除
        </el-button>
        <el-button
            type="warning"
            icon="el-icon-setting"
            @click="$refs.roleDialog.open(userData)"
          >设置角色</el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增用户" @confirmData="(item) => add(item)" />
    <update-dialog ref="updateDialog" title="修改用户" @confirmData="(item) => update(item)" />
    <RoleDialog ref="roleDialog" />
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './modify'
import UpdateDialog from './modify'
import axios from 'axios'
import RoleDialog from './role-dialog'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog,
    UpdateDialog,
    RoleDialog
  },
  data () {
    return {
      loading: false,
      headUrl: [], // 保存头像
      // searchUserForm: [ // 模糊搜索
      //   {
      //     searchStr: '' // 账号或昵称
      //   }
      // ],
      searchForm: [ // 精确搜索
        {
          number: '',
          nickName: '',
          sex: '',
          readName: '',
          startBirthday: '',
          endBirthday: '',
        }
      ],
      userData: {}, // 保存鼠标悬停的当前行的数据
      userList: [],
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 总条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getUserList()
  },
  methods: {
    mouseEnter (data) {
      this.userData = Object.assign({}, data)
    },
    // searchUser () { // 可输入账号、昵称模糊搜索
    //   axios.get('/json/user/search?searchStr=' + this.searchUserForm.searchStr).then((res) => {
    //     this.userList = res.data.data
    //   })
    // },
    getUserList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      axios.get(('/json/user/list'), {
        params: {
          limit: 10,
          number: this.searchForm.number,
          nickName: this.searchForm.nickName,
          sex: this.searchForm.sex,
          readName: this.searchForm.readName,
          startBirthday: this.searchForm.startBirthday,
          endBirthday: this.searchForm.endBirthday
        }
      }).then((res) => {
        if (res.data.msg === '无权限') {
          this.$router.push({path: '/401'})
        }
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.userList = this.handleHeadImg(res.data.data)
        // console.log('进入到查询所有数据')
        // console.log(res.data.data)
        this.loading = false
      })
    },
    handleHeadImg (data) {
      const temp = data
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].headImg === null || temp[i].headImg === 'null') {
          temp[i].headImg = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'
        }
      }
      return temp
    },
    update (item) { // 修改用户信息,根据ID修改,需管理员或自己才能修改
      axios.put('/json/user/update?userId=' + item.userId + '&nickName=' + item.nickName + '&telPhone=' + item.telPhone + '&email=' + item.email + '&qq=' + item.qq + '&weiXin=' + item.weiXin + '&sex=' + item.sex + '&readName=' + item.readName + '&headImg=' + item.headImg + '&birthday=' + item.birthday + '&introduce=' + item.introduce).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
        this.getUserList()
      })
    },
    del () { // 根据ID删除
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        // 点击确定后发送请求
        axios.delete('/json/user/delete?userId=' + this.userData.userId).then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除用户成功'
            })
            this.getUserList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePageChange (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/user/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        // console.log(res.data)
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.userList = this.handleHeadImg(res.data.data)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
