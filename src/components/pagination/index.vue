<template>
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
</template>
<script>
export default {
  props: {
    total: {
      required: true,
      type: Number
    }
  },
  data () {
    return {
      page: {
        currentPage: 1,
        pageSize: 10
      }
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
