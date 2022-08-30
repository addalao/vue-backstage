<template>
    <div class="search-box">
        <el-input v-if="hasSearch" v-model="inputVal" :placeholder="'请输入'+searchOptions.placeholder+'查询'" class="single-search" clearable @keyup.enter="search" @clear="reset">
            <template #prepend>
                <span class="reset" @click="reset">重置</span>
            </template>
            <template #append>
                <el-button type="primary" :icon="Search" @click="search"></el-button>
            </template>
        </el-input>
        <slot></slot>
    </div>
</template>
<script>
    export default {
        name: "SearchBar"
    }
</script>
<script setup>
    import {Search} from '@element-plus/icons-vue'
    import { reactive, ref,watch } from "vue"
    // import { ElMessage } from 'element-plus'
    import showToast from '../../common/showToast';

    const props = defineProps({
        searchOptions: {
            type: Object,
            default: () => {
               return {
                  placeholder:'关键字',
                  keys:'' 
               }
            }
        },
        hasSearch:{
            type:Boolean,
            default:true
        }
    })
    const emits = defineEmits(['reset','search'])

    const inputVal = ref('')
   

    //重置
    const reset = ()=>{
        inputVal.value = ""
        emits("reset")
    }
    //搜索
    const search = ()=>{
		if(!inputVal.value){
			return emits("reset")
		}
        const object = new Object();
        if(!props.searchOptions.keys) return showToast.warning("请配置查询参数")
        object[(props.searchOptions.keys)] = inputVal.value.trim()
        emits("search",object)
    }
</script>

<style lang="scss" scoped>
    .search-box {
        border: 1px solid $borderColor;
        background: #fff;
        padding:6px;
        margin-top: -5px;
        margin-bottom: 8px;
        @include flex-style(row,nowrap,flex-start,center);
        .single-search{
            max-width: 380px;
            min-width: 200px;
            .reset{
                cursor: pointer;
                font-size: 12px;
            }
        }
    }
</style>
