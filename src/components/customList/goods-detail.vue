<template>
    <HeaderTitle title="集装箱管理" content="商品详情" icon="back"></HeaderTitle>
    <div class="detail-body">
        <div class="sub-container">
            <h5 class="title">详情</h5>
            <el-form
                class="form-box"
                label-width="120"
                label-position="top"
                ref="formref"
                :model="productDetail"
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
                            v-model="productDetail[item.prop]" :placeholder="'请输入'+item.label"
                            :disabled="item.disabled"   
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
                            v-model="productDetail[item.prop]" :placeholder="'请选择'+item.label" :clearable="!!item.clearable?item.clearable:true"
                            :multiple="item.multiple"
                            :disabled="item.disabled"
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
                            :imageUrl="productDetail[item.prop]"
                            @result="(e)=>{productDetail[item.prop]=e}"
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
                            :imageUrl="productDetail[item.prop]"
                            :limit="item.limit || 3"
                            :multiple="item.multiple===false?false:true"
                            @result="(e)=>{productDetail[item.prop]=e}"
                        >
                        </muitiple-upload-img>
                    </el-form-item>
                    <el-form-item v-else-if="item.type=='editor'" :label="item.label" :prop="item.prop"         
                        :rules="{
                            required: item.required===false?false:true,
                            message: '请输入'+item.label,
                            trigger: item.trigger || 'blur',
                        }"
                    >
                        <vue3-tinymce v-model="productDetail[item.prop]" :setting="tinymceSeting" />
                    </el-form-item>
                    <el-form-item v-else :label="item.label" :prop="item.prop" style="width:50%"        
                        :rules="{
                            required: item.required===false?false:true,
                            message: '请输入'+item.label,
                            trigger: item.trigger || 'blur',
                        }"
                    >
                        <el-input 
                            v-model="productDetail[item.prop]" :placeholder="'请输入'+item.label" :clearable="!!item.clearable?item.clearable:true"
                            :disabled="item.disabled"
                        >
                        </el-input>
                    </el-form-item>
                </template>
            </el-form>
        </div>
        <div class="sub-container">
            <h5 class="title">
                <span>商品sku</span>
                <el-button type="primary" plain size="small" @click="editSku(null,'new')">新增sku</el-button>
            </h5>
            <div class="form-box">
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item :name="skuindex" v-for="(skuitem,skuindex) in productDetail.skuList" :key="skuindex">
                        <template #title>
							<el-icon @click.stop="editSku(skuitem,'edit',skuindex)" style="color: #75B9FF;margin-right: 20px;font-size: 16px;"><edit /></el-icon>
							
							<el-popconfirm @click.stop='' v-if="productDetail.skuList.length>1 && skuitem.skuName" title="确定删除该sku?"
							@confirm.stop="delSku(skuitem)">
							    <template #reference>
									<el-icon @click.stop='' style="color: #F58181;margin-right: 20px;font-size: 16px;"><delete-filled /></el-icon>
							    </template>
						    </el-popconfirm>
							<span>{{skuitem.skuName || '默认'}}</span>
						</template>
						<ul class="sku-list">
							<li v-if="skuitem.skuName">
								<span class="label">sku名称：</span>
								<span class="val">{{skuitem.skuName}}</span>
							</li>
                        	<li>
								<span class="label">租卖类型：</span>
								<span class="val">
									{{skuitem.skuType==1?'只租':skuitem.skuType==2?'只卖':'可租可卖'}}
								</span>
							</li>
                        	<li>
								<span class="label">原价：</span>
								<span class="val">￥{{skuitem.skuOriPrice || '-'}}</span>
							</li>
                        	<li v-if="skuitem.skuType!=2">
								<span class="label">出租价：</span>
								<span class="val">￥{{skuitem.skuLeasePrice || '-'}}</span>
							</li>
							<li v-if="skuitem.skuType!=1">
								<span class="label">当前零售价：</span>
								<span class="val">￥{{skuitem.skuPrice || '-'}}</span>
							</li>
							<li>
								<span class="label">库存：</span>
								<span class="val">{{skuitem.skuActualStocks || '-'}}</span>
							</li>
							<li>
								<span class="label">体积：</span>
								<span class="val">{{skuitem.skuVolume || '-'}}m*m</span>
							</li>
							<li>
								<span class="label">重量：</span>
								<span class="val">{{skuitem.skuWeight || '-'}}/kg</span>
							</li>
							<li>
								<span class="label">库存：</span>
								<span class="val">{{skuitem.skuActualStocks==-1?'无限':(skuitem.skuActualStocks || '-')}}</span>
							</li>
							<li>
								<span class="label">上架状态：</span>
								<span class="val">{{skuitem.status==1?'上架':'下架'}}</span>
							</li>
							<li>
								<span class="label">sku图片：</span>
								<el-image
								  style="width: 40px; height: 40px"
								  :src="skuitem.skuPic"
								  :preview-src-list="[skuitem.skuPic]"
								  :initial-index="0"
								  fit="cover"
								/>
							</li>
                        </ul>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <!--  -->
    </div>
    <div class="handle-area">
        <bottom-handle @close="close" @confirm="confirm" position="right" :border="false" rtitle="更新"></bottom-handle>
    </div>
    <el-drawer
        v-model="editSkuObj.showNewSku"
        :title="editSkuObj.type=='new'?'sku--新建':'sku编辑--'+(editSkuObj.item.skuName || '默认')"
        size="40%"
        direction="rtl"
        @close="closedrawer"
    >
        <NewSku @close="closedrawer" @confirm="confirmdrawer" :type="editSkuObj.type" :item="editSkuObj.item"></NewSku>
    </el-drawer>
</template>
<script setup>
    import {ref,reactive} from "vue"
    import {useRoute,useRouter} from "vue-router"
    import {formConfig} from "@/config/goods/container"
    import {formConfig as skuFormCinfig} from "@/config/goods/containerSku"
    import SingleUploadImg from "@/components/upload/uploadImg.vue";
    import MuitipleUploadImg from '@/components/upload/uploadImgM.vue'
    import WangEditor from '@/components/editor/wangEditor.vue';
    import Vue3Tinymce from '@jsdawn/vue3-tinymce';
    import BottomHandle from '@/components/bottomHandle.vue';
    import NewSku from '@/components/businessCop/newSku.vue'
    import {ElMessage} from 'element-plus'
    import _axios from "@/plugins/axios"
    import {checkMobile,checkPhone,getStorage} from "@/utils/tools.js"
    import { formatDate } from "@/plugins/formatdate";
    import {uploadpath} from '@/main.js'

    const router = useRouter()
    const route = useRoute()

    const productDetail =  ref({})
    const formref = ref(null)
    const formColumnConfig  = ref(formConfig)
    const activeName = ref(0)
	const newSkuList = ref([])
	const editSkuObj = reactive({
		showNewSku:false,
		type:'new',
		item:{},
		skuindex:0
	})

    formColumnConfig.value.map(async (v,index)=>{
        if(v.prop=='categoryId'){
            formColumnConfig.value[index].lkey='categoryName'
            formColumnConfig.value[index].vkey='categoryId'
            formColumnConfig.value[index].option =await getCategory()
        }
        if(v.prop=='labelId'){
            formColumnConfig.value[index].lkey='labelName'
            formColumnConfig.value[index].vkey='labelId'
            formColumnConfig.value[index].option =await getTags()
        }
    })
    const tinymceSeting = ref({
        height:400,
        menubar: false,
        language: 'zh_CN',
        language_url:
            'https://unpkg.com/@jsdawn/vue3-tinymce@1.1.6/dist/tinymce/langs/zh_CN.js',
        toolbar:
            'bold italic underline h1 h2 blockquote codesample numlist bullist link image | removeformat fullscreen',
        plugins: 'codesample link image table lists fullscreen',
        toolbar_mode: 'sliding',
        nonbreaking_force_tab: true,
        link_title: false,
        default_link_target: '_blank',
        content_style: 'body{font-size: 16px}img{width:100%;height:auto}',
        // 自定义 图片上传模式
        custom_images_upload: true,
        images_upload_url: uploadpath,
        custom_images_upload_header: { 'X-Token': 'xxxx' },
        custom_images_upload_callback: res =>res.data,
        custom_images_upload_param: { id: 'xxxx01', age: 18 }
    })

    if(typeof getStorage('tokenObj') == 'string'){
	    const res = JSON.parse(getStorage('tokenObj'))
		const {tokenValue,tokenName} = res
		tinymceSeting.value['custom_images_upload_header'][tokenName] = tokenValue
	}

	//sku新建编辑
	const editSku=(item,type,index)=>{
		editSkuObj.type = type
		editSkuObj.skuindex = index
		if(!item){
			editSkuObj.item = {
				skuCompany:'间/天',
				commodityId: productDetail.value.commodityId,
				commodityName:productDetail.value.commodityName,
				skuType:productDetail.value.type,
				status:1,
			}
		}else{
			editSkuObj.item = item
		}
		editSkuObj.showNewSku = true
	}
	//删除sku 
	const delSku = async (item)=>{
		await _axios('post',`/sys/commodity/deleteSku?prodId=${item.commodityId}&skuId=${item.skuId}`,{},true)
		ElMessage.success("sku已删除");
		getProductDetail()
	}
   
   //sku编辑关闭
    const closedrawer = ()=>{
        editSkuObj.showNewSku = false
    }
	//sku编辑确认
    const confirmdrawer = (e)=>{
		if(editSkuObj.type=='new'){
			productDetail.value.skuList.push(e)
			// newSkuList.value.push(e)
			// if(productDetail.value.skuList.length>1){
			// 	productDetail.value.skuList.push(e)
			// }else if(productDetail.value.skuList.length==1){
			// 	if(productDetail.value.skuList[0].skuName){
			// 		productDetail.value.skuList.push(e)
			// 	}else{
			// 		productDetail.value.skuList = [e]
			// 	}
			// }else{
			// 	productDetail.value.skuList = newSkuList.value
			// }
		}else{
			productDetail.value.skuList[editSkuObj.skuindex] = Object.assign({},e)
		}
		editSkuObj.showNewSku = false
    }
	
	//详情更新相关操作
	const close = ()=>{
	    router.back()
	}
	const confirm = ()=>{
	    // emits('confirm')
		console.log(productDetail.value)
		formref.value.validate(async (valid) => {
		    if (valid) {
		        try {
		            await _axios('post','/sys/commodity/update',productDetail.value,true)
		            ElMessage.success("商品更新成功");
					router.back()
		        } catch (error) {
		            ElMessage.error("保存出错");
		        }
		    } else {
		        ElMessage.warning("请检查并完善表单再提交！");
		        return false
		    }
		})
	}

    getProductDetail()
    getCategory()
    getTags()
    //获取商品详情
    async function getProductDetail(){
        const res = await _axios('post','/sys/commodity/detail',{commodityId:route.query.productId},true)
        productDetail.value = res
    }
    //获取商品分类
    async function getCategory(){
        const res = await _axios('get','/sys/category/listCategory',{},true)
        return res     
   }

    //获取商品标签
    async function getTags(){
        const res = await _axios('post','/sys/label/list',{},true)
        return res
   }
   
   //数字类型表单验证
   const numberCheck = (rule,value,callback)=>{
       if(!rule.required){
           if (value === '' || value === undefined) {
               callback()
           }else{
               if(rule.exp && !(rule.exp).test(value)){
                   productDetail.value[rule.prop] = ''
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
           productDetail.value[rule.prop] = ''
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
                       productDetail.value[rule.prop] = ''
                       callback(new Error('电话号码格式不正确(座机:区号-电话)'))
                   }else{
                       productDetail.value[rule.prop] = ''
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
                   productDetail.value[rule.prop] = ''
                   callback(new Error('电话号码格式不正确(座机:区号-电话)'))
               }else{
                   productDetail.value[rule.prop] = ''
                   callback(new Error('电话号码不正确'))
               }
           }else{
               callback()
           }
       }
   }
</script>
<style lang="scss">
    .detail-body{
        height: calc(100vh - 204px);
        @include scroll-bar-style(4px, 4px, #efefef, #c0c4cc);
        border:1px solid $borderColor;
        background: #FFF;
        // padding:20px;
        overflow: auto;
        box-sizing: border-box;
        @include flex-style(row,nowrap,space-between,center);
        position: relative;
        .sub-container{
            border-right: 1px solid $borderColor;
            width: 50%;
            height: 100%;
            padding:0;
            box-sizing: border-box;
            .title{
                border-bottom: 1px solid $borderColor;
                padding-right:20px;
                height: 38px;
                line-height: 38px;
                margin: 0;
                color: #666;
                font-size: 16px;
                font-weight: bold;
                padding-left: 20px;
                @include flex-style(row,nowrap,space-between,center);
            }
            .form-box{
                height: calc(100% - 38px);
                overflow: auto;
                padding: 20px;
                box-sizing: border-box;
                @include scroll-bar-style(4px, 4px, #efefef, #c0c4cc);
            }
        }
    }
    .handle-area{
        position: relative;
        // border: 1px solid red;
        box-sizing: border-box;
		height: 56px;
    }
	.sku-list{
		margin:0;
		padding: 10px;
		border: 1px solid #EBEEF5;
		li{
			@include flex-style(row,nowrap,flex-start,center);
			padding: 4px;
			.label{
				font-size: 14px;
				color: #666;
				font-weight: bold;
				min-width: 100px;
			}
			.val{
				font-size: 14px;
				color: #999;
				font-weight: bold;
			}
		}
	}
</style>