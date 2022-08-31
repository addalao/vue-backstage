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
    showConfirm,
    
){
    // handleEventObj.newData = () => { //新建
    //     console.log('新建')
    //     pageParams.type = 1
    //     pageParams.item = {}
    //     pageParams.show = true
    // }
    handleEventObj.excelImport = () => {// 导入
        showInput.value = true
    }
    handleEventObj.moreExport = () => {// 更多导出设置
        showMoreExport.value = true
    }
    handleEventObj.excelExport = async (type) => {// 导出
        const baseUrl = import.meta.env.VITE_RES_URL == '/' ? '/api' : import.meta.env.VITE_RES_URL
        let params = {
            pageNum: pageParams.page, pageSize: pageParams.pageSize, ...searchParams.value
        }
        let exportKeys = []
        checkedItemArr.value.map(v => {
            if (v.checked) {
                exportKeys.push(v.prop);
            }
        });
        if (type == 'con') {
            params.pageNum = exportParam.value.pageNum
            params.pageSize = exportParam.value.size * exportParam.value.pageEnd
            params.columnNames = exportKeys
        }
        if (type == 'all') {
            params.pageNum = 1
            params.pageSize = dataTotal.value
            params.columnNames = exportKeys
        }
        axios({
            data: params,
            method: 'POST',
            url: baseUrl + '/sys/enterprise/execl',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'yk_wx_admin': getToken("token")
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
    // handleEventObj.editData = (item) => {//编辑
    //     pageParams.type = 2
    //     pageParams.item = item
    //     pageParams.show = true
    // }
    handleEventObj.handleRecord = async (item) => {//操作记录
        pageParams.type = 3
        pageParams.item = item
        pageParams.showRecord = true
        // pageParams.item = {userId:item.userId}
        // pageParams.show = true
    }
   

	//搜索
    searchOption.searchType = 'conditionQuery'
    searchOptionsConditionQuery.options = [
        { label: '企业名称/代码/手机号', prop: 'enterpriseName', type: 'text' },
        { label: '省', prop: 'province', type: 'select', options: [], lkey: 'areaName', vkey: 'areaName' },
        { label: '市', prop: 'city', type: 'select', options: [], lkey: 'areaName', vkey: 'areaName' },
        { label: '区/县', prop: 'county', type: 'select', options: [], lkey: 'areaName', vkey: 'areaName' },
        { label: '街道办', prop: 'street', type: 'select', options: [], lkey: 'areaName', vkey: 'areaName' },
        { label: '大楼名称', prop: 'building', type: 'select', options: [], lkey: 'name', vkey: 'name' },
        { label: '楼号', prop: 'buildingNumber', type: 'text' },
        { label: '楼层', prop: 'floor', type: 'text' },
        { label: '房号', prop: 'room', type: 'text' },
        { label: '行业', prop: 'industry', type: 'select', options: [], lkey: 'name', vkey: 'name' },
        { label: '创建时间', prop: 'createTime', type: 'date' },
        { label: '更新时间', prop: 'updateTime', type: 'date' },
        {
            label: '在地注册情况', prop: 'registerType', type: 'select', options: [
                { label: '在地不在册', value: 1 },//1 在地不在册 2 在册不在地 3在地在册
                { label: '在册不在地', value: 2 },
                { label: '在地在册', value: 3 },
            ]
        },
        {
            label: '核验状态', prop: 'status', type: 'select', options: [
                { label: '待办', value: 0 },
                { label: '已核验', value: 1 },
            ]
        },
    ]
    getProvince()
    // 获取省份
    async function getProvince(id = 1, type = '') {
        const res = await _axios('get', `/sys/area/listByPid?pid=${id}`, {}, true)
        if (type == 'province') {
            searchOptionsConditionQuery.options[2].options = res
        } else if (type == 'city') {
            searchOptionsConditionQuery.options[3].options = res
        } else if (type == 'county') {
            searchOptionsConditionQuery.options[4].options = res
        } else {
            searchOptionsConditionQuery.options[1].options = res
        }
    
    }
    //获取行业
    getHangye()
    async function getHangye(id = 0, type = '') {
        const res = await _axios('get', `/sys/industry/listbypid?pid=${id}`, {}, true)
        searchOptionsConditionQuery.options[9].options = res
    }
    //获取楼
    async function getFloor(id) {
        const res = await _axios('post', `/sys/building/list`, {
            parentId: id
        }, true)
        searchOptionsConditionQuery.options[5].options = res
    }
    searchOptionsConditionQuery.getSelectVal = (e)=>{
        const [sitem, item] = e
        if (item.prop == 'street') {
            getFloor(sitem.areaId)
        }
        if (item.prop == 'province') {
            getProvince(sitem.areaId, 'province')
        }
        if (item.prop == 'city') {
            getProvince(sitem.areaId, 'city')
        }
        if (item.prop == 'county') {
            getProvince(sitem.areaId, 'county')
        }
    }
    // //设置新建表单默认值
    // formDialogOption.defaultItem = {type:1}
    // formDialogOption.dialogWidth = "30%"

    tableRequestOption.url = '/sys/enterprise/page'

    // //删除参数
    // tableDelDataOption.method = 'post'
    // tableDelDataOption.type = 'bodyArr'
    // tableDelDataOption.url = '/sys/cooperativePartner/remove'
    
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
