<template>
    <!-- 顶部导航区域 -->
    <HeaderTitle title="首页" content="扣款明细" icon="back"></HeaderTitle>
    <!-- 搜索区域 -->
    <ConditionQuery
        :searchOptions="searchOptionsConditionQuery.options"
        @reset="reset" 
        @search="search"
    >
    </ConditionQuery>
    <!-- 列表区域 -->
    <MainBody type="msearch">
        <el-table 
            :data="tableData"
            :stripe="tableOption.stripe"
            :border="tableOption.border"
        >
            <template v-for="(columnItem,columnIndex) in tableConfig" :key="columnIndex">
                <el-table-column v-if="columnItem.type=='state'" 
                    :prop="columnItem.prop" 
                    :label="columnItem.label" 
                    :width="columnItem.width || '200'"
                    :type="columnItem.type=='expand'?'expand':''"
                >
                    <template #default="scope">
                        <div>
                            <template v-for="(stateItem,sindex) in columnItem.option">
                                <span v-if="scope.row[columnItem.prop]===stateItem.value" :key="sindex">{{stateItem.label}}</span>
                            </template>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column v-else 
                    :prop="columnItem.prop" 
                    :label="columnItem.label" 
                    :width="columnItem.width || '200'"
                    :type="columnItem.type=='expand'?'expand':''"
                >
                    <template #default="scope">
                        <span>{{scope.row[columnItem.prop] || '-'}}</span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </MainBody>
    <!-- 分页 -->
    <Pagination :total="pageParams.dataTotal" :pageSize="pageParams.pageSize" @sizeChange="sizeChange" @currentChange="currentChange"></Pagination>
</template>
<script setup>
    import {watchEffect,ref,reactive,watch,defineAsyncComponent, computed} from 'vue'
    import {customToast} from '@/common/toast.js'
    import {tableConfig} from "./payment.js"
    import { useStore } from "vuex";
    import { useRoute,useRouter } from 'vue-router';
    import _axios from '@/plugins/axios';
	import {ElMessage} from 'element-plus'
    // import {createRequire} from 'module'

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const tableData = ref([])//table数据

    const searchOptionsConditionQuery = ref({
        options:[
            {label:'扣款状态',prop:'status',type:'select',options:[
                {label:"失败",value:0},
                {label:"成功",value:1}
            ]},
            {label:'时间断',prop:'mdate',type:'mdate',start:'startTime',end:'endTime'},
        ]
    })//条件搜索配置

    const searchOption = reactive({//搜索配置
        searchType:'fuzzyQuery',//搜索类型  fuzzyQuery模糊搜索  conditionQuery 多条件搜索
        hasSearch:true,//搜索栏 是否需要搜索框 ，默认ture
        mainBodyType:'single'//主盒子的样式类型 single  /  msearch
    })
    const pageParams  = reactive({//页面相关参数配置
        pageSize:12,//条数
        page:1,//页码
        show:false,//表单的显隐控制
        dataTotal:0,//总数
    })
    const searchParams = ref({})//搜索对象

    const tableOption = ref({//表格属性配置
        expandName:''
    })
   
    const currentId = ref('')
    const templateType=ref('custom')
    

    // 分页相关事件
    const sizeChange = (e)=>{
        pageParams.pageSize = e
        getTableData()
    }
    const currentChange = (e)=>{
        pageParams.page = e
        getTableData()
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
			// if(e[key]===0){
			// 	searchParams.value[key] = e[key]
			// }
        }
        searchOptionsConditionQuery.value.options.map(v=>{
            if(v.type=='mdate' || v.type=='mtime' || v.type=='mdatetime'){
                delete searchParams.value[v.prop]
            }
        })
        pageParams.page = 1
        getTableData()
    }
    //搜索栏自定义选择数据
    const getSelectVal = (e)=>{
        const [sitem,item] = e
    }

    getTableData()
    //获取table数据
    async function getTableData(){
        const res = await _axios("post",'/sys/reductionRecord/pageDto',{
            pageNum:pageParams.page,
            pageSize:pageParams.pageSize,
            ...searchParams.value,
        },true)
        const {records,total} = res
        tableData.value = records
        pageParams.dataTotal = parseInt(total)
    }
 
</script>
<style lang="scss" scoped>
    :deep(.el-scrollbar__bar.is-horizontal){
		height: 10px !important;
    }
    :deep(.el-table .el-table__cell){
        z-index: auto !important;
    }
    // :deep(.el-overlay-dialog .el-dialog){
    //     min-width: 400px !important;
    // }
    .more-handle{
        position: absolute;
        z-index: 99999;
        right: 0;
        top: 0;
        bottom: 0;
        border: 1px solid rgb(189, 193, 224);
        // min-width: 200px;
        height: 40px;
        background: #fff;
        box-sizing: border-box;
        padding: 0 6px;
        border-radius: 6px;
        @include flex-style(row,nowrap,space-between,center);
    }
</style>