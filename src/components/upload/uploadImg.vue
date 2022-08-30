<template>
    <el-upload
        :disabled="disabled"
        class="avatar-uploader"
        :action="uploadpath"
		:headers="headers"
        :show-file-list="false"
        :multiple="multiple"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
    >
        <img v-if="currentImg" :src="currentImg" class="avatar" @mouseenter="showHandle('flex')"/>
        <div v-else class="avatar-uploader-icon">
            <el-icon><plus /></el-icon>
        </div>
        <div class="handle-box" @mouseleave="showHandle('none')">
            <span @click.stop="handlePictureCardPreview" :style="{'margin-left':disabled?'0':''}">
                <el-icon><zoom-in /></el-icon>
            </span>
            <span @click.stop="handleRemove" v-if="!disabled">
                <el-icon><Delete /></el-icon>
            </span>
        </div>
    </el-upload>
    <el-dialog v-model="dialogVisible">
        <img style="width: 100%;" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <h5 v-if="tips" class="upload-tips">({{tips}})</h5>
</template>
<script>
    export default {
        name:'single-upload-img'
    }
</script>
<script setup>
    import {uploadpath} from '@/main.js' 
    // import {ElMessage} from 'element-plus'
    import { ref, watch } from 'vue'
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
        multiple:{
            type:Boolean,
            default:false
        },
        size:{
            type:String,
            default:'148px'
        }
    })
    const emits = defineEmits(['result'])

    const dialogVisible = ref(false)
    const dialogImageUrl = ref('')
    const showTips = ref('none')
    const currentImg = ref(props.imageUrl)
	const headers = ref({})
	
	let tokenValue='',tokenName = ''
	if(typeof getStorage('tokenObj') == 'string'){
	    const res = JSON.parse(getStorage('tokenObj'))
	    tokenValue = res.tokenValue
	    tokenName = res.tokenName
		headers.value[tokenName] = tokenValue
	}

    watch(()=>props.imageUrl,val=>{
        currentImg.value = val
    })

    const showHandle = (val)=>{
        showTips.value = val
    }

    //上传成功
    const handleAvatarSuccess = (res,file,fileList)=>{
        currentImg.value = res.data
        emits('result',currentImg.value)
    }
    // 删除
    const handleRemove = (file,fileList)=>{
        currentImg.value = ''
        emits('result',currentImg.value)
    }
    // 预览
    const handlePictureCardPreview = (file)=>{
        dialogImageUrl.value = currentImg.value
        dialogVisible.value = true
    }
    const beforeAvatarUpload = (file) => {
        // const isJPG = file.type === 'image/jpeg'
        // const isLt2M = file.size / 1024 / 1024 < 2

        // if (!isJPG) {
        //     ElMessage.error('Avatar picture must be JPG format!')
        // }
        // if (!isLt2M) {
        //     ElMessage.error('上传图片大小不能超过2M!')
        // }
        // return isLt2M
        // return isJPG && isLt2M
    }
</script>
<style lang="scss" scoped>
    .avatar-uploader{
        border: 1px dashed #C0CCDA;
        width: v-bind(size);
        height: v-bind(size);
        border-radius: 6px;
        @include flex-style(row,nowrap,center,center);
        overflow: hidden;
        background: #FBFDFF;
        position: relative;
        margin-bottom: 20px;
        &:hover{
            border-color: #409EFF;
        }
        .avatar-uploader-icon{
            margin-top: 10px;
            font-size: 28px;
            width: v-bind(size);
            height: v-bind(size);
            line-height: v-bind(size);
            text-align: center;
            color: #8c939d;
        }
        .avatar{
            max-width: 100%;
        }
        .handle-box{
            position: absolute;
            display: v-bind(showTips);
            z-index: 999;
            top: 0;
            left: 0;
            width: v-bind(size);
            height: v-bind(size);
            border-radius: 6px;
            // opacity:.2;
            background: rgba(0,0,0,.5);
            bottom: 0;
            justify-content: center;
            align-items: center;
            span{
                font-size: 20px;
                color: #fff;
                &:last-child{
                    margin-left: calc(v-bind(size) / 5);
                }
            }
        }
    }

    .upload-tips{
        color:#999;
        position: absolute;bottom: -10px;
        @include single-text(100%);
    }
</style>