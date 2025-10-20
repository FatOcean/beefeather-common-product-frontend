<template>
  <el-drawer
    title="新增任务"
    :visible.sync="drawer"
    :direction="direction"
    :before-close="handleClose"
    custom-class="drawer-custom"
  >
  <el-form ref="form" :model="form" label-width="110px">
  <el-form-item label="任务名称">
    <el-input v-model="form.taskName" placeholder="请选择任务名称" style="width: 280px;"></el-input>
  </el-form-item>
  <el-form-item label="单据类型">
    <el-select v-model="form.documentType" placeholder="请选择单据类型">
      <el-option v-for="value in documentTypeOptions" :key="value.value" :label="value.label" :value="value.value"></el-option>
    </el-select>
  </el-form-item>
  <el-form-item label="上传">
    <upload :limit="1" :fileList="documentTypeFields[form.documentType]" @change="handleFileChange" :accept="['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'json', 'zip', 'rar', '7z']"></upload>
  </el-form-item>
</el-form>
<div class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="handleSubmit">确 定</el-button>
  </div>
  </el-drawer>
</template>
<script>
import upload from '@/components/LinkUpload'
export default {
  components: {
    upload
  },

  data() {
    return {
      drawer: false,
      direction: 'rtl',
      form: {
        taskName: '',
        documentType: 'vat',
        fileList: []
      },
      documentTypeFields: {
        financial_statement: [],
        vat: [],
        bill_of_lading: [],
        order: []
      },
      documentTypeOptions: [
        {
          label: '流水',
          value: 'financial_statement'
        },
        {
          label: '增值税发票',
          value: 'vat'
        },
        {
          label: '提单',
          value: 'bill_of_lading'
        },
        {
          label: '订单',
          value: 'order'
        }

      ]
    }
  },
  methods: {
    openDrawer() {
      this.drawer = true
    },
    handleClose() {
      this.drawer = false
    },
    handleFileChange(fileList) {
      this.form.fileList = fileList
    },
    handleSubmit() {
      console.log(this.form)
    }
  }
}
</script>
<style scoped lang="stylus">
::v-deep.el-drawer__header{
  margin-bottom: 0px;
}
::v-deep.el-drawer__title{
  margin-bottom: 0px
  }
  .el-drawer__header{
  margin-bottom: 0px;

    }
.drawer-custom{
  .el-drawer__header{
    margin-bottom: 0px;
  }
  .el-drawer__body{
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
  }
  .dialog-footer{
    margin-top: auto;
    display: flex;
    margin-bottom: 12px;
    margin-right: 12px;
    justify-content: flex-end;
    border-top: 1px solid #ebeef5;
    padding-top: 12px;
  }
}
</style>
