export default function(
    store,route,router,
    formColumnConfig,//表单label相关配置
    formOption,//表单配置
    clickBtnSelectObj,//自定义点击类型按钮配置
    fromHndleEventObj
){
    // formOption.labelWidth = 120
    // formOption.nextStep = 'new'
    formOption.newApiOption.api = `/sys/category`
    formOption.updateApiOption.api = `/sys/category/update`
    fromHndleEventObj.myCustomEvent = (formData)=>{
        clickBtnSelectObj.clickBtnShowCom = true
        clickBtnSelectObj.title = '规格--添加属性'
        clickBtnSelectObj.size = '30%'
        clickBtnSelectObj.cpname = 'attrbute'
    }
}
