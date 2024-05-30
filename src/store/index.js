// store/index.js
import { createStore } from 'vuex';
import { connectWallet, getWalletAddress } from '@/utils/utils';

// 保持你的状态、突变、动作和getter定义不变
const state = {
  isLoggedIn: false, 
  loginId: '',
  processId: ''
};
const mutations = {
  SET_LOGGED_IN(state, status) {
    state.isLoggedIn = status;
  },
  SET_LOGIN_ID(state, loginId) {
    state.loginId = loginId;
  },
  SET_PROCESS_ID(state, processId) {
    state.processId = processId;
  }
};
const actions = {
  async login({ commit }) {
    // 这里应该是调用API进行登录验证的地方
    // 假设登录成功
    var isSuccess = await connectWallet();
    if(isSuccess){
      var address = await getWalletAddress();
      commit('SET_LOGGED_IN', true);
      commit('SET_LOGIN_ID', address);
    } else {
      commit('SET_LOGGED_IN', false);
      commit('SET_LOGIN_ID', '');
    }
  },
  async logout({ commit }) {
    await window.arweaveWallet.disconnect();
    commit('SET_LOGGED_IN', false);
    commit('SET_LOGIN_ID', '');
  },
  async switchProcess({ commit }, newProcessId) {
    commit('SET_PROCESS_ID', newProcessId)
  }
};
const getters = {
  isLoggedIn: state => state.isLoggedIn,
  loginId: state => state.loginId,
  processId: state => state.processId
};

// 使用 createStore 创建 store 实例
export default createStore({
  state,
  mutations,
  actions,
  getters,
});