
import imagePath from '../images/seal_detection.png'
import imagePath_1 from '../images/seal_detection_1.png'
import imagePath_2 from '../images/seal_detection_2.png'

const data = [
  {
    angle: 0,
    isexample: true,
    content: [
      {
        height: 251,
        id: 1,
        imageName: 'seal_detection_1.png',
        sealImage: imagePath_1,
        sealType: '椭圆章',
        position: [
          {
            x: 1115,
            y: 127
          },
          {
            x: 1115,
            y: 378
          },
          {
            x: 1482,
            y: 378
          },
          {
            x: 1482,
            y: 127
          }
        ],
        width: 367
      },
      {
        height: 383,
        id: 2,
        imageName: 'seal_detection_2.png',
        sealImage: imagePath_2,
        sealType: '椭圆章',
        position: [
          {
            x: 1861,
            y: 1252
          },
          {
            x: 1861,
            y: 1635
          },
          {
            x: 2393,
            y: 1635
          },
          {
            x: 2393,
            y: 1252
          }
        ],
        width: 532
      }
    ],
    fileName: 'seal_detection.png',
    height: 1650,
    imagePath,
    json: {
      predict_status: 'success',
      predict_result: [
        {
          ret: [
            {
              size: {
                Height: 251,
                Width: 367
              },
              name: '示例一_1.jpg',
              index: 1,
              box: [
                {
                  x: 1115,
                  y: 127
                },
                {
                  x: 1115,
                  y: 378
                },
                {
                  x: 1482,
                  y: 378
                },
                {
                  x: 1482,
                  y: 127
                }
              ],
              type: 'ellipse_stamp'
            },
            {
              size: {
                Height: 383,
                Width: 532
              },
              name: '示例一_2.jpg',
              index: 2,
              box: [
                {
                  x: 1861,
                  y: 1252
                },
                {
                  x: 1861,
                  y: 1635
                },
                {
                  x: 2393,
                  y: 1635
                },
                {
                  x: 2393,
                  y: 1252
                }
              ],
              type: 'ellipse_stamp'
            }
          ],
          size: {
            Height: 1650,
            Width: 2598
          },
          name: '示例一.jpg',
          index: 1
        }
      ]
    },
    status: 1,
    taskId: 'T001',
    width: 2598
  }
]

export { data }
