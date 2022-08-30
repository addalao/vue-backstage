<template>
    <div :class="['search-box',isMore?'active':'']">
        <el-row :gutter="20" :class="['condition-list',isMore?'active':'']" id="conditionList">
            <el-col class="condition-item" :span="6" :xs="24" :sm="12" :md="6" :xl="4" v-for="(item,index) in searchOptions" :key="index">
                <el-tooltip
                    effect="dark"
                    :content="item.label"
                    placement="top-start"
                >
                    <span class="item-label">{{item.label}}</span>
                </el-tooltip>
                <div class="item-val">
                    <el-input v-if="item.type=='text'" v-model="conditionData[item.prop]" @input="textVal($event,item.prop)" :placeholder="'请输入'+item.label" clearable />
                    <el-input-number style="width:100%" v-if="item.type=='number'" v-model="conditionData[item.prop]" :placeholder="'请输入'+item.label" clearable />
                    <el-select style="width:100%" v-if="item.type=='select'" v-model="conditionData[item.prop]" :placeholder="'请选择'+item.label" clearable >  <!--  @clear="reset" -->
                        <el-option
                            v-for="(sitem,sindex) in item.options"
                            :key="sindex"
                            :label="item.lkey?sitem[item.lkey]:sitem.label"
                            :value="item.vkey?sitem[item.vkey]:sitem.value"
                            @click.native="getSelectVal(sitem,item)"
                        >
                        </el-option>
                    </el-select>
                    <el-date-picker style="width:100%" v-if="item.type=='date'" @change="dateVal($event,item.prop)" v-model="conditionData[item.prop]" 
						type="date" :placeholder="'请选择'+item.label" clearable>
					</el-date-picker>
                    <el-date-picker
                        style="width:100%"
                        v-if="item.type=='mdate'"
                        @change="mdateVal($event,item)"
                        v-model="conditionData[item.prop]"
                        type="daterange"
                        range-separator="To"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
						clearable
                    >
                    </el-date-picker>
                    <el-time-picker style="width:100%" v-if="item.type=='time'" @change="timeVal($event,item.prop)" v-model="conditionData[item.prop]" 
						type="time" :placeholder="'请选择'+item.label" clearable>
					</el-time-picker>
                    <el-time-picker
                        style="width:100%"
                        v-if="item.type=='mtime'"
                        @change="mtimeVal($event,item)"
                        v-model="conditionData[item.prop]"
                        is-range
                        range-separator="To"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
						clearable
                    >
                    </el-time-picker>
                    <el-date-picker
                        style="width:100%"
                        v-if="item.type=='datetime'"
                        @change="timeVal($event,item.prop)"
                        v-model="conditionData[item.prop]"
                        type="datetime"
                        :placeholder="'请选择'+item.label"
						clearable
                    >
                    </el-date-picker>
                    <el-date-picker
                        style="width:100%"
                        v-if="item.type=='mdatetime'"
                        @change="mtimeVal($event,item)"
                        v-model="conditionData[item.prop]"
                        type="datetimerange"
                        range-separator="To"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
						clearable
                    >
                    </el-date-picker>
                </div>
            </el-col>
        </el-row>
        <div :class="['search-handle',isMore?'active':'']">
            <div>
                <slot></slot>
            </div>
            <div class="right-handle">
                <el-button type="primary" @click="search">搜索</el-button>
                <el-button @click="reset">重置</el-button>
                <el-button v-if="searchOptions.length>4" link :icon="isMore?'ArrowUp':'ArrowDown'" @click="moreCondition">{{isMore?'close':'more'}}</el-button>
            </div>
        </div>
        
    </div>
</template>
<script>
    export default {
        name: "ConditionQuery"
    }
</script>
<script setup>
    import {Search,ArrowDown,ArrowUp} from '@element-plus/icons-vue'
    import { ref,computed } from "vue"
    // import { ElMessage } from 'element-plus'
    import {formatDate} from '@/plugins/formatdate'
	import { useStore } from 'vuex';
	import emitter from "@/plugins/mitt";
    import showToast from '../../common/showToast'
	
	const store = useStore()

    const props = defineProps({
        searchOptions: {
            type: Array,
            default: () => {
                return [
                    {label:'文本',prop:'text',type:'text',placeholder:''},
                    {label:'数字',prop:'number',type:'number',exp:'自定义正则验证'},
                    {label:'选择框',prop:'select',type:'select',options:[{label:'张三',value:'112'}],lkey:'',vkey:''},
                    {label:'日期',prop:'date',type:'date',hasTime:true},
                    {label:'日期桥',prop:'mdate',type:'mdate',start:'start',end:'end',hasTime:true},
                    {label:'时间',prop:'time',type:'time'},
                    {label:'时间桥',prop:'mtime',type:'mtime',start:'start',end:'end'},
                    {label:'日期时间',prop:'datetime',type:'datetime',hasTime:true},
                    {label:'日期时间桥',prop:'mdatetime',type:'mdatetime',start:'start',end:'end',hasTime:true},
                ]
            }
        }
    })
    const emits = defineEmits(['reset','search','select'])

    const inputVal = ref('')
    const isMore = ref(false)
    // const searchParams = ref({
    //     placeholder:'关键字',
    //     keys:'',
    //     ...props.searchOptions
    // })
    const conditionData = ref({})
	const leftSpace = ref('96px')
	
	const collspace = computed(()=>{
		if(store.state.page.isCollapsed===true || store.state.page.isCollapsed==='true'){
			return true
		}
		return false
	})
	
	//监听菜单变化
	// emitter.on("menuClose",(e)=>{
	// 	isMore.value = false
	//     if(e){
	//         leftSpace.value = '216px'
	//     }else{
	//         leftSpace.value = '96px'
	//     }
	// })
	
	// if(collspace.value){
	//     leftSpace.value = '216px'
	// }else{
	//     leftSpace.value = '96px'
	// }

    //更多搜索条件
    const moreCondition = ()=>{
        isMore.value = !isMore.value
    }

    //输入框
    const textVal = (e,prop)=>{
        conditionData.value[prop] = e.trim()
    }
    // 日期
    const dateVal = (e,prop)=>{
        if(e){
			conditionData.value[prop] = formatDate('yyyy-MM-dd hh:mm:ss',e)
		}else{
			reset()
		}
    }
    // 日期桥
    const mdateVal = (e,item)=>{
        // delete conditionData.value[item.prop]
		if(e){
			const [a,b] = e
			conditionData.value[item.start] = formatDate('yyyy-MM-dd hh:mm:ss',a)
			conditionData.value[item.end] = formatDate('yyyy-MM-dd hh:mm:ss',b)
		}else{
			reset()
		}
    }
    // 时间
    const timeVal = (e,prop)=>{
		if(e){
			conditionData.value[prop] = formatDate('yyyy-MM-dd hh:mm:ss',e)
		}else{
			reset()
		}
    }
    // 时间桥
    const mtimeVal = (e,item)=>{
        // delete conditionData.value[item.prop]
		if(e){
			const [a,b] = e
			conditionData.value[item.start] = formatDate('yyyy-MM-dd hh:mm:ss',a)
			conditionData.value[item.end] = formatDate('yyyy-MM-dd hh:mm:ss',b)
		}else{
			reset()
		}
    }

    //重置
    const reset = ()=>{
        for (let key in conditionData.value){
            conditionData.value[key] = null
        }
        emits("reset")
    }
    //搜索
    const search = ()=>{
        if(Object.keys(conditionData.value).length<1) return showToast.warning("请配置查询参数")
        console.log(conditionData.value)
        emits("search",conditionData.value)
    }
    //自定义select获取值
    const getSelectVal = (sitem,item)=>{
        emits("select",[sitem,item])
    }
</script>

<style lang="scss" scoped>
    .search-box {
        border: 1px solid $borderColor;
        background: #fff;
        padding:10px;
        margin-top: -5px;
        margin-bottom: 8px;
        box-sizing: border-box;
        position: relative;
        &.active{
   //          position: absolute;
   //          left: v-bind(leftSpace);
   //          right: 16px;
   //          z-index: 99;
			// height: 200px;
   //          overflow: auto;
   //          top: 53px;
   //          border: 1px solid $borderColor;
   //          background: #fff;
            padding:0;
			// margin-bottom: 0;
        }
        // @include flex-style(row,nowrap,flex-start,center);
        .condition-list{
            height: 38px;
            overflow: hidden;
            box-sizing: border-box;
			transition: all .5s;
            &.active{
				position: absolute;
				background: #fff;
				z-index: 99;
				top: -62px;
				left: 0;
				right: 0;
                height: 124px;
                overflow: auto;
                padding:7px 6px 3px;
                border-bottom: 1px solid $borderColor;
				margin: auto !important;
                @include scroll-bar-style(4px, 4px, #efefef, #c0c4cc);
				.condition-item{
					height: auto;
					margin-bottom: 5px;
				}
            }
        }
        .condition-item{
            // border:1px solid $borderColor;
            height: 32px;
            margin-bottom: 14px;
            box-sizing: border-box;
            @include flex-style(row,nowrap,flex-start,center);
            .item-label{
                width:68px !important;
                text-align: right;
                @include single-text(68px);
                font-size: 14px;
                color: #666;
                box-sizing: border-box;
                padding-right: 8px;
                border-right: 2px solid $borderColor;
            }
            .item-val{
                flex: 1;
                margin-left: 8px;
            }
        }
        .search-handle{
            @include flex-style(row,nowrap,space-between,center);
            margin-top: 15px;
			&.active{
				margin-top: 54px;
				box-sizing: border-box;
				.right-handle{
					padding: 14px 20px 6px;
				}
			}
            .right-handle{
            }
        }
    }
</style>
