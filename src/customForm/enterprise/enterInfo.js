import _axios from "@/plugins/axios"
export default function(
    store,route,router,
    formColumnConfig,//表单label相关配置
    formOption,//表单配置
    clickBtnSelectObj,//自定义点击类型按钮配置
    fromHndleEventObj
){
    fromHndleEventObj.selectChangeItem = (event,type)=>{
        getProvince(event, type)
    }
    getProvince()
    // 获取省份
    async function getProvince(id = 1, type = '') {
        
        const res = await _axios('get', `/sys/area/listByPid?pid=${id}`, {}, true)
        console.log(res)
        // let tage = ''
        // if(type == 'province') {//选择了省
        //     tage = 'city'
        // }else if (type == 'city'){//市
        //     tage = 'county'
        // }else if(type == 'county'){//区
        //     tage = "street"//找 街道办
        // }
        // else{//啥也没选择
        //     tage = 'province' //找 省
        // }
        if(type !== '') return
        formColumnConfig.forEach((item)=>{
            if(item.prop == "province"){
                console.log(item)
                item.lkey = 'areaName';
                item.vkey = 'areaId';
                item.option = res
            }else {

            }
        }) 
        // if (type == 'province') {
        //     searchOptionsConditionQuery.options[2].options = res
        // } else if (type == 'city') {
        //     searchOptionsConditionQuery.options[3].options = res
        // } else if (type == 'county') {
        //     searchOptionsConditionQuery.options[4].options = res
        // } else {
            
        // }
    
    }
    
}

