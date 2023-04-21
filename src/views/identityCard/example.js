// import exampleOne from "../../assets/images/document-images/1/示例.png";
import front from "../../assets/images/document-images/identityCardAnalysis/身份证人像页.png";
import back from "../../assets/images/document-images/identityCardAnalysis/身份证国徽页.png";
// import exampleThree from "../../assets/images/document-images/3/示例.png";

const data = [
  {
    "fileId": 1,
    "filePath": "/home/lls_data/product/id_card_analysis/demo/front/身份证人像页.png",
    "excelPath": "/home/lls_data/product/id_card_analysis/demo/front/身份证人像页.xlsx",
    "analysisResult": [
      {
        "imageType": "身份证人像页",
        "identityList": [
          {
            "id": 1,
            "key": "姓名",
            "position": [
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
            ],
            "value": "张应"
          },
          {
            "id": 2,
            "key": "性别",
            "position": [
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
            ],
            "value": "女"
          },
          {
            "id": 3,
            "key": "民族",
            "position": [
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
            ],
            "value": "汉"
          },
          {
            "id": 4,
            "key": "出生日期",
            "position": [
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
            ],
            "value": "1994年10月31日"
          },
          {
            "id": 5,
            "key": "住址",
            "position": [
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
            ],
            "value": "广东省深圳市南山区科苑南路3099号"
          },
          {
            "id": 6,
            "key": "公民身份号码",
            "position": [
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
            ],
            "value": "440305199410317291"
          }
        ],
        "analysisName": "身份证人像页"
      }
    ],
    "fileName": "身份证人像页.png",
    // "imagePath": "https://beefeather-ng-front.lianyirong.com.cnPNG?filename=/home/lls_data/product/id_card_analysis/demo/front/身份证人像页.png",
    imagePath: front,
    "width": 660,
    "height": 417
  },
  {
    "fileId": 2,
    "filePath": "/home/lls_data/product/id_card_analysis/demo/behind/身份证国徽页.png",
    "excelPath": "/home/lls_data/product/id_card_analysis/demo/behind/身份证国徽页.xlsx",
    "analysisResult": [
      {
        "imageType": "身份证国徽页",
        "identityList": [
          {
            "id": 1,
            "key": "签发机关",
            "position": [
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
            ],
            "value": "深圳市公安局南山分局"
          },
          {
            "id": 2,
            "key": "有效期限",
            "position": [
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
            ],
            "value": "2010.01.05-2020.01.05"
          }
        ],
        "analysisName": "身份证国徽页"
      }
    ],
    "fileName": "身份证国徽页.png",
    // "imagePath": "https://beefeather-ng-front.lianyirong.com.cnPNG?filename=/home/lls_data/product/id_card_analysis/demo/behind/身份证国徽页.png",
    imagePath: back,
    "width": 4762,
    "height": 2971
  }
]








export { data }