<template>
  <ul class="query">
    <li class="query-item">
      <span>标题标题标题</span>
      <lls-input v-model="query.a" placeholder="请输入"></lls-input>
    </li>
    <li class="query-item">
      <span>标题标题标题</span>
      <lls-input v-model="query.b" placeholder="请输入"></lls-input>
    </li>
    <li class="query-item">
      <span>标题标题标题</span>
      <lls-input v-model="query.c" placeholder="请输入"></lls-input>
    </li>
    <li class="query-item">
      <span>标题标题标题</span>
      <lls-input v-model="query.d" placeholder="请输入"></lls-input>
    </li>
    <li class="query-item">
      <lls-dropdown>
        <span class="lls-dropdown-link">
          更多查询<i class="lls-icon-arrow-down lls-icon--right"></i>
        </span>
        <lls-dropdown-menu slot="dropdown">
          <lls-dropdown-item icon="lls-icon-search">查询01</lls-dropdown-item>
          <lls-dropdown-item icon="lls-icon-search" divided>查询02</lls-dropdown-item>
          <lls-dropdown-item icon="lls-icon-search" divided>查询03</lls-dropdown-item>
        </lls-dropdown-menu>
      </lls-dropdown>
    </li>
  </ul>
</template>

<script>
export default {
  data () {
    return {
      query: {
        a: '',
        b: '',
        c: '',
        d: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
.query {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  .query-item {
    display: flex;
    font-size: 12px;
    line-height: 32px;
    margin-right: 20px;
    margin-top: 5px;
    .lls-input {
      margin-left: 8px;
      width: 160px;
    }
    .lls-dropdown-link {
      cursor: pointer;
      color: #0887FF;
    }
    .lls-icon-arrow-down {
      font-size: 12px;
    }
  }
}
</style>
