 <template>
    <div class="page-box">
        <el-pagination
            v-model:currentPage="params.currentPage"
            v-model:page-size="pageSize"
            :page-sizes="params.pageSizes"
            :small="params.small"
            :background="params.background"
            layout="total, sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
    </div>
</template>
<script>
    export default {
        name:"Pagination"
    }
</script>
<script setup>
    import { ref,watch } from "vue"

    const props = defineProps({
        total:{
            type:Number,
            default:0
        },
        pageSize:{
            type:Number,
            default:10
        },
        currentPage:{
            type:Number,
            default:1
        }
    })
    const emits = defineEmits(['sizeChange','currentChange'])

    const params = ref({
        currentPage:props.currentPage,
        pageSize:10,
        pageSizes:[5,10,12,16,20,30,40,50],
        small:false,
        background:false,
        total:props.total,
    })

    watch(()=>props.currentPage,val=>{
        params.value.currentPage = val
    })

    //每页条数改变的事件
    const handleSizeChange = (e)=>{ 
        emits('sizeChange',e)
    }
    //当前页数改变的事件
    const handleCurrentChange = (e)=>{
        emits('currentChange',e)
    }

</script>

<style lang="scss" scoped>
    .page-box{
        border: 1px solid $borderColor;
        background:#fff;
        padding: 4px 0;
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
</style>
