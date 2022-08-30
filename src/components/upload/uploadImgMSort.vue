<template>
    <div class="drag-box">
        <draggable
            :list="imgUrlList"
            ghost-class="ghost"
            chosen-class="chosenClass"
            animation="300"
            item-key="id"
            @end="onEnd"
        >
            <template #item="{ element }">
                <div class="drag-box-item" :style="{background:`url(${element}) no-repeat center`,backgroundSize:'cover'}">
                    <div class="drag-handle-box">
                        <span @click.stop="handlePictureCardPreview(element)">
                            <el-icon>
                                <zoom-in />
                            </el-icon>
                        </span>
                        <span @click.stop="handleRemove(element,index)">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </span>
                    </div>
                </div>
            </template>
        </draggable>
        <el-upload :disabled="disabled" class="avatar-uploader" :action="uploadpath" :headers="headers"
            v-if="showUpload"
            :show-file-list="false" :multiple="multiple" :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <!-- <img v-if="currentImg" :src="currentImg" class="avatar" @mouseenter="showHandle('flex')"/> -->
            <div class="avatar-uploader-icon">
                <el-icon>
                    <plus />
                </el-icon>
            </div>
        </el-upload>
        <el-dialog v-model="dialogVisible">
            <img style="width: 100%;" :src="dialogImageUrl" alt="" />
        </el-dialog>
        <h5 v-if="tips" class="upload-tips">({{tips}})</h5>
    </div>
    
</template>
<script>
    export default {
        name:'single-upload-img'
    }
</script>
<script setup>
    import {uploadpath} from '@/main.js' 
    // import {ElMessage} from 'element-plus'
    import { ref, watch,nextTick } from 'vue'
	import {getStorage} from "../../utils/tools.js"
    import draggable from "vuedraggable";

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
    const showUpload = ref(true)
    // const currentImg = ref(props.imageUrl)
	const headers = ref({})
    const imgUrlList = ref([])
	
	let tokenValue='',tokenName = ''
	if(typeof getStorage('tokenObj') == 'string'){
	    const res = JSON.parse(getStorage('tokenObj'))
	    tokenValue = res.tokenValue
	    tokenName = res.tokenName
		headers.value[tokenName] = tokenValue
	}

    if(props.imageUrl && props.imageUrl.split(',').length >= props.limit){
        showUpload.value = false
    }else{
        showUpload.value = true
    }

    nextTick(()=>{
        if( props.imageUrl){
            props.imageUrl.split(',').map(v=>{
                imgUrlList.value.push(v)
            })
        }else{
            imgUrlList.value = []
        } 
    })

     watch(()=>props.imageUrl,val=>{
        if(val){
            if(val.split(',').length >= props.limit){
                showUpload.value = false
            }else{
                showUpload.value = true
            }
            let arr = []
            val.split(',').map(v=>{
                arr.push(v)
            })
            imgUrlList.value = arr
        }else{
            imgUrlList.value = []
            showUpload.value = true
        }
    },{deep:true})

    // watch(()=>props.imageUrl,val=>{
    //     currentImg.value = val
    // })

    //拖拽开始的事件
    // const onStart = () => {
    //     console.log("开始拖拽");
    // };

    //拖拽结束的事件
    const onEnd = (e) => {
        emits('result',imgUrlList.value.toString())
    };

    // const showHandle = (val)=>{
    //     showTips.value = val
    // }

    //上传成功
    const handleAvatarSuccess = (res,file,fileList)=>{
        // currentImg.value = res.data
        imgUrlList.value.push(res.data)
        emits('result',imgUrlList.value.toString())
        // 
    }
    // 删除
    const handleRemove = (item)=>{
        const arr = imgUrlList.value.filter(v=>{
            return v!=item
        })
        // currentImg.value = ''
        emits('result',arr.toString())
    }
    // 预览
    const handlePictureCardPreview = (file)=>{
        dialogImageUrl.value = file
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
    .drag-box{
        @include flex-style(row,nowrap,flex-start,center);
        position: relative;
        padding-bottom: 12px;
        line-height: 1;
        // border: 1px solid red;
        width: 100%;
        .drag-box-item{
            display: inline-block;
            border: 1px solid #C0CCDA;
            width: 148px;
            height: 148px;
            box-sizing: border-box;
            margin-right: 10px;
            border-radius: 6px;
            overflow: hidden;
            // background: url() no-repeat center;
            background-size: cover;
            position: relative;
            cursor: pointer;
            .drag-handle-box{
                display: none;
            }
            &:hover{
                .drag-handle-box{
                    display: block;
                    position: absolute;
                    z-index: 9;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    background: rgba(0,0,0,.5);
                    @include flex-style(row,nowrap,center,center);
                    span{
                        color: #fff;
                        font-size: 20px;
                        &:last-child{
                            margin-left: 24px;
                        }
                    }
                }
            }
           
       } 
    }
    .avatar-uploader{
        border: 1px dashed #C0CCDA;
        width: v-bind(size);
        height: v-bind(size);
        border-radius: 6px;
        @include flex-style(row,nowrap,center,center);
        overflow: hidden;
        background: #FBFDFF;
        // position: relative;
        // margin-bottom: 20px;
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
        // @include single-text(100%);
    }
</style>