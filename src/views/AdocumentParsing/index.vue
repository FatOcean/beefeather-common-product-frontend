<template>
  <div class="document-parsing">
    <lls-page-header @back="goBack" content="证件解析" bottom-line>
    </lls-page-header>
    <button @click="pushtest">测试</button>
    <ocrlayout
      @tabs="tabs"
      :data="documents"
      v-model="page"
      :activeTabIndex="activeTabIndex"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
      @resetId="() => (activeTextId = null)"
    >
      <lls-tabs
        @tab-click="handleClick"
        v-model="activeName"
        v-if="productName === 'id_card'"
      >
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        ></lls-tab-pane>
        <table cellspacing="0" class="table-data" id="table-data">
          <thead>
            <td colspan="2">字段名</td>
            <td>识别结果</td>
          </thead>
          <tbody v-for="i in pageDetail" :key="i.key">
            <tr
              :class="{
                active: activeTextId === i.id,
                commonCursor: !(i.position && i.position.length > 0),
              }"
              @click="(e) => clickHandler(e, i)"
            >
              <td colspan="2">{{ i.key }}</td>
              <td>{{ i.value }}</td>
            </tr>
          </tbody>
        </table>
      </lls-tabs>
      <table cellspacing="0" class="table-data" v-else id="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <tbody v-for="i in page.content" :key="i.key">
          <tr
            :class="{
              active: activeTextId === i.id,
              commonCursor: !(i.position && i.position.length > 0),
            }"
            @click="(e) => clickHandler(e, i)"
          >
            <td colspan="2">{{ i.key }}</td>
            <td>{{ i.value }}</td>
          </tr>
        </tbody>
      </table>
    </ocrlayout>
  </div>
</template>
<script>
import { staticData } from './staticData'
import ocrlayout from './ocr-layout'
import { mapState } from 'vuex'
export default {
  components: { ocrlayout },
  data() {
    return {
      // page: {}, // 当前页面数据信息
      percent: 0, // 进度条
      activeName: '',
      activeDocumentIndex: 0,
      checked: false,
      staticData,
      // documents: staticData.id_card,
      activeTabIndex: 0,
      tabsArray: [],
      activeTextId: 0,
      productName: 'id_card'
    }
  },

  watch: {
    checked(val) {
      this.$refs.documents.pathValue = null
      this.filterEmpty(val)
    }
  },
  created() {
    if (this.productName === 'id_card') {
      for (let i = 0; i < this.page.content.length; i++) {
        this.tabsArray[i] = { name: this.page.content[i].imageType }
      }
      this.activeName = this.tabsArray[0].name
    }
  },
  computed: {
    documents() {
      const document = JSON.parse(JSON.stringify(staticData[this.productName]))
      // if (this.staticName !== 'id_card') {
      //   const content = [
      //     { imageType: this.productName, identityList: document[0].content }
      //   ]
      //   document.content = content
      // } else {
      // this.activeName = ''
      // this.tabsArray = []
      // for (let i = 0; i < this.page.content.length; i++) {
      //   this.tabsArray[i] = { name: this.page.content[i].imageType }
      // }
      // this.activeName = this.tabsArray[0].name
      // }
      return document
    },
    page() {
      return this.documents[this.documents.length - 1]
    },
    pageDetail() {
      return this.page.content[this.activeTabIndex].identityList
    },
    ...mapState(['pageMenuPerm']),
    // example() {
    //   return this.documents[this.activeDocumentIndex]
    // },
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    }
  },
  mounted() {},
  methods: {
    setProductName(data) {
      this.activeTextId = 0
      this.productName = data.staticName
    },
    resetId() {},
    clickHandler(e, i) {
      const el = e.target.parentNode.firstChild
      if (!(i.position && i.position.length > 0)) {
        return
      }
      e = e || window.event
      if (i.value) {
        this.$refs.documents.handleClickText({
          el,
          value: i.position,
          id: i.id
        })
        this.activeTextId = i.id
      }
    },
    handleClick(value) {
      this.activeTabIndex = Number(value.index)
      this.$refs.documents.handleClick(value.index)
      this.$refs.documents.resetProps()
    },
    goBack() {},
    pushtest() {
      const data = [
        {
          taskId: 'U2023122519902441',
          status: 1,
          fileName: '身份证.jpg',
          imagePath:
            '/home/lls_data/product/license_analysis/id_card/systemadmin/U2023122519902441/身份证.jpg',
          height: 800,
          width: 600,
          content: [
            {
              imageType: '身份证人像页',
              identityList: [
                {
                  id: 1,
                  key: '姓名',
                  position: [
                    [
                      {
                        x: 121,
                        y: 66
                      },
                      {
                        x: 192,
                        y: 68
                      },
                      {
                        x: 191,
                        y: 95
                      },
                      {
                        x: 120,
                        y: 94
                      }
                    ]
                  ],
                  value: '王■'
                },
                {
                  id: 2,
                  key: '性别',
                  position: [
                    [
                      {
                        x: 119,
                        y: 116
                      },
                      {
                        x: 143,
                        y: 116
                      },
                      {
                        x: 143,
                        y: 141
                      },
                      {
                        x: 119,
                        y: 141
                      }
                    ]
                  ],
                  value: '男'
                },
                {
                  id: 3,
                  key: '民族',
                  position: [
                    [
                      {
                        x: 234,
                        y: 114
                      },
                      {
                        x: 259,
                        y: 114
                      },
                      {
                        x: 259,
                        y: 140
                      },
                      {
                        x: 234,
                        y: 140
                      }
                    ]
                  ],
                  value: '汉'
                },
                {
                  id: 4,
                  key: '出生日期',
                  position: [
                    [
                      {
                        x: 124,
                        y: 160
                      },
                      {
                        x: 303,
                        y: 160
                      },
                      {
                        x: 303,
                        y: 180
                      },
                      {
                        x: 124,
                        y: 180
                      }
                    ]
                  ],
                  value: '1987年2月10日'
                },
                {
                  id: 5,
                  key: '住址',
                  position: [
                    [
                      {
                        x: 121,
                        y: 207
                      },
                      {
                        x: 351,
                        y: 207
                      },
                      {
                        x: 351,
                        y: 254
                      },
                      {
                        x: 121,
                        y: 254
                      }
                    ]
                  ],
                  value: '福建省厦门市思明区莲前■日'
                },
                {
                  id: 6,
                  key: '公民身份号码',
                  position: [
                    [
                      {
                        x: 211,
                        y: 321
                      },
                      {
                        x: 482,
                        y: 321
                      },
                      {
                        x: 482,
                        y: 343
                      },
                      {
                        x: 211,
                        y: 343
                      }
                    ]
                  ],
                  value: '35020119870210'
                }
              ]
            },
            {
              imageType: '身份证国徽页',
              identityList: [
                {
                  id: 1,
                  key: '签发机关',
                  position: [
                    [
                      {
                        x: 247,
                        y: 678
                      },
                      {
                        x: 379,
                        y: 678
                      },
                      {
                        x: 379,
                        y: 703
                      },
                      {
                        x: 247,
                        y: 703
                      }
                    ]
                  ],
                  value: '新市公安局'
                },
                {
                  id: 2,
                  key: '有效期限',
                  position: [
                    [
                      {
                        x: 252,
                        y: 725
                      },
                      {
                        x: 414,
                        y: 725
                      },
                      {
                        x: 414,
                        y: 746
                      },
                      {
                        x: 252,
                        y: 746
                      }
                    ]
                  ],
                  value: '2010.07.01-长期'
                }
              ]
            }
          ],
          angle: 0,
          json: {
            predict_status: 'success',
            predict_result: {
              code: 200,
              image_size: {
                width: 600,
                height: 800
              },
              content: [
                {
                  data: {
                    active_time: {
                      bounding_box: {
                        top: 725,
                        left: 252,
                        width: 162,
                        height: 21
                      },
                      vertices: [
                        {
                          x: 252,
                          y: 725
                        },
                        {
                          x: 414,
                          y: 725
                        },
                        {
                          x: 414,
                          y: 746
                        },
                        {
                          x: 252,
                          y: 746
                        }
                      ],
                      text: '2010.07.01-长期'
                    },
                    issuing_authority: {
                      bounding_box: {
                        top: 678,
                        left: 247,
                        width: 132,
                        height: 25
                      },
                      vertices: [
                        {
                          x: 247,
                          y: 678
                        },
                        {
                          x: 379,
                          y: 678
                        },
                        {
                          x: 379,
                          y: 703
                        },
                        {
                          x: 247,
                          y: 703
                        }
                      ],
                      text: '新市公安局'
                    }
                  },
                  angle: 0,
                  type: 'idcard_back'
                },
                {
                  data: {
                    birthday: {
                      bounding_box: {
                        top: 160,
                        left: 124,
                        width: 179,
                        height: 20
                      },
                      vertices: [
                        {
                          x: 124,
                          y: 160
                        },
                        {
                          x: 303,
                          y: 160
                        },
                        {
                          x: 303,
                          y: 180
                        },
                        {
                          x: 124,
                          y: 180
                        }
                      ],
                      text: '1987年2月10日'
                    },
                    id_number: {
                      bounding_box: {
                        top: 321,
                        left: 211,
                        width: 271,
                        height: 22
                      },
                      vertices: [
                        {
                          x: 211,
                          y: 321
                        },
                        {
                          x: 482,
                          y: 321
                        },
                        {
                          x: 482,
                          y: 343
                        },
                        {
                          x: 211,
                          y: 343
                        }
                      ],
                      text: '35020119870210'
                    },
                    address: {
                      bounding_box: {
                        top: 207,
                        left: 121,
                        width: 230,
                        height: 47
                      },
                      vertices: [
                        {
                          x: 121,
                          y: 207
                        },
                        {
                          x: 351,
                          y: 207
                        },
                        {
                          x: 351,
                          y: 254
                        },
                        {
                          x: 121,
                          y: 254
                        }
                      ],
                      text: '福建省厦门市思明区莲前■日'
                    },
                    gender: {
                      bounding_box: {
                        top: 116,
                        left: 119,
                        width: 24,
                        height: 25
                      },
                      vertices: [
                        {
                          x: 119,
                          y: 116
                        },
                        {
                          x: 143,
                          y: 116
                        },
                        {
                          x: 143,
                          y: 141
                        },
                        {
                          x: 119,
                          y: 141
                        }
                      ],
                      text: '男'
                    },
                    nation: {
                      bounding_box: {
                        top: 114,
                        left: 234,
                        width: 25,
                        height: 26
                      },
                      vertices: [
                        {
                          x: 234,
                          y: 114
                        },
                        {
                          x: 259,
                          y: 114
                        },
                        {
                          x: 259,
                          y: 140
                        },
                        {
                          x: 234,
                          y: 140
                        }
                      ],
                      text: '汉'
                    },
                    name: {
                      bounding_box: {
                        top: 66,
                        left: 120,
                        width: 72,
                        height: 29
                      },
                      vertices: [
                        {
                          x: 121,
                          y: 66
                        },
                        {
                          x: 192,
                          y: 68
                        },
                        {
                          x: 191,
                          y: 95
                        },
                        {
                          x: 120,
                          y: 94
                        }
                      ],
                      text: '王■'
                    }
                  },
                  angle: 0,
                  type: 'idcard_front'
                }
              ]
            }
          }
        }
      ]
      data.map((item) => {
        item.imagePath = `${this.originLocation}?filename=${encodeURIComponent(
          item.imagePath
        )}`
      })
      this.staticData[this.productName] =
        this.staticData[this.productName].concat(data)
      // this.$refs.documents.activePageIndex = this.staticData[this.productName].length - 1
    },
    uploadFileData(res) {
      this.staticData[this.productName] = this.staticData[
        this.productName
      ].concat(res.data)
      return
      res.data.forEach((i) => {
        i.isUpload = true
      })
      res.data[0].images.forEach((item) => {
        item.url = `${this.originLocation}?filename=${encodeURIComponent(
          item.path
        )}`
      })
      if (this.documents.length >= 3) {
        this.documents.shift()
      }
      this.documents = res.data.concat(this.documents)
      this.activeDocumentIndex = 0
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.checked = false
      this.filterEmpty(false)
      this.activeDocumentIndex = activeDocumentIndex
    },
    filterEmpty(flag) {
      this.page.items = this.emptyData(this.page.items, flag)
      // this.page.describes = this.emptyData(this.page.describes, flag)
    },
    emptyData(arr, flag) {
      const newArr = arr.map((item) => {
        return {
          ...item,
          notEmpty: flag ? item.value === '' || !item.value : false
        }
      })
      return newArr
    }
  }
}
</script>
<style lang="stylus" scoped>
.table-data {
  width: 100%;
  margin-bottom: 16px;

  thead {
    background: #F3F4F6;

    td {
      border-top: 1px solid #E3E8F0;
      font-weight: bold;
      color: #202D40;

      &:last-child {
        width: 50%;
        color: #202D40;
        border-right: 1px solid #E3E8F0;
      }
    }
  }

  tr td:last-child {
    width: 50%;
    color: #202D40;
    border-right: 1px solid #E3E8F0;
  }

  .td-title {
    width: 33% !important;
    border-right: none !important;
  }

  tr {
    &:hover {
      background: #f6f9fb;
      cursor: pointer;
    }

    &.active {
      td:first-child {
        background: rgba(8, 135, 255, 0.1);
        border-top-left-radius: 4px;
        border-right: none;
        border-bottom-left-radius: 4px;
        border-color: #0887ff;
      }

      td:last-child {
        background: rgba(8, 135, 255, 0.1);
        border: 1px solid #0887ff;
        border-left: 1px solid #E3E8F0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
  }

  td {
    line-height: 40px;
    padding-left: 8px;
    color: #5F6C80;
    border-top: 1px solid #fff;
    border-bottom: 1px solid #E3E8F0;
    border-left: 1px solid #E3E8F0;
  }
}

.document-parsing {
  padding: 60px 12px 2px 12px;

  .lls-page-header {
    padding-bottom: 12px;
    border-bottom: 1px solid #E5E7EC;
  }

  ::-webkit-scrollbar {
    width: 4px;
    background: rgba(#202D40);
    opacity: 0.5;
  }

  /* 滚动槽 */
  ::-webkit-scrollbar-track {
    padding-right: 4px;
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }

  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:window-inactive {
    background: rgba(0, 0, 0, 0.3);
  }
}
</style>
