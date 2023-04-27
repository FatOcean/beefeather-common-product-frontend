import example1 from "./image/示例一.jpg";
import example1_removal from "./image/示例一去除.jpg";
import example2 from "./image/示例二.jpg";
import example2_removal from "./image/示例二去除.jpg";

const data = [
  {
    fileId: 1,
    fileName: "示例一.jpg",
    filePath:
      "beefeather-file-handle-web/file/img?filename=/home/lls_data/product/seal_removal/demo/1/示例一.jpg",
    imageVO: [
      {
        filePath: "product/seal_removal/demo/1/示例一.jpg",
        width: 2504,
        height: 3496,
        image: example1,
      },
      {
        filePath: "product/seal_removal/demo/1/示例一印章去除.jpg",
        width: 2504,
        height: 3496,
        image: example1_removal,
        hwFlag: true
      },
    ],
  },
  {
    fileId: 2,
    fileName: "示例二.jpg",
    filePath:
      "beefeather-file-handle-web/file/img?filename=/home/lls_data/product/seal_removal/demo/2/示例二.jpg",
    imageVO: [
      {
        filePath:
          "product/seal_removal/demo/2/示例二.jpg",
        width: 1700,
        height: 2338,
        image: example2,
      },
      {
        filePath:
          "product/seal_removal/demo/2/示例二印章去除.jpg",
        width: 1700,
        height: 2338,
        image: example2_removal,
        hwFlag: true
      },
    ],
  },
];

export { data };
