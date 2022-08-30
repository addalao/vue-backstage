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
    searchOption.searchType = 'conditionQuery'
    searchOptionsConditionQuery.options = [
        {label:'订单号/电话号码',prop:'keywords',type:'text',placeholder:''},
        {label:'订单状态',prop:'status',type:'select',options:[
            {label:"待确认",value:1},
            {label:"待付款",value:2},
            {label:"已付款/待发货",value:3},
            {label:"已发货/待收货",value:4},
            {label:"确认收货/租赁中",value:5},
            {label:"待结算",value:6},
            {label:"完成",value:7},
        ]},
        {label:'支付状态',prop:'isPayed',type:'select',options:[
            {label:"已支付",value:1},
            {label:"未支付",value:0},
        ]},
        {label:'下单时间',prop:'mdate',type:'mdate',start:'startTime',end:'endTime'},
    ]

    tableRequestOption.url = '/sys/order/page'
	tableRequestOption.params = {orderType:1}

    handleEventObj.orderDetail = (item)=>{
        formDialogOption.formTitle = '订单详情'
        formDialogOption.openType = 'custom'
        formDialogOption.item = item
        formDialogOption.dialogWidth = '90%'
        formDialogOption.showFormDialog = true
        formDialogOption.customCopName = 'orderDetail'
    }
}
