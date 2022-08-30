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
	_axios,
){
    //搜索
    searchOption.searchType='conditionQuery'
    searchOptionsConditionQuery.options = [
		{label:'商品名称',prop:'commodityName',type:'text'},
		{label:'商品分类',prop:'categoryId',type:'select',options:[],lkey:'categoryName',vkey:'categoryId'},
		{label:'租卖类型',prop:'type',type:'select',options:[
			{label:"只租",value:1},
			{label:"只卖",value:2},
			{label:"可租可卖",value:3},
		]},
		{label:'上架状态',prop:'commodityStatus',type:'select',options:[
			{label:"下架",value:0},
			{label:"上架",value:1}
		]}
	]
	searchOptionsConditionQuery.options.map(async(v)=>{
		if(v.prop=='categoryId'){
			v.options = await getCategory(_axios)
		}
	})

    //设置新建表单默认值
    formDialogOption.defaultItem = {commodityStatus:1}
    formDialogOption.dialogWidth = "40%"

    tableRequestOption.url = '/sys/commodity/list'

    //删除参数
    tableDelDataOption.method = 'get'
    tableDelDataOption.url = '/sys/commodity/delete'
    tableDelDataOption.key='prodId'
    tableDelDataOption.valkey='commodityId'
    
    //商品详情
    handleEventObj.viewDetail = (item)=>{
        router.push({path:'/goods-detail',query:{productId:item.commodityId}})
    }
}

//获取商品分类
async function getCategory(_axios){
    const res = await _axios('get','/sys/category/listCategory',{},true)
    return res
}
