<template>
    <el-upload
        :disabled="disabled"
        :action="uploadpath"
        :headers="headers"
        list-type="picture-card"
        :file-list="imgUrlList"
        :multiple="multiple"
        :limit="limit"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
        <el-icon>
            <Plus />
        </el-icon>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img style="width: 100%" :src="dialogImageUrl" />
    </el-dialog>
    <h5 v-if="tips" class="upload-tips">({{tips}})</h5>
</template>
<script>
    export default {
        name:'muitiple-upload-img'
    }
</script>
<script setup>
    import { nextTick, ref,watch } from 'vue'
    import { uploadpath } from '@/main.js'
    // import { showToast } from 'element-plus'
    import {getStorage} from "../../utils/tools.js"

    const props = defineProps({
        imageUrl:String,
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
            default: true
        },
        limit: {
            type: Number,
            default: 3
        }
    })
    const emits = defineEmits(['result'])

    const imgUrlList = ref([])
    const showUpload = ref('block')
	const headers = ref({})
	
	let tokenValue='',tokenName = ''
	if(typeof getStorage('tokenObj') == 'string'){
	    const res = JSON.parse(getStorage('tokenObj'))
	    tokenValue = res.tokenValue
	    tokenName = res.tokenName
		headers.value[tokenName] = tokenValue
	}

    if(props.imageUrl && props.imageUrl.split(',').length >= props.limit){
        showUpload.value = 'none'
    }else{
        showUpload.value = 'block'
    }

    nextTick(()=>{
        if( props.imageUrl){
            props.imageUrl.split(',').map(v=>{
                imgUrlList.value.push({
                    name:'图片',url:v
                })
            })
        }else{
            imgUrlList.value = []
        } 
    })

    watch(()=>props.imageUrl,val=>{
        if(val){
            if(val.split(',').length >= props.limit){
                showUpload.value = 'none'
            }else{
                showUpload.value = 'block'
            }
            let arr = []
            val.split(',').map(v=>{
                arr.push({
                    name:'图片',url:v
                })
            })
            imgUrlList.value = arr
        }else{
            imgUrlList.value = []
            showUpload.value = 'block'
        }
    },{deep:true})

    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const callBackNum = ref(0)

    const handleRemove = (file, fileList) => {
        callBackNum.value = 0
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
    const handlePictureCardPreview = (file) => {
        dialogImageUrl.value = file.url
        dialogVisible.value = true
    }

    //上传成功
    const handleAvatarSuccess = (res,file,fileList)=>{
        callBackNum.value++
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
        if(!props.imageUrl){
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
     //上传限制处理
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
    :deep(.el-upload.el-upload--picture-card){
        line-height: 148px;
        text-align: center;
        display: v-bind(showUpload);
        margin-bottom: 20px;
    }

    .upload-tips{
        color:#999;
        position: absolute;bottom: -10px;
        @include single-text(100%);
    }
</style>