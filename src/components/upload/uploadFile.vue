<template>
  <el-upload
    class="upload-demo"
    :disabled="disabled"
    drag
    :action="uploadpath"
    :headers="headers"
	v-model:file-list="fileList"
	:limit="limit"
    :multiple="multiple"
    :on-remove="handleRemove"
	:on-success="handleAvatarSuccess"
	:before-upload="beforeAvatarUpload"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      拖拽或 <em>点击上传</em>
    </div>
  </el-upload>
  <h5 v-if="tips" style="color:#999">({{tips}})</h5>
</template>
<script>
	export default {
		name:'upload-file'
	}
</script>
<script setup>
	import {ref,watch,nextTick} from "vue"
	import {uploadpath} from '@/main.js'
	// import {showToast} from 'element-plus'
	import {getStorage} from "../../utils/tools.js"
	
	const emits = defineEmits(['result'])
	const props = defineProps({
	    files:String,
         disabled:{
            type:Boolean,
            default:false
        },
        tips:{
             type:String,
            default:''
        },
	    multiple: {
	        type: Boolean,
	        default: false
	    },
	    limit: {
	        type: Number,
	        default: 3
	    }
	})
	
	const headers = ref({})
	const fileList = ref([])
	const showUpload = ref('block')
	
	let tokenValue='',tokenName = ''
	if(typeof getStorage('tokenObj') == 'string'){
	    const res = JSON.parse(getStorage('tokenObj'))
	    tokenValue = res.tokenValue
	    tokenName = res.tokenName
		headers.value[tokenName] = tokenValue
	}
	
	if(props.files && props.files.split(',').length >= props.limit){
	    showUpload.value = 'none'
	}else{
	    showUpload.value = 'block'
	}
	
	nextTick(()=>{
	    if( props.files){
	        props.files.split(',').map(v=>{
	            fileList.value.push({
	                name:'文件',url:v
	            })
	        })
	    }else{
	        fileList.value = []
	    } 
	})
	
	watch(()=>props.files,val=>{
	    if(val){
	        if(val.split(',').length >= props.limit){
	            showUpload.value = 'none'
	        }else{
	            showUpload.value = 'block'
	        }
	        let arr = []
	        val.split(',').map(v=>{
	            arr.push({
	                name:'文件',url:v
	            })
	        })
	        fileList.value = arr
	    }else{
	        fileList.value = []
	        showUpload.value = 'block'
	    }
	},{deep:true})
	
	//上传成功
	const handleAvatarSuccess = (res,file,fileList)=>{
        if(fileList.length >= props.limit){
            showUpload.value = 'none'
        }
        let result = [],oldResult=[],number=0,oldNumber = 0
        fileList.map(v=>{
            if(v['response'] && v['response']['data']){
                number++
                result.push({
                    name:v.name,
                    url:v['response'].data
                })
            }else{
                oldNumber++
                oldResult.push(v.url)
            }
        })
        if(!props.files){
            if(number==fileList.length){
                console.log(23)
                let arr = []
                result.map(v=>{
                    arr.push(v.url)
                })
                emits('result',arr.toString())
            }
        }else if(number==(fileList.length-oldNumber)){
            let arr = []
            result.map(v=>{
                arr.push(v.url)
            })
            emits('result',oldResult.toString()+","+arr.toString())
        }
	}
	// 删除
	const handleRemove = (file,fileList)=>{
        if(fileList.length >= props.limit){
            showUpload.value = 'none'
        }else{
            showUpload.value = 'block'
        }
        let arr = []
        fileList.map(v=>{
            arr.push(v.url)
        })
        emits('result',arr.toString())
	}
	const beforeAvatarUpload = (file) => {
	    // const isJPG = file.type === 'image/jpeg'
	    // const isLt2M = file.size / 1024 / 1024 < 2
	
	    // if (!isJPG) {
	    //     showToast.error('Avatar picture must be JPG format!')
	    // }
	    // if (!isLt2M) {
	    //     showToast.error('上传图片大小不能超过2M!')
	    // }
	    // return isLt2M
	    // return isJPG && isLt2M
	}
</script>
<style lang="scss" scoped>
	.upload-demo{
		:deep(.el-upload-dragger){
			width: 148px;
			height: 74px;
		}
		:deep(.el-icon.el-icon--upload){
			height: 40px;
			margin: 2px auto;
		}
		.el-upload__text{
			margin-top: -20px;
		}
        :deep(.el-upload.el-upload--text.is-drag){
            display: v-bind(showUpload);
        }

        :deep(.el-upload-list.el-upload-list--text){
            min-width: 120px;
        }
	}

    
</style>