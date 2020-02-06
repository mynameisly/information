<template>
  <div id="study">
      <video src="movie.ogg" controls width="100%" height="60%">您的浏览器暂不支持video标签，请先升级……</video>
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
      <div>
        <input type="text" style="float:left"  v-model="msg" @keyup.enter="addToList" />
        <button type="button" style="float:left" @click="addToList" >添加弹幕</button>
      </div>
    </div>
  </div>
</template>

<script>
import { MESSAGE_TYPE } from '../../lib/index.js'

export default {
  name: 'study',
  data () {
    return {
      msg: '开始你的吐槽大会……',
      barrageIsShow: true,
      currentId: 0,
      barrageLoop: false,
      barrageList: []
    }
  },
  methods: {
    removeList () {
      this.barrageList = []
    },
    addToList () {
        this.barrageList.push({
          id: ++this.currentId,
          avatar: '@/assets/avatar.jpg',
          msg: this.msg,
          time: 15,
          type: MESSAGE_TYPE.NORMAL
        })
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
  top: 90px;
  // left: 8%;
  z-index: 999;
  width: 100%;
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
    width: 300px;
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
