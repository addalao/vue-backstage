<template>
    <el-select style="margin-bottom:40px" v-model="formProp.roleId" placeholder="请选择角色">
        <el-option
            v-for="item in roleOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        >
        </el-option>
    </el-select>
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
    const callBackObj = ref(props.currentItem)
    const roleOption = ref([])
    const formProp = ref({
        roleId:''
    })
    
    //获取角色列表
    getRoleList()

    const close = ()=>{
        emits('close')
    }
    const confirm = ()=>{
        bindRole()
    }

    async function  bindRole(){
        await _axios('get',`/sys/sysRole/roleBingUser?roleId=${formProp.value.roleId}&userId=${props.item.id}`,{},true)
        showToast.success("角色绑定成功");
        emits('confirm')
    }

    async function getRoleList(){
        const res = await _axios('get',`/sys/sysRole/listAll`,{},true)
        roleOption.value = res
    }
    
</script>
<style lang="scss" scoped>

</style>
