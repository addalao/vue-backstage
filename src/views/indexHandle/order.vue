<template>
    <!-- 顶部导航区域 -->
    <HeaderTitle title="首页" :content="route.query.title" icon="back"></HeaderTitle>
    <!-- 搜索区域 -->
    <FuzzyQuery 
        :searchOptions="searchOptionsFuzzyQuery.val"
        @reset="reset" 
        @search="search"
    >
    </FuzzyQuery>
    <!-- 列表区域 -->
    <MainBody type="single">
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
            <el-table-column :fixed="tableOption.handleFixed==false?tableOption.handleFixed:'right'" label="操作" align="center" :width="tableOption.handleWidth||200">
                <template #default="scope">
                    <el-button type="success" @click="orderDetail(scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
    </MainBody>
    <!-- 分页 -->
    <Pagination :total="pageParams.dataTotal" :pageSize="pageParams.pageSize" @sizeChange="sizeChange" @currentChange="currentChange"></Pagination>
     <!-- 表单处理 -->
    <el-dialog
        v-model="formDialogOption.showFormDialog"
        :title="formDialogOption.formTitle"
        :width="formDialogOption.dialogWidth"
        @close="close"
    >
        <GeneralForm v-if="formDialogOption.openType!=='custom'" @close="close" @confirm="confirm" :item="formDialogOption.item" :type="formDialogOption.openType"></GeneralForm>
        <component v-if="formDialogOption.openType==='custom'" v-bind:is="OrderDetail" @close="close" @confirm="confirm" :item="formDialogOption.item" :type="formDialogOption.openType"></component>
    </el-dialog>
</template>
<script setup>
    import {watchEffect,ref,reactive,watch,defineAsyncComponent, computed} from 'vue'
    import {customToast} from '@/common/toast.js'
    import {tableConfig} from "@/config/order/lease.js"
    import { useStore } from "vuex";
    import { useRoute,useRouter } from 'vue-router';
    import _axios from '@/plugins/axios';
	import {ElMessage} from 'element-plus'
    import OrderDetail from "@/components/customForm/orderDetail.vue"
    // import {createRequire} from 'module'

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const tableData = ref([])//table数据

    const searchOptionsFuzzyQuery = reactive({
       val:{
            placeholder:'订单号/电话号码',
            keys:'keywords',
       }
    })//模糊搜索配置
    // const searchOptionsConditionQuery = ref({
    //     options:[
    //         {label:'订单号/电话号码',prop:'keywords',type:'text',placeholder:''},
    //         {label:'扣款状态',prop:'status',type:'select',options:[
    //             {label:"失败",value:0},
    //             {label:"成功",value:1}
    //         ]},
    //         {label:'时间断',prop:'mdate',type:'mdate',start:'startTime',end:'endTime'},
    //     ]
    // })//条件搜索配置

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
    const tableRequestOption = reactive({//列表数据请求相关配置
        url:'/sys/order/page',
        params:{orderType:route.query.orderType,status:route.query.status},
        method:'post'
    })

    const tableOption = ref({//表格属性配置
        expandName:''
    })

    const formDialogOption = ref({//表单dialog参数配置
        showFormDialog:false,
        formTitle:'',
        dialogWidth:"30%",
        item:{},//当前点击或选中项的row数据
        defaultItem:{},//表单默认值
        openType:'new',//打开表单的类型  new  edit  view  custom
        customCopName:''
    })
    
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
        pageParams.page = 1
        getTableData()
    }
    //搜索栏自定义选择数据
    const getSelectVal = (e)=>{
        const [sitem,item] = e
    }

    // 详情
    const orderDetail = (item)=>{
        console.log(item)
        formDialogOption.value.formTitle = '订单详情'
        formDialogOption.value.openType = 'custom'
        formDialogOption.value.item = item
        formDialogOption.value.dialogWidth = '90%'
        formDialogOption.value.showFormDialog = true
        formDialogOption.value.customCopName = 'orderDetail'
    }

     //按钮事件自定义组件
    // const customComp = computed(()=>{
    //     return defineAsyncComponent(()=>import(``))
    // })

     /*
    表单dialog相关操作
    */
    const close = ()=>{//关闭
        formDialogOption.value.showFormDialog = false
        getTableData()
    }
    const confirm = ()=>{//确定
        formDialogOption.value.showFormDialog = false
        if(formDialogOption.value.openType=='new'){
            pageParams.page =1
            searchParams.value = {}
        }
        getTableData()
    }

    getTableData()
    //获取table数据
    async function getTableData(){
        const res = await _axios(tableRequestOption.method,tableRequestOption.url,{
            pageNum:pageParams.page,
            pageSize:pageParams.pageSize,
            ...searchParams.value,
            ...tableRequestOption.params
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