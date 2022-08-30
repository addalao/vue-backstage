import {getStorage} from "@/utils/tools.js"
import {uploadpath} from '@/main.js'

export const tinymceSeting = {
    height: 650, //编辑器高度
	min_height: 500,
    // width:600,
    menubar: false,
    language: 'zh_CN',
    language_url:
        'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js',
    // toolbar:
    //     'code bold italic underline h1 h2 image | removeformat fullscreen',
    // plugins: 'code image fullscreen',
    plugins: 'code print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount imagetools textpattern help emoticons autosave autoresize',
    toolbar: 'code undo redo restoredraft image | cut copy paste pastetext fullscreen preview | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
    styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat | \
    table media charmap emoticons hr pagebreak insertdatetime print | lineheight',
    toolbar_mode: 'sliding',
    nonbreaking_force_tab: true,
    link_title: false,
    default_link_target: '_blank',
    content_style: 'img{width:100%;height:auto}',
    // 自定义 图片上传模式
    custom_images_upload: true,
    images_upload_url: uploadpath,
    custom_images_upload_header: {},
    custom_images_upload_callback: res =>res.data,
    custom_images_upload_param: {  }
}

if(typeof getStorage('tokenObj') == 'string'){
    const res = JSON.parse(getStorage('tokenObj'))
    const {tokenValue,tokenName} = res
    tinymceSeting['custom_images_upload_header'][tokenName] = tokenValue
}
