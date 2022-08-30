export default function(
    store,route,router,
    tableColumnConfig,//表格表头
    formDialogOption,//表单弹窗相关配置
    searchParams,//搜索条件
    searchOption,//顶部搜索配置   searchType为fuzzyQuery conditionQuery
    searchOptionsFuzzyQuery,//模糊搜索配置 searchType为fuzzyQuery为obj / searchType为conditionQuery为array
    searchOptionsConditionQuery,//条件搜索配置 searchType为fuzzyQuery为obj / searchType为conditionQuery为array
    pageParams,//页面相关配置
    tableRequestOption,//表格获取数据相关配置
    tableOption,//表格属性配置
    tableDelDataOption,//数据删除相关配置
    handleEventObj,//顶部及右侧操作按钮事件
    customBtnEvent,//自定义事件
){
    //搜索
    searchOptionsFuzzyQuery.val = {
        keys:'propName',
        placeholder:'规格名称'
    }
    

    //设置新建表单默认值
    formDialogOption.defaultItem = {rule:1}
    formDialogOption.dialogWidth = "30%"

    tableRequestOption.url = '/sys/prodProp/page'

    //删除参数
    tableDelDataOption.method = 'get'
    tableDelDataOption.url = '/sys/prodProp/delete'
    tableDelDataOption.valkey = 'propId'
    
    //绑定权限
    // handleEventObj.distributeRight = (item)=>{
    //     formDialogOption.formTitle = '角色--绑定权限'
    //     formDialogOption.openType = 'custom'
    //     formDialogOption.item = item
    //     formDialogOption.dialogWidth = '1100px'
    //     formDialogOption.showFormDialog = true
    //     formDialogOption.customCopName = 'distributeRight'
    // }
}
