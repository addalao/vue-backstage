export default function(
    store,route,router,
    formColumnConfig,//表单label相关配置
    formOption,//表单配置
    clickBtnSelectObj,//自定义点击类型按钮配置
    fromHndleEventObj
){
    formOption.nextStep = true
    formOption.newApiOption.api = `/sys/yunke/mgr/insertAdmin`
    formOption.updateApiOption.api = `/sys/yunke/mgr/updateAdminInfo`
    fromHndleEventObj.myCustomEvent = (formData)=>{
        clickBtnSelectObj.clickBtnShowCom = true
        clickBtnSelectObj.title = '绑定角色'
        clickBtnSelectObj.size = '30%'
        clickBtnSelectObj.cpname = 'bindRole'
    }
}
