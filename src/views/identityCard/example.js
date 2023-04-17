// import exampleOne from "../../assets/images/document-images/1/示例.png";
import front from "../../assets/images/document-images/identityCardAnalysis/身份证人像页.png";
import back from "../../assets/images/document-images/identityCardAnalysis/身份证国徽页.png";
// import exampleThree from "../../assets/images/document-images/3/示例.png";

const documents = [
  {
    "name": "身份证人像页.png",
    "requestId": "001",
    "pages": [
      {
        "img": front,
        "pageName": "/身份证人像页.png",
        "originalHeight": 417,
        "originalWidth": 660,
        "imgRotatingDeg": 0,
        "analysisResult": [
          {
            tabName: '身份证人像页',
            tabResult: [
              {
                "id": 1,
                "key": "姓名",
                "value": "张应",
                "coordinatesList": [
                  [
                    {
                      "x": 122,
                      "y": 52
                    },
                    {
                      "x": 198,
                      "y": 50
                    },
                    {
                      "x": 199,
                      "y": 85
                    },
                    {
                      "x": 123,
                      "y": 87
                    }
                  ]
                ]
              },
              {
                "id": 2,
                "key": "性别",
                "value": "女",
                "coordinatesList": [
                  [
                    {
                      "x": 115,
                      "y": 110
                    },
                    {
                      "x": 147,
                      "y": 110
                    },
                    {
                      "x": 147,
                      "y": 142
                    },
                    {
                      "x": 115,
                      "y": 142
                    }
                  ]
                ]
              },
              {
                "id": 3,
                "key": "民族",
                "value": "汉",
                "coordinatesList": [
                  [
                    {
                      "x": 247,
                      "y": 110
                    },
                    {
                      "x": 280,
                      "y": 110
                    },
                    {
                      "x": 280,
                      "y": 141
                    },
                    {
                      "x": 247,
                      "y": 141
                    }
                  ]
                ]
              },
              {
                "id": 4,
                "key": "出生日期",
                "value": "1994年10月31日",
                "coordinatesList": [
                  [
                    {
                      "x": 121,
                      "y": 163
                    },
                    {
                      "x": 331,
                      "y": 163
                    },
                    {
                      "x": 331,
                      "y": 186
                    },
                    {
                      "x": 121,
                      "y": 186
                    }
                  ]
                ]
              },
              {
                "id": 5,
                "key": "住址",
                "value": "广东省深圳市南山区科苑南路3099号",
                "coordinatesList": [
                  [
                    {
                      "x": 120,
                      "y": 216
                    },
                    {
                      "x": 359,
                      "y": 216
                    },
                    {
                      "x": 359,
                      "y": 270
                    },
                    {
                      "x": 120,
                      "y": 270
                    }
                  ]
                ]
              },
              {
                "id": 6,
                "key": "公民身份号码",
                "value": "440305199410317291",
                "coordinatesList": [
                  [
                    {
                      "x": 226,
                      "y": 347
                    },
                    {
                      "x": 572,
                      "y": 347
                    },
                    {
                      "x": 572,
                      "y": 372
                    },
                    {
                      "x": 226,
                      "y": 372
                    }
                  ]
                ]
              }
            ]
          },
        ]
      }
    ]
  },
  {
    "name": "身份证国徽页.png",
    "requestId": "002",
    "pages": [
      {
        "img": back,
        "pageName": "/身份证国徽页.png",
        "originalHeight": 2971,
        "originalWidth": 4762,
        "imgRotatingDeg": 0,
        "analysisResult": [
          {
            tabName: '身份证国徽页',
            tabResult: [
              {
                "id": 1,
                "key": "签发机关",
                "value": "深圳市公安局南山分局",
                "coordinatesList": [
                  [
                    {
                      "x": 2026,
                      "y": 1937
                    },
                    {
                      "x": 3183,
                      "y": 1937
                    },
                    {
                      "x": 3183,
                      "y": 2059
                    },
                    {
                      "x": 2026,
                      "y": 2059
                    }
                  ]
                ]
              },
              {
                "id": 2,
                "key": "有效期限",
                "value": "2010.01.05-2020.01.05",
                "coordinatesList": [
                  [
                    {
                      "x": 2025,
                      "y": 2207
                    },
                    {
                      "x": 3271,
                      "y": 2207
                    },
                    {
                      "x": 3271,
                      "y": 2310
                    },
                    {
                      "x": 2025,
                      "y": 2310
                    }
                  ]
                ]
              }
            ]
          }
        ]
      }
    ]
  },

]
export default documents