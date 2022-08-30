<template>
	<iframe :src="linkUrl" frameborder="0"></iframe>
</template>

<script setup>
	import { ref,reactive } from 'vue';
	import _axios from '@/plugins/axios';
	
	
	const linkUrl = ref('')
	
	getUrl()
	async function getUrl(){
		const res = await _axios('get','/sys/yunke/mgr/getJob',{},true)
		linkUrl.value = res
	} 
</script>

<style scoped>
	iframe{
		width: 100%;
		height: calc(100vh - 114px);
		border: 1px solid #ebeef5;
		background: #fff;
	}
</style>