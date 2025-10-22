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
      <el-form-item label="单据类型">
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
      </el-form-item>
      <el-form-item label="上传">
        <!-- 
          上传组件说明：
          - v-model: 绑定当前单据类型的文件列表，实现切换类型时显示对应文件
          - limit: 最多上传文件数量
          - accept: 允许的文件格式
          - multiple: 支持多文件上传
          - http-request: 自定义上传逻辑
          - auto-upload: 选择文件后自动上传
          - show-file-list: 显示文件列表（缩略图）
        -->
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
    
    // 自定义上传请求
    async fileUpload(files) {
      console.log("开始上传文件：", files);
      for (let index = 0; index < files.length; index++) {
        const fileItem = files[index];
        
        // 构建 FormData
        const formData = new FormData();
        formData.append("file", fileItem.file);
        formData.append("documentType", this.form.documentType);
        
        try {
          // 模拟上传请求（当有真实接口时，取消注释并修改）
          // const res = await uploadFileApi(formData)
          // if (res.data.code === '200') {
          //   const { uploadId, filePath, fileExt } = res.data.data
          //   fileItem.uploadId = uploadId
          //   fileItem.filePath = filePath
          //   fileItem.status = 'success'
          // } else {
          //   fileItem.status = 'fail'
          // }
          
          // 模拟上传成功
          await new Promise((resolve) => setTimeout(resolve, 500));
          fileItem.status = "success";
          
          console.log(`文件 ${fileItem.filename} 上传成功`);
        } catch (error) {
          fileItem.status = "fail";
          console.error("上传文件出错:", error);
          this.$message.error(`文件 ${fileItem.filename} 上传失败`);
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
        
        // 收集所有单据类型的文件
        const allFiles = [];
        Object.keys(this.documentTypeFields).forEach((docType) => {
          const files = this.documentTypeFields[docType];
          if (files && files.length > 0) {
            files.forEach((fileItem) => {
              allFiles.push({
                documentType: docType,
                file: fileItem.file, // 原始文件流对象
                filename: fileItem.filename,
                size: fileItem.size,
                filetype: fileItem.filetype,
                status: fileItem.status,
                taskId: fileItem.taskId,
                uploadId: fileItem.uploadId, // 如果有上传返回的ID
              });
            });
          }
        });
        
        // 检查是否有上传文件
        if (allFiles.length === 0) {
          this.$message.error("请至少上传一个文件");
          return;
        }
        
        // 检查是否有上传失败的文件
        const hasFailedFile = allFiles.some(
          (item) => item.status === "fail" || item.status === "loading"
        );
        if (hasFailedFile) {
          this.$message.error("请等待文件上传完成或删除失败的文件");
          return;
        }
        
        // 构建提交数据
        const submitData = {
          taskName: this.form.taskName,
          documentType: this.form.documentType,
          files: allFiles, // 所有文件列表
        };
        
        console.log("====== 提交的数据格式 ======");
        console.log("任务名称：", submitData.taskName);
        console.log("单据类型：", submitData.documentType);
        console.log("文件数量：", submitData.files.length);
        console.log("文件详情：");
        submitData.files.forEach((fileItem, index) => {
          console.log(`文件${index + 1}:`, {
            documentType: fileItem.documentType,
            filename: fileItem.filename,
            size: `${(fileItem.size / 1024 / 1024).toFixed(2)} MB`,
            filetype: fileItem.filetype,
            status: fileItem.status,
            file: fileItem.file, // 这是原始的 File 对象
          });
        });
        console.log("完整数据对象：", submitData);
        console.log("============================");
        
        // 当有真实接口时，可以这样调用：
        // const formData = new FormData();
        // formData.append('taskName', submitData.taskName);
        // formData.append('documentType', submitData.documentType);
        // submitData.files.forEach((fileItem, index) => {
        //   formData.append(`files[${index}]`, fileItem.file);
        //   formData.append(`fileInfos[${index}][documentType]`, fileItem.documentType);
        //   formData.append(`fileInfos[${index}][filename]`, fileItem.filename);
        // });
        // await createTaskApi(formData);
        
        this.$message.success("提交成功！请查看控制台输出");
        
        // 触发父组件事件
        this.$emit("submit-success", submitData);
        
        // 关闭抽屉
        // this.handleClose();
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
