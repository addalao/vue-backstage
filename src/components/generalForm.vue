<template>
    <el-form
        :label-width="formOption.labelWidth"
        ref="formref"
        :model="formOption.formProp"
        style="margin-bottom:80px"
    >
        <template v-for="(item,index) in formColumnConfig" :key="index">
            <el-form-item v-if="item.type=='number'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    validator:numberCheck,
                    exp:item.exp,
                    label:item.label,
                    prop:item.prop,
                    tips:item.tips || '输入不合规范',
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-input-number
                    v-model="formOption.formProp[item.prop]" :placeholder="'请输入'+item.label"
                    :disabled="type=='edit' && item.disabled"   
                    style="min-width:200px;width:50%" 
                >
                </el-input-number>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='pwd'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请输入'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-input
                    type="password"
                    v-model="formOption.formProp[item.prop]" :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                >
                </el-input>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='phone'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    validator:phoneCheck,
                    prop:item.prop,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-input
                    v-model="formOption.formProp[item.prop]" :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                >
                </el-input>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='switch'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请选择'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-switch
                    v-model="formOption.formProp[item.prop]"
                    :active-color="item.acolor"
                    :inactive-color="item.icolor"
                    :active-value="item.aval || true"
                    :inactive-value="item.ival || false"
                    :active-text ="item.atext"
                    :inactive-text="item.itext"
                    :disabled="type=='edit' && item.disabled"
                />
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='textarea'" :label="item.label" :prop="item.prop" style="max-width: 60%;min-width: 330px;"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请输入'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-input
                    v-model="formOption.formProp[item.prop]"
                    :autosize="{ minRows: 2, maxRows: 4 }"
                    :maxlength="item.max || 10000000"
                    :show-word-limit="item.limit"
                    :disabled="type=='edit' && item.disabled"
                    type="textarea"
                    :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                />
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='radio'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请选择'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-radio-group
                    v-model="formOption.formProp[item.prop]"
                    :disabled="item.disabled"
                >
                    <el-radio v-for="(ritem,rindex) in item.option" :label="item.vkey?ritem[item.vkey]:ritem.value" :key="rindex">{{item.lkey?ritem[item.lkey]:ritem.label}}</el-radio>
                </el-radio-group>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='datetime'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请选择'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-date-picker
                    v-model="formOption.formProp[item.prop]"
                    type="datetime"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    :placeholder="'请选择'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                    @change="dateTimeChange($event,item.prop)"
                >
                </el-date-picker>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='select'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请选择'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-select
                    v-model="formOption.formProp[item.prop]" :placeholder="'请选择'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :multiple="item.multiple"
                    :disabled="type=='edit' && item.disabled"
                    @change="fromHndleEventObj['selectChangeItem']($event,item.prop,item.vkey?opitem[item.vkey]:opitem.value)"
                >
                    <el-option
                        v-for="(opitem,opindex) in item.option"
                        :key="opindex"
                        :label="item.lkey?opitem[item.lkey]:opitem.label"
                        :value="item.vkey?opitem[item.vkey]:opitem.value"
                    >
                    </el-option>
                </el-select>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='selecttree'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请选择'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-select
                    v-model="formOption.formProp[item.prop]" :placeholder="'请选择'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :multiple="item.multiple"
                    :disabled="type=='edit' && item.disabled"
                >
                    <el-option
                        v-for="(opitem,opindex) in item.option"
                        :key="opindex"
                        :label="item.lkey?opitem[item.lkey]:opitem.label"
                        :value="item.vkey?opitem[item.vkey]:opitem.value"
                    >
                    </el-option>
                </el-select>
                <el-tree-select
                    v-model="formOption.formProp[item.prop]" :placeholder="'请选择'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                    :data="item.option"
                    check-strictly
                    :value-key="item.vkey?item.vkey:'value'"
                    :render-after-expand="false"
                    show-checkbox
                >
                    <!-- <template #default="{ data: { item.lkey?item.lkey:value } }">
                        {{ categoryName }}
                    </template> -->
                </el-tree-select>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='cascader'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请选择'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-cascader
                    v-model="formOption.formProp[item.prop]"
                    :options="item.option"
                    :placeholder="'请选择'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                >
                </el-cascader>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
			<el-form-item v-else-if="item.type=='file'" :label="item.label" :prop="item.prop"
			    :rules="{
			        required: item.required===false?false:true,
			        message: '请上传'+item.label,
			        trigger: item.trigger || 'blur',
			    }"
			>
			    <upload-file
			        :files="formOption.formProp[item.prop]"
                    :limit="item.limit || 3"
                    :tips="item.tips || ''"
                    :disabled="item.disabled"
                    :multiple="item.multiple?item.multiple:false"
			        @result="(e)=>{formOption.formProp[item.prop]=e}"
			    >
			    </upload-file>
			</el-form-item>
            <el-form-item v-else-if="item.type=='img'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请上传'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <single-upload-img
                    :tips="item.tips || ''"
                    :disabled="item.disabled"
                    :imageUrl="formOption.formProp[item.prop]"
                    @result="(e)=>{formOption.formProp[item.prop]=e}"
                >
                </single-upload-img>
            </el-form-item>
            <el-form-item v-else-if="item.type=='mimg'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请上传'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <muitiple-upload-img
                    :imageUrl="formOption.formProp[item.prop]"
                    :limit="item.limit || 3"
                    :tips="item.tips || ''"
                    :disabled="item.disabled"
                    :multiple="item.multiple===false?false:true"
                    @result="(e)=>{formOption.formProp[item.prop]=e}"
                >
                </muitiple-upload-img>
            </el-form-item>
            <el-form-item v-else-if="item.type=='imgSort'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请上传'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <muitiple-upload-img-sort
                    :imageUrl="formOption.formProp[item.prop]"
                    :limit="item.limit || 3"
                    :tips="item.tips || ''"
                    :disabled="item.disabled"
                    :multiple="item.multiple===false?false:true"
                    @result="(e)=>{formOption.formProp[item.prop]=e}"
                >
                </muitiple-upload-img-sort>
            </el-form-item>
            <el-form-item v-else-if="item.type=='editor'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请输入'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <!-- <wang-editor :placeholder="'请输入'+item.label" :editorId="item.prop+type+'Editor'"
                    :defaultHtml="formOption.formProp[item.prop]"
                    :remove = "wangEditRemove"
                    @getHtml="(e)=>{formOption.formProp[item.prop]=e}"
                >
                </wang-editor> -->
                <!-- scriptSrc="https://cdn.tiny.cloud/1/no-api-key/tinymce/5/tinymce.min.js"  -->
                <vue3-tinymce v-model="formOption.formProp[item.prop]" :setting="tinymceSeting" />
            </el-form-item>
            <el-form-item v-else-if="item.type=='clickBtn'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请设置'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-input
                    v-model="formOption.formProp[item.prop]" :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    readonly
                >
                    <template #append>
                        <el-button @click="showDrawerEnent(item)">操作</el-button>
                    </template>
                </el-input>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
            <el-form-item v-else-if="item.type=='colorPicker'" :label="item.label" :prop="item.prop"  style="max-width: 60%;min-width: 330px;"        
                :rules="{
                    required: item.required===false?false:true,
                    message: '请设置'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-color-picker v-model="formOption.formProp[item.prop]" :show-alpha="item.alpha"/>
            </el-form-item>
			<el-form-item v-else :label="item.label" :prop="item.prop"  style="max-width: 60%;min-width: 330px;"        
                :rules="{
                    required: item.required===false?false:true,
                    message: '请输入'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <el-input 
                    v-model="formOption.formProp[item.prop]" :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                >
                </el-input>
                <el-tooltip v-if="item.explain" :content="item.explain" placement="top">
                    <el-icon class="explain-style"><QuestionFilled /></el-icon>
                </el-tooltip>
            </el-form-item>
        </template>
    </el-form>
    <bottom-handle v-if="formOption.nextStep == type || formOption.nextStep=='all'" custom>
        <el-button type="primary" @click="fromHndleEventObj['nextStep'](formOption.formProp)">下一步</el-button>
    </bottom-handle>
    <bottom-handle :hasConfirm="type!='view'" v-else @close="fromHndleEventObj['closeForm']" @confirm="fromHndleEventObj['confirmForm']($event,formref)"></bottom-handle>
    <!-- 点击再操作类型表单自定义组件抽屉 -->
    <el-drawer
        v-model="clickBtnSelectObj.clickBtnShowCom"
        :title="clickBtnSelectObj.title"
        :size="clickBtnSelectObj.size"
        direction="rtl"
    >
        <component v-bind:is="clickBtnCopName" :current-item="clickBtnSelectObj.selectObj" :type="type" @close="close" @confirm="confirm"></component>
    </el-drawer>
</template>
<script>
    export default {
        name:"GeneralForm"
    }
</script>
<script setup>
    import { ref, watch,reactive,watchEffect,computed,defineAsyncComponent   } from "vue";
    import SingleUploadImg from "./upload/uploadImg.vue";
    import MuitipleUploadImg from './upload/uploadImgM.vue'
    import MuitipleUploadImgSort from './upload/uploadImgMSort.vue'
	import UploadFile from "./upload/uploadFile.vue"
    // import WangEditor from '../components/editor/wangEditor.vue';
    import Vue3Tinymce from '@jsdawn/vue3-tinymce';
    import BottomHandle from '../components/bottomHandle.vue';
    // import {ElMessage} from 'element-plus'
	import {showConfirm} from '../common/showConfirm.js'
    import _axios from "../plugins/axios"
    import {checkMobile,checkPhone,getStorage} from "@/utils/tools.js"
    import { formatDate } from "../plugins/formatdate";
    import { useStore } from "vuex";
    import { useRoute,useRouter } from 'vue-router';
    import {uploadpath} from '@/main.js'
    import {modulesConfig,modulesForm} from "@/main.js"
    import showToast from "../common/showToast.js"
    import {tinymceSeting} from "@/common/tinymceEditor.js"
	

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const props = defineProps({
        show:Boolean,
        item:{
            type:Object,
            default:()=>{}
        },
        type:{
            type:String,
            default:'new' //new  edit  view  custom
        }
    })
    const emits = defineEmits(['confirm','close'])

    const formColumnConfig = ref([])
    const formref = ref(null)
	const templateType=ref('custom')
    const formOption = reactive({//表单配置
        labelWidth:'80px',
        formProp:props.item,
        newApiOption:{//新建api配置
            api:'',
            methods:''
        },
        updateApiOption:{//更新api配置
            api:'',
            methods:''
        },
        nextStep:false,//定义表单是否做下一步操作按钮的类型 ，new 新建的时候用  edit编辑的时候用   all新建编辑全用
        beforUpdate(){}//提交前事件
    })
    const clickBtnSelectObj = reactive({
        title:"",//抽屉标题
        cpname:'',//自定义组件名称
        selectObj:{//当前选中的表单数据
            prop:'',
            val:'',
            customData:{}
        },
        size:'40%',//抽屉的宽度
        clickBtnShowCom:false//控制抽屉显隐
    })
	
    watch(()=>props.item,val=>{
        formOption.formProp = val
    })
    
    watch(()=>props.type,async val=>{
		if(modulesConfig[`./config${route.path}.js`]){
			const formConfig = modulesConfig[`./config${route.path}.js`]
			if(val=='new'){
			    formColumnConfig.value = formConfig.formConfig
			}
			if(val=='edit' && formConfig.editFormConfig){
			    formColumnConfig.value = formConfig.editFormConfig
			}
		}
    })

    //clickBtn类型的表单点击事件获取相关配置
    const showDrawerEnent = (item)=>{
        clickBtnSelectObj.size = item.size || '40%'
        clickBtnSelectObj.title = item.label
        clickBtnSelectObj.cpname = item.cpname
        clickBtnSelectObj.selectObj.prop = item.prop
        clickBtnSelectObj.selectObj.val = formOption.formProp[item.prop]
        clickBtnSelectObj.clickBtnShowCom = true
    }
    //clickBtn类型自定义组件引入 表单中的点击类型按钮组件引入
    const clickBtnCopName = computed(()=>{
        if(!clickBtnSelectObj.cpname) return showToast.warning("未配置当前类型所需的自定义组件");
        return defineAsyncComponent(()=>import(`../components/clickBtnCop/${clickBtnSelectObj.cpname}.vue`))
    })
    //clickBtn类型自定义组件回调事件
    const close = ()=>{//关闭
        clickBtnSelectObj.clickBtnShowCom = false
        if(formOption.nextStep){
            emits('close')
        }
    }
    const confirm = (e)=>{//确定
        if(formOption.nextStep){
            emits('confirm')
        }else{
            const {prop,val} = e
            formOption.formProp[prop] = val
        }
        clickBtnSelectObj.clickBtnShowCom = false
    }

    // 表单关闭确认事件
    const fromHndleEventObj = {
        // select类型的选择事件
        selectChangeItem(e,props){
            // console.log(e,props)
        },
        // 表单带下一步按钮操作事件
        nextStep:(form)=>{
            formref.value.validate(async (valid) => {
                //测试
                // fromHndleEventObj['myCustomEvent'](form)
                // return
                if (valid){
                    clickBtnSelectObj.selectObj.customData = form
                    // 处理下一步按钮自定义操作事件
                    fromHndleEventObj['myCustomEvent'](form)
                } else {
                    showToast.warning("请检查并完善表单再提交！");
                    return false
                }
            })
        },
        closeForm:()=>{ //关闭事件
            emits('close')
        },
        confirmForm:()=>{//提交事件
            formref.value.validate((valid) => {
                if (valid) {
                    if(fromHndleEventObj.beforeConfirm){
                        fromHndleEventObj.beforeConfirm(formOption.formProp,()=>{
                            fromHndleEventObj.confirmFunc()
                        })
                    }else{
                        fromHndleEventObj.confirmFunc()
                    }
                } else {
                    showToast.warning("请检查并完善表单再提交！");
                    return false
                }
            })
        },
        confirmFunc:async ()=>{
            let url = formOption.newApiOption.api,methods = formOption.newApiOption.methods
            if(props.type=='edit' && formOption.updateApiOption.api){
                methods = formOption.updateApiOption.methods
                url = formOption.updateApiOption.api
            }
            try {
                await _axios(methods || 'post',url,formOption.formProp,true)
                showToast.success("保存成功");
                emits('confirm')
            } catch (error) {
                showToast.error("保存出错");
            }
        }
    }

    
    //外部自定义js逻辑处理引入
    // watchEffect(async () => {
       
    // })
    initFormConfig()
    function initFormConfig(){
        templateType.value = route.meta.formType
		// console.log(templateType.value)
		if(templateType.value=='custom') return
		
		if(modulesConfig[`./config${route.path}.js`]){
			const formConfig = modulesConfig[`./config${route.path}.js`]
			
			formColumnConfig.value = formConfig.formConfig
			if(props.type=='edit' && formConfig.editFormConfig){
			    formColumnConfig.value = formConfig.editFormConfig
			}
		}
		
		if(modulesForm[`./customForm${route.path}.js`]){
			const customLogic = modulesForm[`./customForm${route.path}.js`]
			if(customLogic.default===undefined){
			    return showToast.error("请配置表单自定义js文件");
			}
			customLogic.default(
			    store,route,router,
			    formColumnConfig.value,//表单label相关配置
			    formOption,//表单配置
			    clickBtnSelectObj,//自定义点击类型按钮配置
			    fromHndleEventObj,
				_axios,
				showToast,
				showConfirm
			)
		}
    }
	
	//数字类型表单验证
	const numberCheck = (rule,value,callback)=>{
	    if(!rule.required){
	        if (value === '' || value === undefined) {
	            callback()
	        }else{
	            if(rule.exp && !(rule.exp).test(value)){
	                formOption.formProp[rule.prop] = ''
	                callback(new Error(rule.tips))
	            }else{
	                callback()
	            }
	        }
	        return 
	    }
	    if (value === '' || value === undefined) {
	        callback(new Error('请输入'+rule.label))
	    } else if(rule.exp && !(rule.exp).test(value)){
	        formOption.formProp[rule.prop] = ''
	        callback(new Error(rule.tips))
	    }else{
	        callback()
	    }
	}
	//电话座机验证
	const phoneCheck = (rule,value,callback)=>{
	    if(!rule.required){
	        if (value === '' || value === undefined) {
	            callback()
	        }else{
	            if(!checkMobile(value)){
	                if(!checkPhone(value)){
	                    formOption.formProp[rule.prop] = ''
	                    callback(new Error('电话号码格式不正确(座机:区号-电话)'))
	                }else{
	                    formOption.formProp[rule.prop] = ''
	                    callback(new Error('电话号码不正确'))
	                }
	            }else{
	                callback()
	            }
	        }
	        return 
	    }
	    if (value === '') {
	        callback(new Error('请输入电话号码'))
	    } else {
	        if(!checkMobile(value)){
	            if(!checkPhone(value)){
	                formOption.formProp[rule.prop] = ''
	                callback(new Error('电话号码格式不正确(座机:区号-电话)'))
	            }else{
	                formOption.formProp[rule.prop] = ''
	                callback(new Error('电话号码不正确'))
	            }
	        }else{
	            callback()
	        }
	    }
	}
	
	//datetime结果格式化
	const dateTimeChange = (e,props) =>{
	    formOption.formProp[props] = formatDate('yyyy-MM-dd hh:mm:ss',e)
	}
</script>
<style lang="scss" scoped>
    .tox-tinymce-aux{z-index: 99999999999999999 !important;}
    .explain-style{
        margin-left: 10px;
        cursor: pointer;
        font-size: 22px;
    }
    :deep(.el-form-item__content){
        flex-wrap: nowrap;
    }
</style>
