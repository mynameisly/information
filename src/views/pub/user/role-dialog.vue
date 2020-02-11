<template>
  <el-dialog
    id="role-dialog"
    ref="userdialog"
    :title="'用户【'+item.number+'】隶属角色：'"
    :visible.sync="visable"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :show-close="false"
    @close="cancel"
  >
    <div class="role-list">
      <el-table
        ref="multipleTable"
        border
        height="50%"
        :data="roleList"
        tooltip-effect="dark"
        size="mini"
      >
        <el-table-column prop="userId" label="用户ID" />
        <!-- <el-table-column prop="roleId" label="角色ID" /> -->
        <template v-for="(item, index) in roleList">
          <!-- <el-table-column
              v-if="!isEdit"
              :key="index"
              prop="roleId"
              label="角色ID"/> -->
              <el-button
               v-if="!isEdit"
                :key="index">
              {{item.roleId}}
              </el-button>
            <el-input
            v-else-if="isEdit"
             :key="index"
             v-model="item.roleId"
             style="width:300px;margin-right:5px;margin-bottom:5px;">
             </el-input>
          </template>
        <el-table-column prop="depict" label="隶属角色" />
        <el-table-column prop="level" label="权重" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- <el-button type="danger" plain @click="updateRole(scope.$index)">修改</el-button> -->
            <el-button type="danger" icon="el-icon-edit" @click.stop="updateRole">修改</el-button>
          <el-button type="primary" icon="el-icon-setting" @click.stop="handleSave">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button type="warning" @click="cancel">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import axios from 'axios'
export default {
  props: {
    title: {
      type: String,
      default: '编辑'
    }
  },
  data () {
    return {
      item: {},
      visable: false,
      isEdit: false, // 编辑或保存
      roleList: [ // 角色数据 ,这里可能有问题，要不要{ }
        {
          userId: '',
          roleId: '',
          depict: '',
          level: ''
        }
      ]
    }
  },
  methods: {
    open (item) {
      this.visable = true
      if (item === undefined || item === null) {
        this.item = {}
      } else {
        this.item = Object.assign({}, item)
        this.getUserList(this.item.userId)
      }
    },
    getUserList (userId) { // 根据userId查询该用户角色数据
      axios.get('/json/user/getUserById?userId=' + this.item.userId).then((res) => {
        const returnData = res.data.data.role
        this.roleList[0].userId = res.data.data.userId
        this.roleList[0].roleId = returnData.roleId
        this.roleList[0].depict = returnData.depict
        this.roleList[0].level = returnData.level
      })
    },
    handleSave () { // 通过userId和roleId设置用户角色
      axios.get('/json/user/setRole?userId=' + userId + '&roleId=' + roleId).then((res) => {
        console.log(res.data)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
        }
        this.getUserList(this.item.userId)
      })
    },
    cancel () {
      this.visable = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog {
  width: 50%;
  height: 300px;
}
.el-dialog__footer {
  padding: 70px 20px 0px;
}
</style>
