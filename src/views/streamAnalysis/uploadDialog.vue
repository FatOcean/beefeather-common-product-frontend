<template>
  <el-dialog
    title="新增JSON规则"
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="handleClose"
  >
    <upload
      v-model="jsonFiles"
      :limit="20"
      :accept="['json']"
      :multiple="true"
      :http-request="fileUploadJson"
      :auto-upload="true"
      :show-file-list="true"
    >
      <template slot="tip">
        <div>仅支持 json 文件，解析后自动加入左侧规则树</div>
      </template>
    </upload>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import upload from "@/components/LinkUpload";
export default {
  name: "UploadDialog",
  components: { upload },
  data() {
    return {
      dialogVisible: false,
      jsonFiles: [],
    };
  },
  methods: {
    openDialog() {
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
    },
    fileUploadJson(){

    },
  },
};
</script>

<style scoped lang="stylus">
::v-deep .upload-file-wrapper {
  width: 100%;

  .dragger-wrapper {
    width: 100% !important;
  }
}

::v-deep .el-dialog__body {
  padding: 20px;
  padding-bottom: 4px;
}
</style>