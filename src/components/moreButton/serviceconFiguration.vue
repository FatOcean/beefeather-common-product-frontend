<template>
  <div class="servicecon-figuration">
    <lls-button :type="type" :plain="plain" @click="dialogOpen">
      <!-- <svg-icon iconClass="服务配置"></svg-icon> -->
      <img
        src="./服务配置.svg"
        alt=""
        style="vertical-align: middle; margin-right: 4px"
        v-if="isicon"
      />
      <span class="button-text">服务配置</span>
    </lls-button>
    <lls-dialog
      title="服务配置"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="dialogClose"
      append-to-body
    >
      <lls-form ref="form" label-width="100px">
        <lls-radio-group
          v-model="configType"
          style="margin-bottom: 22px"
          @change="handleConfigType"
        >
          <lls-radio-button
            v-for="(item, index) in configurationArray"
            :key="index"
            :label="item.label"
            :value="item.value"
            >{{ item.label }}</lls-radio-button
          >
        </lls-radio-group>
        <template v-if="configType === '默认服务配置'">
          <lls-form-item label="调用服务名称">
            <lls-select
              v-model="dataId"
              :filter-bar="true"
              placeholder="请选择服务名称"
            >
              <lls-option
                v-for="(item, index) in serviceOptions"
                :key="index"
                :label="item.serviceName"
                :value="item.serviceId"
                :disabled="item.serviceStatus == '不可用'"
              ></lls-option>
            </lls-select>
          </lls-form-item>
          <lls-form-item label="接口地址">
            <lls-input v-model="params.servicePortAddress" disabled></lls-input>
          </lls-form-item>
          <dl class="service-description">
            <dt>服务描述</dt>
            <dd>{{ params.serviceDescription || "- -" }}</dd>
          </dl>
        </template>
        <!-- 自定义服务配置 -->
        <template v-else>
          <lls-form-item label="接口地址" style="margin-bottom: 4px">
            <lls-input
              v-model="dataPortAddress"
              :disabled="checkStatus === 'checking'"
              @blur="handleCheck"
              @focus="handleFocus"
              placeholder="示例:127.0.0.1:6666"
            ></lls-input>
          </lls-form-item>
          <div v-show="checkStatus == null" class="detection-hint">
            系统将自动检测接口地址是否连接成功
          </div>
          <div class="detection-centre" v-show="checkStatus == 'checking'">
            <span
              v-loading="checkStatus == 'checking'"
              class="detection-loading"
            ></span>
            <div class="detection-centre-title">检测中</div>
          </div>
          <div class="detection-success-title" v-show="checkStatus === true">
            <i class="lls-icon-success"></i>
            <span>检测成功</span>
          </div>
          <div class="detection-error-title" v-show="checkStatus === false">
            <i class="lls-icon-error"></i>
            <span>检测失败</span>
          </div>
        </template>

        <div></div>
      </lls-form>
      <span slot="footer" class="dialog-footer">
        <lls-button type="primary" plain @click="dialogClose">取 消</lls-button>
        <lls-button
          type="primary"
          v-throttle="{ handler: confirm, event: 'click', time: 500 }"
          :disabled="
            (isSelfConfig && checkStatus !== true) ||
            serviceStatus == '不可用' ||
            (!isSelfConfig && !params.servicePortAddress)
          "
          >确 定</lls-button
        >
      </span>
    </lls-dialog>
  </div>
</template>
<script>
// 自定义服务接口
// import { customServiceConfiguration } from '../../../api/documentOcr/customServiceConfiguration.js'
// 检测服务接口
import { checkingInterfaceStatus } from "@/api/documentOcr/customServiceConfiguration.js";
// 保存服务接口
import { saveServiceConfiguration } from "@/api/documentOcr/defaultServiceConfiguration.js";
// 默认服务配置下拉
import {
  defaultServiceConfigurationSelect,
  defaultServiceConfigurationSelectForBody,
} from "@/api/documentOcr/defaultServiceConfiguration";
// 默认服务配置
import { defaultServiceConfiguration } from "@/api/documentOcr/defaultServiceConfiguration";
export default {
  name: "Serviceconfiguration",
  props: {
    plain: Boolean,
    productName: String,
    type: { type: String, default: "primary" },
    isicon: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  data() {
    return {
      dialogVisible: false, // 控制弹窗显示和隐藏的属性
      checkStatus: null,
      // status: null, // 检测失败成功
      // flag: false,
      // 单选按钮选项
      configType: "默认服务配置",
      serviceConfigType: "默认服务配置",
      configurationArray: [
        { label: "默认服务配置", value: "默认服务配置" },
        { label: "自定义服务配置", value: "自定义服务配置" },
      ],
      // 调用服务名称下拉框选项
      serviceOptions: [],
      temporaryAddress: "", // 临时自定义地址
      dataPortAddress: "", // 当前录入自定义地址
      servicePortAddress: "", // // 服务端保存的自定义地址
      dataId: "", // 当前录入的服务id
      serviceId: "", // 服务端保存的服务id
    };
  },
  computed: {
    // 服务配置参数
    params() {
      let obj = {};
      this.serviceOptions.forEach((item) => {
        if (item.serviceId === this.dataId) {
          obj = item;
        }
      });
      return {
        serviceId: this.isSelfConfig ? "00000000" : obj.serviceId,
        serviceName: this.isSelfConfig ? "自定义服务" : obj.serviceName,
        servicePortAddress: this.isSelfConfig
          ? this.dataPortAddress
          : obj.servicePortAddress,
        isSelfConfig: this.isSelfConfig,
        productName: this.productName,
        serviceDescription: this.isSelfConfig ? "" : obj.serviceDescription,
      };
    },
    serviceStatus() {
      let obj = {};
      this.serviceOptions.forEach((item) => {
        if (item.serviceId === this.dataId) {
          obj = item;
        }
      });
      return obj.serviceStatus;
    },
    // 是否是自定义服务配置
    isSelfConfig() {
      return this.configType === "自定义服务配置";
    },
  },
  methods: {
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
      this.configType = this.serviceConfigType;
      this.dataId = this.serviceId;
      this.dialogVisible = true;
      this.postFixdMessage(true);
      // 默认服务配置接口下拉
      // 这里有些接口的请求参数方式不一样，放在body里的需要判断一下
      const { serviceListUrl, productName } = this;
      this.queryServiceList(
        defaultServiceConfigurationSelect,
        "/general-product-web/serviceConfig/serviceList",
        productName
      );
    },
    // 弹窗关闭
    dialogClose() {
      this.dialogVisible = false;
      this.postFixdMessage(false);
    },
    // 切换配置类型
    handleConfigType() {
      this.checkStatus = null;
      if (this.isSelfConfig) {
        this.dataId = "00000000";
        this.dataPortAddress =
          this.configType == this.serviceConfigType
            ? this.servicePortAddress
            : "";
      } else {
        this.dataId =
          this.configType == this.serviceConfigType ? this.serviceId : "";
      }
    },
    // 检测地址
    handleCheck() {
      if (!this.dataPortAddress) {
        return;
      }
      if (this.dataPortAddress == this.temporaryAddress) {
        this.checkStatus = this.beforeStatus;
        return;
      }
      this.checkStatus = "checking";
      checkingInterfaceStatus(
        "/general-product-web/serviceConfig/checkConnect",
        this.dataPortAddress
      )
        .then((res) => {
          if (res.data.code === "200") {
            const data = res.data;
            this.checkStatus = data.data;
          } else {
            this.checkStatus = false;
          }
        })
        .catch((error) => {
          this.checkStatus = false;
          console.log(error);
        });
    },
    handleFocus() {
      this.beforeStatus = this.checkStatus;
      this.checkStatus = null;
      this.temporaryAddress = this.dataPortAddress;
    },

    // 确定按钮
    confirm() {
      saveServiceConfiguration(
        "/general-product-web/serviceConfig/saveConfigInfo",
        this.params
      ).then((res) => {
        if (res.data.code === "200") {
          // console.log(res, '保存默认服务配置')
          // this.dialogVisible = false;
          this.dialogClose();

          this.serviceConfigType = this.configType;
          this.serviceId = this.dataId;
          this.servicePortAddress = this.dataPortAddress;
          this.$message({
            message: res.data.message,
            type: "success",
            offset: 60,
          });
          this.serviceOptions = this.serviceOptions.filter((item) => {
            return item.serviceStatus !== "不可用";
          });
        } else {
          this.dialogVisible = true;
          this.$message({
            message: res.data.message,
            type: "error",
            offset: 60,
          });
        }
      });
    },
    // 默认服务配置接口
    queryDefaultServiceConfig() {
      defaultServiceConfiguration(
        "/general-product-web/serviceConfig/queryServiceConfigInfo",
        this.productName
      ).then((res) => {
        if (res.data.code === "200" && res.data.data) {
          const data = res.data.data;
          this.configType = data.isSelfConfig
            ? "自定义服务配置"
            : "默认服务配置";
          this.serviceConfigType = data.isSelfConfig
            ? "自定义服务配置"
            : "默认服务配置";
          this.dataId = data.serviceId;
          this.serviceId = data.serviceId;
          this.servicePortAddress = data.servicePortAddress;
          this.dataPortAddress = data.servicePortAddress;
          let obj = null;
          this.serviceOptions.forEach((item) => {
            if (item.serviceId === this.serviceId) {
              obj = item;
            }
          });
          if (
            !obj &&
            this.serviceId !== "" &&
            this.serviceId != undefined &&
            !data.isSelfConfig
          ) {
            this.serviceOptions.unshift({
              serviceName: data.serviceName + "（不可用）",
              serviceId: this.serviceId,
              servicePortAddress: data.servicePortAddress,
              serviceStatus: "不可用",
              serviceDescription: data.serviceDescription,
            });
          }
        }
      });
    },
    queryServiceList(methods, url, data) {
      methods(url, data).then((res) => {
        if (res.data.code === "200") {
          // console.log(res, '默认服务配置接口下拉')
          const data = res.data;
          // 赋值下拉选项数组
          this.serviceOptions = data.data;
          // 默认服务配置接口
          this.queryDefaultServiceConfig();
        }
      });
    },
  },
};
</script>
<style lang="stylus" scoped>
::v-deep .lls-select {
  width: 100%;
}

.servicecon-figuration {
  display: inline-block;
  // margin-right: 10px;
  vertical-align: middle;
}

.service-description {
  display: flex;
  line-height: 18px;

  dt {
    width: 100px;
    color: #202d40;
    padding-right: 8px;
    text-align: right;
  }

  dd {
    flex: 1;
    color: #8492a6;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
}

.detection-hint {
  margin-left: 100px;
  color: #8492a6;
}

.detection-centre {
  position: relative;

  .detection-loading {
    position: absolute;
    top: 14px;
    left: 100px;
    width: 14px;
    height: 14px;
  }
}

::v-deep .lls-loading-spinner .circular {
  width: 14px;
  height: 14px;
}

.detection-success-title, .detection-error-title, .detection-centre-title {
  margin-left: 100px;
  color: #202d40;
  height: 18px;
  line-height: 18px;

  [class*=' lls-icon-'], [class^=lls-icon-] {
    margin-right: 4px;
    vertical-align: middle;
  }

  >span {
    vertical-align: middle;
  }
}

.detection-centre-title {
  margin-left: 117px;
}

::v-deep .lls-icon-success:before, .lls-icon-error:before {
  font-size: 14px;
}

.lls-icon-success:before {
  color: #1bc65c;
}

.lls-icon-error:before {
  color: #f82418;
}

::v-deep .lls-dialog {
  width: 490px !important;

  .lls-dialog__body {
    min-height: 230px;
    padding-bottom: 20px;
  }
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
