<template>
    <div class="btn-box">
        <div class="btn-line" v-for="(item,index) in btnStyleListArr" :key="index">
            <!-- <h4>{{item.type}}</h4> -->
            <el-button 
                v-for="(bitem,bindex) in item.list" :key="bindex"
                size="small"
                :type="bitem.type"
                :plain="bitem.plain"
                :round="bitem.round"
                :circle="bitem.circle"
                :icon="bitem.icon"
                @click="selectBtnStyle(bitem)"
            >
                {{bitem.name}}
            </el-button>
        </div>
       
    </div>
</template>
<script>
    export default{
        name: "Btns"
    }
</script>

<script setup>
    import {
        Search,
        Edit,
        Check,
        Message,
        Star,
        Delete,
    } from '@element-plus/icons-vue'
    import {btnStyleListArr} from '@/common/menu.js'

    const emits = defineEmits(['select'])

    const selectBtnStyle = (item)=>{
        emits('select',item)
    }
</script>
<style lang="scss" scoped>
    .btn-box{
        background: #fff;
        padding: 10px;
        border-radius: 10px;
        margin-top: 10px;
        .btn-line{
            margin-bottom: 10px;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .top-space{
            margin-top: 10px;
        }
        :deep(.el-button){
            justify-content: flex-start;
            font-size: 10px;
        }
    }
</style>