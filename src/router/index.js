import Vue from "vue";
import VueRouter from "vue-router";

import houseProperty from "../views/house-property/index.vue";
import proofIncome from "../views/proof-income/index.vue";
import vehicleQualificationCertificate from "../views/vehicle-qualification-certificate/index.vue";
import drivingLicense from "../views/driving-license/index.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/drivingLicense",
  },
  {
    path: "/houseProperty",
    component: houseProperty,
    meta: {
      title: "房产证解析",
    },
  },
  {
    path: "/vehicleQualificationCertificate",
    component: vehicleQualificationCertificate,
    meta: {
      title: "车辆合格证解析",
    },
  },
  {
    path: "/proofIncome",
    component: proofIncome,
    meta: {
      title: "收入证明解析",
    },
  },
  {
    path: "/drivingLicense",
    component: drivingLicense,
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
];

const router = new VueRouter({
  routes,
});

export default router;
