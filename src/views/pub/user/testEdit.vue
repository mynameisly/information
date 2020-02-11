<template>
  <div id="testDeit">
    <div class="content-wrapper">
        <div>
          <el-button type="primary" icon="el-icon-edit" @click.stop="handleEdit">编辑</el-button>
          <el-button type="primary" icon="el-icon-setting" @click.stop="handleSave">保存</el-button>
        </div>
        <div class="street-wrapper">
          <template v-for="(item, index) in roleList">
            <!-- <el-button v-if="!isEdit" :type="activeButton === index ? 'primary' : 'info'" :key="index"
              @click.stop="handleButtonClick(index)">{{item.name}}</el-button> -->

              <el-button
               v-if="!isEdit"
                :key="index">
              {{item.name}}
              </el-button>
            <el-input
            v-else-if="isEdit"
             :key="index"
             v-model="item.name"
             style="width:300px;margin-right:5px;margin-bottom:5px;">
             </el-input>
            <!-- <el-input v-else-if="isEdit" :key="index" v-model="item.name" style="width:300px;margin-right:5px;margin-bottom:5px;"></el-input> -->
          </template>
        </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'official',
  data () {
    return {
      // activeButton: 0,
      isEdit: false, // 编辑街道
      roleList: [
        {id: 1, name: '观湖街道'},
        {id: 1, name: '民治街道'}
      ]
    }
  },
  methods: {
    // handleButtonClick (index) {
    //   this.activeButton = index
    // },
    handleEdit () {
      this.isEdit = true
    },
    handleSave () {
      this.isEdit = false
    }
  }
}
</script>
