// import exampleOne from "../../assets/images/document-images/1/示例.png";
import exampleTwo from '../../assets/images/document-images/income/示例二.jpg'
import exampleOne from '../../assets/images/document-images/income/示例一.jpg'
// import exampleThree from "../../assets/images/document-images/3/示例.png";

const documents = [
  {
    name: '示例一.jpg',
    requestId: '001',
    pages: [
      {
        img: exampleOne,
        pageName: '/示例一_1.jpg',
        originalHeight: 1963,
        originalWidth: 1375,
        imgRotatingDeg: 0,
        analysisResult: [
          {
            tabName: 'tab1',
            tabResult: [

              {
                id: 0,
                key: '工作单位',
                value: '深圳市小蜜蜂科技有限公司',
                coordinatesList: [[
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
                ]]
              },
              {
                id: 1,
                key: '月收入',
                value: '10000',
                coordinatesList: [[
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
                ]]
              },
              {
                id: 2,
                key: '年收入',
                value: '',
                coordinatesList: [
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: '示例二.jpg',
    requestId: '002',
    pages: [
      {
        img: exampleTwo,
        pageName: '/示例二(1)_1.jpg',
        originalHeight: 2419,
        originalWidth: 1814,
        imgRotatingDeg: 0,
        analysisResult: [
          {
            tabName: 'tab1',
            tabResult: [
              {
                id: 0,
                key: '工作单位',
                value: '深圳市小蜜峰科技有限公司',
                coordinatesList: [[
                  {
                    x: 1108,
                    y: 1356
                  },
                  {
                    x: 1461,
                    y: 1356
                  },
                  {
                    x: 1461,
                    y: 1701
                  },
                  {
                    x: 1108,
                    y: 1701
                  }
                ]]
              },
              {
                id: 1,
                key: '月收入',
                value: '',
                coordinatesList: [
                ]
              },
              {
                id: 2,
                key: '年收入',
                value: '250000',
                coordinatesList: [[
                  {
                    x: 1181,
                    y: 883
                  },
                  {
                    x: 1317,
                    y: 883
                  },
                  {
                    x: 1317,
                    y: 932
                  },
                  {
                    x: 1181,
                    y: 932
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
