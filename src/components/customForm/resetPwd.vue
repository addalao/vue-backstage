<template>
    <el-input v-model="password" type="password" style="margin-bottom:40px" placeholder="请输入密码" />
    <bottom-handle @close="close" @confirm="confirm"></bottom-handle>
</template>
<script setup>
    import { ref } from "vue"
    import BottomHandle from '../bottomHandle.vue';
    import {showToast} from 'element-plus'
    import _axios from '@/plugins/axios';
    
     const props = defineProps({
        show:Boolean,
        item:{
            type:Object,
            default:()=>{}
        },
        type:{
            type:String,
            default:'new' //new  edit  view  custom
        }
    })
    const emits = defineEmits(['close','confirm'])

    const password = ref('')
    
    const close = ()=>{
        emits('close')
    }
    const confirm = async ()=>{
        await _axios('post',`/sys/yunke/mgr/updatePassword`,{
            id:props.item.id,
            password:password.value
        },true)
        showToast.success("密码修改成功");
        emits('confirm')
    } 
</script>
<style lang="scss" scoped>

</style>
