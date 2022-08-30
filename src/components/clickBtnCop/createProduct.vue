<template>
    <SkuForm :item="{}" :upterItem="currentItem.customData" @close="close" @confirm="confirm"></SkuForm>
    <!-- <bottom-handle @close="close" @confirm="confirm" position="left"></bottom-handle> -->
</template>
<script setup>
    import { ref, watch, watchEffect } from "vue"
    import BottomHandle from '../bottomHandle.vue';
    import SkuForm from "../businessCop/skuForm.vue";
    import {ElMessage} from 'element-plus'
    import _axios from '@/plugins/axios';
    
    const props = defineProps({
        currentItem:{//当前绑定的数据
            type:Object,
            default:()=>{}
        },
        type:String
    })
    const emits = defineEmits(['close','confirm'])
    const upterItem = ref(props.currentItem.customData)
   
    watch(()=>props.currentItem,val=>{
        console.log(val)
        upterItem.value = val.customData
    },{deep:true})

    watch(()=>props.type,val=>{
        console.log(val)
    },{deep:true})
    

    const close = ()=>{
        emits('close')
    }
    const confirm = ()=>{
        emits('confirm')
    }
</script>
<style lang="scss" scoped>

</style>
