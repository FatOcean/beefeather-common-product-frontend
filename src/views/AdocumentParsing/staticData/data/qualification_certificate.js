
import imagePath from '../images/qualification_certificate.png'

const data = [
  {
    angle: 0,
    content: [
      {
        id: 1,
        key: '2.发证日期',
        position: [
          [
            {
              x: 890,
              y: 82
            },
            {
              x: 1067,
              y: 82
            },
            {
              x: 1067,
              y: 116
            },
            {
              x: 890,
              y: 116
            }
          ]
        ],
        value: '2015年08月25日'
      },
      {
        id: 2,
        key: '6.车辆识别代号/车架号',
        position: [
          [
            {
              x: 891,
              y: 192
            },
            {
              x: 1073,
              y: 192
            },
            {
              x: 1073,
              y: 221
            },
            {
              x: 891,
              y: 221
            }
          ]
        ],
        value: 'LV4ER4S2VS4FE65FE'
      },
      {
        id: 3,
        key: '7.车身颜色',
        position: [
          [
            {
              x: 328,
              y: 229
            },
            {
              x: 396,
              y: 229
            },
            {
              x: 396,
              y: 259
            },
            {
              x: 328,
              y: 259
            }
          ]
        ],
        value: '传奇黑'
      }
    ],
    fileName: '车辆合格证.png',
    height: 1800,
    imagePath,
    json: {
      predict_status: 'success',
      width: 1320,
      angle: 0,
      predict_result: [
        {
          0: {
            '2.发证日期': {
              bounding_box: [
                {
                  top: 82,
                  left: 890,
                  width: 177,
                  height: 34
                }
              ],
              vertices: [
                [
                  {
                    x: 890,
                    y: 82
                  },
                  {
                    x: 1067,
                    y: 82
                  },
                  {
                    x: 1067,
                    y: 116
                  },
                  {
                    x: 890,
                    y: 116
                  }
                ]
              ],
              text: '2015年08月25日'
            },
            '6.车辆识别代号/车架号': {
              bounding_box: [
                {
                  top: 192,
                  left: 891,
                  width: 182,
                  height: 29
                }
              ],
              vertices: [
                [
                  {
                    x: 891,
                    y: 192
                  },
                  {
                    x: 1073,
                    y: 192
                  },
                  {
                    x: 1073,
                    y: 221
                  },
                  {
                    x: 891,
                    y: 221
                  }
                ]
              ],
              text: 'LV4ER4S2VS4FE65FE'
            },
            '7.车身颜色': {
              bounding_box: [
                {
                  top: 229,
                  left: 328,
                  width: 68,
                  height: 30
                }
              ],
              vertices: [
                [
                  {
                    x: 328,
                    y: 229
                  },
                  {
                    x: 396,
                    y: 229
                  },
                  {
                    x: 396,
                    y: 259
                  },
                  {
                    x: 328,
                    y: 259
                  }
                ]
              ],
              text: '传奇黑'
            }
          }
        }
      ],
      type: 'KEY_INFO',
      height: 1800
    },
    status: 1,
    taskId: 'T001',
    width: 1320
  }
]

export { data }
