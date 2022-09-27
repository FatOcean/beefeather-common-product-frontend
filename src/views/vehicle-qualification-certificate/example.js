
import exampleOne from "../../assets/images/document-images/vehicle/示例一.png";

const documents = [
  {
    "name": '示例一.png',
    "requestId": "001",
    "pages": [
      {
        "img": exampleOne,
        "pageName": "车辆合格证.png",
        "originalHeight": 1800,
        "originalWidth": 1320,
        "imgRotatingDeg": 0,
        "analysisResult": [
          {
            tabName: 'tab1',
            tabResult: [
              {
                "id": 1,
                "key": "发证日期",
                "value": "2015年08月25日",
                "coordinatesList": [[
                  {
                    "x": 890,
                    "y": 82
                  },
                  {
                    "x": 1067,
                    "y": 82
                  },
                  {
                    "x": 1067,
                    "y": 116
                  },
                  {
                    "x": 890,
                    "y": 116
                  }
                ]]
              },
              {
                "id": 2,
                "key": "车辆识别代号/车架号",
                "value": "LV4ER4S2VS4FE65FE",
                "coordinatesList": [[
                  {
                    "x": 891,
                    "y": 192
                  },
                  {
                    "x": 1073,
                    "y": 192
                  },
                  {
                    "x": 1073,
                    "y": 221
                  },
                  {
                    "x": 891,
                    "y": 221
                  }
                ]]
              },
              {
                "id": 3,
                "key": "车身颜色",
                "value": "传奇黑",
                "coordinatesList": [[
                  {
                    "x": 328,
                    "y": 229
                  },
                  {
                    "x": 396,
                    "y": 229
                  },
                  {
                    "x": 396,
                    "y": 259
                  },
                  {
                    "x": 328,
                    "y": 259
                  }
                ]]
              }
            ]
          }
        ]
      }
    ]
  }
]
export default documents