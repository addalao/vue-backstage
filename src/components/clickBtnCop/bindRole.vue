<template>
    <el-select v-model="formProp.roleId" placeholder="请选择角色">
        <el-option
            v-for="item in roleOption"
            :key="item.id"
            :label="item.name"
            :value="item.id"
        >
        </el-option>
    </el-select>
    <bottom-handle @close="close" @confirm="confirm" position="left"></bottom-handle>
</template>
<script setup>
    import { ref } from "vue"
    import BottomHandle from '../bottomHandle.vue';
    import {showToast} from 'element-plus'
    import _axios from '@/plugins/axios';
    
    const props = defineProps({
        currentItem:{//当前绑定的数据
            type:Object,
            default:()=>{}
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
        createUser()
    }

    async function createUser(){
        const res = await _axios('post',`/sys/yunke/mgr/insertAdmin`,props.currentItem.customData,true)
        bindRole(res)
    }

    async function  bindRole(id){
        await _axios('get',`/sys/sysRole/roleBingUser?roleId=${formProp.value.roleId}&userId=${id}`,{},true)
        showToast.success("账号创建成功");
        emits('confirm',callBackObj)
    }

    async function getRoleList(){
        const res = await _axios('get',`/sys/sysRole/listAll`,{},true)
        roleOption.value = res
    }
    
</script>
<style lang="scss" scoped>

</style>
