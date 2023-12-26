
import imagePath from '../images/driver_license.png'

const data = [
  {
    angle: 0,
    content: [
      {
        id: 1,
        key: '首页证号',
        position: [
          [
            {
              x: 716,
              y: 322
            },
            {
              x: 1238,
              y: 316
            },
            {
              x: 1239,
              y: 376
            },
            {
              x: 717,
              y: 381
            }
          ]
        ],
        value: '150000000000000000'
      },
      {
        id: 2,
        key: '首页姓名',
        position: [
          [
            {
              x: 332,
              y: 409
            },
            {
              x: 666,
              y: 409
            },
            {
              x: 666,
              y: 475
            },
            {
              x: 332,
              y: 475
            }
          ]
        ],
        value: '桃桃桃'
      },
      {
        id: 3,
        key: '性别',
        position: [
          [
            {
              x: 904,
              y: 405
            },
            {
              x: 965,
              y: 405
            },
            {
              x: 965,
              y: 469
            },
            {
              x: 904,
              y: 469
            }
          ]
        ],
        value: '女'
      },
      {
        id: 4,
        key: '国籍',
        position: [
          [
            {
              x: 1172,
              y: 401
            },
            {
              x: 1293,
              y: 401
            },
            {
              x: 1293,
              y: 474
            },
            {
              x: 1172,
              y: 474
            }
          ]
        ],
        value: '中国'
      },
      {
        id: 5,
        key: '住址',
        position: [
          [
            {
              x: 369,
              y: 497
            },
            {
              x: 883,
              y: 493
            },
            {
              x: 884,
              y: 556
            },
            {
              x: 370,
              y: 560
            }
          ]
        ],
        value: '内蒙古自治区赤峰市'
      },
      {
        id: 6,
        key: '出生日期',
        position: [
          [
            {
              x: 714,
              y: 666
            },
            {
              x: 1000,
              y: 664
            },
            {
              x: 1001,
              y: 727
            },
            {
              x: 715,
              y: 728
            }
          ]
        ],
        value: '1999-09-09'
      },
      {
        id: 7,
        key: '初次领证日期',
        position: [
          [
            {
              x: 790,
              y: 758
            },
            {
              x: 1085,
              y: 758
            },
            {
              x: 1085,
              y: 821
            },
            {
              x: 790,
              y: 821
            }
          ]
        ],
        value: '2015-06-18'
      },
      {
        id: 8,
        key: '准驾车型',
        position: [
          [
            {
              x: 834,
              y: 863
            },
            {
              x: 972,
              y: 857
            },
            {
              x: 974,
              y: 914
            },
            {
              x: 836,
              y: 919
            }
          ]
        ],
        value: 'C1'
      },
      {
        id: 9,
        key: '有效期限',
        position: [
          [
            {
              x: 446,
              y: 949
            },
            {
              x: 1142,
              y: 946
            },
            {
              x: 1143,
              y: 1008
            },
            {
              x: 447,
              y: 1011
            }
          ]
        ],
        value: '2015-06-18至2021-06-18'
      },
      {
        id: 10,
        key: '发证单位',
        position: [
          [
            {
              x: 231,
              y: 666
            },
            {
              x: 515,
              y: 664
            },
            {
              x: 515,
              y: 931
            },
            {
              x: 232,
              y: 931
            }
          ]
        ],
        value: '河北省秦皇岛市公安局交通警察支队'
      }
    ],
    fileName: '驾驶证.jpg',
    height: 1210,
    imagePath,
    json: {
      msg: 'success',
      result: [
        {
          0: {
            address: {
              kie_score: 0.9953712821006775,
              bounding_box: {
                top: 497,
                left: 369,
                width: 515,
                height: 59
              },
              vertices: [
                {
                  x: 369,
                  y: 497
                },
                {
                  x: 883,
                  y: 493
                },
                {
                  x: 884,
                  y: 556
                },
                {
                  x: 370,
                  y: 560
                }
              ],
              text: '内蒙古自治区赤峰市'
            },
            nationality: {
              kie_score: 0.9998900890350342,
              bounding_box: {
                top: 401,
                left: 1172,
                width: 121,
                height: 73
              },
              vertices: [
                {
                  x: 1172,
                  y: 401
                },
                {
                  x: 1293,
                  y: 401
                },
                {
                  x: 1293,
                  y: 474
                },
                {
                  x: 1172,
                  y: 474
                }
              ],
              text: '中国'
            },
            valid_period: {
              kie_score: 0.9999364614486694,
              bounding_box: {
                top: 949,
                left: 446,
                width: 697,
                height: 59
              },
              vertices: [
                {
                  x: 446,
                  y: 949
                },
                {
                  x: 1142,
                  y: 946
                },
                {
                  x: 1143,
                  y: 1008
                },
                {
                  x: 447,
                  y: 1011
                }
              ],
              text: '2015-06-18至2021-06-18'
            },
            home_name: {
              kie_score: 0.9993413090705872,
              bounding_box: {
                top: 409,
                left: 332,
                width: 334,
                height: 66
              },
              vertices: [
                {
                  x: 332,
                  y: 409
                },
                {
                  x: 666,
                  y: 409
                },
                {
                  x: 666,
                  y: 475
                },
                {
                  x: 332,
                  y: 475
                }
              ],
              text: '桃桃桃'
            },
            date_of_birth: {
              kie_score: 0.9998021721839905,
              bounding_box: {
                top: 666,
                left: 714,
                width: 287,
                height: 61
              },
              vertices: [
                {
                  x: 714,
                  y: 666
                },
                {
                  x: 1000,
                  y: 664
                },
                {
                  x: 1001,
                  y: 727
                },
                {
                  x: 715,
                  y: 728
                }
              ],
              text: '1999-09-09'
            },
            issuing_unit: {
              kie_score: 0.9999909400939941,
              bounding_box: {
                top: 666,
                left: 231,
                width: 284,
                height: 265
              },
              vertices: [
                {
                  x: 231,
                  y: 666
                },
                {
                  x: 515,
                  y: 664
                },
                {
                  x: 515,
                  y: 931
                },
                {
                  x: 232,
                  y: 931
                }
              ],
              text: '河北省秦皇岛市公安局交通警察支队'
            },
            sex: {
              kie_score: 0.9998167157173157,
              bounding_box: {
                top: 405,
                left: 904,
                width: 61,
                height: 64
              },
              vertices: [
                {
                  x: 904,
                  y: 405
                },
                {
                  x: 965,
                  y: 405
                },
                {
                  x: 965,
                  y: 469
                },
                {
                  x: 904,
                  y: 469
                }
              ],
              text: '女'
            },
            home_certificate_num: {
              kie_score: 0.9996688365936279,
              bounding_box: {
                top: 322,
                left: 716,
                width: 523,
                height: 54
              },
              vertices: [
                {
                  x: 716,
                  y: 322
                },
                {
                  x: 1238,
                  y: 316
                },
                {
                  x: 1239,
                  y: 376
                },
                {
                  x: 717,
                  y: 381
                }
              ],
              text: '150000000000000000'
            },
            class: {
              kie_score: 0.9999411106109619,
              bounding_box: {
                top: 863,
                left: 834,
                width: 140,
                height: 51
              },
              vertices: [
                {
                  x: 834,
                  y: 863
                },
                {
                  x: 972,
                  y: 857
                },
                {
                  x: 974,
                  y: 914
                },
                {
                  x: 836,
                  y: 919
                }
              ],
              text: 'C1'
            },
            date_of_first_issue: {
              kie_score: 0.9998006224632263,
              bounding_box: {
                top: 758,
                left: 790,
                width: 295,
                height: 63
              },
              vertices: [
                {
                  x: 790,
                  y: 758
                },
                {
                  x: 1085,
                  y: 758
                },
                {
                  x: 1085,
                  y: 821
                },
                {
                  x: 790,
                  y: 821
                }
              ],
              text: '2015-06-18'
            }
          }
        }
      ],
      predict_status: '200',
      width: 1680,
      angle: 0,
      type: 'KEY_INFO',
      height: 1210
    },
    status: 1,
    taskId: 'T001',
    width: 1680
  }
]

export { data }
