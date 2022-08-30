<template>
    <el-form
        :label-width="formOption.labelWidth"
        ref="formref"
        :model="formOption.formProp"
    >
		<el-form-item label="sku名称" prop="skuName" v-if="type=='new'"
		    :rules="{
		        required: true,
		        message: '请选择规格',
		        trigger: 'blur',
		    }"
		>
			<el-cascader
			    v-model="formOption.formProp['skuName']"
				ref="skuname"
				placeholder="请选择规格属性"
			    :options="skuOption"
			    :props="{
					label:'propValue',
					value:'valueId'
				}"
			    @change="handleChange"
			/>
		</el-form-item>
        <template v-for="(item,index) in formConfigOption" :key="index">
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
                    :disabled="false"
                >
                    <el-option
                        v-for="(opitem,opindex) in item.option"
                        :key="opindex"
                        :label="item.lkey?opitem[item.lkey]:opitem.label"
                        :value="item.vkey?opitem[item.vkey]:opitem.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-else-if="item.type=='img'" :label="item.label" :prop="item.prop"         
                :rules="{
                    required: item.required===false?false:true,
                    message: '请上传'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <single-upload-img
                    :imageUrl="formOption.formProp[item.prop]"
                    @result="(e)=>{formOption.formProp[item.prop]=e}"
                >
                </single-upload-img>
            </el-form-item>
            <el-form-item v-else :label="item.label" :prop="item.prop"  style="max-width: 60%;min-width: 330px;"        
                :rules="{
                    required: item.required===false?false:true,
                    message: '请输入'+item.label,
                    trigger: item.trigger || 'blur',
                }"
            >
                <div v-if="item.prop=='properties'" class="select-ge" @click="showGe=true">

                </div>
                <el-input v-else
                    v-model="formOption.formProp[item.prop]" :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                    :disabled="type=='edit' && item.disabled"
                >
                </el-input>
            </el-form-item>
        </template>
    </el-form>
    <bottom-handle @close="fromHndleEventObj['closeForm']" @confirm="confirmForm(formref)" position="left"></bottom-handle>
</template>
<script>
    export default{
        name:"sku-form"
    }
</script>
<script setup>
    import { ref, watch,reactive,watchEffect,computed,defineAsyncComponent   } from "vue-demi";
    import SingleUploadImg from "../upload/uploadImg.vue";
    import BottomHandle from '../bottomHandle.vue';
    import {formConfig,formConfigZu,formConfigSel} from '@/config/goods/containerSku.js'
    import {ElMessage} from 'element-plus'
    import _axios from "@/plugins/axios"
    import {checkMobile,checkPhone} from "@/utils/tools.js"
    import { formatDate } from "@/plugins/formatdate";
    import { useStore } from "vuex";
    import { useRoute,useRouter } from 'vue-router';

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const props = defineProps({
        item:{
            type:Object,
            default:()=>{}
        },
        type:String
    })
    const emits = defineEmits(['confirm','close'])
    const formref = ref(null)
	const skuname = ref(null)
    const formConfigOption = ref(formConfig)
    const showGe = ref(false)
	const skuOption = ref([])
	const currentSkuName = ref('')
    const formOption = reactive({//表单配置
        labelWidth:'100px',
        formProp:props.item,
    })
	
	if(props.item.skuType==1){
		formConfigOption.value = formConfigZu
	}
	if(props.item.skuType==2){
		formConfigOption.value = formConfigSel
	}
	if(props.item.skuType==3){
		formConfigOption.value = formConfig
	}
    
    watch(()=>props.item,val=>{
        formOption.formProp = val
		if(val.skuType==1){
			formConfigOption.value = formConfigZu
		}
		if(val.skuType==2){
			formConfigOption.value = formConfigSel
		}
		if(val.skuType==3){
			formConfigOption.value = formConfig
		}
    },{deep:true})
	
	//规格选择
	const handleChange = (e)=>{
		currentSkuName.value = skuname.value.inputValue
		console.log(currentSkuName.value)
	}
    
    // 表单关闭确认事件
    const confirmForm=(formref)=>{//提交事件
        formref.validate(async (valid) => {
            if (valid) {
				if(currentSkuName.value){
                    formOption.formProp['skuName'] = currentSkuName.value
                }
                ElMessage.success("sku内容更改，请注意保存！");
                emits('confirm',formOption.formProp)
            } else {
                ElMessage.warning("请检查并完善表单再提交！");
                return false
            }
        })
    }
    const fromHndleEventObj = {
        closeForm:()=>{ //关闭事件
            emits('close')
        }
    }
	
	getSkuOptionList()
	async function getSkuOptionList(){
		const res =await _axios('post',`/sys/prodProp/list`,{},true)
		let arr = []
		if(res.length>0){
			res.map(v=>{
				arr.push({
					propValue:v.propName,
					valueId:v.propId,
					children:v.prodPropValues
				})
			})
			skuOption.value = arr
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
</script>
<style lang="scss" scoped>
    .select-ge{
        border: 1px solid #ededed;
        min-height: 40px;
        width: 100%;
    }
</style>
