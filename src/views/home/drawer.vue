<template>
  <el-drawer
    title="新增任务"
    :visible.sync="drawer"
    direction="rtl"
    :before-close="handleClose"
    custom-class="drawer-custom"
  >
    <el-form ref="form" :model="form" label-width="110px" :rules="rules">
      <el-form-item label="任务名称" prop="taskName">
        <el-input
          v-model="form.taskName"
          placeholder="请选择任务名称"
          style="width: 280px"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传" required>
        <upload
          v-model="documentfileList"
          :limit="10"
          :accept="acceptList"
          :multiple="true"
          :http-request="fileUpload"
          :auto-upload="true"
          :show-file-list="true"
          :chunkSize="1024 * 1024 * 1024 * 1.1"
        >
          <template slot="tip">
            <div>仅支持{{ acceptList.join("、") }}格式</div>
          </template>
        </upload>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading"
        >确 定</el-button
      >
    </div>
  </el-drawer>
</template>
<script>
import upload from "@/components/LinkUpload";
import { createTask, uploadFile } from "@/api/taskManagement";
export default {
  components: {
    upload,
  },

  data() {
    return {
      drawer: false,
      loading: false,
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
      },
      acceptList: ["pdf", "png", "jpg", "jpeg"],
      form: {
        taskName: "",
        documentType: "vat",
        fileList: [],
      },
      documentfileList: [],
      documentTypeOptions: [
        {
          label: "流水",
          value: "financial_statement",
        },
        {
          label: "增值税发票",
          value: "vat",
        },
        {
          label: "提单",
          value: "bill_of_lading",
        },
        {
          label: "订单",
          value: "order",
        },
      ],
    };
  },
  methods: {
    // 自定义上传请求 - 上传文件流，获取文件ID
    async fileUpload(files) {
      for (let index = 0; index < files.length; index++) {
        const fileItem = files[index];

        // 构建 FormData
        const formData = new FormData();
        formData.append("file", fileItem.file);
        // formData.append("documentType", this.form.documentType);

        try {
          // 调用上传接口
          const response = await uploadFile(formData);

          if (response.data.code === "200" || response.data.data) {
            const fileData = response.data.data;
            // 保存文件ID到 fileItem
            fileItem.fileId = fileData.id; // 后端返回的文件ID
            fileItem.fileName = fileData.fileName || fileItem.file.name;
            fileItem.filePath = fileData.filePath; // 可选：文件路径
            fileItem.status = "success";

            console.log(
              `文件上传成功：${fileItem.fileName}，文件ID：${fileItem.id}`
            );
          } else {
            fileItem.status = "fail";
            fileItem.errorMsg = response.message || "上传失败";
            this.$message.error(
              `${fileItem.file.name} 上传失败：${fileItem.errorMsg}`
            );
          }
        } catch (error) {
          fileItem.status = "fail";
          fileItem.errorMsg = error.message || "网络错误";
          console.error("上传文件出错:", error);
          this.$message.error(`${fileItem.file.name} 上传失败`);
        }
      }
    },

    // 打开抽屉
    openDrawer() {
      this.drawer = true;
    },

    // 关闭抽屉
    handleClose() {
      this.drawer = false;
      // 重置表单
      this.resetForm();
    },

    // 重置表单
    resetForm() {
      this.form = {
        taskName: "",
      };
      this.documentfileList = [];
      this.$refs.form && this.$refs.form.resetFields();
    },

    // 提交表单
    handleSubmit() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) {
          return;
        }

        const uploadingFiles = this.documentfileList.filter(
          (f) => f.status === "uploading"
        );
        if (uploadingFiles.length > 0) {
          this.$message.warning("还有文件正在上传中，请稍候...");
          return;
        }

        // 检查是否有上传失败的文件
        const failedFiles = this.documentfileList.filter(
          (f) => f.status === "fail"
        );
        if (failedFiles.length > 0) {
          this.$message.error(
            `有 ${failedFiles.length} 个文件上传失败，请重新上传`
          );
          return;
        }

        // 检查是否有文件
        if (this.documentfileList.length === 0) {
          this.$message.error("请至少上传一个文件");
          return;
        }

        // 构建提交数据（只传文件ID）
        const submitData = {
          taskName: this.form.taskName,
          // documentType: this.form.documentType,
          documentfileList: this.documentfileList.map((f) => f.fileId), // 文件ID数组，按单据类型分组
        };
        this.loading = true;
        createTask(submitData)
          .then((response) => {
            if (response.data.code === "200" || response.data.data) {
              this.$message.success("任务创建成功！");
              this.handleClose();
              // 通知父组件刷新列表
              this.$emit("refresh");
            } else {
              this.$message.error(response.message || "提交失败！");
            }
          })
          .catch((error) => {
            this.$message.error("提交失败，请稍后重试！");
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
  },
};
</script>
<style scoped lang="stylus">
.drawer-custom {
  .el-drawer__body {
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;

    .el-form {
      height: calc(100vh - 150px);
    }
  }

  .dialog-footer {
    margin-top: auto;
    display: flex;
    margin-bottom: 12px;
    margin-right: 12px;
    justify-content: flex-end;
    border-top: 1px solid #ebeef5;
    padding-top: 12px;
  }
}

::v-deep .el-drawer__header {
  margin-bottom: 30px;
  padding: 12px 20px;
  border-bottom: 1px solid #ebeef5;
  color: #000;
  font-size: 16px;
}
</style>
