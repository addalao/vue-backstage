<template>
    <div class="header-title">
        <el-page-header :title="title" :content="content" :icon='icon' @back="backEvet"/>
    </div>
</template>
<script>
    export default {
        name:"HeaderTitle"
    }
</script>
<script setup>
    import { useRouter } from "vue-router";

    const router = useRouter()

    const props = defineProps({
        title:String,
        content:String,
        icon:{
            type:String,
            default:''
        },
        customBack:Boolean
    })
    const emits = defineEmits(['back'])

    const backEvet = ()=>{
        if(!props.icon) return
        if(props.customBack){
            emits('back')
        }else{
            router.back()
        }
    }
</script>
<style lang="scss" scoped>
    .header-title{
        border: 1px solid $borderColor;
        padding:8px 6px;
        background: #fff;
        margin-bottom: 12px;
        :deep(.el-page-header__title){
            font-size: 16px;
            color:#666;
            font-weight: bold;
            cursor: auto;
        }
        :deep(.el-page-header__content){
            font-size: 14px;
            font-weight: normal;
            color:#999;
        }
    }
</style>
