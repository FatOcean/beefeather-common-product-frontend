
import imagePath from '../images/business_license.png'

const data = [
  {
    angle: 0,
    content: [
      {
        id: 1,
        key: '统一社会信用代码',
        position: [
          [
            {
              x: 450,
              y: 505
            },
            {
              x: 580,
              y: 501
            },
            {
              x: 581,
              y: 516
            },
            {
              x: 451,
              y: 520
            }
          ]
        ],
        value: '9141072173246453X5'
      },
      {
        id: 2,
        key: '编号',
        position: [
          []
        ],
        value: ''
      },
      {
        id: 3,
        key: '公司名称',
        position: [
          [
            {
              x: 219,
              y: 557
            },
            {
              x: 344,
              y: 552
            },
            {
              x: 345,
              y: 571
            },
            {
              x: 220,
              y: 576
            }
          ]
        ],
        value: '机械有限责任公司'
      },
      {
        id: 4,
        key: '公司类型',
        position: [
          [
            {
              x: 220,
              y: 581
            },
            {
              x: 452,
              y: 575
            },
            {
              x: 453,
              y: 594
            },
            {
              x: 221,
              y: 599
            }
          ]
        ],
        value: '有限责任公司(自然人投资或控股)'
      },
      {
        id: 5,
        key: '法定代表人',
        position: [
          [
            {
              x: 220,
              y: 633
            },
            {
              x: 269,
              y: 631
            },
            {
              x: 270,
              y: 651
            },
            {
              x: 221,
              y: 653
            }
          ]
        ],
        value: '江发呆'
      },
      {
        id: 6,
        key: '经营范围',
        position: [
          [
            {
              x: 223,
              y: 746
            },
            {
              x: 586,
              y: 737
            },
            {
              x: 587,
              y: 879
            },
            {
              x: 224,
              y: 881
            }
          ]
        ],
        value: '振动机械、提升设备、输送设备、混合设备、粉体设备、纺织机械、金属丝网、过滤器、紧固件制造;五金交电批发、零售及从事货物和技术的进出口贸易(国家法律法规规定应经审批方可经营或禁止进出口的货物和技术除外)**(依法须经批准的项目,经相关部门批准后方可开展经营活动)'
      },
      {
        id: 7,
        key: '注册资本（中文）',
        position: [
          [
            {
              x: 221,
              y: 659
            },
            {
              x: 332,
              y: 656
            },
            {
              x: 333,
              y: 675
            },
            {
              x: 222,
              y: 678
            }
          ]
        ],
        value: '伍佰伍拾万圆整'
      },
      {
        id: 8,
        key: '注册资本（数字）',
        position: [
          [
            {
              x: 221,
              y: 659
            },
            {
              x: 332,
              y: 656
            },
            {
              x: 333,
              y: 675
            },
            {
              x: 222,
              y: 678
            }
          ]
        ],
        value: '5500000'
      },
      {
        id: 9,
        key: '成立日期',
        position: [
          [
            {
              x: 220,
              y: 687
            },
            {
              x: 331,
              y: 685
            },
            {
              x: 332,
              y: 703
            },
            {
              x: 221,
              y: 705
            }
          ]
        ],
        value: '2001年10月16日'
      },
      {
        id: 10,
        key: '营业期限',
        position: [
          [
            {
              x: 221,
              y: 715
            },
            {
              x: 457,
              y: 708
            },
            {
              x: 458,
              y: 726
            },
            {
              x: 222,
              y: 733
            }
          ]
        ],
        value: '2007年04月28日至2036年04月27日'
      },
      {
        id: 11,
        key: '地址',
        position: [
          []
        ],
        value: ''
      }
    ],
    fileName: '营业执照.png',
    height: 1243,
    imagePath,
    json: {
      predict_status: 'success',
      predict_result: {
        code: 200,
        image_size: {
          width: 700,
          height: 1243
        },
        angle: 0,
        content: {
          biz_license_credit_code: {
            bounding_box: [
              {
                x: 450,
                y: 505
              },
              {
                x: 580,
                y: 501
              },
              {
                x: 581,
                y: 516
              },
              {
                x: 451,
                y: 520
              }
            ],
            vertices: {
              top: 505,
              left: 450,
              width: 130,
              height: 11
            },
            text: '9141072173246453X5'
          },
          biz_license_scope: {
            bounding_box: [
              {
                x: 223,
                y: 746
              },
              {
                x: 586,
                y: 737
              },
              {
                x: 587,
                y: 879
              },
              {
                x: 224,
                y: 881
              }
            ],
            vertices: {
              top: 746,
              left: 223,
              width: 363,
              height: 133
            },
            text: '振动机械、提升设备、输送设备、混合设备、粉体设备、纺织机械、金属丝网、过滤器、紧固件制造;五金交电批发、零售及从事货物和技术的进出口贸易(国家法律法规规定应经审批方可经营或禁止进出口的货物和技术除外)**(依法须经批准的项目,经相关部门批准后方可开展经营活动)'
          },
          biz_license_address: {
            bounding_box: [],
            vertices: {},
            text: ''
          },
          biz_license_operating_period: {
            bounding_box: [
              {
                x: 221,
                y: 715
              },
              {
                x: 457,
                y: 708
              },
              {
                x: 458,
                y: 726
              },
              {
                x: 222,
                y: 733
              }
            ],
            vertices: {
              top: 715,
              left: 221,
              width: 236,
              height: 11
            },
            text: '2007年04月28日至2036年04月27日'
          },
          biz_license_start_time: {
            bounding_box: [
              {
                x: 220,
                y: 687
              },
              {
                x: 331,
                y: 685
              },
              {
                x: 332,
                y: 703
              },
              {
                x: 221,
                y: 705
              }
            ],
            vertices: {
              top: 687,
              left: 220,
              width: 111,
              height: 16
            },
            text: '2001年10月16日'
          },
          biz_license_company_type: {
            bounding_box: [
              {
                x: 220,
                y: 581
              },
              {
                x: 452,
                y: 575
              },
              {
                x: 453,
                y: 594
              },
              {
                x: 221,
                y: 599
              }
            ],
            vertices: {
              top: 581,
              left: 220,
              width: 232,
              height: 13
            },
            text: '有限责任公司(自然人投资或控股)'
          },
          biz_license_company_name: {
            bounding_box: [
              {
                x: 219,
                y: 557
              },
              {
                x: 344,
                y: 552
              },
              {
                x: 345,
                y: 571
              },
              {
                x: 220,
                y: 576
              }
            ],
            vertices: {
              top: 557,
              left: 219,
              width: 125,
              height: 14
            },
            text: '机械有限责任公司'
          },
          biz_license_serial_number: {
            bounding_box: [],
            vertices: {},
            text: ''
          },
          biz_license_owner_name: {
            bounding_box: [
              {
                x: 220,
                y: 633
              },
              {
                x: 269,
                y: 631
              },
              {
                x: 270,
                y: 651
              },
              {
                x: 221,
                y: 653
              }
            ],
            vertices: {
              top: 633,
              left: 220,
              width: 49,
              height: 18
            },
            text: '江发呆'
          },
          biz_license_reg_capital: {
            bounding_box: [
              {
                x: 221,
                y: 659
              },
              {
                x: 332,
                y: 656
              },
              {
                x: 333,
                y: 675
              },
              {
                x: 222,
                y: 678
              }
            ],
            vertices: {
              top: 659,
              left: 221,
              width: 111,
              height: 16
            },
            text: '伍佰伍拾万圆整'
          },
          biz_license_reg_capital_num: {
            bounding_box: [
              {
                x: 221,
                y: 659
              },
              {
                x: 332,
                y: 656
              },
              {
                x: 333,
                y: 675
              },
              {
                x: 222,
                y: 678
              }
            ],
            vertices: {
              top: 659,
              left: 221,
              width: 111,
              height: 16
            },
            text: '5500000'
          }
        }
      }
    },
    status: 1,
    taskId: 'T001',
    width: 700,
    isexample: true
  }
]

export { data }
