<template>
    <div class="btn-list" v-if="btnList.length>0">
        <el-button class="btn-item" v-for="(item,index) in btnList" :key="index" 
            :type="JSON.parse(item.icon).type" 
            :icon="JSON.parse(item.icon)['icon'] || ''" 
            :circle="JSON.parse(item.icon)['circle'] || false" 
            :round="JSON.parse(item.icon)['round'] || false" 
            :plain="JSON.parse(item.icon)['plain'] || false" 
            @click="handleEventObj(item.uri)">
            {{JSON.parse(item.icon)['circle'] ? '':item.name}}
        </el-button>
    </div>
</template>
<script>
    export default {
        name: "TopBtn"
    }
</script>
<script setup>
    import { ref } from "@vue/reactivity"
    // import { ElMessage } from 'element-plus'

    const props = defineProps({
        btnList:{
            type:Array,
            default:()=>{
                return []
            }
        }
    })
    const emits = defineEmits(['handle'])

    //顶部按钮操作事件对象
    const handleEventObj =(event)=> {
        emits('handle',event)
    }

   
</script>

<style lang="scss" scoped>
    .btn-list{
        @include flex-style(row,nowrap,flex-start,center);
        .btn-item{
            margin-left: 10px;
        }
    }
</style>
