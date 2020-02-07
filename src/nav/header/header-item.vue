<template>
  <div class="header-item">
    <div ref="role" title="用户" :class="istoggle.toggle[0]==true?'clickStyle':''" @click="toggle(0)">
      <i class="el-icon-user-solid" />
      <!-- 点击弹出框 -->
      <div :class="istoggle.toggle[0]==true?'clickShow':''">
        <div>
          <!-- <img :src="imageUrl" min-width="60" height="60"> -->
          <ul>
            <!-- <li>用户名：{{ username }}</li> -->
            <li>用户名：{{ username.user }}</li>
          </ul>
        </div>
        <div :class="istoggle.toggle[0]==true?'clickShow':''" :style="{'background':`${themeColor}`}" @click.stop="logout">
          <p style="margin-left:6.5rem" @click.stop="logout">退出登录</p>
        </div>
      </div>
    </div>
    <div ref="theme" title="皮肤" :class="istoggle.toggle[1]==true?'clickStyle':''" @click="toggle(1)">
      <i class="el-icon-s-shop" />
      <div :class="istoggle.toggle[1]==true?'clickShow':''">
        <div>
          <el-button @click.stop="toggleColor('#0099CC')">默认</el-button>
          <el-button @click.stop="toggleColor('#339900')">深黄</el-button>
          <el-button @click.stop="toggleColor('#CC0000')">深蓝</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { removeToken } from '@/utils/token'
import axios from 'axios'
export default {
  data () {
    return {
      istoggle: { open: false, toggle: [false, false, false] },
      radio1: '1',
      radio2: '1',
      focusedRecord: {},
      state: false,
      addForm: {}
    }
  },
  computed: {
    isLogin () {
      if (this.$isEmpty(this.token)) {
        return false
      }
      return true
    },
    // ...mapGetters(['token', 'themeColor', 'username', 'usertype', 'imageUrl'])
    ...mapGetters(['themeColor', 'username'])
  },
  methods: {
    // 自定义页头
    toggle (value) {
      if (this.istoggle.open === false) {
        this.istoggle.open = true
        this.istoggle.toggle = [false, false, false]
        this.istoggle.toggle[value] = true
      } else {
        this.istoggle.open = false
        this.istoggle.toggle = [false, false, false]
      }
    },
    logout () {
      axios.get('json/login/out').then(res => {
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '退出登录成功'
          })
          // this.setUserdata('')
          // 退出登录时将sessionStorage里的token和store里面的角色都清零
          // removeToken()
          // this.resetToken()
          this.$store.state.username = null
          sessionStorage.setItem('store', null)
          this.$router.push({path: '/login'})
        }
      })
    },
    ...mapActions('app/', ['toggleColor']),
    ...mapActions('user/', ['setUserdata', 'resetToken'])
  }
}
</script>
<style lang="scss">
$hei: 3rem;
$bg1:#0099CC;
$bg2:#339900;
$bg3:#CC0000;
.iconfont.icon-jiaoseliebiao{font-size:2rem!important}
.clickShow {
  .el-radio{
    margin:.6rem 0 0 0;
    background:$bg1;
    height:1.5rem;
    border-radius:5px;
    line-height:1.5rem;
    padding-left:.3rem;
    color:white;
    &:hover{
      background-color:gray!important
    }
  }
  .is-checked{
   background-color:rgb(75, 74, 74);
  }
  .el-radio__input.is-checked+.el-radio__label{color:white};
  .el-radio__input.is-checked .el-radio__inner{border-color:#0099CC;background:#0099CC}
}
.el-tabs__header{
    .el-tabs__nav-wrap{
        border-bottom:2px solid #E4E7ED;
    }
}
.clickStyle{
    border-top:2px solid white;
    box-shadow:0px 0px 30px gray;
}
.clickLanguage{
    border-top:2px solid white;
    box-shadow:0px 0px 30px gray;

}
.clickShow{
    height:7rem!important;
}
.header-item{
  height:$hei;
  position:absolute;
  top:0;
  right:0.6rem;
  display: flex;
  align-items: center;
   div{
      font-size:1.5rem;
      color:white;
      line-height:3rem;
      padding:0 .7rem;
      height:100%;
      width:3rem;
      margin:0 1rem;
      cursor:pointer;
      transition:all .2s linear;
      &:hover{
        font-size:1.7rem;
        color:rgb(245, 182, 153);
      }
    }
    div:nth-child(1){
      // 角色切换弹出框
      div{
        position:relative;
        right:16.7rem;
        width:18rem;
        height:0;
        overflow:hidden;
        background:white;
        box-shadow:0 0 1.9rem gray;
        // content
        div:first-child{
          display: flex;
          width:16rem;
          height:4rem;
          line-height:2rem;
          top:.6rem;
          left:0rem;
          box-shadow:none;
          .el-avatar{
            width:3.6rem;
            height:3.6rem;
            line-height:3.5rem;
            font-size:2rem;
            margin:0 0 0 .7rem;
          }
          ul{
            margin:0.7rem 0 0 1.3rem;
            padding:0;
            list-style:none;
            font-size:.7rem;
            color:gray;
            li:first-child{
              color:rgb(44, 44, 44);
              font-size:1rem;
            }
            li:nth-child(2){
              margin:.5rem 0 0 0;
            }
          }
        }
        // bottom
        div:nth-child(2){
            top:100%;
            left:-1rem;
            margin-top:-2rem;
            width:100%;
            height:2rem;
            background:$bg1;
            box-shadow:none;
            // text-align: center;
            p{
                line-height:2rem;
                font-size:0.9rem;
                margin:0 0 0 0.5rem;
            }
        }
      }
    }
    // 皮肤切换弹出框
    div:nth-child(2){
        right:10%;
        width:3.3rem;
        div{
        position:absolute;
        top:2.9rem;
        left:1.3rem;
        width:7rem;
        height:0;
        overflow:hidden;
        background:white;
        box-shadow:0 0 1.9rem gray;
        div:first-child{
            top:2px;
            left:-1.2rem;
            height:100%;
            box-shadow:none;
            line-height:.5rem;
            .el-button{
              display:inline-block;
              width:6rem;
              height:1rem;
              line-height:0rem;
              color:white;
              margin:5px 0;
              &:hover{
                opacity:0.8
              }
            }
            .el-button:first-child{
              background-color:$bg1
            }
            .el-button:nth-child(2){
              background-color:$bg2
            }
            .el-button:nth-child(3){
              background-color:$bg3;
            }
        }
    }
}
}
.logout {
    line-height: $hei;
    color: white;
    font-size: 0.8rem;
    float: right;
  }
</style>
