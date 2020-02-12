<template>
  <el-dialog
    id="role-dialog"
    ref="userdialog"
    :title="'用户【'+item.number+'】隶属角色：'"
    :visible.sync="visable"
    :close-on-click-modal="false"
    :lock-scroll="false"
    :show-close="true"
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
        <el-table-column prop="roleId" label="角色ID">
          <template slot-scope="scope">
            <el-input v-show="scope.row.edit" size="small" v-model="scope.row.roleId"></el-input>
            <span v-show="!scope.row.edit">{{ scope.row.roleId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="depict" label="隶属角色" />
        <el-table-column prop="level" label="权重" />
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button  type='danger' icon="el-icon-edit" @click='scope.row.edit=!scope.row.edit'>修改</el-button>
            <el-button  type='primary' icon="el-icon-s-tools" @click='scope.row.edit=!scope.row.edit' @click.stop="handleSave(scope.row.roleId)">保存</el-button>
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
          edit: false,
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
    handleSave (roleId) { // 通过userId和roleId设置用户角色
      axios.get('/json/user/setRole?userId=' + this.item.userId + '&roleId=' + roleId).then((res) => {
        console.log('enter 保存')
        console.log(res.data)
        if (res.data.code === 0) {
          this.$message({
            type: 'sucess',
            message: '修改成功'
          })
        }
        if (res.data.code === 4) {
          this.$message({
            type: 'danger',
            message: res.data.msg
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
