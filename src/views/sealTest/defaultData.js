import img1 from './image/示例一.jpg'
import img1_1 from './image/示例一_1.jpg'
import img1_2 from './image/示例一_2.jpg'
import img2 from './image/示例二.jpg'
import img2_1 from './image/示例二_1.jpg'

const data = [
	{
		"index": 1,
		"fileName": "示例一.jpg",
		"height": 1650.0,
		"width": 2598.0,
		imagePath: img1,
		"ret": [{
			"index": 1,
			"sealName": "示例一_1.jpg",
			"sealType": "椭圆章",
			"imageHeight": 393.0,
			"imageWidth": 531.0,
			sealUrl: img1_1,
			"rectangle": [{
				"index": 1,
				"x": 1854.0,
				"y": 1249.0
			}, {
				"index": 2,
				"x": 1854.0,
				"y": 1642.0
			}, {
				"index": 3,
				"x": 2385.0,
				"y": 1642.0
			}, {
				"index": 4,
				"x": 2385.0,
				"y": 1249.0
			}]
		}, {
			"index": 2,
			"sealName": "示例一_2.jpg",
			"sealType": "椭圆章",
			"imageHeight": 255.0,
			"imageWidth": 380.0,
			sealUrl: img1_2,
			"rectangle": [{
				"index": 1,
				"x": 1107.0,
				"y": 130.0
			}, {
				"index": 2,
				"x": 1107.0,
				"y": 385.0
			}, {
				"index": 3,
				"x": 1487.0,
				"y": 385.0
			}, {
				"index": 4,
				"x": 1487.0,
				"y": 130.0
			}]
		}],
		"sealPath": "product/seal_detection/lls/T2022051314677553/data/",
		show: true,
		pathName: '示例一'
	},
	{
		"index": 1,
		"fileName": "示例二.jpg",
		"height": 1536.0,
		"width": 2368.0,
		imagePath: img2,
		"ret": [{
			"index": 1,
			"sealName": "示例二_1.jpg",
			"sealType": "椭圆章",
			"imageHeight": 514.0,
			"imageWidth": 759.0,
			sealUrl: img2_1,
			"rectangle": [{
				"index": 1,
				"x": 1120.0,
				"y": 1016.0
			}, {
				"index": 2,
				"x": 1120.0,
				"y": 1530.0
			}, {
				"index": 3,
				"x": 1879.0,
				"y": 1530.0
			}, {
				"index": 4,
				"x": 1879.0,
				"y": 1016.0
			}]
		}],
		"sealPath": "product/seal_detection/lls/T2022051314688298/data/",
		show: true,
		pathName: '示例二'
	}
]





export { data }
