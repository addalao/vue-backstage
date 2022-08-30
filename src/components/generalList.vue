<template>
    <!-- 顶部导航区域 -->
    <HeaderTitle :title="navBarTxt.firstMenuItem.value.name" :content="navBarTxt.subMenuItem.value.name"></HeaderTitle>
    <!-- 搜索区域 -->
    <FuzzyQuery 
        v-if="searchOption.searchType=='fuzzyQuery'" 
        :searchOptions="searchOptionsFuzzyQuery.val"
        :hasSearch="searchOption.hasSearch" 
        @reset="reset" 
        @search="search"
    >
        <TopBtn v-if="navBarTxt.topBtnList.value" @handle="topEventHandleObj" :btnList="navBarTxt.topBtnList.value"></TopBtn>  <!-- 搜索栏按钮 -->
    </FuzzyQuery>
    <ConditionQuery
        v-if="searchOption.searchType=='conditionQuery'" 
        :searchOptions="searchOptionsConditionQuery.options"
        @reset="reset" 
        @search="search"
    >
        <TopBtn v-if="navBarTxt.topBtnList.value" @handle="topEventHandleObj" :btnList="navBarTxt.topBtnList.value"></TopBtn><!-- 搜索栏按钮 -->
    </ConditionQuery>
    <component 
        v-if="searchOption.searchType=='customQuery'"
        @reset="reset" 
        @search="search"
        v-bind:is="customSearchComp"
    >
        <TopBtn v-if="navBarTxt.topBtnList.value" @handle="topEventHandleObj" :btnList="navBarTxt.topBtnList.value"></TopBtn><!-- 搜索栏按钮 -->
    </component>
    <!-- 列表区域 -->
    <MainBody :type="searchOption.searchType=='fuzzyQuery'?'single':(searchOption.searchType=='conditionQuery' || searchOption.searchType=='customQuery')?'msearch':'normal'">
        <div ref="tablesDom">
            <el-table 
                :data="tableData"
                :stripe="tableOption.stripe"
                :border="tableOption.border"
                :row-key="tableOption.dragId"
            >
                <template v-for="(columnItem,columnIndex) in tableColumnConfig" :key="columnIndex">
                    <el-table-column v-if="columnItem.type=='state'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >   
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <div>
                                <template v-for="(stateItem,sindex) in columnItem.option">
                                    <span v-if="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])==stateItem.value" :key="sindex">{{stateItem.label}}</span>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='tags'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <el-tag
                                style="margin-right:8px;"
                                v-for="(tag,tindex) in (columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])"
                                :closable="columnItem.closable?columnItem.closable:false"
                                :type="columnItem.tagType||'success'"
                                :key="tindex"
                                @click="customBtnEvent['tagsClick'](tag,scope.row,columnItem.subprop?columnItem.prop[columnItem.subprop]:columnItem.prop)"
                                @close="customBtnEvent['tagsClose'](tag,scope.row,columnItem.subprop?columnItem.prop[columnItem.subprop]:columnItem.prop)"
                            >
                                {{ columnItem.key?tag[columnItem.key]:tag}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='tagsStr'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <el-tag
                                style="margin-right:10px;margin-bottom:2px;margin-top:2px"
                                v-for="(tagstr,stindex) in scope.row[columnItem.prop] && scope.row[columnItem.prop].length>0?scope.row[columnItem.prop].split(','):[]"
                                :key="stindex"
                                :closable="columnItem.closable?columnItem.closable:false"
                                :type="columnItem.style||'success'"
                                @click="tagsClick(tagstr,scope.row,columnItem.prop)"
                                @close="tagsClose(tagstr,scope.row,columnItem.prop)"
                            >
                                {{tagstr}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='audio'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <audio controls>
                                <source :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])" type="audio/ogg">
                                <source :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])" type="audio/mpeg">
                                <source :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])" type="audio/wav">
                                您的浏览器不支持 audio 元素。
                            </audio>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='video'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <video controls width="160" height="120">
                                <source :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])" type="video/mp4">
                                <source :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])" type="video/ogg">
                                <source :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])" type="video/webm">
                                您的浏览器不支持Video标签。
                            </video>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='img'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <el-image
                                style="width: 40px; height: 40px"
                                :src="(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])"
                                :preview-src-list="[(columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop])]"
                                fit="cover"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='mimg'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <el-image 
                                v-for="(mimg,mindex) in (columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop].split(','):scope.row[columnItem.prop].split(','))"
                                style="width: 40px; height: 40px"
                                :src="mimg"
                                :preview-src-list="[columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop]]"
                                fit="cover"
                                :key="mindex"
                            >
                            </el-image>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='button'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <el-button size="small" :type="columnItem.btntype || 'success'" plain @click="customBtnEvent['rowBtnEvent'](scope.row,columnItem.subprop?columnItem.prop[columnItem.subprop]:columnItem.prop)">{{columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop]}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column v-else-if="columnItem.type=='expand'" 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <component v-bind:is="expandName" :current-row="scope.row"></component>
                        </template>
                    </el-table-column>
                    <el-table-column v-else 
                        :prop="columnItem.prop" 
                        :width="columnItem.width || '200'"
                        :type="columnItem.type=='expand'?'expand':''"
                    >
                        <template #header>
                            <div style="display:flex;align-items:center">
                                <span>{{columnItem.label}}</span>
                                <el-tooltip v-if="columnItem.explain" :content="columnItem.explain" placement="top">
                                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                                </el-tooltip>
                            </div>
                        </template>
                        <template #default="scope">
                            <span>{{columnItem.subprop? scope.row[columnItem.prop][columnItem.subprop]:scope.row[columnItem.prop]}}</span>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column v-if="navBarTxt.rightBtnList.value && navBarTxt.rightBtnList.value.length>0" :fixed="tableOption.handleFixed==false?tableOption.handleFixed:'right'" label="操作" align="center" :width="tableOption.handleWidth||200">
                    <template #default="scope">
                        <template v-if="navBarTxt.rightBtnList.value.length>3">
                            <template v-for="(bitem,bindex) in navBarTxt.rightBtnList.value" :key="bindex">
                                <template v-if="bindex<2">
                                    <el-popconfirm v-if="bitem.name=='删除'" title="确定删除该数据?"
                                        @confirm="handleEventObj[bitem.uri](scope.row,bitem)"
                                    >
                                        <template #reference>
                                            <el-button link>{{bitem.name}}</el-button>
                                        </template>
                                    </el-popconfirm>
                                    <el-button v-else link @click="handleEventObj[bitem.uri](scope.row,bitem,scope)">{{bitem.name}}</el-button>
                                </template>
                            </template> 
                            <el-button link stype="position:relative;" @mouseenter="handleMore(scope.row)" @mouseleave="currentId=''">
                                more
                                <el-icon><arrow-up /></el-icon>
                                <div v-if="currentId==scope.row" class="more-handle">
                                    <template v-for="(bitem,bindex) in navBarTxt.rightBtnList.value" :key="bindex">
                                        <template v-if="bindex>1">
                                            <el-button v-if="bitem.name=='删除'" link @click="handleEventObj[bitem.uri](scope.row,bitem,'more')">{{bitem.name}}</el-button>
                                            <el-button v-else link @click="handleEventObj[bitem.uri](scope.row,bitem,scope)">{{bitem.name}}</el-button>
                                        </template>
                                    </template>
                                </div>
                            </el-button>
                        </template>
                        <template v-else-if="navBarTxt.rightBtnList.value.length==3">
                            <template v-for="(bitem,bindex) in navBarTxt.rightBtnList.value" :key="bindex">
                                <el-popconfirm v-if="bitem.name=='删除'" title="确定删除该数据?"
                                            @confirm="handleEventObj[bitem.uri](scope.row,bitem)"
                                        >
                                    <template #reference>
                                        <el-button link type="warning">{{bitem.name}}</el-button>
                                    </template>
                                </el-popconfirm>
                                <el-button v-else link :type="JSON.parse(bitem.icon).type" @click="handleEventObj[bitem.uri](scope.row,bitem,scope)">{{bitem.name}}</el-button>
                            </template>
                        </template>
                        <template v-else>
                            <template v-for="(bitem,bindex) in navBarTxt.rightBtnList.value" :key="bindex">
                                <el-popconfirm v-if="bitem.name=='删除'" title="确定删除该数据?"
                                    @confirm="handleEventObj[bitem.uri](scope.row,bitem)">
                                    <template #reference>
                                        <el-button class="btn-item" 
                                            size="small"
                                            :type="JSON.parse(bitem.icon).type" 
                                            :icon="JSON.parse(bitem.icon)['icon'] || ''" 
                                            :circle="JSON.parse(bitem.icon)['circle'] || false" 
                                            :round="JSON.parse(bitem.icon)['round'] || false" 
                                            :plain="JSON.parse(bitem.icon)['plain'] || false" 
                                        >
                                            {{JSON.parse(bitem.icon)['circle'] ? '':bitem.name}}
                                        </el-button>
                                    </template>
                                </el-popconfirm>
                                <el-button v-else class="btn-item" 
                                    size="small"
                                    :type="JSON.parse(bitem.icon).type" 
                                    :icon="JSON.parse(bitem.icon)['icon'] || ''" 
                                    :circle="JSON.parse(bitem.icon)['circle'] || false" 
                                    :round="JSON.parse(bitem.icon)['round'] || false" 
                                    :plain="JSON.parse(bitem.icon)['plain'] || false" 
                                    @click="handleEventObj[bitem.uri](scope.row,bitem,scope)">
                                    {{JSON.parse(bitem.icon)['circle'] ? '':bitem.name}}
                                </el-button>
                            </template>   
                        </template>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </MainBody>
    <!-- 分页 -->
    <Pagination :total="pageParams.dataTotal" :currentPage="pageParams.page" :pageSize="pageParams.pageSize" @sizeChange="sizeChange" @currentChange="currentChange"></Pagination>
    <!-- 表单处理 -->
    <el-dialog
        v-model="formDialogOption.showFormDialog"
        :title="formDialogOption.formTitle"
        :width="formDialogOption.dialogWidth"
        @close="close"
    >
        <GeneralForm v-if="formDialogOption.openType!=='custom'" @close="close" @confirm="confirm" :item="formDialogOption.item" :type="formDialogOption.openType"></GeneralForm>
        <component v-if="formDialogOption.openType==='custom'" v-bind:is="customComp" @close="close" @confirm="confirm" :item="formDialogOption.item" :type="formDialogOption.openType"></component>
    </el-dialog>
</template>
<script setup>
    import {watchEffect,ref,shallowRef,reactive,watch,defineAsyncComponent, computed,onMounted,nextTick} from 'vue'
    import GeneralForm from './generalForm.vue'
    import CurrentNavBar from '@/common/currentNavBar.js'
    import {showConfirm} from '@/common/showConfirm.js'
    import { useStore } from "vuex";
    import { useRoute,useRouter } from 'vue-router';
    import TopBtn from './topBtn.vue';
    import _axios from '../plugins/axios';
	// import {ElMessage} from 'element-plus'
    import showToast from "../common/showToast.js"
    import {modulesConfig,modulesList} from "@/main.js"
    import emitter from '../plugins/mitt';
    // import {createRequire} from 'module'
    import Sortable from "sortablejs";
    import tableSortable from "@/common/tableSortable.js"

    emitter.on('refreshTableList',()=>{
        customBtnEvent.refreshList('full')
    })
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const navBarTxt = CurrentNavBar(store)//顶部导航头数据
    const tableColumnConfig = ref([])//表头配置
    const tableData = ref([])//table数据
    const tablesDom = ref(null)
    const searchOptionsFuzzyQuery = reactive({
       val:{
            placeholder:'关键字',
            keys:'',
       }
    })//模糊搜索配置
    const searchOptionsConditionQuery = ref({
        options:[]
    })//条件搜索配置
    const searchOption = reactive({//搜索配置
        searchType:'fuzzyQuery',//搜索类型  fuzzyQuery模糊搜索  conditionQuery 多条件搜索  customQuery自定义搜索
        hasSearch:true,//搜索栏 是否需要搜索框 ，默认ture
        mainBodyType:'single',//主盒子的样式类型 single  /  msearch
        comTplName:'',//自定义搜索组件名称
    })
    const pageParams  = reactive({//页面相关参数配置
        pageSize:12,//条数
        page:1,//页码
        show:false,//表单的显隐控制
        dataTotal:0,//总数
    })
    const searchParams = ref({})//搜索对象
    const tableRequestOption = reactive({//列表数据请求相关配置
        url:'',
        params:{},
        method:'post'
    })
    const tableDelDataOption = reactive({//列表数据删除请求相关配置
        url:'',
        key:'',
        valkey:'',
        method:'delete',
        type:'query' //query传参  body传参  bodyArr数组[]传参 path路径传参 queryArr传参
    })
    const tableOption = ref({//表格属性配置
        expandName:'',
        isDrag:false,
        dragId:'id',
        dragUrl:''
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
        if(Object.keys(e).length){
            for(let key in e){
                if(e[key] || e[key]===0){
                    searchParams.value[key] = e[key]
                }else{
                    delete searchParams.value[key]
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
        }else{
            searchParams.value = {}
        }
        pageParams.page = 1
        getTableData()
    }
    //搜索栏自定义选择数据
    const getSelectVal = (e)=>{
        const [sitem,item] = e
    }

    //顶部可配按钮点击事件
    const topEventHandleObj = (e)=>{
        handleEventObj[e]()
    }
    //按钮操作事件对象
    const handleEventObj = {
		resetFormDialogWidth:()=>{
			//如果其他事件修改了默认的dialog 的width ，调用此函数重置默认值
		},
         //新建
        newData:()=>{
			handleEventObj.resetFormDialogWidth()
            formDialogOption.value.formTitle = navBarTxt.subMenuItem.value.name+'--新建'
            formDialogOption.value.openType = 'new'
            formDialogOption.value.item = Object.assign({},formDialogOption.value.defaultItem) || {}
            formDialogOption.value.showFormDialog = true
        },
        //编辑
        editData:(item,bitem,scope)=>{
			handleEventObj.resetFormDialogWidth()
            formDialogOption.value.formTitle = navBarTxt.subMenuItem.value.name+'--编辑'
            formDialogOption.value.openType = 'edit'
            formDialogOption.value.item = item
            formDialogOption.value.showFormDialog = true
        },
        //上移一位
        moveUp:async (item,bitem,scope)=>{
            const {$index} = scope
            // tableOption.value.dragId
            // console.log()

            await _axios('post',tableOption.value.dragUrl,{
                startSortId:item[tableOption.value.dragId],
                // endSortId:newId,
                sortFlag:1
            },true)
            getTableData()
        },
        //查看
        viewData:(item)=>{
			handleEventObj.resetFormDialogWidth()
            formDialogOption.value.formTitle = navBarTxt.subMenuItem.value.name+'--查看'
            formDialogOption.value.openType = 'view'
            formDialogOption.value.item = item
            formDialogOption.value.showFormDialog = true
        },
        //删除
        delData:async (item,bitem,type)=>{
            let url = `${tableDelDataOption.url}`
            if(tableDelDataOption.valkey){
                url = `${tableDelDataOption.url}?${tableDelDataOption.key || 'id'}=${item[tableDelDataOption.valkey]}`
            }else{
                url = `${tableDelDataOption.url}?${tableDelDataOption.key || 'id'}=${item.id}`
            }
            if(type=='more'){
                showConfirm('确定删除该数据',{confirm:async ()=>{
                    delFun()
                }})
            }else{
                delFun()
            }
            async function delFun(){
                if(tableDelDataOption.type=='body'){
                    let params = {
                        id:tableDelDataOption.valkey?item[tableDelDataOption.valkey]:item.id
                    }
                    if(tableDelDataOption.key){
                        delete params.id
                        params[tableDelDataOption.key] = tableDelDataOption.valkey?item[tableDelDataOption.valkey]:item.id
                    }
                    await _axios(tableDelDataOption.method,url,params,true)
                }
                else if(tableDelDataOption.type=='queryArr'){
                    let pa = `ids=${item.id}`
                    if(item[tableDelDataOption.valkey]){
                        pa = `ids=${item[tableDelDataOption.valkey]}`
                    }
                    url = `${tableDelDataOption.url}?${pa}`
                    await _axios(tableDelDataOption.method,url,{},true)
                }
                else if(tableDelDataOption.type=='bodyArr'){
                    await _axios(tableDelDataOption.method,url,[tableDelDataOption.valkey?item[tableDelDataOption.valkey]:item.id],true)
                }else{
                    await _axios(tableDelDataOption.method,url,{},true)
                }
                showToast.success("删除成功");
                getTableData()
            }
        }
    }
    
    // 更多操作
    const handleMore = (e)=>{
        currentId.value = e
    }

    // 所有自定义按钮点击事件对象
    const customBtnEvent = {
        //按钮类型row点击事件,可通过prop来确定点击事件具体操作的是那个数据
        rowBtnEvent:(row,prop)=>{

        },
        //tag点击事件，可通过prop来确定点击事件具体操作的是那个数据
        tagsClick:(tag,row,prop)=>{

        },
        //tag删除事件，可通过prop来确定点击事件具体操作的是那个数据
        tagsClose:(tag,row,prop)=>{
            
        },
        refreshList:(type)=>{
            if(type=='full'){
                pageParams.page = 1
                searchParams.value = {}
                getTableData()
            }else{
                getTableData()
            }
        }
    }

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

    // getTableData()
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
        //拖拽排序
        if(tableOption.value.isDrag && tablesDom.value){
            const tbody = tablesDom.value.querySelector('.el-table__body-wrapper tbody');
            tableSortable(tbody,Sortable,tableData.value,tableOption.value.dragId,tableOption.value.dragUrl,()=>{
                tableData.value = []
                getTableData()
            })
        }
		
    }

    //下拉数据组件注册
    const expandName = computed(()=>{
        return defineAsyncComponent(()=>import(`../components/expand${route.path}.vue`))
    })

    //自定义搜索组件注册
    const customSearchComp = shallowRef()
    watch(()=>searchOption.comTplName,val=>{
        customSearchComp.value = defineAsyncComponent(()=>import(`../components/customSearch/${searchOption.comTplName}.vue`))
    })

    //按钮事件自定义组件
    const customComp = shallowRef()
    watch(()=>formDialogOption.value.customCopName,val=>{
        customComp.value = defineAsyncComponent(()=>import(`../components/customForm/${formDialogOption.value.customCopName}.vue`))
    })

    // watchEffect(async onInvalidate => {
       
    // },{
    //     onTrack: e => {    // 调试用： 追踪的信息
    //         templateType.value = route.meta.type
    //     },
    //     onTrigger: e => {  // 调试用：响应式信息
    //         templateType.value = route.meta.type
    //     }
    // })
    initTableConfig()
    function initTableConfig(){
        templateType.value = route.meta.type
        // console.log(templateType.value)
        if(templateType.value=='custom') return

		if(modulesConfig[`./config${route.path}.js`]){
			tableColumnConfig.value = modulesConfig[`./config${route.path}.js`].tableConfig
		}else{
		    showToast.error("请配置表头配置js文件");  
		}
		
		if(modulesList[`./customList${route.path}.js`]){
			const customLogic = modulesList[`./customList${route.path}.js`]
			if(customLogic.default===undefined){
			    return showToast.error("请配置列表自定义js文件");
			}
			customLogic.default(
			    store,route,router,
			    tableColumnConfig.value,
			    formDialogOption.value,
		        searchParams.value,
			    searchOption,
			    searchOptionsFuzzyQuery,
			    searchOptionsConditionQuery.value,
			    pageParams,
			    tableRequestOption,
			    tableOption.value,
			    tableDelDataOption,
			    handleEventObj,
			    customBtnEvent,
				_axios,
				showToast,
				showConfirm
			)
			getTableData()
		}
		
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
    .explain-style{
        margin-left: 10px;
        cursor: pointer;
        font-size: 16px;
    }
</style>