<template>
  <div class="page-component">
    <el-pagination
      background
      layout="sizes,prev, pager, next,jumper"
      :total="total"
      :current-page.sync="page.currentPage"
      :page-size.sync="page.pageSize"
      :page-sizes="[10, 30, 50, 100]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>

</template>
<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      required: true,
      type: Object
    }
  },
  methods: {
    handleSizeChange (val) {
      this.page.pageSize = val
      this.$emit('pageChange', this.page)
    },
    handleCurrentChange (val) {
      this.page.currentPage = val
      this.$emit('pageChange', this.page)
    }
  }
}
</script>
<style lang="scss">
.el-pagination{padding:.5rem 0!important}
.page-component{
  text-align:center
}
</style>
