/**
 * showToast 组件
 * 弹窗提示
 * title  提示内容
 */
"use strict" //使用js严格模式检查，使语法更规范

const body = document.body

function toastBoxStyle(title = '消息', backgound = 'rgb(240,249,235)', textColor = 'rgb(103,194,58)') {
	const toastBox = document.createElement('div')
	body.appendChild(toastBox)
	toastBox.style.cssText = `
		text-align: center;
		width:380px;height:40px;
		line-height: 40px;
		position:fixed;
		z-index:9999999999;
		opacity:0;
		top:-40px;
		left:calc(50vw - 190px);
		box-sizing:border-box;
		padding: 0 10px;
		overflow: hidden;
		boxShadow:2px 2px 2px 1px rgba(0,0,0,0.04);
		border-radius:8px;
		border:1px solid ${backgound};
		color:${textColor};
		background:${backgound};
		transition: all 0.8s;
		-webkit-transition: all 0.8s; /* Safari */
	`
	setTimeout(() => {
		toastBox.style.top = '50px'
		toastBox.style.opacity = 1
	})
	toastBox.innerHTML = title
	setTimeout(() => {
		toastBox.style.top = '-40px'
		toastBox.style.opacity = 0
		setTimeout(() => {
			body.removeChild(toastBox)
		}, 1000)
	}, 3000)
}

// export const showToast = {
// 	title: '啥都会',
// 	success(title, color = 'rgb(240,249,235)', textColor = 'rgb(103,194,58)') {
// 		toastBoxStyle(title, color, textColor)
// 	},
// 	error(title, color = 'rgb(254,240,240)', textColor = 'rgb(255, 85, 0)') {
// 		toastBoxStyle(title, color, textColor)
// 	},
// 	warning(title, color = 'rgb(230, 249, 217)', textColor = 'rgb(160, 194, 35)') {
// 		toastBoxStyle(title, color, textColor)
// 	},
// 	info(title, color = 'rgb(244,244,245)', textColor = 'rgb(170,147,153)') {
// 		toastBoxStyle(title, color, textColor)
// 	},
// 	toast(title, color, textColor) {
// 		toastBoxStyle(title, color, textColor)
// 	}
// }

class ShowToast {
	success(title, color = 'rgb(240,249,235)', textColor = 'rgb(103,194,58)') {
		toastBoxStyle(title, color, textColor)
	}
	error(title, color = 'rgb(254,240,240)', textColor = 'rgb(255, 85, 0)') {
		toastBoxStyle(title, color, textColor)
	}
	warning(title, color = 'rgb(230, 249, 217)', textColor = 'rgb(160, 194, 35)') {
		toastBoxStyle(title, color, textColor)
	}
	info(title, color = 'rgb(244,244,245)', textColor = 'rgb(170,147,153)') {
		toastBoxStyle(title, color, textColor)
	}
	toast(title, color, textColor) {
		toastBoxStyle(title, color, textColor)
	}
}

export default new ShowToast()
