import imagePath from "../images/cross_border_contract.png";

const data = [
  {
    isexample: true,
    groupName: "合同1",
    images: [
      {
        imagePath,
        imageName: "cross_border_contract1.png",
        height: 1584,
        width: 1224,
      },
      {
        imagePath,
        imageName: "cross_border_contract2.png",
        height: 1584,
        width: 1224,
      },
    ],
    content: [
      {
        sortId: 1,
        keyEn: "Document Name",
        keyCh: "文档名称11",
        groupable: false,
        values: [
          {
            imageName: "cross_border_contract.png", // 基于名称来匹配要素展示位置  是否考虑重名图片？
            position: [
              [
                {
                  x: 583.95,
                  y: 87.975,
                },
                {
                  x: 776.475,
                  y: 87.975,
                },
                {
                  x: 776.475,
                  y: 122.4,
                },
                {
                  x: 583.95,
                  y: 122.4,
                },
              ],
            ],
            value: "限公司销售合同",
          },
        ],
      },
      {
        sortId: 41,
        keyEn: "End User",
        keyCh: "最终用户",
        groupable: false,
        values: [],
      },
      {
        sortId: 42,
        keyEn: "GOODS LIST",
        keyCh: "商品信息",
        groupable: true,
        row: [
          {
            sortId: 45,
            keyEn: "Goods Amount",
            keyCh: "单个商品单价",
            groupable: false,
            values: [
              {
                imageName: "cross_border_contract.png",
                position: [
                  [
                    {
                      x: 882.0373,
                      y: 237.8686,
                    },
                    {
                      x: 989.578,
                      y: 239.1185,
                    },
                    {
                      x: 993.8209,
                      y: 277.5463,
                    },
                    {
                      x: 882.1982,
                      y: 276.4078,
                    },
                  ],
                ],
                value: "741135.30",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    groupName: "合同2",
    images: [
      {
        imagePath,
        imageName: "cross_bor",
        height: 1584,
        width: 1224,
      },
      {
        imagePath,
        imageName: "cross_border_g",
        height: 1584,
        width: 1224,
      },
    ],
    content: [
      {
        sortId: 1,
        keyEn: "Document Name",
        keyCh: "文档名称222",
        groupable: false,
        values: [
          {
            imageName: "cross_border_contract.png", // 基于名称来匹配要素展示位置  是否考虑重名图片？
            position: [
              [
                {
                  x: 583.95,
                  y: 87.975,
                },
                {
                  x: 776.475,
                  y: 87.975,
                },
                {
                  x: 776.475,
                  y: 122.4,
                },
                {
                  x: 583.95,
                  y: 122.4,
                },
              ],
            ],
            value: "限公司销售合同",
          },
        ],
      },
      {
        sortId: 41,
        keyEn: "End User",
        keyCh: "最终用户",
        groupable: false,
        values: [],
      },
      {
        sortId: 42,
        keyEn: "GOODS LIST",
        keyCh: "商品信息",
        groupable: true,
        row: [
          {
            sortId: 45,
            keyEn: "Goods Amount",
            keyCh: "单个商品单价",
            groupable: false,
            values: [
              {
                imageName: "cross_border_contract.png",
                position: [
                  [
                    {
                      x: 882.0373,
                      y: 237.8686,
                    },
                    {
                      x: 989.578,
                      y: 239.1185,
                    },
                    {
                      x: 993.8209,
                      y: 277.5463,
                    },
                    {
                      x: 882.1982,
                      y: 276.4078,
                    },
                  ],
                ],
                value: "741135.30",
              },
            ],
          },
        ],
      },
    ],
  },
];

export { data };
