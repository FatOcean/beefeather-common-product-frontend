import imagePath from '../images/income_proof.png'

const data = [
  {
    angle: 0,
    content: [
      {
        id: 1,
        key: '工作单位',
        position: [
          [
            {
              x: 900,
              y: 1412
            },
            {
              x: 1190,
              y: 1401
            },
            {
              x: 1192,
              y: 1438
            },
            {
              x: 902,
              y: 1448
            }
          ]
        ],
        value: '深圳市小蜜蜂科技有限公司'
      },
      {
        id: 2,
        key: '月收入',
        position: [
          [
            {
              x: 394,
              y: 757
            },
            {
              x: 489,
              y: 759
            },
            {
              x: 487,
              y: 804
            },
            {
              x: 392,
              y: 801
            }
          ]
        ],
        value: '10000'
      },
      {
        id: 3,
        key: '年收入',
        position: [],
        value: ''
      }
    ],
    fileName: '收入证明.jpg',
    height: 1963,
    imagePath,
    json: {
      msg: 'success',
      result: [
        {
          0: {
            work_unit: {
              bounding_box: [
                {
                  top: 1401,
                  left: 900,
                  width: 293,
                  height: 48
                }
              ],
              vertices: [
                [
                  {
                    x: 900,
                    y: 1412
                  },
                  {
                    x: 1190,
                    y: 1401
                  },
                  {
                    x: 1192,
                    y: 1438
                  },
                  {
                    x: 902,
                    y: 1448
                  }
                ]
              ],
              text: '深圳市小蜜蜂科技有限公司'
            },
            monthly_income: {
              bounding_box: [
                {
                  top: 757,
                  left: 392,
                  width: 98,
                  height: 48
                }
              ],
              vertices: [
                [
                  {
                    x: 394,
                    y: 757
                  },
                  {
                    x: 489,
                    y: 759
                  },
                  {
                    x: 487,
                    y: 804
                  },
                  {
                    x: 392,
                    y: 801
                  }
                ]
              ],
              text: '10000'
            },
            annual_income: {
              bounding_box: {},
              vertices: [],
              text: ''
            }
          }
        }
      ],
      predict_status: 200,
      width: 1375,
      angle: 0,
      type: 'KEY_INFO',
      height: 1963
    },
    status: 1,
    taskId: 'T001',
    width: 1375
  }
]

export { data }
