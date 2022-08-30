/**
 * toast 组件
 * 弹窗提示
 * title  提示内容
 * backgound 弹窗背景色
 * color  文字颜色
 * closeTitle  关闭按钮内容 ，默认‘关闭’
 * confirmTitle 确定按钮内容，默认‘确认’
 * toastClose() 关闭事件
 * toastConfirm() 确认事件 
*/
"use strict" //使用js严格模式检查，使语法更规范
export const customToast = (title='are you shure?',confirm,close,option={})=>{
    const toastOptions = {
        confirmTitle:'确定',
        closeTitle:'关闭',
        backgound:'#fff',
        color:'#444'
    }
    const body = document.body

    const toastBox = document.createElement('div')
    toastBox.style.cssText = 'display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:space-between;align-item:center;width:200px;height:100px;position:fixed;z-index:9999999999;top:calc(50vh - 50px);left:calc(50vw - 100px);box-sizing:border-box;padding:16px 10px 4px;'
    toastBox.style.border = '1px solid #E4E7ED'
    toastBox.style.background = toastOptions.backgound
    toastBox.style.boxShadow = '2px 2px 2px 1px rgba(0,0,0,0.04)'
    toastBox.style.borderRadius = '8px'

    const titleEl = document.createElement('h4')
    titleEl.style.cssText = 'width:100%;text-align:center;font-size:14px;color:#666;'
    titleEl.innerText = title

    const btnBox = document.createElement('div')
    btnBox.style.cssText = 'display:flex;flex-wrap:nowrap;justify-content:space-between;align-item:center;font-size:14px;'

    const closeBtn = document.createElement('span')
    closeBtn.innerText = toastOptions.closeTitle
    closeBtn.style.cssText = 'padding:6px 10px;color:#999;cursor:pointer;'

    const confirmBtn = document.createElement('span')
    confirmBtn.innerText = toastOptions.confirmTitle
    confirmBtn.style.cssText = 'padding:6px 10px;color:#6A6FB6;cursor:pointer;'

    btnBox.appendChild(closeBtn)
    btnBox.appendChild(confirmBtn)
    
    toastBox.appendChild(titleEl)
    toastBox.appendChild(btnBox)

    body.appendChild(toastBox)

    closeBtn.onclick = function(){
        body.removeChild(toastBox)
        if(close){
            close()
        }
    }
    confirmBtn.onclick =async function(){
        if(confirm){
           const a =await confirm()
            if(a){
                body.removeChild(toastBox)
            }
        }
    }
}