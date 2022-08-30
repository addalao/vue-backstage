<template>
    <HeaderTitle :title="navBarTxt.firstMenuItem.value.name" :content="navBarTxt.subMenuItem.value.name"></HeaderTitle>
    <ConditionQuery :searchOptions="searchOptions" @reset="reset" @search="search">
        <TopBtn @handle="topEventHandleObj" :btnList="navBarTxt.topBtnList.value"></TopBtn>
    </ConditionQuery>
    <MainBody type="msearch">
        <el-table :data="tableData" :row-key="getRowKey">
            <el-table-column v-for="(columnItem,columnIndex) in tableConfig" :prop="columnItem.prop" :label="columnItem.label" :key="columnIndex" :width="columnItem.width || '200'">
                <template #default="scope">
                    <div v-if="columnItem.type=='state'">
                        <template v-for="(stateItem,sindex) in columnItem.option">
                            <span v-if="scope.row[columnItem.prop]===stateItem.value" :key="sindex">{{stateItem.label}}</span>
                        </template>
                    </div>
                    <div v-else-if="columnItem.type=='tags'">
                        <el-tag
                            v-for="(tag,tindex) in scope.row[columnItem.prop]"
                            :key="tindex"
                            :closable="columnItem.closable?columnItem.closable:false"
                        >
                            {{ tag[columnItem.key] }}
                        </el-tag>
                    </div>
                    <div v-else>{{scope.row[columnItem.prop] || '-'}}</div>
                </template>
            </el-table-column>
        </el-table>
    </MainBody>
    <Pagination :total="dataTotal" :pageSize="pageParams.pageSize" @sizeChange="sizeChange" @currentChange="currentChange"></Pagination>
    <!-- 更多导出配置 -->
    <el-drawer class="more-export" size="40%" v-model="showMoreExport" direction="ttb">
        <template #title style="margin:0">
            <h4>更多导出配置</h4>
        </template>
        <template #default>
            <el-form :inline="true" class="user-search">
                <el-form-item label="导出字段："><el-checkbox v-model="selectAll" @change="selectAllAttr">全部</el-checkbox></el-form-item>
                <el-form-item v-for="(item, index) in checkedItemArr" :key="index">
                    <el-checkbox v-model="item.checked">{{ item.name }}</el-checkbox>
                </el-form-item>
                <el-form style="display:flex;flex-wrap:nowrap;">
                    <div style="border:1px solid #ddd;padding:16px 6px 0 6px;">
                        <el-form-item label="导出数据起始页:">
                            <el-input style="width: 80px;" type="number" @change="changePageNum" v-model="exportParam.pageNum" placeholder="请输入导出数据起始页"></el-input>
                        </el-form-item>
                        <el-form-item label="导出数据每页条数:">
                            <el-input style="width: 80px;" type="number" @change="changeSize" v-model="exportParam.size" placeholder="请输入导出数据每页条数"></el-input>
                        </el-form-item>
                        <el-form-item label="导出数据结束页">
                            <el-input style="width: 80px;" type="number" @change="changePageEnd" v-model="exportParam.pageEnd" placeholder="请输入导出数据结束页"></el-input>
                        </el-form-item>
                        <el-form-item style="margin-left: -14px;">
                            <el-button type="primary" @click="handleEventObj['exportCurrentPage']('con')">导出</el-button>
                        </el-form-item>
                        <el-form-item style="margin-left: -14px;">
                            <el-button type="primary" plain @click="clearExport">清除导出条件</el-button>
                        </el-form-item>
                    </div>
                </el-form>
            </el-form>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="showMoreExport=false">关闭</el-button>
                <el-button type="primary" @click="handleEventObj['exportCurrentPage']('all')">导出全部</el-button>
            </div>
        </template>
    </el-drawer>
</template>
<script setup>
    import CurrentNavBar from '@/common/currentNavBar.js'
    import { useStore } from "vuex";
    import {tableConfig} from '@/config/finance/excel.js'
    import { ref,reactive } from 'vue-demi';
    import _axios from '@/plugins/axios';
    import {getToken} from '@/utils/tools'
    import axios from "axios";

    const store = useStore()
    const navBarTxt = CurrentNavBar(store)
    const baseUrl=import.meta.env.VITE_RES_URL=='/'?'/api':import.meta.env.VITE_RES_URL

    const tableData = ref([])
    const pageParams  = reactive({
        pageSize:12,
        page:1,
        type:1,
        show:false,
        showRecord:false,
        item:{}
    })
    const dataTotal = ref(0)
    const showMoreExport = ref(false)
    const searchOptions = ref([
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
    ])
    const searchParams = ref({})
    const selectAll=ref(true)
    const exportParam =ref({
        pageNum: 1,
        pageSize: pageParams.pageSize,
        size: pageParams.pageSize,
        pageEnd: 1,
        columnNames:[]
    })
    //导出字段
    const checkedItemArr=ref([
        { name: '用户名称', prop: 'userName', checked: true },
        { name: '电话号码', prop: 'userPhone', checked: true },
        { name: '订单号', prop: 'orderNumber', checked: true },
        { name: '订单类型', prop: 'orderType', checked: true },
        { name: '订单金额', prop: 'orderAmount', checked: true },
        { name: '押金', prop: 'deposit', checked: true },
        { name: '运费', prop: 'freight', checked: true },
        { name: '买断金额', prop: 'buyOutAmount', checked: true },
        { name: '支付单号', prop: 'payNo', checked: true },
        { name: '支付状态', prop: 'payStatus', checked: true },		
        { name: '支付金额', prop: 'payAmount', checked: true },
        { name: '支付方式', prop: 'payType', checked: true },
        { name: '预付金额', prop: 'prepaymentAmount', checked: true },
    ])

    const getRowKey = (row)=>{
        return row.id;
	}

    const selectAllAttr = (val)=> {
        if (val) {
            checkedItemArr.value.map(v => {
                v.checked = true;
            });
        } else {
            checkedItemArr.value.map(v => {
                v.checked = false;
            });
        }
    }

    const changePageNum = (e)=>{
        if(!(/(^[1-9]\d*$)/.test(e))){
            exportParam.value.pageNum = 1
        }else{
            exportParam.value.pageNum = e
        }
    }
    const changeSize= (e)=>{
        if(!(/(^[1-9]\d*$)/.test(e))){
            exportParam.value.size = 1
        }else{
            exportParam.value.size = e
        }
    }
    const changePageEnd= (e)=>{
        if(!(/(^[1-9]\d*$)/.test(e))){
            exportParam.value.pageEnd = 1
        }else{
            exportParam.value.pageEnd = e
        }
    }

    const clearExport = ()=>{
        exportParam.value.pageNum = 1;
        exportParam.value.pageSize = pageParams.pageSize;
        exportParam.value.size = pageParams.pageSize;
        exportParam.value.pageEnd = 1;
        checkedItemArr.value.map(v => {
            v.checked = true;
        });
    }

    //搜索重置
    const reset = ()=>{
        pageParams.page = 1
        searchParams.value = {}
        getTableData()
    }

    //搜索事件
    const search = (e)=>{
        for(let key in e){
            if(e[key] || e[key]===0){
                searchParams.value[key] = e[key]
            }
        }
        searchOptions.value.map(v=>{
            if(v.type=='mdate' || v.type=='mtime' || v.type=='mdatetime'){
                delete searchParams.value[v.prop]
            }
        })
        pageParams.page = 1
        getTableData()
    }

    //顶部可配按钮点击事件
    const topEventHandleObj = (e)=>{
        handleEventObj[e]()
    }

    //列表按钮操作事件对象
    const handleEventObj = {
        // 更多导出设置
        moreExport:()=>{
            showMoreExport.value = true
        },
         // 导出
        exportCurrentPage:async (type)=>{
            const baseUrl= import.meta.env.VITE_RES_URL=='/'?'/api':import.meta.env.VITE_RES_URL
            let params = {
                pageNum:pageParams.page,pageSize:pageParams.pageSize,...searchParams.value
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
				url: baseUrl+'/sys/orderPayinfo/execl',
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
    }

    const success = ()=>{
        pageParams.page = 1
        pageParams.show = false
        pageParams.showRecord = false
        getTableData()
    }
    const closeForm = ()=>{
        pageParams.show = false
        pageParams.showRecord = false
        pageParams.page = 1
        getTableData()
    }

    const sizeChange = (e)=>{
        pageParams.pageSize = e
        getTableData()
    }
    const currentChange = (e)=>{
        pageParams.page = e
        getTableData()
    }

    getTableData()
    //获取table数据
    async function getTableData(){
        const res = await _axios('post',`/sys/orderPayinfo/page`,{
            pageNum:pageParams.page,
            pageSize:pageParams.pageSize,
            ...searchParams.value
        },true)
        const {records,total} = res
        tableData.value = records
        dataTotal.value = parseInt(total)
    }

</script>
<style lang="scss" scoped>
    // :deep(.el-table__header){
    //     width: auto !important;
    // }
    .import-name{
        position: fixed;
        z-index: 999;
        background: #fff;
        border: 1px solid #ddd;
        top: 200px;
        width: 300px;
        height: 200px;
        // line-height: 200px;
        text-align: center;
        left: 50%;
        margin-left: -100px;
        border-radius: 10px;
        input{
            border: 1px solid rgb(96, 114, 194);
            margin-top: 40px;
        }
        span{
            display: block;
            text-align: right;
            box-sizing: border-box;
            padding: 10px;
            color: #999;
            font-weight: bold;
            cursor: pointer;
        }
    }
    
</style>