<template>
  <div class="loading-example">
    <h2>全局Loading组件使用示例</h2>
    
    <div class="example-section">
      <h3>基本用法</h3>
      <button @click="showBasicLoading">显示基本Loading</button>
      <button @click="hideLoading">隐藏Loading</button>
    </div>
    
    <div class="example-section">
      <h3>自定义文本</h3>
      <button @click="showCustomLoading">显示自定义文本Loading</button>
    </div>
    
    <div class="example-section">
      <h3>模拟异步操作</h3>
      <button @click="simulateAsyncOperation">模拟异步操作</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingExample',
  methods: {
    // 显示基本loading
    showBasicLoading() {
      this.$showLoading()
    },
    
    // 显示自定义文本loading
    showCustomLoading() {
      this.$showLoading('正在处理数据...')
    },
    
    // 隐藏loading
    hideLoading() {
      this.$hideLoading()
    },
    
    // 模拟异步操作
    async simulateAsyncOperation() {
      this.$showLoading('正在处理请求...')
      
      try {
        // 模拟API请求
        await new Promise(resolve => setTimeout(resolve, 3000))
        console.log('操作完成')
      } catch (error) {
        console.error('操作失败:', error)
      } finally {
        this.$hideLoading()
      }
    }
  }
}
</script>

<style scoped>
.loading-example {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fafafa;
}

.example-section h3 {
  margin-top: 0;
  color: #303133;
}

button {
  margin: 5px 10px 5px 0;
  padding: 8px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background-color: #66b1ff;
}

button:active {
  background-color: #3a8ee6;
}
</style>
