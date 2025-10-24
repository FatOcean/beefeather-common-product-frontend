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
import {getDocumentTypeList,createTask} from "@/api/taskManagement";
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
        } catch (error) {
          fileItem.status = "fail";
          console.error("上传文件出错:", error);
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

        const files = {}
        // 循环documentTypeFields 取出file对象
        Object.keys(this.documentTypeFields).forEach((docType) => {
          files[docType] = this.documentTypeFields[docType].map((file) => file.file)
        })
        
        // 构建提交数据
        const submitData = {
          taskName: this.form.taskName,
          documentType: this.form.documentType,
          files: files, // 所有文件列表
        };

        createTask(submitData).then((response) => {
          if (response.code === "200") {
            this.$message.success("提交成功！");
            this.handleClose();
          } else {
            this.$message.error("提交失败！");
          }
        }).catch((error) => {
          this.$message.error("提交失败！");
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
