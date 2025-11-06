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
      <!-- <el-form-item label="单据类型">
        <el-select
          v-model="form.documentType"
          placeholder="请选择单据类型"
          style="width: 280px"
        >
          <el-option
            v-for="value in documentTypeOptions"
            :key="value.value"
            :label="value.label"
            :value="value.value"
          ></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="上传">
        <upload
          v-model="documentTypeFields[form.documentType]"
          :limit="10"
          :accept="acceptList"
          :multiple="true"
          :http-request="fileUpload"
          :auto-upload="true"
          :show-file-list="true"
          :chunkSize="1024 * 1024 * 1024 * 1.1"
          @handle-change="fileChange"
        >
          <template slot="tip">
            <div>支持{{ acceptList.join("、") }}格式</div>
          </template>
        </upload>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </div>
  </el-drawer>
</template>
<script>
import upload from "@/components/LinkUpload";
import { getDocumentTypeList, createTask, uploadFile } from "@/api/taskManagement";
export default {
  components: {
    upload,
  },

  data() {
    return {
      drawer: false,
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
      documentTypeFields: {
        financial_statement: [],
        vat: [],
        bill_of_lading: [],
        order: [],
      },
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
    // 文件列表变化时触发
    fileChange(fileList) {
      console.log("文件列表变化：", fileList);
      // 更新当前单据类型对应的文件列表
      this.documentTypeFields[this.form.documentType] = fileList;
    },
    
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
          
          if (response.code === "200") {
            // 保存文件ID到 fileItem
            fileItem.fileId = response.data.fileId; // 后端返回的文件ID
            fileItem.fileName = response.data.fileName || fileItem.file.name;
            fileItem.filePath = response.data.filePath; // 可选：文件路径
            fileItem.status = "success";
            
            console.log(`文件上传成功：${fileItem.fileName}，文件ID：${fileItem.fileId}`);
          } else {
            fileItem.status = "fail";
            fileItem.errorMsg = response.message || "上传失败";
            this.$message.error(`${fileItem.file.name} 上传失败：${fileItem.errorMsg}`);
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
      this.getDocumentTypeList();
    },
    async getDocumentTypeList() {
      const response = await getDocumentTypeList();
      if (response.code === "200") {
        this.documentTypeOptions = response.data;
      } else {
        this.$message.error("获取单据类型失败");
      }
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
        documentType: "vat",
        fileList: [],
      };
      this.documentTypeFields = {
        financial_statement: [],
        vat: [],
        bill_of_lading: [],
        order: [],
      };
      this.$refs.form && this.$refs.form.resetFields();
    },
    
    // 提交表单
     handleSubmit() {
      // 表单验证
      this.$refs.form.validate((valid) => {
        if (!valid) {
          this.$message.error("请完善表单信息");
          return;
        }

        // 检查是否有文件正在上传
        const allFiles = Object.values(this.documentTypeFields).flat();
        const uploadingFiles = allFiles.filter(f => f.status === 'uploading');
        if (uploadingFiles.length > 0) {
          this.$message.warning("还有文件正在上传中，请稍候...");
          return;
        }

        // 检查是否有上传失败的文件
        const failedFiles = allFiles.filter(f => f.status === 'fail');
        if (failedFiles.length > 0) {
          this.$message.error(`有 ${failedFiles.length} 个文件上传失败，请重新上传`);
          return;
        }

        // 提取文件ID，按单据类型分组
        const fileIds = {};
        Object.keys(this.documentTypeFields).forEach((docType) => {
          const fileList = this.documentTypeFields[docType];
          if (fileList.length > 0) {
            // 只提取文件ID
            fileIds[docType] = fileList
              .filter(f => f.fileId) // 确保有fileId
              .map(f => f.fileId);
          }
        });
        
        // 检查是否有文件
        const totalFiles = Object.values(fileIds).flat().length;
        if (totalFiles === 0) {
          this.$message.warning("请至少上传一个文件");
          return;
        }

        // 构建提交数据（只传文件ID）
        const submitData = {
          taskName: this.form.taskName,
          documentType: this.form.documentType,
          fileIds: fileIds, // 文件ID数组，按单据类型分组
        };

        console.log("提交的数据：", submitData);

        createTask(submitData).then((response) => {
          if (response.code === "200") {
            this.$message.success("任务创建成功！");
            this.handleClose();
            // 通知父组件刷新列表
            this.$emit('refresh');
          } else {
            this.$message.error(response.message || "提交失败！");
          }
        }).catch((error) => {
          console.error("提交失败：", error);
          this.$message.error("提交失败，请稍后重试！");
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
