const productList = [
  {
    name: '个人证件',
    icon: '上传',
    isShowChildren: true,
    children: [
      {
        name: '身份证'
      },
      {
        name: '护照'
      },
      {
        name: '户口本'
      },
      {
        name: '社保卡'
      },
      {
        name: '往来港澳通行证'
      },
      {
        name: '香港身份证'
      },
      {
        name: '澳门身份证'
      },
      {
        name: '台湾身份证'
      },
      {
        name: '房产证'
      },
      {
        name: '收入证明'
      }
    ]
  },
  {
    name: '企业证件',
    icon: '下载',
    isShowChildren: true,
    children: [
      {
        name: '开户许可证'
      },
      {
        name: '组织机构代码证税'
      },
      {
        name: '税务登记证'
      },
      {
        name: '事业单位法人证书'
      },
      {
        name: '完税证明'
      },
      {
        name: '营业执照'
      },
      {
        name: '资质证书'
      }
    ]
  },
  {
    name: '车辆证件',
    icon: '上传',
    isShowChildren: true,
    children: [
      {
        name: '行驶证'
      },
      {
        name: '机动车发票'
      },
      {
        name: '机动车登记证'
      },
      {
        name: '车牌'
      },
      {
        name: '驾驶证'
      },
      {
        name: '车辆合格证'
      }
    ]
  }
]
const jsonTest = '{"title":"测试json数据","children":[{"name":"子项名称", "desc":"子项说明" },{"name":"子项名称1", "desc":"子项说明1" }]}'

export { productList, jsonTest }
