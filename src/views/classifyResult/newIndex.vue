<template>
  <div class="classify-page">
    <!-- 头部 -->
    <div class="header">
      <div class="header-left">
        <el-button icon="el-icon-arrow-left" @click="goBack" circle></el-button>
        <span class="title">单据分类</span>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>

    <!-- 图片内容区域 -->
    <div class="content-area">
      <div class="image-grid">
        <div
          v-for="(item, index) in imageList"
          :key="index"
          class="image-item"
        >
          <!-- 单据类型选择 -->
          <div class="item-header">
            <div class="form-item">
              <label>单据类型：</label>
              <el-select
                v-model="item.docType"
                placeholder="请选择"
                size="small"
                style="width: 150px"
              >
                <el-option
                  v-for="doc in docTypeOptions"
                  :key="doc.value"
                  :label="doc.label"
                  :value="doc.value"
                ></el-option>
              </el-select>
            </div>
            <div class="form-item">
              <label>分组：</label>
              <el-input
                v-model="item.group"
                placeholder="分组标识"
                size="small"
                style="width: 100px"
              ></el-input>
            </div>
          </div>

          <!-- 图片展示 -->
          <div class="image-container">
            <el-image
              :src="item.imageUrl"
              :preview-src-list="[item.imageUrl]"
              fit="contain"
              class="image"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="image-label">{{ item.imageName }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ClassifyNew',
  data() {
    return {
      // 单据类型选项
      docTypeOptions: [
        { label: '发票', value: 'invoice' },
        { label: '合同', value: 'contract' },
        { label: '收据', value: 'receipt' },
        { label: '提单', value: 'bill_of_lading' },
        { label: '装箱单', value: 'packing_list' },
        { label: '商业发票', value: 'commercial_invoice' },
        { label: '产地证', value: 'certificate_of_origin' },
        { label: '保险单', value: 'insurance_policy' }
      ],
      // 图片列表数据
      imageList: [
        {
          id: 1,
          docType: 'invoice',
          group: 'S1',
          imageUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
          imageName: '10_46fb064dce3.jpg'
        },
        {
          id: 2,
          docType: 'contract',
          group: 'S1',
          imageUrl: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
          imageName: '11_4f3847ae7186.jpg'
        },
        {
          id: 3,
          docType: 'receipt',
          group: 'S1',
          imageUrl: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
          imageName: '12_ce61b957ed6a.jpg'
        },
        {
          id: 4,
          docType: 'bill_of_lading',
          group: 'S1',
          imageUrl: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
          imageName: '13_3432b02b932d.jpg'
        },
        {
          id: 5,
          docType: 'packing_list',
          group: 'S2',
          imageUrl: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
          imageName: '14_5621c34a876e.jpg'
        },
        {
          id: 6,
          docType: 'commercial_invoice',
          group: 'S2',
          imageUrl: 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
          imageName: '15_7843f92b456c.jpg'
        },
        {
          id: 7,
          docType: 'certificate_of_origin',
          group: 'S2',
          imageUrl: 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
          imageName: '16_8954a03b567d.jpg'
        },
        {
          id: 8,
          docType: 'insurance_policy',
          group: 'S2',
          imageUrl: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
          imageName: '17_9065b14c678e.jpg'
        }
      ]
    }
  },
  methods: {
    // 返回
    goBack() {
      this.$confirm('确定要返回吗？未保存的修改将丢失', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.back()
      }).catch(() => {})
    },

    // 提交
    handleSubmit() {
      // 验证是否所有图片都已选择单据类型
      const unclassified = this.imageList.filter(item => !item.docType)
      if (unclassified.length > 0) {
        this.$message.warning('请为所有单据选择类型')
        return
      }

      this.$confirm('确定要提交分类结果吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        // 这里可以添加提交逻辑
        console.log('提交数据：', this.imageList)
        this.$message.success('提交成功')

        // 提交成功后返回
        setTimeout(() => {
          this.$router.back()
        }, 1000)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped lang="stylus">
.classify-page {
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  padding: 16px 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;

  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.header-right {
  display: flex;
  gap: 12px;
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.image-item {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }
}

.item-header {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .form-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;

    label {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
      margin-right: 8px;
      font-weight: 500;
    }
  }
}

.image-container {
  position: relative;

  .image {
    width: 100%;
    height: 280px;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    cursor: pointer;

    /deep/ .el-image__inner {
      border-radius: 4px;
    }
  }

  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #ccc;

    i {
      font-size: 48px;
    }
  }

  .image-label {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

/* 响应式布局 */
@media (max-width: 1600px) {
  .image-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .image-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .image-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
