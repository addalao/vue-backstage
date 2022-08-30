<template>
    <Right :row="item" style="margin-bottom:30px"></Right>
    <bottom-handle custom>
        <el-button type="primary" plain @click="close">关闭</el-button>
    </bottom-handle>
</template>
<script setup>
    import { ref } from "vue"
    import BottomHandle from '../bottomHandle.vue';
    import Right from "../right.vue";
    
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

    const close = ()=>{
        emits('close')
    }
    
</script>
<style lang="scss" scoped>

</style>
