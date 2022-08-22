<template>
  <section class="query-table">
    <lls-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;"
      fit
      @selection-change="handleSelectionChange">
      <lls-table-column
        type="selection">
      </lls-table-column>
      <lls-table-column
        prop="index"
        label="序号">
      </lls-table-column>
      <lls-table-column
        prop="content1"
        label="标题内容">
      </lls-table-column>
      <lls-table-column
        label="金额数据(元)">
        <template slot-scope="scope">{{ numToThousands(scope.row.num) }}</template>
      </lls-table-column>
      <lls-table-column
        prop="content2"
        label="标题内容">
      </lls-table-column>
      <lls-table-column
        label="状态">
        <template slot-scope="scope">
          <lls-tag class="table-tag" v-if="scope.row.status === 'processing'" rimless type="primary">进行中</lls-tag>
          <lls-tag class="table-tag" v-if="scope.row.status === 'warning'" rimless type="warning">警示</lls-tag>
        </template>
      </lls-table-column>
      <lls-table-column
        prop="content3"
        label="标题内容">
      </lls-table-column>
      <lls-table-column
        label="操作"
        width="80">
        <template slot-scope="scope">
          <lls-button type="text" @click="handleItemClick(scope.row.index)">操作</lls-button>
        </template>
      </lls-table-column>
    </lls-table>
    <div class="table-pagination">
      <lls-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, prev, pager, next, sizes, jumper"
        :total="400">
      </lls-pagination>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default () {
        return []
      }
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },

  methods: {
    handleSelectionChange (val) {
      console.log(val)
    },
    handleItemClick (index) {
      console.log(index)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    }
  }
}
</script>

<style scoped lang="stylus">
.query-table {
  .table-tag {
    text-align: center;
    width: 50px;
  }
  .table-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
