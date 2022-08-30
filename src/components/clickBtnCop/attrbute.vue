<template>
    <div class="attrbute-box">
        <el-button type="primary" plain v-for="(item,index) in attrbuteList" :key="index">
            {{item.propValue}}
            <el-icon style="margin-left:10px" @click="del(item)"><delete /></el-icon>
        </el-button>
    </div>
    <el-input v-model="attrbute" placeholder="请输入属性" class="input-attrbute">
        <template #append>
            <el-button @click="saveAttr">添加</el-button>
        </template>
    </el-input>
    <bottom-handle @close="close" @confirm="confirm" position="left"></bottom-handle>
</template>
<script>
export default {
    name: 'attrbute'
}
</script>
<script setup>
import { ref, watch } from "vue"
import BottomHandle from '../bottomHandle.vue';
import SkuForm from "../businessCop/skuForm.vue";
import { ElMessage } from 'element-plus'
import _axios from '@/plugins/axios';
import {arrayDelItem} from '@/utils/tools.js'
import axios from 'axios';

const props = defineProps({
    currentItem: {//当前绑定的数据
        type: Object,
        default: () => { }
    },
    type:String//表单打开的类型 new edit custom view
})
const emits = defineEmits(['close', 'confirm'])

const attrbute = ref()
const attrbuteList = ref([])

if(props.type=='edit'){
    attrbuteList.value = props.currentItem.customData.prodPropValues
}

watch(()=>props.currentItem.customData,val=>{
    attrbuteList.value = val.prodPropValues || []
})

const saveAttr = ()=>{
	if(!attrbute.value) return ElMessage.warning('请输入属性名')
    attrbuteList.value.push({
        propValue:attrbute.value
    })
    attrbute.value = ''
}

const del = (item)=>{
    attrbuteList.value = arrayDelItem(item,attrbuteList.value)
}

const close = () => {
    emits('close')
}
const confirm = async () => {
    props.currentItem.customData['prodPropValues'] = attrbuteList.value
    let url = '/sys/prodProp/save'
    if(props.type=='edit'){
        url = `/sys/prodProp/update`
    }
    await _axios('post',url,props.currentItem.customData,true)
    emits('confirm')
}
</script>
<style lang="scss" scoped>  
    .attrbute-box{
        padding: 10px 0;
        margin: 10px 0;
        @include flex-style(row,wrap,flex-start,center);
        button{
            margin-left: 0;
            margin-right: 10px;
            margin-bottom: 10px;
            &:last-child{
                margin-right: 0;
            }
        }
    }
    .input-attrbute{
        width: 50%;
    }
</style>
