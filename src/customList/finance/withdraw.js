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
	    keys:'title',
	    placeholder:'案例标题'
	}

    tableRequestOption.url = '/sys/withdrawal/Page'

    //提现审核
    handleEventObj.examine = (item)=>{
        formDialogOption.formTitle = '提现审核'
        formDialogOption.openType = 'custom'
        formDialogOption.item = item
        formDialogOption.showFormDialog = true
        formDialogOption.customCopName = 'withdrawalDetail'
    }
}
