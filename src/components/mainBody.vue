<template>
    <div class="main-body">
        <slot></slot>
    </div>
</template>
<script>
    export default{
        name:"HeaderTitle"
    }
</script>
<script setup>
    import { computed, ref,watch } from 'vue'
    import emitter from "@/plugins/mitt";
    import { useStore } from 'vuex';
	import { getStorage, setStorage } from "@/utils/tools"

    const store = useStore()

    const props = defineProps({
        type:{
            type:String,
            default:'normal' //normal 不带搜索头 / single模糊搜索头 /msearch 多条件搜索
        }
    })

    const collspace = computed(()=>{
		if(store.state.page.isCollapsed===true || store.state.page.isCollapsed==='true'){
			return true
		}
		return false
	})
	
	// const bodyHeight = ref('calc(100vh - 271px)')
	const bodyHeight = ref('calc(100vh - 222px)')
	const bodyWidth = ref('calc(100vw - 104px)')
    
    //监听菜单变化
    emitter.on("menuClose",(e)=>{
        if(e){
            bodyWidth.value = 'calc(100vw - 224px)'
        }else{
            bodyWidth.value = 'calc(100vw - 104px)'
        }
    })
	
	watch(()=>props.type,val=>{
		if(val=='single'){
		    bodyHeight.value = 'calc(100vh - 271px)'
		}else if(val=='msearch'){
		    bodyHeight.value = 'calc(100vh - 333px)'
		}else{
			bodyHeight.value = 'calc(100vh - 222px)'
		}
	})
    if(props.type=='single'){
        bodyHeight.value = 'calc(100vh - 271px)'
    }
    if(props.type=='msearch'){
        bodyHeight.value = 'calc(100vh - 333px)'
    }

    if(collspace.value){
        bodyWidth.value = 'calc(100vw - 224px)'
    }else{
        bodyWidth.value = 'calc(100vw - 104px)'
    }

</script>
<style lang="scss" scoped>
    .main-body{
        max-height: v-bind(bodyHeight);
		// height:calc(100vh - 271px); //214 271 57
        @include scroll-bar-style(4px, 4px, #efefef, #c0c4cc);
        border:1px solid $borderColor;
        background: #FFF;
        padding:8px 10px;
        overflow: auto;
        width:v-bind(bodyWidth);
        box-sizing: border-box;
    }
</style>
