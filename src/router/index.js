import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/sealRemoval",
  },
  {
    path: "/housePropertyAnalysis",
    component: (resolve) => require(["@/views/house-property"], resolve),
    meta: {
      title: "房产证解析",
    },
  },
  {
    path: "/vehicleQualificationCertificateAnalysis",
    component: (resolve) => require(["@/views/vehicle-qualification-certificate"], resolve),
    meta: {
      title: "车辆合格证解析",
    },
  },
  {
    path: "/proofIncome",
    component: (resolve) => require(["@/views/proof-income"], resolve),
    meta: {
      title: "收入证明解析",
    },
  },
  {
    path: "/drivingLicense",
    component: (resolve) => require(["@/views/driving-license"], resolve),
    meta: {
      title: "驾驶证解析",
    },
  },
  {
    path: "/receiptAnalysis",
    component: (resolve) => require(["@/views/receipt-analysis"], resolve),
    meta: {
      title: "回单解析",
    },
  },
  {
    path: "/treasuryFlowAnalysis",
    component: (resolve) => require(["@/views/treasuryFlow-Analysis"], resolve),
    meta: {
      title: "流水解析",
    },
  },
  {
    path: "/businessLicenseAnalysis",
    component: (resolve) =>
      require(["@/views/businessLicenseAnalysis"], resolve),
    meta: {
      title: "营业执照解析",
    },
  },
  {
    path: "/certificateAnalysis",
    component: (resolve) => require(["@/views/certificateAnalysis"], resolve),
    meta: {
      title: "资质证书解析",
    },
  },
  {
    path: "/sealRemoval",
    component: (resolve) => require(["@/views/sealRemoval"], resolve),
    meta: {
      title: "印章去除",
    },
  },
  {
    path: "/sealRecognition",
    component: (resolve) => require(["@/views/sealRecognition"], resolve),
    meta: {
      title: "印章识别",
    },
  },
  {
    path: "/sealTest",
    component: (resolve) => require(["@/views/sealTest"], resolve),
    meta: {
      title: "印章检测",
    },
  },
  {
    path: "/identityCardAnalysis",
    component: (resolve) => require(["@/views/identityCard"], resolve),
    meta: {
      title: "身份证解析",
    },
  },
  {
    path: "/documentOcr",
    component: (resolve) => require(["@/views/docOcr"], resolve),
    meta: {
      title: "文档OCR",
    },
  },
  {
    path: "/formOcr",
    component: (resolve) => require(["@/views/tableOcr"], resolve),
    meta: {
      title: "表格OCR",
    },
  },
  {
    path: "/vatSpecialvAnalysis",
    component: (resolve) => require(["@/views/vatInvoice"], resolve),
    meta: {
      title: "增值税发票解析",
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
