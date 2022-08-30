export default function(
    store,route,router,
    formColumnConfig,//表单label相关配置
    formOption,//表单配置
    clickBtnSelectObj,//自定义点击类型按钮配置
    fromHndleEventObj,
	_axios
){
    
    formColumnConfig.map(async (v,index)=>{
        if(v.prop=='categoryId'){
            formColumnConfig[index].lkey='categoryName'
            formColumnConfig[index].vkey='categoryId'
            formColumnConfig[index].option =await getCategory(_axios)
        }
        if(v.prop=='labelId'){
            formColumnConfig[index].lkey='labelName'
            formColumnConfig[index].vkey='labelId'
            formColumnConfig[index].option =await getTags(_axios)
        }
    })

    formOption.labelWidth = 120
    formOption.nextStep = "new"
    formOption.newApiOption.api = `/sys/commodity/save`
    formOption.updateApiOption.api = `/sys/commodity/update`
    fromHndleEventObj.myCustomEvent = (formData)=>{
        clickBtnSelectObj.clickBtnShowCom = true
        clickBtnSelectObj.title = '集装箱--sku'
        clickBtnSelectObj.size = '40%'
        clickBtnSelectObj.cpname = 'createProduct'
    }
 
}

//获取商品分类
async function getCategory(_axios){
    const res = await _axios('get','/sys/category/listCategory',{},true)
    return res
}

//获取商品标签
async function getTags(_axios){
    const res = await _axios('post','/sys/label/list',{},true)
    return res
}