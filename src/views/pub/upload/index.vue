<template>
  <div id="upload">
    <h1>{{ msg }}</h1>
    <el-button type="warning" size="mini" @click="$refs.addDialog.open(null)">新增</el-button>

    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      :data="uploadList"
      height="80%"
      :cell-style="addBgColorByState"
      @cell-mouse-enter="mouseEnter"
        >
      <el-table-column label="序号" type="index" width="55">
      <!-- <template scope="scope"> -->
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <!-- <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span> -->
          <!-- </template> -->
      </el-table-column>
      <el-table-column label="文件名" prop="fileRealName"/>
      <el-table-column label="文件后缀名" prop="fileSuffix"/>
      <el-table-column label="文件类型" prop="type"/>
      <el-table-column label="状态" prop="state"/>
      <el-table-column label="操作" prop="operation">
        <el-button
          type="success"
          size="mini"
          @click="download">
          下载
        </el-button>
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
export default {
  components: {
    AddDialog,
    UpdateDialog
  },
  data(){
    return {
      msg: 'upload',
      uploadList: [
        {
          fileRealName: 'aaa',
          fileSuffix: '.png',
          type: '图像',
          state: '审核不通过'
        },
        {
          fileRealName: 'bbb',
          fileSuffix: '.txt',
          type: '文本文件',
          state: '未审核'
        },
        {
          fileRealName: 'ccc',
          fileSuffix: '.js',
          type: '脚本文件',
          state: '通过审核'
        }
      ],
      uploadData: {}
    }
  },
  mounted() {
    this.getUploadList();
  },
  methods: {
    getUploadList() {
      // this.$ajax.get('http://120.24.186.190:12346/json/login/direct?number=zhangsan&password=123456A')
      //   .then(res => {
      //   console.log('获取文件列表成功');
      //   console.log(res);
      //   console.log(res.data);
      //   this.uploadList = res.data
      // })
    },
    mouseEnter(data) {
      this.uploadData = Object.assign({}, data);
    },
    addBgColorByState({row, columnIndex}) {
      if (columnIndex === 4) {
        if (row.state === '审核不通过') {
          return 'color: #e5323e'
        } else if (row.state === '通过审核') {
          return 'color: #22c32e'
        } else if (row.state === '未审核') {
          return 'color: #4cabce'
        }
      }
    },
    add() { // 增加

    },
    update() { // 修改

    },
    download() { // 资料下载
      // const fileId = this.uploadData.id;
      // this.$ajax.get('http://120.24.186.190:12346/json/file/download?fileId=' + fileId)
      //   .then( res => {
      //     console.log(res.data)
      //   })
    },
    del() { // 资料删除

    }
  }
}
</script>

<style lang="scss">
  .el-table td, .el-table th {
    text-align: center;
  }
</style>