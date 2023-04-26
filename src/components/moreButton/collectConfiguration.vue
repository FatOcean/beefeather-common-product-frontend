<template>
  <div class="collect-configuration">
    <lls-button :type="type" :plain="plain" @click="dialogOpen">
      <svg-icon iconClass="服务配置"></svg-icon
      ><span class="button-text">收集配置</span>
    </lls-button>
    <lls-dialog
      title="收集配置"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="dialogClose"
      append-to-body
    >
      <lls-form ref="form">
        <lls-form-item label="数据集" :rules="[{ required: true }]">
          <lls-select
            v-model="datasetId"
            placeholder="请选择数据集名称"
            @visible-change="handleVisibleChange"
          >
            <lls-option
              v-for="(item, index) in serviceOptions"
              :key="index"
              :label="item.datasetName"
              :value="item.datasetId"
              :disabled="item.serviceStatus == '不可用'"
            ></lls-option>
          </lls-select>
        </lls-form-item>
        <div class="detection-hint">
          请选择一个数据集进行难例样本收集，如没有请前往
          <!-- <span class="detection-hint-span" @click="jumpDataSet">数据管理</span> -->
          <!-- <router-link
            class="detection-hint-span"
            custom
            to="/systemTools/dataAdmin"
             v-slot="{ href }" 
          >

            <a target="_blank" :href="href" @click="skipData">数据管理</a>
          </router-link> -->
          <lls-button type="text" @click="skipData">数据管理</lls-button>
          创建
        </div>
      </lls-form>
      <span slot="footer" class="dialog-footer">
        <lls-button type="primary" plain @click="dialogClose">取 消</lls-button>
        <lls-button
          type="primary"
          v-throttle="{ handler: confirm, event: 'click', time: 500 }"
          :disabled="datasetId === '' || serviceStatus == '不可用'"
          >确 定</lls-button
        >
      </span>
    </lls-dialog>
  </div>
</template>
<script>
//  查询数据集默认信息
import { queryDataSet } from "@/api/documentOcr/collectConfiguration.js";
//  查询数据集列表
import { dataSetList } from "@/api/documentOcr/collectConfiguration.js";
//  保存收集配置
import { saveDatasetInfo } from "@/api/documentOcr/collectConfiguration.js";
import { mapMutations } from "vuex";
export default {
  name: "collectConfiguration",
  props: {
    plain: { type: Boolean, default: true },
    productName: String,
    type: { type: String, default: "primary" },
  },
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示和隐藏的属性
      loading: true,
      // 服务数据
      serviceId: "",
      // 当前数据
      datasetId: "",
      // 调用服务名称下拉框选项
      serviceOptions: [],
    };
  },
  computed: {
    params() {
      let obj = {};
      this.serviceOptions.forEach((item) => {
        if (item.datasetId === this.datasetId) {
          obj = {
            datasetId: item.datasetId,
            datasetName: item.datasetName,
            datasetUrl: item.datasetUrl,
            productName: this.productName,
          };
        }
      });
      return obj;
    },
    serviceStatus() {
      let obj = {};
      this.serviceOptions.forEach((item) => {
        if (item.datasetId === this.datasetId) {
          obj = item;
        }
      });
      return obj.serviceStatus;
    },
  },
  methods: {
    skipData() {
      window.open(`${window.location.origin}/#/systemTools/dataAdmin`);
    },
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: "messageGeneralProduct",
          fixed: fixed,
        },
        "*"
      );
    },
    // 弹窗打开
    dialogOpen() {
      this.datasetId = this.serviceId;
      this.dialogVisible = true;
      this.postFixdMessage(true);
    },
    // 弹窗关闭
    dialogClose() {
      this.dialogVisible = false;
      this.postFixdMessage(false);
    },
    // 确定按钮
    confirm() {
      // 调用保存接口
      saveDatasetInfo(
        "/general-product-web/collectConfig/saveDatasetInfo",
        this.params
      ).then((res) => {
        if (res.data.code === "200") {
          // this.dialogVisible = false;
          this.dialogClose();

          this.serviceId = this.datasetId;
          this.serviceOptions = this.serviceOptions.filter((item) => {
            return item.serviceStatus !== "不可用";
          });
          this.$message({
            message: "收集配置成功",
            type: "success",
            offset: 60,
          });
        } else {
          this.datasetId = "";
          this.$message({
            message: res.data.message,
            type: "error",
            offset: 60,
          });
        }
      });
    },
    // 查询数据集默认信息
    queryDefaultService() {
      const queryUrl = `/general-product-web/collectConfig/queryCollectConfigInfo?productName=${this.productName}`;
      queryDataSet(queryUrl).then((res) => {
        if (res.data.code === "200") {
          // this.dialogVisible = true
          const data = res.data;
          if (data.data.datasetUrl) {
            this.serviceId = data.data.datasetId;
            this.datasetId = data.data.datasetId;
          }
          const serviceArr = this.serviceOptions.filter((i) => {
            return i.datasetId == this.serviceId;
          });

          if (serviceArr.length == 0 && this.serviceId) {
            this.serviceOptions.unshift({
              datasetId: data.data.datasetId,
              datasetName: data.data.datasetName + "（不可用）",
              datasetUrl: data.data.datasetUrl,
              serviceStatus: "不可用",
            });
          }
        }
      });
    },
    jumpDataSet() {
      this.$router.push("/systemTools/dataAdmin");
    },
    handleVisibleChange() {
      dataSetList("/general-product-web/collectConfig/datasetList").then(
        (res) => {
          // console.log(res, '数据集列表')
          if (res.data.code === "200") {
            const data = res.data;
            if (data.data) {
              // 赋值下拉框数组
              this.serviceOptions = data.data;
            }
          }
        }
      );
    },
  },
  mounted() {
    // 数据集列表
    dataSetList("/general-product-web/collectConfig/datasetList").then(
      (res) => {
        // console.log(res, '数据集列表')
        if (res.data.code === "200") {
          const data = res.data;
          if (data.data) {
            // 赋值下拉框数组
            this.serviceOptions = data.data;
            this.queryDefaultService();
          }
        }
      }
    );
  },
};
</script>
<style lang="stylus" scoped>
::v-deep .lls-select {
  width: 86%;
}

.collect-configuration {
  display: inline-block;
  margin-right: 12px;
  vertical-align: middle;
}

.detection-hint {
  margin-left: 44px;
  color: #8492a6;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #8492a6;
  line-height: 18px;
}

.detection-hint-span {
  color: #0887ff;
  cursor: pointer;
}

.lls-form-item {
  margin-bottom: 4px;
}

::v-deep .lls-dialog {
  width: 440px !important;
}

::v-deep .lls-dialog__body {
  min-height: 80px;
}

.button-text {
  vertical-align: middle;
  // margin-left: 4px;
}

::v-deep .lls-select:hover .lls-input__inner {
  border-color: #0887ff !important;
}

::v-deep .lls-select .lls-input.is-disabled .lls-input__inner:hover {
  border-color: #E9E9E9 !important;
}
</style>
