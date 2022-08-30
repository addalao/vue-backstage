<template>
    撒娇发生大事
    <bottom-handle @close="close" @confirm="confirm" position="left"></bottom-handle>
</template>
<script setup>
    import { ref } from "vue"
    import BottomHandle from '../bottomHandle.vue';
    
    const props = defineProps({
        currentItem:{//当前绑定的数据
            type:Object,
            default:()=>{}
        }
    })
    const emits = defineEmits(['close','confirm'])
    const callBackObj = ref(props.currentItem)

    const close = ()=>{
        emits('close')
    }
    const confirm = ()=>{
        emits('confirm',callBackObj)
    }
    
</script>
<style lang="scss" scoped>

</style>
