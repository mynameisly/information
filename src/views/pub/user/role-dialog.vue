<template>
  <el-dialog
    id="userrole-dialog"
    ref="userdialog"
    custom-class="customWidth"
    :title="'用户【'+item.number+'】隶属角色：'"
    :visible.sync="visable"
    :close-on-click-modal="false"
    :show-close="false"
    :lock-scroll="false"
    width="50%"
    @close="cancel"
  >
    <div class="search-row" style="margin-bottom:.5rem;width:100%;padding-left:.6rem">
      <!-- <el-select v-model="addroles" collapse-tags multiple placeholder="请选择该用户要添加的角色" style="width:16rem;">
        <el-option
          v-for="item in dropbox"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select> -->
      <el-button type="primary" plain icon="el-icon-plus" style="margin-right:.5rem;width:7.5rem" @click="$refs.detailDialog.open(roleList)">添加角色</el-button>
      <el-button type="success" plain icon="el-icon-search" style="float:right;margin-right:.5rem;margin-left:.2rem;width:7.5rem" @click="onSearch">搜索角色</el-button>
      <!-- <el-input v-model="rolename" clearable placeholder="输入角色名称进行搜索" style="float:right;width:16rem;" /> -->
    </div>
    <div class="role-list">
      <el-table
        ref="multipleTable"
        border
        height="100%"
        :data="roleList"
        tooltip-effect="dark"
        size="mini"
        @selection-change="handleSelectionChange"
        @select="SelectRow"
        @select-all="selectall"
      >
        <el-table-column type="selection" label="序号" width="55" />
        <el-table-column prop="name" label="角色名称" width="150" />
        <el-table-column prop="node" label="组织架构节点" />
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="danger" plain @click="delRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer">
      <el-button type="danger" plain @click="delAll">删除选中</el-button>
      <el-button type="warning" plain @click="cancel">取消</el-button>
      <el-button type="success" plain @click="submit">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: "编辑"
    }
  },
  data () {
    return {
      item: {},
      visable: false,
      multipleSelection: [], // 选中的数据二维数组
      roleList: [], // el-table 绑定的数据
      roleList_copy: [], // 实现模糊搜索的原始数据
      rolename: '', // 双向绑定角色搜索框
      delroles: [] // 选择删除的角色
    }
  },
  methods: {
    open (item) {
      this.visable = true
      this.rolename = ''; // 打开对话框时，清空搜索框数据
      if (item === undefined || item === null) {
        this.item = {};
      } else {
        this.item = Object.assign({}, item)
        this.getroleid()
      }
    },
    // 根据用户id 获取角色数组
    getroleid() {
      queryRolesUid(this.item.id).then(res => {
        this.roleList = res.data;
        this.roleList_copy = this.roleList;
      });
    },
    adduserrole(addroles) {
      const tabledata = this.roleList.map(a => a.id); // tabledata[1, 3]   selectdatda[1, 3]   arr[1]
      const selectdatda = addroles.map(a => a.id)
      const arr = delWeight(selectdatda, tabledata) // 添加的角色中有和table重复的
      if (arr.length === 0 || arr.length === null || arr.length === undefined) {
        addroles.forEach((item) => {
          this.roleList.push(item)
        })
        this.roleList_copy = this.roleList;
      } else {
        var name = [];
        for (var i = 0; i < arr.length; i++) { // arr[3,4,5]
          for (var j = 0; j < this.roleList.length; j++) { // this.roleList[{id: 3,name: "前端",orgNode: null},{...}]
            if (this.roleList[j].id === arr[i]) {
              name.push(this.roleList[j].name)
            }
          }
        }
        var msg = `角色【 ${name} 】已经存在！`;
        this.$message({
          message: msg,
          type: 'warning'
        })
      }
    },
    delRow(rowindex) {
      this.$confirm("确认删除吗？", "询问", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        this.roleList.splice(rowindex, 1)
        this.roleList_copy = this.roleList;
      }).catch(() => {
        console.log("cancel");
      })
    },
    delAll() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请先至少选择一项')
      } else {
        this.$confirm("确认删除吗？", "询问", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          lockScroll: "false",
          closeOnClickModal: "false"
        }).then(() => {
          this.multipleSelection.forEach(element => {
            this.roleList.forEach((e, i) => {
              if (element.id === e.id) {
                this.roleList.splice(i, 1)
              }
            });
          });
          this.roleList_copy = this.roleList;
        }).catch(() => {
          console.log("cancel");
        })
      }
    },
    submit() {
      this.rolename = '';
      this.roleList = this.roleList_copy // table显示实际上角色列表数据
      this.$confirm("确认保存吗？", "询问", {
        confirmButtonText: "确认", // 点击确认按钮之后会触发.then()
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: "false",
        closeOnClickModal: "false"
      }).then(() => {
        // 发送修改角色请求
        const tabledata = this.roleList_copy.map(a => a.id);
        const param = {
          userId: this.item.id,
          roleId: tabledata.toString()
        }
        this.updateUserRole(param)
        this.visable = false;// 关闭dialog弹窗后重置form，不能在这里重置，函数执行完之后才把数据添加的父元素table中
      }).catch(() => {
        console.log("cancel");
      })
    },
    cancel () {
      this.visable = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    SelectRow (val, row) {
      if (val.indexOf(row) === -1 && this.delroles.indexOf(row) === -1) {
        this.delroles.push(row);
      } else if (val.indexOf(row) !== -1 && this.delroles.indexOf(row) !== -1) {
        this.delroles.splice(row);
      }
    },
    selectall (val) {
      if (val.length === 0) {
        this.delroles = this.roleList
      }
    },
    updateUserRole(param) {
      updateUserRole(param).then(res => {
        if (res.code === 200) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          this.$message({
            message: "保存失败，原因：" + res.msg,
            type: "danger"
          });
        }
      });
    }
  }
}
</script>

<style lang="scss">
#userrole-dialog {
  .customWidth {
    width: 70%;
  }
  .header {
    margin-top: -1rem;
    font-size: 1.2rem;
    font-weight: 600px;
  }

  .role-list {
    height: 28rem;
    border-top: 1px solid #e2e2e2;
    margin: 1px;
    padding: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600px;
  }
}
</style>
