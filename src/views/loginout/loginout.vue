<template />
<script>
import { mapGetters, mapActions } from "vuex";
// import wxvar from "../../api/global variable";
// import { wxlogin } from "../../api/qywxlogapi";
// import "@/api/wwlogin";
export default {
  data () {
    return {
    }
  },
  activated () {
    this.Onload()
  },
  methods: {
    Onload () {
      var str1 = location.href.split("code=")[1]
      if (str1 !== undefined && str1 !== "") {
        var code = str1.split("&")[0]
        if (code != null) {
          const para = { code: code };
          wxlogin(para).then(res => {
            this.relog(res);
          })
        }
      }
    },
    relog (res) {
      const token = res.data[1];
      const uname = res.data[0].username;
      const utype = res.data[0].usertype;
      this.setUserdata({ token, uname, utype });
      this.$router.replace("/home")
    },
    ...mapActions("user/", ["setUserdata"])
  }
}
</script>
