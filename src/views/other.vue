<template>
    <div class="box-warap">
        <h4>积分说明</h4>
        <div class="box">
            <textarea v-model="formOption.text"></textarea>
        </div>
        <h4>代扣协议</h4>
        <div class="box">
            <vue3-tinymce v-model="formOption.note" :setting="tinymceSeting" />
        </div>
        <div style="padding-left:40px">
            <el-button type="primary" style="width:120px;height:40px" @click="saveForm">保存</el-button>
        </div>
    </div>
</template>
<script setup>
    import { reactive, ref} from "vue-demi";
    import Vue3Tinymce from '@jsdawn/vue3-tinymce';
    import _axios from "../plugins/axios"
    import {uploadpath} from '@/main.js'
    import { ElMessage } from 'element-plus'

    const tinymceSeting = ref({
        height:'calc(100vh - 540px)',
		width:'100%',
        menubar: false,
        language: 'zh_CN',
        language_url:
            'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js',
        toolbar:
            'bold italic underline h1 h2 image | removeformat fullscreen',
        plugins: 'image fullscreen',
        toolbar_mode: 'sliding',
        nonbreaking_force_tab: true,
        link_title: false,
        default_link_target: '_blank',
        content_style: 'body{font-size: 16px}img{width:100%;height:auto}',
        // 自定义 图片上传模式
        custom_images_upload: true,
        images_upload_url: uploadpath,
        custom_images_upload_callback: res =>res.data,
        custom_images_upload_param: { id: 'xxxx01', age: 18 }
    })

    const formOption = ref({
       note:'',
       text:''
    })

    //保存内容

    const saveForm  = async (type)=>{
        if(!formOption.value.note || !formOption.value.text) return ElMessage.warning("请输入相应内容")
        await _axios('post','/sys/agreement/saveOrUpdata',formOption.value,true)
        ElMessage.success("保存成功！")
        getDetail()
    }
    // 获取内容详情
    getDetail()
    async function getDetail(){
        const res = await _axios('post','/sys/agreement/details',{},true)
        if(res){
            formOption.value = res
        }
    }
</script>
<style lang="scss" scoped>
    .box-warap{
       height: calc(100vh - 110px);
       overflow: auto; 
       box-sizing: border-box;
       @include scroll-bar-style(2px, 2px, #F2F2F2, #2DCCCE);
    }
    h4{
        font-size: 22px;
        color: #666;
        padding-left: 40px;
        margin-bottom: 20px;
    }
    .box{
        padding-left: 40px;
        margin-bottom: 40px;
        textarea{
            box-sizing: border-box;
            width: 100%;
            height: 200px;
            padding: 40px;
            font-size: 16px;
        }
    }
</style>