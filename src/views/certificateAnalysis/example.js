import exampleOne from "./image/示例1.png";
import exampleTwo from "./image/示例2.jpg";
// import exampleThree from "../../assets/images/document-images/3/示例.png";

const documents = [
  {
    name: "示例一.png",
    requestId: "001",
    pages: [
      {
        img: exampleOne,
        excelPath:
          "product/qualification_certificate_analysis/demo/result/示例一.xlsx",
        name: "示例一.png",
        originalHeight: 4094,
        originalWidth: 2894,
        imgRotatingDeg: 0,
        analysisResult: [
          {
            id: 1,
            key: "企业名称",
            value: "建筑有限责任公司",
            coordinatesList: [
              {
                x: 896,
                y: 1222,
              },
              {
                x: 1471,
                y: 1222,
              },
              {
                x: 1471,
                y: 1292,
              },
              {
                x: 896,
                y: 1292,
              },
            ],
          },
          {
            id: 2,
            key: "企业地址",
            value: "深圳市南山区科苑南路3099号",
            coordinatesList: [
              {
                x: 883,
                y: 1349,
              },
              {
                x: 1791,
                y: 1349,
              },
              {
                x: 1791,
                y: 1419,
              },
              {
                x: 883,
                y: 1419,
              },
            ],
          },
          {
            id: 3,
            key: "证书编号",
            value: "D12345678",
            coordinatesList: [
              {
                x: 902,
                y: 1702,
              },
              {
                x: 1164,
                y: 1702,
              },
              {
                x: 1164,
                y: 1772,
              },
              {
                x: 902,
                y: 1772,
              },
            ],
          },
          {
            id: 4,
            key: "证书名称",
            value: "建筑业企业资质证书(副本)",
            coordinatesList: [
              {
                x: 761,
                y: 825,
              },
              {
                x: 2124,
                y: 825,
              },
              {
                x: 2124,
                y: 1094,
              },
              {
                x: 761,
                y: 1094,
              },
            ],
          },
          {
            id: 5,
            key: "有效期",
            value: "2023年10月27日",
            coordinatesList: [
              {
                x: 1938,
                y: 1734,
              },
              {
                x: 2380,
                y: 1734,
              },
              {
                x: 2380,
                y: 1804,
              },
              {
                x: 1938,
                y: 1804,
              },
            ],
          },
          {
            id: 6,
            key: "发证日期",
            value: "2018年10月28日",
            coordinatesList: [
              {
                x: 1856,
                y: 3549,
              },
              {
                x: 2515,
                y: 3564,
              },
              {
                x: 2512,
                y: 3666,
              },
              {
                x: 1854,
                y: 3652,
              },
            ],
          },
          {
            id: 7,
            key: "资质等级",
            value:
              "建筑工程施工总承包壹级。公路工程施工总承包壹级。市政公用工程施工总承包壹级。矿山工程施工总承包壹级。电力工程施工总承包壹级。通信工程施工总承包壹级。水利水电工程施工总承包壹级。港口与航道工程施工总承包壹级。铁路工程施工总承包壹级。石油化工工程施工总承包壹级。机电工程施工总承包壹级。冶金工程施工总承包壹级c航道工程专业承包壹级。",
            coordinatesList: [
              { x: 415, y: 1951 },
              { x: 1552, y: 1958 },
              { x: 1544, y: 3111 },
              { x: 407, y: 3103 },
            ],
          },
          {
            id: 8,
            key: "注册资金",
            value: "5000万元人民币",
            coordinatesList: [
              {
                x: 896,
                y: 1586,
              },
              {
                x: 1299,
                y: 1586,
              },
              {
                x: 1299,
                y: 1657,
              },
              {
                x: 896,
                y: 1657,
              },
            ],
          },
          {
            id: 9,
            key: "营业执照注册号",
            value: "3707811542",
            coordinatesList: [
              {
                x: 889,
                y: 1465,
              },
              {
                x: 1190,
                y: 1465,
              },
              {
                x: 1190,
                y: 1535,
              },
              {
                x: 889,
                y: 1535,
              },
            ],
          },
          {
            id: 10,
            key: "法定代表人",
            value: "代用名",
            coordinatesList: [
              {
                x: 1942,
                y: 1457,
              },
              {
                x: 2144,
                y: 1473,
              },
              {
                x: 2138,
                y: 1550,
              },
              {
                x: 1935,
                y: 1533,
              },
            ],
          },
          {
            id: 11,
            key: "经济类型",
            value: "有限责任公司(自然人控股或控股)",
            coordinatesList: [
              {
                x: 1976,
                y: 1591,
              },
              {
                x: 2617,
                y: 1599,
              },
              {
                x: 2616,
                y: 1670,
              },
              {
                x: 1976,
                y: 1663,
              },
            ],
          },
          {
            id: 12,
            key: "企业成立时间",
            value: "",
            coordinatesList: [],
          },
          {
            id: 18,
            key: "其他",
            coordinatesList: [],
          },
        ],
      },
    ],
  },
  {
    name: "示例二.jpg",
    requestId: "002",
    pages: [
      {
        img: exampleTwo,
        excelPath:
          "product/qualification_certificate_analysis/demo/result/示例二.xlsx",
        name: "示例.jpg",
        originalHeight: 1414,
        originalWidth: 2000,
        imgRotatingDeg: 0,
        analysisResult: [
          {
            id: 1,
            codeEn: "company_name",
            key: "企业名称",
            value: "工程集团有限公司",
            coordinatesList: [
              {
                x: 1469,
                y: 272,
              },
              {
                x: 1747,
                y: 272,
              },
              {
                x: 1747,
                y: 309,
              },
              {
                x: 1469,
                y: 309,
              },
            ],
          },
          {
            id: 2,
            codeEn: "company_address",
            key: "企业地址",
            value: "",
            coordinatesList: [],
          },
          {
            id: 3,
            codeEn: "certificate_number",
            key: "证书编号",
            value: "A13301",
            coordinatesList: [
              {
                x: 469,
                y: 912,
              },
              {
                x: 609,
                y: 912,
              },
              {
                x: 609,
                y: 962,
              },
              {
                x: 469,
                y: 962,
              },
            ],
          },
          {
            id: 4,
            codeEn: "qualification_name",
            key: "证书名称",
            value: "工程设计资质证书",
            coordinatesList: [
              {
                x: 262,
                y: 600,
              },
              {
                x: 938,
                y: 600,
              },
              {
                x: 938,
                y: 856,
              },
              {
                x: 262,
                y: 856,
              },
            ],
          },
          {
            id: 5,
            codeEn: "expiration_date",
            key: "有效期",
            value: "至2022年04月17日",
            coordinatesList: [
              {
                x: 477,
                y: 981,
              },
              {
                x: 800,
                y: 978,
              },
              {
                x: 800,
                y: 1024,
              },
              {
                x: 478,
                y: 1028,
              },
            ],
          },
          {
            id: 6,
            codeEn: "issue_date",
            key: "发证日期",
            value: "2017年04月17日",
            coordinatesList: [
              {
                x: 1488,
                y: 1153,
              },
              {
                x: 1853,
                y: 1153,
              },
              {
                x: 1853,
                y: 1200,
              },
              {
                x: 1488,
                y: 1200,
              },
            ],
          },
          {
            id: 7,
            codeEn: "qualification_scope",
            key: "资质等级",
            value:
              "建筑行业(建筑工程)甲级。可承担建筑装饰工程设计、建筑幕墙工程设计、轻型钢结构工程设计、建筑智能化系统设计、照明工程设计和消防设施工程设计相应范围的甲级专项工程设计业务,可从事资质证书许可范围内相应的建设工程总承包业务以及项目管理和相关的技术与管理服务。******",
            coordinatesList: [
              {
                x: 1035,
                y: 474,
              },
              {
                x: 1795,
                y: 468,
              },
              {
                x: 1797,
                y: 676,
              },
              {
                x: 1037,
                y: 682,
              },
            ],
          },
          {
            id: 10,
            codeEn: "registered_capital",
            key: "注册资金",
            value: "",
            coordinatesList: [],
          },
          {
            id: 11,
            codeEn: "license_registration_number",
            key: "营业执照注册号",
            value: "",
            coordinatesList: [],
          },
          {
            id: 12,
            codeEn: "legal_person",
            key: "法定代表人",
            value: "",
            coordinatesList: [],
          },
          {
            id: 13,
            codeEn: "economic_nature",
            key: "经济类型",
            value: "有限责任公司(法人独资)",
            coordinatesList: [
              {
                x: 1319,
                y: 366,
              },
              {
                x: 1738,
                y: 366,
              },
              {
                x: 1738,
                y: 403,
              },
              {
                x: 1319,
                y: 403,
              },
            ],
          },
          {
            id: 14,
            codeEn: "enterprise_establishment_time",
            key: "企业成立时间",
            value: "",
            coordinatesList: [],
          },
          {
            id: 15,
            codeEn: "other",
            key: "其他",
            value: "",
            coordinatesList: [],
          },
        ],
      },
    ],
  },
];
export default documents;
