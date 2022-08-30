<template>
    <div class="drawer-bottom-handle">
        <slot v-if="custom"></slot>
        <template v-else>
            <el-button @click="close">{{ltitle}}</el-button>
			<el-button type="primary" v-if="hasConfirm" @click="confirm">{{rtitle}}</el-button>
        </template>
    </div>
</template>
<script>
    export default {
        name:'bottom-handle'
    }
</script>

<script setup>
    import { ref } from "vue"


    const props = defineProps({
        custom:[Boolean,String],
        position:{
            type:String,
            default:'right'
        },
        border:{
            type:[Boolean,String],
            default:true
        },
        ltitle:{
            type:String,
            default:'关闭'
        },
        rtitle:{
            type:String,
            default:'确定'
        },
        hasConfirm:{
            type:[String,Boolean],
            default:true
        }
    })
    const emits = defineEmits(['close','confirm'])

    const btnPosition = ref(props.position)
    const isTab = ref(false)
    const borders = ref('1px solid #f4f4f4')
    if(!props.border){
        borders.value = 0
    }

    const close = ()=>{
        if(isTab.value) return 
        isTab.value = true
        setTimeout(()=>{
            isTab.value = false
        },3000)
        emits('close')
    }
    const confirm = ()=>{
        if(isTab.value) return 
        isTab.value = true
        setTimeout(()=>{
            isTab.value = false
        },3000)
        emits('confirm')
    }
</script>
<style lang="scss" scoped>
    .drawer-bottom-handle{
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        box-sizing: border-box;
        text-align: v-bind(btnPosition);
        border-top: v-bind(borders);
        padding: 15px 20px;
        button{
            &:last-child{
                margin-left: 30px;
            }
        }
    }
</style>
