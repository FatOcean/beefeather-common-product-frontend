import Vue from "vue";
import Vuex from "vuex";

// 该指令必须在 store 创建之前执行
Vue.use(Vuex);

// Actions(行动): 处理交互行为
const actions = {};

// Mutations(变化): 修改 state 中的数据
const mutations = {
  // state: 存储的数据；    value: 发送的数据
  changePageMenuPerm(state, value) {
    // 修改 state 中存储的数据
    state.pageMenuPerm = value;
    // 修改后，页面会重新渲染
    console.log(state.pageMenuPerm);
  },
};

// State: 用于存储数据
const state = {
  // 按钮权限数据
  pageMenuPerm: {},
};

// 创建并导出 store
export default new Vuex.Store({
  actions,
  mutations,
  state,
});
