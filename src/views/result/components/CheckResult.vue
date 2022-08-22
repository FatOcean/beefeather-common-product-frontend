<template>
  <div class="check-result">
    <div class="result-title" @click="showContent1 = !showContent1">
      <span>核查结果</span>
      <i :class="['lls-icon-arrow-up', showContent1 && 'close']"></i>
    </div>
    <div class="result-content" v-show="showContent1">
      <lls-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <lls-tab-pane name="first">
          <span slot="label">
            <i class="lls-icon-error" style="color: #F82418;font-size: 14px"></i>
            核查不通过(10)
          </span>
          <div class="result-type">
            <span><i class="lls-icon-camera"></i>OCR识别值</span>
            <span><i class="lls-icon-tickets"></i>系统录入值</span>
          </div>
          <lls-table
            :data="tableData"
            style="width: 100%">
            <lls-table-column
              prop="identity"
              label="核查对象">
            </lls-table-column>
            <lls-table-column
              prop="content"
              label="标题标题标题">
            </lls-table-column>
            <lls-table-column
              prop="autoTime"
              label="自动核查时间">
            </lls-table-column>
            <lls-table-column
              prop="result"
              label="人工核查结果">
            </lls-table-column>
            <lls-table-column
              prop="time"
              label="人工核查时间">
            </lls-table-column>
          </lls-table>
        </lls-tab-pane>
        <lls-tab-pane name="second">
          <span slot="label">
            <i class="lls-icon-error" style="color: #1BC65C;font-size: 14px"></i>
            核查通过(12)
          </span>
          核查通过
        </lls-tab-pane>
      </lls-tabs>
    </div>
    <div class="result-title" @click="showContent2 = !showContent2">
      <span>异常结果人工核查</span>
      <i :class="['lls-icon-arrow-up', showContent2 && 'close']"></i>
    </div>
    <div class="result-content" v-show="showContent2">
      <div class="second-title">
        <div class="line-v"></div>
        <div>债务人</div>
        <div class="line-h"></div>
      </div>
      <div class="content-warpper">
        <div class="item">
          <span class="type">中文名称</span>
          <span class="info">华为国际控股集团</span>
        </div>
        <div class="item">
          <span class="type">英文名称</span>
          <span class="info">Hua Wei International International</span>
        </div>
        <div class="item">
          <span class="type">档案特别注解</span>
          <span class="info">这是一段很长的文字说明这是一段很长的文字这是一段很长的文字说明这是一段很长的文字这是一段很长的文字说明这是一段很长的文字这是一段很长的文字说明这是一段很长的文字这是一段很长的文字说明这是一段很长的文字...</span>
        </div>
        <div class="item">
          <span class="type">资料来源</span>
          <span class="info"><a href="https://djrc.dowjones.com/">https://djrc.dowjones.com/</a></span>
        </div>
        <div class="item line"></div>
        <div class="item">
          <span class="type result-type">人工核查结果</span>
          <span class="info">
            <lls-radio v-model="checkResult1" label="pass">通过</lls-radio>
            <lls-radio v-model="checkResult1" label="fail">不通过</lls-radio>
          </span>
        </div>
        <div class="item">
          <span class="type result-type" style="line-height: 32px">核查意见</span>
          <span class="info">
            <lls-input v-model="opinion" placeholder="核查通过必填"></lls-input>
          </span>
        </div>
      </div>
      <div class="second-title">
        <div class="line-v"></div>
        <div>债务人法定代表人</div>
        <div class="line-h"></div>
      </div>
      <div class="content-warpper">
        <div class="item">
          <span class="type">中文名称</span>
          <span class="info">易千千</span>
        </div>
        <div class="item">
          <span class="type">英文名称</span>
          <span class="info">Qianqian Yi</span>
        </div>
        <div class="item">
          <span class="type">资料来源</span>
          <span class="info"><a href="https://djrc.dowjones.com/">https://djrc.dowjones.com/</a></span>
        </div>
        <div class="item line"></div>
        <div class="item">
          <span class="type result-type">人工核查结果</span>
          <span class="info">
            <lls-radio v-model="checkResult1" label="pass">通过</lls-radio>
            <lls-radio v-model="checkResult1" label="fail">不通过</lls-radio>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showContent1: true,
      showContent2: true,
      activeName: 'first',
      tableData: [
        { identity: '债务人', content: '内容内容内容', autoTime: '2019-09-21 15:33:23', result: '--', time: '--' },
        { identity: '债务人法定代表人', content: '内容内容内容', autoTime: '2019-09-21 15:33:23', result: '--', time: '--' },
        { identity: '债务被授权人', content: '内容内容内容', autoTime: '2019-09-21 15:33:23', result: '--', time: '--' }
      ],
      checkResult1: 'fail',
      checkResult2: 'fail',
      opinion: ''
    }
  },

  methods: {
    handleClick () {}
  },

  created () {
  }
}
</script>

<style lang="stylus" scoped>
@mixin title-font {
  color: #000;
  font-size: 14px;
  font-weight: bold;
}
.check-result {
  padding: 0 30px;
}

.result-title {
  height: 36px;
  border-radius: 4px;
  background-color: #EEF2F6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  color: #9BA1A9;
  cursor: pointer;
  >span {
    @include title-font;
  }
  .close {
    transform: rotate(180deg);
  }
}

.result-content {
  margin-top: 16px;
  margin-bottom: 20px;
  .result-type {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    i {
      margin-right: 5px;
    }
    >span:first-child {
      margin-right: 20px;
    }
  }
}

.second-title {
  @include title-font;
  display: flex;
  align-items: center;
  height: 14px;
  line-height: 14px;
  padding-left: 16px;
  margin-top: 20px;
  .line-v {
    width: 4px;
    height: 12px;
    border-radius: 3px;
    background-color: #0887FF;
    margin-right: 5px;
  }
  .line-h {
    flex-grow: 1;
    height: 0;
    border-bottom: 1px dashed #E9E9E9;
    margin-left: 8px;
  }
}

.content-warpper {
  padding: 10px 90px 5px;
  font-size: 12px;
  .item {
    display: flex;
    margin-bottom: 10px;
    &.line {
      height: 0;
      border-bottom: 1px dashed #E9E9E9;
    }
    .type {
      flex-shrink: 0;
      width: 80px;
      margin-right: 8px;
      color: #888;
      text-align: right;
    }
    .result-type {
      color: #444;
    }
    .info {
      flex-grow: 1;
    }
  }
}
</style>
