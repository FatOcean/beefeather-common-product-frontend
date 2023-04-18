import exampleOne from "../../assets/images/document-images/tableOcr/1.jpg"
import exampleTwo from "../../assets/images/document-images/tableOcr/2.jpg"
import exampleThree from "../../assets/images/document-images/tableOcr/3.png"

const documents = [
  {
    "name": "示例一.jpg",
    "requestId": "001",
    "pages": [
      {
        "img": exampleOne,
        "tableContentDTOList": [
          {
            "textContentDTO": {
              "type": "text",
              "data": [
                {
                  "value": "产品详细信息如下:\n",
                  "startX": 357,
                  "startY": 329,
                  "height": 65,
                  "width": 394
                },
                {
                  "value": "营养成分表\n",
                  "startX": 1115,
                  "startY": 454,
                  "height": 71,
                  "width": 245
                }
              ]
            },
            "excelContentDTO": {}
          },
          {
            "textContentDTO": {},
            "excelContentDTO": {
              "type": "table",
              "data": [
                [
                  {
                    "value": "项目",
                    "startRow": 1,
                    "startCol": 1,
                    "endRow": 1,
                    "endCol": 1,
                    "startX": 373,
                    "startY": 563,
                    "height": 72,
                    "width": 575
                  },
                  {
                    "value": "每100克",
                    "startRow": 1,
                    "startCol": 2,
                    "endRow": 1,
                    "endCol": 2,
                    "startX": 954,
                    "startY": 561,
                    "height": 75,
                    "width": 570
                  },
                  {
                    "value": "NRV%",
                    "startRow": 1,
                    "startCol": 3,
                    "endRow": 1,
                    "endCol": 3,
                    "startX": 1529,
                    "startY": 558,
                    "height": 76,
                    "width": 570
                  }
                ],
                [
                  {
                    "value": "能量",
                    "startRow": 2,
                    "startCol": 1,
                    "endRow": 2,
                    "endCol": 1,
                    "startX": 373,
                    "startY": 640,
                    "height": 70,
                    "width": 575
                  },
                  {
                    "value": "1325千焦",
                    "startRow": 2,
                    "startCol": 2,
                    "endRow": 2,
                    "endCol": 2,
                    "startX": 954,
                    "startY": 640,
                    "height": 70,
                    "width": 570
                  },
                  {
                    "value": "16%",
                    "startRow": 2,
                    "startCol": 3,
                    "endRow": 2,
                    "endCol": 3,
                    "startX": 1529,
                    "startY": 640,
                    "height": 71,
                    "width": 572
                  }
                ],
                [
                  {
                    "value": "蛋白质",
                    "startRow": 3,
                    "startCol": 1,
                    "endRow": 3,
                    "endCol": 1,
                    "startX": 373,
                    "startY": 716,
                    "height": 72,
                    "width": 575
                  },
                  {
                    "value": "17.4克",
                    "startRow": 3,
                    "startCol": 2,
                    "endRow": 3,
                    "endCol": 2,
                    "startX": 954,
                    "startY": 716,
                    "height": 72,
                    "width": 569
                  },
                  {
                    "value": "27%",
                    "startRow": 3,
                    "startCol": 3,
                    "endRow": 3,
                    "endCol": 3,
                    "startX": 1529,
                    "startY": 717,
                    "height": 71,
                    "width": 573
                  }
                ],
                [
                  {
                    "value": "脂肪",
                    "startRow": 4,
                    "startCol": 1,
                    "endRow": 4,
                    "endCol": 1,
                    "startX": 373,
                    "startY": 793,
                    "height": 72,
                    "width": 575
                  },
                  {
                    "value": "19.6克",
                    "startRow": 4,
                    "startCol": 2,
                    "endRow": 4,
                    "endCol": 2,
                    "startX": 953,
                    "startY": 794,
                    "height": 72,
                    "width": 570
                  },
                  {
                    "value": "29%",
                    "startRow": 4,
                    "startCol": 3,
                    "endRow": 4,
                    "endCol": 3,
                    "startX": 1529,
                    "startY": 794,
                    "height": 71,
                    "width": 575
                  }
                ],
                [
                  {
                    "value": "碳水化合物",
                    "startRow": 5,
                    "startCol": 1,
                    "endRow": 5,
                    "endCol": 1,
                    "startX": 373,
                    "startY": 871,
                    "height": 71,
                    "width": 575
                  },
                  {
                    "value": "59.0克",
                    "startRow": 5,
                    "startCol": 2,
                    "endRow": 5,
                    "endCol": 2,
                    "startX": 953,
                    "startY": 871,
                    "height": 72,
                    "width": 570
                  },
                  {
                    "value": "19%",
                    "startRow": 5,
                    "startCol": 3,
                    "endRow": 5,
                    "endCol": 3,
                    "startX": 1529,
                    "startY": 871,
                    "height": 71,
                    "width": 576
                  }
                ],
                [
                  {
                    "value": "钠",
                    "startRow": 6,
                    "startCol": 1,
                    "endRow": 6,
                    "endCol": 1,
                    "startX": 373,
                    "startY": 948,
                    "height": 77,
                    "width": 574
                  },
                  {
                    "value": "642毫克",
                    "startRow": 6,
                    "startCol": 2,
                    "endRow": 6,
                    "endCol": 2,
                    "startX": 953,
                    "startY": 949,
                    "height": 73,
                    "width": 571
                  },
                  {
                    "value": "31%",
                    "startRow": 6,
                    "startCol": 3,
                    "endRow": 6,
                    "endCol": 3,
                    "startX": 1529,
                    "startY": 948,
                    "height": 72,
                    "width": 578
                  }
                ]
              ]
            }
          }
        ],
        originalHeight: 3508,
        originalWidth: 2481,
        "imgRotatingDeg": 0,
        "pageNo": 1
      }
    ]
  },
  {
    "name": "示例二.jpg",
    "requestId": "002",
    "pages": [
      {
        "img": exampleTwo,
        "tableContentDTOList": [
          {
            "textContentDTO": {
              "type": "text",
              "data": [
                {
                  "value": "(一)货币资金\n",
                  "startX": 356,
                  "startY": 334,
                  "height": 66,
                  "width": 291
                }
              ]
            },
            "excelContentDTO": {}
          },
          {
            "textContentDTO": {},
            "excelContentDTO": {
              "type": "table",
              "data": [
                [
                  {
                    "value": "项目",
                    "startRow": 1,
                    "startCol": 1,
                    "endRow": 1,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 430,
                    "height": 82,
                    "width": 613
                  },
                  {
                    "value": "期未余额",
                    "startRow": 1,
                    "startCol": 2,
                    "endRow": 1,
                    "endCol": 2,
                    "startX": 1086,
                    "startY": 430,
                    "height": 82,
                    "width": 470
                  },
                  {
                    "value": "上年年末余额",
                    "startRow": 1,
                    "startCol": 3,
                    "endRow": 1,
                    "endCol": 3,
                    "startX": 1562,
                    "startY": 430,
                    "height": 82,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "库存现金",
                    "startRow": 2,
                    "startCol": 1,
                    "endRow": 2,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 518,
                    "height": 80,
                    "width": 613
                  },
                  {
                    "value": "19.762.22",
                    "startRow": 2,
                    "startCol": 2,
                    "endRow": 2,
                    "endCol": 2,
                    "startX": 1086,
                    "startY": 518,
                    "height": 80,
                    "width": 470
                  },
                  {
                    "value": "58,187.87",
                    "startRow": 2,
                    "startCol": 3,
                    "endRow": 2,
                    "endCol": 3,
                    "startX": 1562,
                    "startY": 518,
                    "height": 80,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "银行存款",
                    "startRow": 3,
                    "startCol": 1,
                    "endRow": 3,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 604,
                    "height": 79,
                    "width": 613
                  },
                  {
                    "value": "255.593.96",
                    "startRow": 3,
                    "startCol": 2,
                    "endRow": 3,
                    "endCol": 2,
                    "startX": 1086,
                    "startY": 604,
                    "height": 79,
                    "width": 470
                  },
                  {
                    "value": "1.245.610.11",
                    "startRow": 3,
                    "startCol": 3,
                    "endRow": 3,
                    "endCol": 3,
                    "startX": 1562,
                    "startY": 604,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "其他货币资金",
                    "startRow": 4,
                    "startCol": 1,
                    "endRow": 4,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 689,
                    "height": 79,
                    "width": 613
                  },
                  {
                    "value": "",
                    "startRow": 4,
                    "startCol": 2,
                    "endRow": 4,
                    "endCol": 2,
                    "startX": 1086,
                    "startY": 689,
                    "height": 79,
                    "width": 470
                  },
                  {
                    "value": "",
                    "startRow": 4,
                    "startCol": 3,
                    "endRow": 4,
                    "endCol": 3,
                    "startX": 1562,
                    "startY": 689,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "合计",
                    "startRow": 5,
                    "startCol": 1,
                    "endRow": 5,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 774,
                    "height": 79,
                    "width": 613
                  },
                  {
                    "value": "275.356.18",
                    "startRow": 5,
                    "startCol": 2,
                    "endRow": 5,
                    "endCol": 2,
                    "startX": 1086,
                    "startY": 774,
                    "height": 79,
                    "width": 470
                  },
                  {
                    "value": "1.303,797.98",
                    "startRow": 5,
                    "startCol": 3,
                    "endRow": 5,
                    "endCol": 3,
                    "startX": 1562,
                    "startY": 774,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "其中:存放在境外的款项总额",
                    "startRow": 6,
                    "startCol": 1,
                    "endRow": 6,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 860,
                    "height": 82,
                    "width": 613
                  },
                  {
                    "value": "",
                    "startRow": 6,
                    "startCol": 2,
                    "endRow": 6,
                    "endCol": 2,
                    "startX": 1086,
                    "startY": 860,
                    "height": 82,
                    "width": 470
                  },
                  {
                    "value": "",
                    "startRow": 6,
                    "startCol": 3,
                    "endRow": 6,
                    "endCol": 3,
                    "startX": 1562,
                    "startY": 860,
                    "height": 82,
                    "width": 543
                  }
                ]
              ]
            }
          },
          {
            "textContentDTO": {
              "type": "text",
              "data": [
                {
                  "value": "(二)应收账款\n",
                  "startX": 362,
                  "startY": 1063,
                  "height": 61,
                  "width": 285
                },
                {
                  "value": "1、应收账款按账龄皮盖喜\n",
                  "startX": 455,
                  "startY": 1195,
                  "height": 60,
                  "width": 499
                }
              ]
            },
            "excelContentDTO": {}
          },
          {
            "textContentDTO": {},
            "excelContentDTO": {
              "type": "table",
              "data": [
                [
                  {
                    "value": "账龄",
                    "startRow": 1,
                    "startCol": 1,
                    "endRow": 1,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1295,
                    "height": 77,
                    "width": 543
                  },
                  {
                    "value": "期未余额",
                    "startRow": 1,
                    "startCol": 2,
                    "endRow": 1,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1293,
                    "height": 79,
                    "width": 540
                  },
                  {
                    "value": "上年年未余额",
                    "startRow": 1,
                    "startCol": 3,
                    "endRow": 1,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1291,
                    "height": 82,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "1年以内",
                    "startRow": 2,
                    "startCol": 1,
                    "endRow": 2,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1375,
                    "height": 80,
                    "width": 543
                  },
                  {
                    "value": "1,092,154.61",
                    "startRow": 2,
                    "startCol": 2,
                    "endRow": 2,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1376,
                    "height": 79,
                    "width": 540
                  },
                  {
                    "value": "1.694.616.00",
                    "startRow": 2,
                    "startCol": 3,
                    "endRow": 2,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1376,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "1至2年",
                    "startRow": 3,
                    "startCol": 1,
                    "endRow": 3,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1461,
                    "height": 80,
                    "width": 543
                  },
                  {
                    "value": "51.976.00",
                    "startRow": 3,
                    "startCol": 2,
                    "endRow": 3,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1461,
                    "height": 80,
                    "width": 540
                  },
                  {
                    "value": "62.995.50",
                    "startRow": 3,
                    "startCol": 3,
                    "endRow": 3,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1461,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "2至3年",
                    "startRow": 4,
                    "startCol": 1,
                    "endRow": 4,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1547,
                    "height": 79,
                    "width": 543
                  },
                  {
                    "value": "34.832.50",
                    "startRow": 4,
                    "startCol": 2,
                    "endRow": 4,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1547,
                    "height": 79,
                    "width": 540
                  },
                  {
                    "value": "1.353.298.00",
                    "startRow": 4,
                    "startCol": 3,
                    "endRow": 4,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1546,
                    "height": 80,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "3至4年",
                    "startRow": 5,
                    "startCol": 1,
                    "endRow": 5,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1632,
                    "height": 79,
                    "width": 543
                  },
                  {
                    "value": "180.222.39",
                    "startRow": 5,
                    "startCol": 2,
                    "endRow": 5,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1632,
                    "height": 80,
                    "width": 540
                  },
                  {
                    "value": "121.534.39",
                    "startRow": 5,
                    "startCol": 3,
                    "endRow": 5,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1632,
                    "height": 80,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "4至5年",
                    "startRow": 6,
                    "startCol": 1,
                    "endRow": 6,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1717,
                    "height": 80,
                    "width": 543
                  },
                  {
                    "value": "44,610.00",
                    "startRow": 6,
                    "startCol": 2,
                    "endRow": 6,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1718,
                    "height": 79,
                    "width": 540
                  },
                  {
                    "value": "108.529.00",
                    "startRow": 6,
                    "startCol": 3,
                    "endRow": 6,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1718,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "5年以上",
                    "startRow": 7,
                    "startCol": 1,
                    "endRow": 7,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1803,
                    "height": 80,
                    "width": 543
                  },
                  {
                    "value": "216.600.76",
                    "startRow": 7,
                    "startCol": 2,
                    "endRow": 7,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1803,
                    "height": 80,
                    "width": 540
                  },
                  {
                    "value": "114.746.76",
                    "startRow": 7,
                    "startCol": 3,
                    "endRow": 7,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1803,
                    "height": 80,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "小计",
                    "startRow": 8,
                    "startCol": 1,
                    "endRow": 8,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1889,
                    "height": 79,
                    "width": 543
                  },
                  {
                    "value": "1.620,396.26",
                    "startRow": 8,
                    "startCol": 2,
                    "endRow": 8,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1889,
                    "height": 79,
                    "width": 540
                  },
                  {
                    "value": "3,455.719.65",
                    "startRow": 8,
                    "startCol": 3,
                    "endRow": 8,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1889,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "减:坏账准备",
                    "startRow": 9,
                    "startCol": 1,
                    "endRow": 9,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 1974,
                    "height": 79,
                    "width": 543
                  },
                  {
                    "value": "412.655.04",
                    "startRow": 9,
                    "startCol": 2,
                    "endRow": 9,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 1974,
                    "height": 79,
                    "width": 540
                  },
                  {
                    "value": "759,356.91",
                    "startRow": 9,
                    "startCol": 3,
                    "endRow": 9,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 1974,
                    "height": 79,
                    "width": 543
                  }
                ],
                [
                  {
                    "value": "合计",
                    "startRow": 10,
                    "startCol": 1,
                    "endRow": 10,
                    "endCol": 1,
                    "startX": 467,
                    "startY": 2059,
                    "height": 82,
                    "width": 543
                  },
                  {
                    "value": "1.207.741.22",
                    "startRow": 10,
                    "startCol": 2,
                    "endRow": 10,
                    "endCol": 2,
                    "startX": 1016,
                    "startY": 2059,
                    "height": 82,
                    "width": 540
                  },
                  {
                    "value": "2.696.362.74",
                    "startRow": 10,
                    "startCol": 3,
                    "endRow": 10,
                    "endCol": 3,
                    "startX": 1561,
                    "startY": 2059,
                    "height": 82,
                    "width": 543
                  }
                ]
              ]
            }
          }
        ],
        originalHeight: 3508,
        originalWidth: 2481,
        "imgRotatingDeg": 0,
        "pageNo": 1
      }
    ]
  },
  {
    "name": "示例三.png",
    "requestId": "003",
    "pages": [
      {
        "img": exampleThree,
        "tableContentDTOList": [
          {
            "textContentDTO": {
              "type": "text",
              "data": [
                {
                  "value": "一、金融科技项目必修课认证。\n",
                  "startX": 71,
                  "startY": 6,
                  "height": 24,
                  "width": 299
                },
                {
                  "value": "所有金融科技项目经理(含产品执行部全员、项目管理部金融科技项目经理、信息科技\n",
                  "startX": 71,
                  "startY": 51,
                  "height": 25,
                  "width": 787
                },
                {
                  "value": "中心金融科技项目IIDN)须完成《金融科技项目经理必修课》课程学习,通过考试后,方\n",
                  "startX": 29,
                  "startY": 98,
                  "height": 25,
                  "width": 831
                },
                {
                  "value": "可正式上岗,独立承担新项目。\n",
                  "startX": 30,
                  "startY": 148,
                  "height": 21,
                  "width": 305
                },
                {
                  "value": "(一)课程内容。\n",
                  "startX": 79,
                  "startY": 191,
                  "height": 26,
                  "width": 163
                }
              ]
            },
            "excelContentDTO": {}
          },
          {
            "textContentDTO": {},
            "excelContentDTO": {
              "type": "table",
              "data": [
                [
                  {
                    "value": "章节。",
                    "startRow": 1,
                    "startCol": 1,
                    "endRow": 1,
                    "endCol": 1,
                    "startX": 30,
                    "startY": 232,
                    "height": 41,
                    "width": 272
                  },
                  {
                    "value": "课程名称。",
                    "startRow": 1,
                    "startCol": 2,
                    "endRow": 1,
                    "endCol": 2,
                    "startX": 309,
                    "startY": 231,
                    "height": 42,
                    "width": 269
                  },
                  {
                    "value": "课程形式。",
                    "startRow": 1,
                    "startCol": 3,
                    "endRow": 1,
                    "endCol": 3,
                    "startX": 585,
                    "startY": 231,
                    "height": 42,
                    "width": 272
                  }
                ],
                [
                  {
                    "value": "第一章。",
                    "startRow": 2,
                    "startCol": 1,
                    "endRow": 2,
                    "endCol": 1,
                    "startX": 30,
                    "startY": 279,
                    "height": 42,
                    "width": 272
                  },
                  {
                    "value": "项目管理基础。",
                    "startRow": 2,
                    "startCol": 2,
                    "endRow": 2,
                    "endCol": 2,
                    "startX": 309,
                    "startY": 279,
                    "height": 42,
                    "width": 269
                  },
                  {
                    "value": "线上视频。",
                    "startRow": 2,
                    "startCol": 3,
                    "endRow": 2,
                    "endCol": 3,
                    "startX": 585,
                    "startY": 279,
                    "height": 42,
                    "width": 272
                  }
                ],
                [
                  {
                    "value": "第二章。",
                    "startRow": 3,
                    "startCol": 1,
                    "endRow": 3,
                    "endCol": 1,
                    "startX": 30,
                    "startY": 327,
                    "height": 41,
                    "width": 272
                  },
                  {
                    "value": "项目管理进阶。",
                    "startRow": 3,
                    "startCol": 2,
                    "endRow": 3,
                    "endCol": 2,
                    "startX": 309,
                    "startY": 327,
                    "height": 41,
                    "width": 269
                  },
                  {
                    "value": "线上图文。",
                    "startRow": 3,
                    "startCol": 3,
                    "endRow": 3,
                    "endCol": 3,
                    "startX": 585,
                    "startY": 327,
                    "height": 41,
                    "width": 272
                  }
                ],
                [
                  {
                    "value": "第三章。",
                    "startRow": 4,
                    "startCol": 1,
                    "endRow": 4,
                    "endCol": 1,
                    "startX": 30,
                    "startY": 374,
                    "height": 43,
                    "width": 272
                  },
                  {
                    "value": "典型金融科技项目案例分享。",
                    "startRow": 4,
                    "startCol": 2,
                    "endRow": 4,
                    "endCol": 2,
                    "startX": 309,
                    "startY": 374,
                    "height": 43,
                    "width": 270
                  },
                  {
                    "value": "线下课程。",
                    "startRow": 4,
                    "startCol": 3,
                    "endRow": 4,
                    "endCol": 3,
                    "startX": 585,
                    "startY": 374,
                    "height": 43,
                    "width": 272
                  }
                ]
              ]
            }
          },
          {
            "textContentDTO": {
              "type": "text",
              "data": [
                {
                  "value": "注:《典型金融科技项目亲例分享》将不定期组织线下课程,所有金融科技项目经理必须现场直播参\n",
                  "startX": 65,
                  "startY": 435,
                  "height": 19,
                  "width": 795
                },
                {
                  "value": "加。课程也将录制成视频课程不断更新到必修课程中。",
                  "startX": 28,
                  "startY": 482,
                  "height": 19,
                  "width": 447
                }
              ]
            },
            "excelContentDTO": {}
          }
        ],
        originalHeight: 520,
        originalWidth: 886,
        "imgRotatingDeg": 0,
        "pageNo": 1
      }
    ]
  },
]
export default documents