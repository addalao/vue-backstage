import {ref} from "vue"
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
        {label:'订单号',prop:'orderNumber',type:'text'},
        {label:'支付单号',prop:'payNo',type:'text'},
        {label:'订单类型',prop:'orderType',type:'select',options:[
            {label: "租赁", value: 1},
            {label: "购买", value: 2},
            {label: "买断价格",value: 3},
            {label: "充值",value: 4}
        ]},
        {label:'支付状态',prop:'payStatus',type:'select',options:[
            {label: "已支付", value: 1},
            {label: "未支付", value: 0},
        ]},
        {label:'支付类型',prop:'payType',type:'select',options:[
            {label: "微信支付", value: 1},
            {label: "支付宝", value: 2},
        ]},
        {label:'创建日期',prop:'createTime',type:'date'},
        {label:'时间段筛选',prop:'mdate',type:'mdate',start:'startTime',end:'endTime'},
       
    ]

    tableRequestOption.url = '/sys/orderPayinfo/page'

    const exportParam =ref({
        pageNum: 1,
        pageSize: pageParams.pageSize,
        size: pageParams.pageSize,
        pageEnd: 1,
        columnNames:[]
    })

    //导出当前页
    handleEventObj.exportCurrentPage = (item)=>{
        const baseUrl= import.meta.env.VITE_RES_URL=='/'?'/api':import.meta.env.VITE_RES_URL
        let params = {
            pageNum:pageParams.page,
            pageSize:pageParams.pageSize,
            ...searchParams
        }
        let exportKeys = []
        checkedItemArr.value.map(v => {
            if(v.checked) {
                exportKeys.push(v.prop);
            }
        });
        if(type=='con'){
            params.pageNum = exportParam.value.pageNum
            params.pageSize = exportParam.value.size*exportParam.value.pageEnd
            params.columnNames = exportKeys
        }
        if(type=='all'){
            params.pageNum = 1
            params.pageSize = dataTotal.value
            params.columnNames = exportKeys
        }
        axios({
            data:params,
            method: 'POST',
            url: baseUrl+'/sys/enterprise/execl',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'yk_wx_admin':getToken("token")
            },
            responseType: 'blob',
            dataType: 'json'
        }).then(res => {
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel;charset=utf-8' });
            const fileName = '报表.xls';
            const elink = document.createElement('a');
            if ('download' in elink) {
                // 非IE下载
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
            } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName);
            }
        });
    }
    //更多导出配置
    handleEventObj.moreExport = ()=>{
        formDialogOption.formTitle = '提现审核'
        formDialogOption.openType = 'custom'
        formDialogOption.item = item
        formDialogOption.showFormDialog = true
        formDialogOption.customCopName = 'withdrawalDetail'
    }
}
