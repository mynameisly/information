<template>
  <div id="baberrage">
    <el-dialog :visible.sync="visible" top="0rem" width="82%" :show-close="false" :close-on-click-modal="false">
      <video :src="videoSrc" controls width="100%" height="60%">您的浏览器暂不支持video标签，请先升级……</video>
      <div class="stage">
        <vue-baberrage
          :isShow= "barrageIsShow"
          :barrageList = "barrageList"
          :loop = "barrageLoop"
          :maxWordCount = "60"
          >
        </vue-baberrage>
      </div>
      <div class="demo-control">
        <div style="display:flex">
          <input type="text" v-model="context" @keyup.enter="addToList" />
          <button type="button" style="cursor: pointer;" @click="addToList" >添加</button>
          <button type="button" style="cursor: pointer;" @click="removeList" >清屏</button>
        </div>
      </div>
      <span slot="footer">
        <el-button type="warning" @click="resetForm()">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { MESSAGE_TYPE } from '@/lib/index.js'
import axios from 'axios'

export default {
  name: 'vue-baberrage',
  data () {
    return {
      visible: false,
      videoSrc: '',
      context: '开始你的吐槽大会……',
      barrageIsShow: true,
      currentId: 0,
      barrageLoop: false,
      barrageList: [],
      item: {}
    }
  },
  methods: {
    open (item) {
      console.log('弹幕打开后的item是',item)
      this.visible = true
      this.item = item
      this.addWatch(item.courseId)
      this.videoSrc = item.mainVideoUrl
      this.getHistoryBaber(item.courseId)
    },
    getHistoryBaber(courseId) {// 这是拿到所有的弹幕，，应该是拿到改视频的弹幕显示在改视频上
      axios.get('/json/comment/list?type=barrage&targetId=' + courseId).then((res) => {
        this.barrageList = this.handleContext(res.data.data)
        console.log('this.barrageList',this.barrageList)
      })
    },
    handleContext(data) {
      const temp = data
      const contextArr = []
      for(let i = 0; i < temp.length; i++) {
        contextArr.push(temp[i].context)
      }
      console.log('contextArr',contextArr)
      return contextArr
    },
    addWatch (courseId) { // 新增观看记录
      axios.post('/json/watch/add?targetId=' + courseId)
        .then((res) => {
      console.log('新增观看记录',res.data)
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增观看记录成功'
            })
          }
        })
    },
    removeList () {
      this.barrageList = []
    },
    addToList () {
      const courseId = this.item.courseId
      axios.post('/json/comment/add?type=barrage&targetId=' + courseId + '&context=' + this.context).then((res) => {
        console.log('新增弹幕',res.data)
        if (res.data.code === 0) {
          this.barrageList.push({
            id: ++this.currentId,
            avatar: './static/avatar.jpg',
            context: this.context,
            time: 15,
            type: MESSAGE_TYPE.NORMAL
          })
        }
      })
    },
    resetForm () {
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
video{
  position: relative;
}
.stage{
  position: absolute;
  top: 4px;
  left: 11.5%;
  z-index: 999;
  width: 88%;
  height: 56%;
}

.baberrage-stage .baberrage-item.normal{
  color:#FFF;
}

.demo-control{
    position: absolute;
    margin: 0 auto;
    width: 88%;
    bottom: 300px;
    top: 70%;
    height: 69px;
    box-sizing: border-box;
    text-align: center;
    display: flex;
    justify-content: center;

  div {
    width: 500px;
    background: rgba(193, 228, 228, 0.6);
    padding: 15px;
    border-radius: 5px;
    border: 2px solid #8ad9ff;
  }

  input,button{
    height:35px;
    padding:0;
    float:left;
    background:#1e3441;
    border:1px solid #CCC;
    color:#FFF;
    border-radius:0;
    width:20%;
    box-sizing: border-box;
  }

  input{
    width:80%;
    height:35px;
    border:1px solid #8ad9ff;
    padding-left:5px;
    color:#FFF;
  }

}

</style>
