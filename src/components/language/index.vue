<template>
  <div>
    <el-radio v-model="radio1" label="zh" size="small" fill="#ffffff" :style="{'background':`${themeColor}`}" @change="changes('zh')">中文</el-radio>
    <el-radio v-model="radio1" label="en" size="small" fill="#ffffff" :style="{'background':`${themeColor}`}" @change="changes('en')">English</el-radio>
    <el-radio v-model="radio1" label="ko" size="small" fill="#ffffff" :style="{'background':`${themeColor}`}" @change="changes('ko')">한글</el-radio>
  </div>
</template>
<script>
export default {
  data () {
    return {
      list: [
        { type: 'zh', name: this.$t('language.zh'), id: 1 },
        { type: 'en', name: this.$t('language.en'), id: 2 },
        { type: 'ko', name: this.$t('language.ko'), id: 3 }
      ]
    }
  }
}
</script>
