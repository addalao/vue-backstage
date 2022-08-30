<template>
    <el-form
        :label-width="formOption.labelWidth"
        ref="formref"
        :model="formOption.formProp"
    >
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
            <el-form-item v-else :label="item.label" :prop="item.prop"   style="max-width: 60%;min-width: 330px;"      
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
    <!-- 点击再操作类型表单自定义组件抽屉 -->
    <el-drawer
        v-model="showGe"
        title="选择规格"
        direction="btt"
    >
        112312
    </el-drawer>
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
        upterItem:{
            type:Object,
            default:()=>{}
        },
        type:String
    })
    const emits = defineEmits(['confirm','close'])
    const formref = ref(null)
    const formConfigOption = ref(formConfig)
    const showGe = ref(false)
    const formOption = reactive({//表单配置
        labelWidth:'100px',
        formProp:{
            skuOriPrice:props.upterItem.commodityOriginalPrice,
            skuActualStocks:props.upterItem.commodityStock,
            status:props.upterItem.commodityStatus,
            skuType:props.upterItem.type,
            skuPic:props.upterItem.commodityPic,
        },
    })
    if(props.upterItem.commodityId){
        formOption.formProp = props.upterItem.skuList
    }else{
        formOption.formProp.skuOriPrice = props.upterItem.commodityOriginalPrice
        formOption.formProp.skuActualStocks = props.upterItem.commodityStock
        formOption.formProp.status = props.upterItem.commodityStatus
        formOption.formProp.skuType = props.upterItem.type
        formOption.formProp.skuPic = props.upterItem.commodityPic
    }
    
    if(props.upterItem.type==1){//1只租  2只卖  3又租又卖
        formConfigOption.value = formConfigZu
		formOption.formProp.skuCompany = '间/天'
        formOption.formProp.skuLeasePrice = props.upterItem.commodityActualPirce
    }else if(props.upterItem.type==2){
        formConfigOption.value = formConfigSel
        formOption.formProp.skuPrice = props.upterItem.commodityActualPirce
    }else{
        formConfigOption.value = formConfig
        formOption.formProp.skuLeasePrice = 0
        formOption.formProp.skuPrice = 0
    }
   
    // console.log(props.upterItem)
    // watch(()=>props.upterItem.type,val=>{
    //     formOption.formProp.skuType=props.upterItem.type
    //     if(val==1){//1只租  2只卖  3又租又卖
    //         formConfigOption.value = formConfigZu    
    //         formOption.formProp.skuLeasePrice = props.upterItem.commodityActualPirce
    //     }else if(val==2){
    //         formConfigOption.value = formConfigSel
    //         formOption.formProp.skuPrice = props.upterItem.commodityActualPirce
    //     }else{
    //         formConfigOption.value = formConfig
    //         formOption.formProp.skuLeasePrice = 0
    //         formOption.formProp.skuPrice = 0
    //     }
    // })
     watch(()=>props.upterItem,val=>{
        formOption.formProp.skuType=val.type
        formOption.formProp.skuOriPrice=val.commodityOriginalPrice
        formOption.formProp.skuActualStocks=val.commodityStock
        formOption.formProp.skuPic=val.commodityPic
        if(val.type==1){//1只租  2只卖  3又租又卖
            formConfigOption.value = formConfigZu    
			formOption.formProp.skuCompany = '间/天'
            formOption.formProp.skuLeasePrice = val.commodityActualPirce
        }else if(val.type==2){
            formConfigOption.value = formConfigSel
            formOption.formProp.skuPrice = val.commodityActualPirce
        }else{
            formConfigOption.value = formConfig
			formOption.formProp.skuCompany = '间/天'
            formOption.formProp.skuLeasePrice = val.commodityActualPirce
            formOption.formProp.skuPrice = val.commodityActualPirce
        }
    },{deep:true})
    
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

    //选择规格回调事件
    // const close = ()=>{//关闭
        
    // }
    // const confirm = (e)=>{//确定
        
    // }

    // 表单关闭确认事件
    const confirmForm=(formref)=>{//提交事件
        formref.validate(async (valid) => {
            if (valid) {
                try {
                    let url = '/sys/commodity/save'
                    if(props.upterItem.commodityId){
                        url = '/sys/commodity/update'
                    }
                    await _axios('post',url,{
                        ...props.upterItem,
                        skuList:[{...formOption.formProp}]
                    },true)
                    ElMessage.success("保存成功");
                    emits('confirm')
                } catch (error) {
                    ElMessage.error("保存出错");
                }
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
</script>
<style lang="scss" scoped>
    .select-ge{
        border: 1px solid #ededed;
        min-height: 40px;
        width: 100%;
    }
</style>
