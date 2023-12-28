<template>
  <div class="vat-invoice-wrapper">
    <ocr-layout
      @resetId="() => (activeTextId = null)"
      @tabs="tabs"
      @changeActivePageIndex="changeActivePageIndex"
      :data="documents"
      v-model="page"
      ref="documents"
      :pageMenuPerm="pageMenuPerm"
    >
      <!-- <ocr-el v-for="(i, index) in page.tableData" :key="index" :id="i.id">
        {{ i.text }}{{i.value}}
      </ocr-el>-->
      <lls-tabs @tab-click="handleClick" v-model="activeName">
        <lls-tab-pane
          v-for="(item, index) in tabsArray"
          :key="index"
          :label="item.name"
          :name="item.name"
        ></lls-tab-pane>
      </lls-tabs>
      <table cellspacing="0" class="table-data">
        <thead>
          <td colspan="2">字段名</td>
          <td>识别结果</td>
        </thead>
        <tr
          :class="{ active: activeTextId === i.id, pointer: i.startX }"
          @click="(e) => clickHandler(e, i)"
          v-for="i in page.headData"
          :key="i.key"
        >
          <td colspan="2">{{ i.key }}</td>
          <td style="white-space: pre-line">{{ i.value }}</td>
        </tr>
        <template v-for="(item, index) in page.otherData">
          <tr v-bind:key="index">
            <td class="td-title" :rowspan="page.otherData[index].length + 1">
              货物或应税劳务、服务描述{{ index + 1 }}
            </td>
          </tr>
          <tr
            :class="{ active: activeTextId === item.id, pointer: item.startX }"
            @click="(e) => clickHandler(e, item)"
            v-for="item in page.otherData[index]"
            :key="item.key"
          >
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
          </tr>
        </template>
        <tr
          :class="{ active: activeTextId === i.id, pointer: i.startX }"
          @click="(e) => clickHandler(e, i)"
          v-for="i in page.bottomData"
          :key="i.key"
        >
          <td colspan="2">{{ i.key }}</td>
          <td>{{ i.value }}</td>
        </tr>
      </table>
    </ocr-layout>

    <!-- 错误样本收集 -->
    <div
      class="sample-collection"
      @click="clickSampleCollection"
      v-if="example.path"
      v-loading="isLoading"
    >
      <svg-icon
        :iconClass="activeImage.starsFlag ? '星星填充' : '星星'"
      ></svg-icon>
      <span>{{ activeImage.starsFlag ? "取消" : "难例" }}样本收集</span>
    </div>

    <!-- 上传文件 -->
    <lls-collapse-transition v-if="pageMenuPerm['SPECIALUPLOADAPP']">
      <upload-File
        productName="增值税发票解析"
        @uploadFileData="uploadFileData"
      ></upload-File>
    </lls-collapse-transition>
  </div>
</template>
<script>
import beeLoading from '@linklogis/beeLoading'
import { mapState } from 'vuex'
import ocrLayout from './ocr-layout'
import specialOne from './image/示例一.png'
import specialTwo from './image/示例二.png'
import specialThere from './image/示例三.png'
export default {
  data() {
    return {
      activePageIndex: 0,
      isLoading: false,
      files: [],
      activeTextId: '',
      page: {}, // 当前页面数据信息
      beeLoading: false, // 上传进度条显示隐藏
      percent: 0, // 进度条
      activeName: '',
      servicePortAddress: '',
      activeDocumentIndex: 0,
      tabsArray: [],
      // documents: [],
      documents: [
        {
          id: '1',
          name: '示例一.png',
          specificData: [
            {
              id: 1,
              type: 2,
              img: specialOne,
              name: '示例一.png',
              headData: [
                {
                  id: 1,
                  key: '发票代码',
                  value: '5000210330',
                  startX: 256,
                  startY: 292,
                  height: 64,
                  width: 358,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 2,
                  key: '发票号码',
                  value: '22968322',
                  startX: 1428,
                  startY: 286,
                  height: 117,
                  width: 563,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 3,
                  key: '发票日期',
                  value: '2021年06月05日',
                  startX: 1695,
                  startY: 416,
                  height: 45,
                  width: 264,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 4,
                  key: '购买方名称',
                  value: '材料有限公司',
                  startX: 569,
                  startY: 499,
                  height: 44,
                  width: 203,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 5,
                  key: '购买方纳税人识别号',
                  value: '91347583MA3TJDEF5N',
                  startX: 376,
                  startY: 548,
                  height: 54,
                  width: 530,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 6,
                  key: '购买方地址及电话',
                  value: '安徽省池州市010-93470823',
                  startX: 372,
                  startY: 607,
                  height: 35,
                  width: 724,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 7,
                  key: '购买方开户行及账号',
                  value: '中国农业银行池州江南支行12984793403940814',
                  startX: 373,
                  startY: 657,
                  height: 41,
                  width: 725,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 8,
                  key: '销售方名称',
                  value: '粘胶厂',
                  startX: 641,
                  startY: 1224,
                  height: 39,
                  width: 97,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 9,
                  key: '销售方纳税人识别号',
                  value: '917438480038080939',
                  startX: 432,
                  startY: 1268,
                  height: 48,
                  width: 487,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 10,
                  key: '销售方地址及电话',
                  value: '广州市白云区020-73905280',
                  startX: 385,
                  startY: 1318,
                  height: 37,
                  width: 725,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 11,
                  key: '销售方开户行及账号',
                  value: '广州农村商业银行白云新城支行35879347823820314',
                  startX: 385,
                  startY: 1364,
                  height: 37,
                  width: 719,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 12,
                  key: '不含税总金额',
                  value: '75663.72',
                  startX: 1384,
                  startY: 1089,
                  height: 44,
                  width: 223,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 13,
                  key: '总税额',
                  value: '9836.28',
                  startX: 1794,
                  startY: 1093,
                  height: 38,
                  width: 195,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 14,
                  key: '价税合计大写',
                  value: '捌万伍仟伍佰圆整',
                  startX: 594,
                  startY: 1150,
                  height: 43,
                  width: 347,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 15,
                  key: '价税合计小写',
                  value: '85500.00',
                  startX: 1600,
                  startY: 1155,
                  height: 41,
                  width: 246,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 16,
                  key: '密码区',
                  value:
                    '4*6<-30*065/+>5-6510*888*94<\n>4<//343>88+-591/951><935-8+\n9++>68/985</>550+-5/17080/8\n8/969244/5+-77<1<6<592>0>57',
                  startX: 1237,
                  startY: 510,
                  height: 162,
                  width: 682,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 17,
                  key: '收款人',
                  value: '贺',
                  startX: 236,
                  startY: 1407,
                  height: 37,
                  width: 40,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 18,
                  key: '开票人',
                  value: '肖',
                  startX: 1203,
                  startY: 1418,
                  height: 36,
                  width: 37,
                  rightClick: false,
                  deg: 0.0
                }
              ],
              otherData: [
                {
                  commodity: [
                    {
                      id: 19,
                      key: '商品名称1',
                      value: '*化学合成材料*胶水',
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 20,
                      key: '商品规格型号1',
                      value: '802.62D',
                      startX: 555,
                      startY: 765,
                      height: 34,
                      width: 126,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 21,
                      key: '商品单位1',
                      value: 'KG',
                      startX: 834,
                      startY: 763,
                      height: 38,
                      width: 56,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 22,
                      key: '商品数量1',
                      value: '2000',
                      startX: 1036,
                      startY: 768,
                      height: 33,
                      width: 75,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 23,
                      key: '商品单价1',
                      value: '37.831858407',
                      startX: 1142,
                      startY: 769,
                      height: 28,
                      width: 172,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 24,
                      key: '商品金额1',
                      value: '75663.72',
                      startX: 1470,
                      startY: 765,
                      height: 38,
                      width: 143,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 25,
                      key: '商品税率1',
                      value: '13%',
                      startX: 1640,
                      startY: 764,
                      height: 40,
                      width: 69,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 26,
                      key: '商品税额1',
                      value: '9836.28',
                      startX: 1874,
                      startY: 769,
                      height: 34,
                      width: 122,
                      rightClick: false,
                      deg: 0.0
                    }
                  ]
                }
              ],
              bottomData: [
                {
                  id: 27,
                  key: '发票联号',
                  value: '第一联:记账联',
                  startX: 2014,
                  startY: 706,
                  height: 243,
                  width: 47,
                  rightClick: false,
                  deg: 0.0
                }
              ],
              originalWidth: 2080,
              originalHeight: 1560
            }
          ],
          url: 'excel/special/示例一.xlsx',
          show: true,
          imgRotatingDeg: 0
        },
        {
          id: '1',
          name: '示例二.png',
          specificData: [
            {
              id: 1,
              type: 2,
              img: specialTwo,
              name: '示例二.png',
              headData: [
                {
                  id: 1,
                  key: '发票代码',
                  value: '5000234219',
                  startX: 217,
                  startY: 180,
                  height: 28,
                  width: 148,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 2,
                  key: '发票号码',
                  value: '07807207',
                  startX: 694,
                  startY: 184,
                  height: 52,
                  width: 234,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 3,
                  key: '发票日期',
                  value: '2021年06月05日',
                  startX: 792,
                  startY: 240,
                  height: 19,
                  width: 110,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 4,
                  key: '购买方名称',
                  value: '地产发展有限公司',
                  startX: 344,
                  startY: 267,
                  height: 19,
                  width: 111,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 5,
                  key: '购买方纳税人识别号',
                  value: '910934346443343435',
                  startX: 266,
                  startY: 288,
                  height: 20,
                  width: 187,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 6,
                  key: '购买方地址及电话',
                  value: '重庆市沙坪坝区023-34815983',
                  startX: 265,
                  startY: 311,
                  height: 18,
                  width: 290,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 7,
                  key: '购买方开户行及账号',
                  value: '招商银行重庆江北支行123903149340254',
                  startX: 264,
                  startY: 334,
                  height: 17,
                  width: 259,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 8,
                  key: '销售方名称',
                  value: '物资有限公司',
                  startX: 329,
                  startY: 572,
                  height: 18,
                  width: 82,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 9,
                  key: '销售方纳税人识别号',
                  value: '917482753470238058',
                  startX: 261,
                  startY: 592,
                  height: 19,
                  width: 193,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 10,
                  key: '销售方地址及电话',
                  value: '重庆市沙坪坝区10213593204302',
                  startX: 259,
                  startY: 611,
                  height: 14,
                  width: 325,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 11,
                  key: '销售方开户行及账号',
                  value: '建行沙坪坝支行上桥分理处50001053700014150193',
                  startX: 260,
                  startY: 635,
                  height: 18,
                  width: 304,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 12,
                  key: '不含税总金额',
                  value: '99710.15',
                  startX: 695,
                  startY: 515,
                  height: 15,
                  width: 81,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 13,
                  key: '总税额',
                  value: '12962.32',
                  startX: 852,
                  startY: 515,
                  height: 16,
                  width: 80,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 14,
                  key: '价税合计大写',
                  value: '壹拾壹万贰仟陆佰柒拾贰圆肆角柒分',
                  startX: 358,
                  startY: 542,
                  height: 16,
                  width: 229,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 15,
                  key: '价税合计小写',
                  value: '112672.47',
                  startX: 773,
                  startY: 542,
                  height: 15,
                  width: 98,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 16,
                  key: '密码区',
                  value:
                    '0305/4*/7/>7<94+7>04/5/8+4<\n5<>2104>-66/46*053/8>1*7<70\n5</3840/3294*+038+5479*893/\n8103+18/8*01188/03/9886+<0--',
                  startX: 622,
                  startY: 272,
                  height: 79,
                  width: 285,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 17,
                  key: '收款人',
                  value: '李',
                  startX: 199,
                  startY: 658,
                  height: 18,
                  width: 22,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 18,
                  key: '复核',
                  value: '陈',
                  startX: 414,
                  startY: 657,
                  height: 19,
                  width: 22,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 19,
                  key: '开票人',
                  value: '吴',
                  startX: 608,
                  startY: 656,
                  height: 18,
                  width: 19,
                  rightClick: false,
                  deg: 0.0
                }
              ],
              otherData: [
                {
                  commodity: [
                    {
                      id: 20,
                      key: '商品名称1',
                      value:
                        '*黑色金属冶炼压延品*螺纹钢\n*黑色金属冶炼压延品*螺纹钢',
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 21,
                      key: '商品规格型号1',
                      value: '25\n16',
                      startX: 344,
                      startY: 372,
                      height: 34,
                      width: 22,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 22,
                      key: '商品单位1',
                      value: '吨\n吨',
                      startX: 447,
                      startY: 372,
                      height: 34,
                      width: 20,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 23,
                      key: '商品数量1',
                      value: '6\n12.911',
                      startX: 526,
                      startY: 374,
                      height: 33,
                      width: 46,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 24,
                      key: '商品单价1',
                      value: '4864.77876106\n5462.12389380',
                      startX: 579,
                      startY: 374,
                      height: 32,
                      width: 70,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 25,
                      key: '商品金额1',
                      value: '29188.67\n70521.48',
                      startX: 717,
                      startY: 375,
                      height: 32,
                      width: 59,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 26,
                      key: '商品税率1',
                      value: '13%\n13%',
                      startX: 782,
                      startY: 375,
                      height: 33,
                      width: 29,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 27,
                      key: '商品税额1',
                      value: '3794.53\n9167.79',
                      startX: 879,
                      startY: 376,
                      height: 32,
                      width: 52,
                      rightClick: false,
                      deg: 0.0
                    }
                  ]
                }
              ],
              bottomData: [
                {
                  id: 28,
                  key: '发票联号',
                  value: '第二联:抵扣联',
                  startX: 935,
                  startY: 354,
                  height: 99,
                  width: 19,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 29,
                  key: '备注',
                  value: '项目名称钢材供货合同项目地)电',
                  startX: 629,
                  startY: 569,
                  height: 29,
                  width: 246,
                  rightClick: false,
                  deg: 0.0
                }
              ],
              originalWidth: 1008,
              originalHeight: 756
            }
          ],
          url: 'excel/special/示例二.xlsx',
          show: true,
          imgRotatingDeg: 0
        },
        {
          id: '1',
          name: '示例三.png',
          specificData: [
            {
              id: 1,
              type: 2,
              img: specialThere,
              name: '示例三.png',
              headData: [
                {
                  id: 1,
                  key: '发票号码',
                  value: '06468006',
                  startX: 889,
                  startY: 240,
                  height: 67,
                  width: 333,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 2,
                  key: '发票日期',
                  value: '2021年03月18日',
                  startX: 1050,
                  startY: 316,
                  height: 27,
                  width: 149,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 3,
                  key: '购买方名称',
                  value: '置业有限公司',
                  startX: 414,
                  startY: 375,
                  height: 21,
                  width: 109,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 4,
                  key: '购买方纳税人识别号',
                  value: '91453427MA3THEFK43',
                  startX: 316,
                  startY: 403,
                  height: 23,
                  width: 295,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 5,
                  key: '购买方地址及电话',
                  value: '福建省泉州市0592-9438450',
                  startX: 295,
                  startY: 433,
                  height: 24,
                  width: 431,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 6,
                  key: '购买方开户行及账号',
                  value: '中国建设银行股份有限公司石狮分行43918740809189408033',
                  startX: 298,
                  startY: 463,
                  height: 21,
                  width: 423,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 7,
                  key: '销售方名称',
                  value: '建筑材料有限公司',
                  startX: 378,
                  startY: 795,
                  height: 23,
                  width: 148,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 8,
                  key: '销售方纳税人识别号',
                  value: '919437580284029303',
                  startX: 325,
                  startY: 822,
                  height: 27,
                  width: 290,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 9,
                  key: '销售方地址及电话',
                  value: '厦门市湖里区0592-85360202',
                  startX: 302,
                  startY: 848,
                  height: 32,
                  width: 94,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 10,
                  key: '销售方开户行及账号',
                  value: '建行厦门吕岭支行75036028058203843850',
                  startX: 304,
                  startY: 880,
                  height: 20,
                  width: 373,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 11,
                  key: '不含税总金额',
                  value: '99963.66',
                  startX: 880,
                  startY: 709,
                  height: 25,
                  width: 127,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 12,
                  key: '总税额',
                  value: '12995.28',
                  startX: 1103,
                  startY: 708,
                  height: 24,
                  width: 125,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 13,
                  key: '价税合计大写',
                  value: '壹拾壹万贰仟玖佰伍拾捌圆玖角肆分',
                  startX: 426,
                  startY: 751,
                  height: 26,
                  width: 361,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 14,
                  key: '价税合计小写',
                  value: '112958.94',
                  startX: 1007,
                  startY: 747,
                  height: 25,
                  width: 156,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 15,
                  key: '密码区',
                  value:
                    '<657<9/7-<0*917*7*7+/3-><+7\n>4/<>7>1</6+50713*50/4323+4\n<4383>403*<8<0<83<0<94//<>5\n>>67+6><-<92*/2326546*/6443',
                  startX: 788,
                  startY: 371,
                  height: 97,
                  width: 391,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 16,
                  key: '收款人',
                  value: '陈',
                  startX: 210,
                  startY: 909,
                  height: 23,
                  width: 25,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 17,
                  key: '复核',
                  value: 'i陈',
                  startX: 455,
                  startY: 886,
                  height: 45,
                  width: 78,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 18,
                  key: '开票人',
                  value: '林',
                  startX: 774,
                  startY: 903,
                  height: 23,
                  width: 25,
                  rightClick: false,
                  deg: 0.0
                }
              ],
              otherData: [
                {
                  commodity: [
                    {
                      id: 19,
                      key: '商品名称1',
                      value: '*金属制品*淋浴花洒',
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 20,
                      key: '商品规格型号1',
                      value: 'K-7686T-4-CP',
                      startX: 404,
                      startY: 526,
                      height: 16,
                      width: 114,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 21,
                      key: '商品单位1',
                      value: '套',
                      startX: 564,
                      startY: 522,
                      height: 23,
                      width: 25,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 22,
                      key: '商品数量1',
                      value: '237',
                      startX: 684,
                      startY: 523,
                      height: 20,
                      width: 33,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 23,
                      key: '商品单价1',
                      value: '421.78761062',
                      startX: 738,
                      startY: 523,
                      height: 16,
                      width: 98,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 24,
                      key: '商品金额1',
                      value: '99963.66',
                      startX: 927,
                      startY: 521,
                      height: 19,
                      width: 75,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 25,
                      key: '商品税率1',
                      value: '13%',
                      startX: 1024,
                      startY: 520,
                      height: 20,
                      width: 35,
                      rightClick: false,
                      deg: 0.0
                    },
                    {
                      id: 26,
                      key: '商品税额1',
                      value: '12995.28',
                      startX: 1150,
                      startY: 517,
                      height: 21,
                      width: 75,
                      rightClick: false,
                      deg: 0.0
                    }
                  ]
                }
              ],
              bottomData: [
                {
                  id: 27,
                  key: '发票联号',
                  value: '第三联:发票联',
                  startX: 1234,
                  startY: 481,
                  height: 97,
                  width: 23,
                  rightClick: false,
                  deg: 0.0
                },
                {
                  id: 28,
                  key: '备注',
                  value:
                    '项目名称:石狮龙湖福江期项目地址:石狮市合同名称：厦门石狮供货合同',
                  startX: 791,
                  startY: 791,
                  height: 87,
                  width: 238,
                  rightClick: false,
                  deg: 0.0
                }
              ],
              originalWidth: 1649,
              originalHeight: 1156
            }
          ],
          url: 'excel/special/示例三.xlsx',
          show: true,
          imgRotatingDeg: 0
        }
      ],
      dragenter: false,
      token: window.sessionStorage.getItem('token'),
      origin: window.sessionStorage.getItem('origin'),
      href: window.location.href,
      falg: true
    }
  },
  components: { [beeLoading.name]: beeLoading, ocrLayout },
  computed: {
    ...mapState(['pageMenuPerm']),
    example() {
      return this.documents[this.activeDocumentIndex]
    },
    activeImage() {
      return this.example.specificData[this.activePageIndex]
    },
    originLocation() {
      return process.env.NODE_ENV === 'development'
        ? 'https://beefeather-ng-front.lianyirong.com.cn//file-handle-web/file/image'
        : `${window.location.origin}/file-handle-web/file/image`
    }
  },
  created() {
    // console.log(documents, "specialData");
    // this.documents = documents;
    this.documents.forEach((item) => {
      item.specificData.forEach((ele) => {
        ele.otherData = ele.otherData.map((item, index) => {
          return item.commodity
        })
      })
    })
    this.page = this.documents[0].specificData[0]
    this.tabsArray = this.documents[0].specificData.map((item, index) => {
      return {
        name: `发票${index + 1}`
      }
    })
    this.activeName = this.tabsArray[0].name
  },
  methods: {
    postFixdMessage(fixed) {
      // 发送message 页面高度
      window.parent.postMessage(
        {
          from: 'messageGeneralProduct',
          fixed: fixed
        },
        '*'
      )
    },
    changeActivePageIndex(activePageIndex) {
      this.activePageIndex = activePageIndex
    },
    tabs(activeDocumentIndex, activePageIndex) {
      this.activePageIndex = 0
      this.activeDocumentIndex = activeDocumentIndex
      this.tabsArray = this.documents[activeDocumentIndex].specificData.map(
        (item, index) => {
          return {
            name: `发票${index + 1}`
          }
        }
      )
      this.activeName = this.tabsArray[activePageIndex].name
    },
    handleClick(value) {
      this.tabsArray.forEach((item, index) => {
        if (item.name === value.name) {
          this.$refs.documents.handleClick(index)
        }
      })
    },
    // 样本收集点击事件
    clickHandler(e, i) {
      if (!i.startX || !i.startY || !i.width || !i.height) {
        return
      }
      const el =
        e.target.nodeName === 'TR'
          ? e.target.firstChild
          : e.target.parentNode.firstChild
      this.activeTextId = i.id
      e = e || window.event
      this.$refs.documents.$events.trigger('click-ocr-el', {
        el,
        value: i
      })
    },
    clickSampleCollection() {
      if (this.isLoading) return
      this.isLoading = true
      const data = this.documents[this.activeDocumentIndex]
      const picAddress = `${data.path}${
        data.specificData[this.activePageIndex].name
      }`
      if (!this.activeImage.starsFlag) {
        this.$http
          .post('/general-product-web/hardCaseCollect/saveCollectInfo', {
            picAddress,
            productName: '增值税发票解析',
            requestId: data.requestId
          })
          .then((res) => {
            if (res.data.code === '200') {
              this.$set(
                this.documents[this.activeDocumentIndex].specificData[
                  this.activePageIndex
                ],
                'starsFlag',
                true
              )
              // this.page.starsFlag = true;
              this.documents[this.activeDocumentIndex].loadRecordId =
                res.data.data
              this.$message({
                message: '样本收集成功',
                type: 'success',
                offset: 60
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                offset: 60
              })
            }
          })
          .finally((res) => {
            this.isLoading = false
          })
      } else {
        this.$http
          .post(
            `/general-product-web/hardCaseCollect/cancelSaveCollectInfo?loadRecordId=${encodeURIComponent(
              this.documents[this.activeDocumentIndex].loadRecordId
            )}&picAddress=${encodeURIComponent(picAddress)}`
          )
          .then((res) => {
            if (res.data.code === '200') {
              this.$set(
                this.documents[this.activeDocumentIndex].specificData[
                  this.activePageIndex
                ],
                'starsFlag',
                false
              )
              this.$message({
                message: '取消收集成功',
                type: 'success',
                offset: 60
              })
            } else {
              this.$message({
                message: res.data.message,
                type: 'error',
                offset: 60
              })
            }
          })
          .finally((res) => {
            this.isLoading = false
          })
      }
    },
    uploadFileData(res) {
      res.data.specificData.forEach((i) => {
        i.starsFlag = false
        i.img = `${this.originLocation}?filename=${
          res.data.path
        }${encodeURIComponent(i.name)}`
        i.otherData = i.otherData.map((item, index) => {
          return item.commodity
        })
      })
      this.documents.splice(0, this.documents.length > 3 ? 1 : 0, res.data)
      this.activeDocumentIndex = 0
      this.page = this.documents[0].specificData[0]
      this.tabsArray = this.documents[0].specificData.map((item, index) => {
        return {
          name: `发票${index + 1}`
        }
      })
      this.activeName = this.tabsArray[0].name
    },
    handleDragLeave() {
      setTimeout((_) => {
        this.dragenter = false
      }, 200)
    }
  }
}
</script>
<style lang="stylus">
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
    &.pointer:hover {
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

.vat-invoice-wrapper {
  // loadin 样式
  .analyzing {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 0;
    vertical-align: middle;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    background: #000000;
    position: fixed !important;
    z-index: 999;
    left: 0;
  }

  .sample-collection {
    width: 114px;
    position: fixed;
    right: -87px;
    bottom: 120px;
    transition: all 0.3s;
    cursor: pointer;
    padding: 12px;
    background: #0887ff;
    border-radius: 100px 0px 0px 100px;

    .lls-loading-spinner {
      margin-top: -10px;

      .circular {
        height: 21px;
        width: 21px;
      }
    }

    &:hover {
      right: 0px;
    }

    .svg-icon {
      font-size: 14px;
    }

    span {
      display: inline-block;
      width: 72px;
      color: #fff;
      margin-left: 4px;
      vertical-align: middle;
    }
  }

  .search-box {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    .lls-checkbox__label {
      padding-left: 4px;
      color: #202D40;
    }

    .lls-checkbox {
      margin-left: 32px;
    }

    .lls-checkbox__input.is-checked+.lls-checkbox__label {
      color: #202D40;
    }
  }

  .pre-line {
    white-space: pre-line;
  }

  .upload-wrapper {
    position: absolute;
    bottom: 0px;
    z-index: 9;

    .dragger-wrapper {
      width: 302px;
      height: initial;
      min-height: initial;
      background: #ffffff;
      border: 1px solid #b4dbff;
      border-radius: 16px 16px 0px 0px;
      box-shadow: 0px -3px 6px 0px rgba(5, 18, 30, 0.04);
      text-align: center;
      cursor: pointer;

      .upload-innder {
        margin: 0;
        padding: 16px 36px;

        .put-upload {
          color: #0887ff;
          font-size: 16px;
          pointer-events: none;

          .svg-icon {
            font-size: 16px;
          }

          >span {
            vertical-align: middle;
            margin-left: 8px;
          }
        }

        .expand-upload {
          padding: 16px 0;
          pointer-events: none;

          .svg-icon {
            font-size: 24px;
          }

          .upload-text {
            color: #8492a6;
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>

<style lang="stylus" scoped>
.vat-invoice-wrapper {
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
