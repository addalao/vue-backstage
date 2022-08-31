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
	showToast,
	customToast
){
	//搜索
	searchOptionsFuzzyQuery.val = {
	    keys:'username',
	    placeholder:'账号'
	}

    // 列表删除
    tableRequestOption.url = '/sys/yunke/mgr/selectAllbypage'
    tableDelDataOption.method = 'post'
    tableDelDataOption.url = '/sys/yunke/mgr/deletedById'

    // searchOption.searchType = 'conditionQuery'
    // searchOptionsConditionQuery.options = [
    //     {label:'账号',prop:'userName',type:'text'},
    //     {label:'创建时间',prop:'createTime',type:'date'},
    // ]
    
    //角色解绑
    customBtnEvent.tagsClose = (tag,row,prop)=>{
        customToast('是否解除该角色权限？',async ()=>{
            await _axios('get',`/sys/sysRole/deletedUserRoles?roleId=${tag.id}&userId=${row.id}`,{},true)
            showToast.success('该角色已解绑')
            customBtnEvent.refreshList()
            return true //关闭toast
        })
    } 

    //绑定角色
    handleEventObj.bindRole = (item)=>{
        formDialogOption.formTitle = '用户--绑定角色'
        formDialogOption.openType = 'custom'
        formDialogOption.item = item
        formDialogOption.showFormDialog = true
        formDialogOption.customCopName = 'bindRole'
    }
    
    //重置密码
    handleEventObj.resetPwd = (item)=>{
        formDialogOption.formTitle = '用户--重置密码'
        formDialogOption.openType = 'custom'
        formDialogOption.item = item
        formDialogOption.showFormDialog = true
        formDialogOption.customCopName = 'resetPwd'
    }
}
