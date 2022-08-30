/**
 * showConfirm 组件
 * 弹窗确认
 * @title 提示内容 string
 * @option 配置     Object
 * {
 *      confirmTitle:'确定',
        closeTitle:'关闭',
        backgound:'#fff',
        color:'#444'
 * }
 * @callback 确认回调 Function
 * @cancel 取消回调 Function
 */
 "use strict" //使用js严格模式检查，使语法更规范

 const body = document.body
 
export const showConfirm = (title = 'are you shure?',config={confirm:callback,cancel:cancel,option})=>{

    const confirmOptions = Object.assign({
        confirmTitle:'确定',
        closeTitle:'关闭',
        backgound:'#fff',
        color:'#444',
        zindex:99999,
        shoCancel:true,
        maskBg:'rgba(0,0,0,.6)'
    },config.option)

    const maskBox = document.createElement('div')
   
    const confirmBox = document.createElement('div')
    const titleEl = document.createElement('h4')
    const btnBox = document.createElement('div')
    const closeBtn = document.createElement('span')
    const confirmBtn = document.createElement('span')
    titleEl.innerText = title
    closeBtn.innerText = confirmOptions.closeTitle
    confirmBtn.innerText = confirmOptions.confirmTitle

    btnBox.appendChild(closeBtn)
    if(!confirmOptions.shoCancel){
        btnBox.removeChild(closeBtn)
    }
    
    btnBox.appendChild(confirmBtn)
    confirmBox.appendChild(titleEl)
    confirmBox.appendChild(btnBox)
    maskBox.appendChild(confirmBox)
    body.appendChild(maskBox)

    maskBox.style.cssText = `
        position:fixed;z-index:${confirmOptions.zindex};left:0;right:0;top:0;bottom:0;background:${confirmOptions.maskBg};
    `
    confirmBox.style.cssText = `
        display:flex;flex-direction:column;flex-wrap:nowrap;justify-content:space-between;align-item:center;
        width:260px;height:140px;
        position:fixed;
        top:calc(50vh - 70px);
        left:calc(50vw - 130px);
        box-sizing:border-box;
        padding:16px 10px 4px;
        border:1px solid #E4E7ED;
        border-radius:8px;
        background:${confirmOptions.backgound};
        boxShadow:2px 2px 2px 1px rgba(0,0,0,0.04);
     `
    titleEl.style.cssText = 'width:100%;text-align:center;font-size:15px;color:#666;'
    btnBox.style.cssText = 'display:flex;flex-wrap:nowrap;justify-content:space-between;align-item:center;font-size:16px;'
    closeBtn.style.cssText = 'padding:6px 10px;color:#999;cursor:pointer;'
    confirmBtn.style.cssText = 'padding:6px 10px;color:#6A6FB6;cursor:pointer;'

    closeBtn.onclick = function(){
        body.removeChild(maskBox)
        if(config.cancel){
            config.cancel()
        }
    }
    confirmBtn.onclick =async function(){
        body.removeChild(maskBox)
        if(config.confirm){
            config.confirm()
            // const a = await config.callback()
            // body.removeChild(maskBox)
            // if(a){
            // }
        }
    }
 }

 