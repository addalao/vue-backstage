export default function(
    store,route,router,
    formColumnConfig,//表单label相关配置
    formOption,//表单配置
    clickBtnSelectObj,//自定义点击类型按钮配置
    fromHndleEventObj
){
    formOption.labelWidth = 120
    formOption.newApiOption.api = `/deliveryBase/submit`
}
