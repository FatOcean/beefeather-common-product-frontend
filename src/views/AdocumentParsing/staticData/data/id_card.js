
import imagePath from '../images/id_card.png'

const data = [
  {
    isexample: true,
    angle: 0,
    content: [
      {
        identityList: [
          {
            id: 1,
            key: '姓名',
            position: [
              [
                {
                  x: 122,
                  y: 52
                },
                {
                  x: 198,
                  y: 50
                },
                {
                  x: 199,
                  y: 85
                },
                {
                  x: 123,
                  y: 87
                }
              ]
            ],
            value: '张应'
          },
          {
            id: 2,
            key: '性别',
            position: [
              [
                {
                  x: 115,
                  y: 110
                },
                {
                  x: 147,
                  y: 110
                },
                {
                  x: 147,
                  y: 142
                },
                {
                  x: 115,
                  y: 142
                }
              ]
            ],
            value: '女'
          },
          {
            id: 3,
            key: '民族',
            position: [
              [
                {
                  x: 247,
                  y: 110
                },
                {
                  x: 280,
                  y: 110
                },
                {
                  x: 280,
                  y: 141
                },
                {
                  x: 247,
                  y: 141
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
                  x: 121,
                  y: 163
                },
                {
                  x: 331,
                  y: 163
                },
                {
                  x: 331,
                  y: 186
                },
                {
                  x: 121,
                  y: 186
                }
              ]
            ],
            value: '1994年10月31日'
          },
          {
            id: 5,
            key: '住址',
            position: [
              [
                {
                  x: 120,
                  y: 216
                },
                {
                  x: 359,
                  y: 216
                },
                {
                  x: 359,
                  y: 270
                },
                {
                  x: 120,
                  y: 270
                }
              ]
            ],
            value: '广东省深圳市南山区科苑南路3099号'
          },
          {
            id: 6,
            key: '公民身份号码',
            position: [
              [
                {
                  x: 226,
                  y: 347
                },
                {
                  x: 572,
                  y: 347
                },
                {
                  x: 572,
                  y: 372
                },
                {
                  x: 226,
                  y: 372
                }
              ]
            ],
            value: '440305199410317291'
          }
        ],
        imageType: '身份证人像页'
      }
      // {
      //   identityList: [
      //     {
      //       id: 1,
      //       key: '签发机关'
      //     },
      //     {
      //       id: 2,
      //       key: '有效期限'
      //     }
      //   ],
      //   imageType: '身份证国徽页'
      // }
    ],
    fileName: 'id_card.png',
    height: 417,
    imagePath,
    json: {
      predict_status: 'success',
      predict_result: {
        code: 200,
        image_size: {
          width: 660,
          height: 417
        },
        content: [
          {
            data: {
              birthday: {
                bounding_box: {
                  top: 163,
                  left: 121,
                  width: 210,
                  height: 23
                },
                vertices: [
                  {
                    x: 121,
                    y: 163
                  },
                  {
                    x: 331,
                    y: 163
                  },
                  {
                    x: 331,
                    y: 186
                  },
                  {
                    x: 121,
                    y: 186
                  }
                ],
                text: '1994年10月31日'
              },
              id_number: {
                bounding_box: {
                  top: 347,
                  left: 226,
                  width: 346,
                  height: 25
                },
                vertices: [
                  {
                    x: 226,
                    y: 347
                  },
                  {
                    x: 572,
                    y: 347
                  },
                  {
                    x: 572,
                    y: 372
                  },
                  {
                    x: 226,
                    y: 372
                  }
                ],
                text: '440305199410317291'
              },
              address: {
                bounding_box: {
                  top: 216,
                  left: 120,
                  width: 239,
                  height: 54
                },
                vertices: [
                  {
                    x: 120,
                    y: 216
                  },
                  {
                    x: 359,
                    y: 216
                  },
                  {
                    x: 359,
                    y: 270
                  },
                  {
                    x: 120,
                    y: 270
                  }
                ],
                text: '广东省深圳市南山区科苑南路3099号'
              },
              gender: {
                bounding_box: {
                  top: 110,
                  left: 115,
                  width: 32,
                  height: 32
                },
                vertices: [
                  {
                    x: 115,
                    y: 110
                  },
                  {
                    x: 147,
                    y: 110
                  },
                  {
                    x: 147,
                    y: 142
                  },
                  {
                    x: 115,
                    y: 142
                  }
                ],
                text: '女'
              },
              nation: {
                bounding_box: {
                  top: 110,
                  left: 247,
                  width: 33,
                  height: 31
                },
                vertices: [
                  {
                    x: 247,
                    y: 110
                  },
                  {
                    x: 280,
                    y: 110
                  },
                  {
                    x: 280,
                    y: 141
                  },
                  {
                    x: 247,
                    y: 141
                  }
                ],
                text: '汉'
              },
              name: {
                bounding_box: {
                  top: 50,
                  left: 122,
                  width: 77,
                  height: 37
                },
                vertices: [
                  {
                    x: 122,
                    y: 52
                  },
                  {
                    x: 198,
                    y: 50
                  },
                  {
                    x: 199,
                    y: 85
                  },
                  {
                    x: 123,
                    y: 87
                  }
                ],
                text: '张应'
              }
            },
            angle: 0,
            type: 'idcard_front'
          }
        ]
      }
    },
    status: 1,
    taskId: 'T001',
    width: 660
  }
]

export { data }
