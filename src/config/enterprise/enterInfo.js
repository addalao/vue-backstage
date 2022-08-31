export const tableConfig=[
    {
        prop:'enterpriseName',
        label:'企业名称'
    },
    {
        prop: "industry",
        label: "行业",
    },
    {
        prop: "unifiedCreditCode",
        label: "统一社会信用代码",
    },
    {
        prop: "contacts",
        label: "联系人", 
    },
    {
        prop: "phone",
        label: "联系电话", 
    },
    {
        prop: "status",
        label: "处理状态",
        type:"state",
        option:[
            {label:"待办",value:0},
            {label:"已核验",value:1}
        ]
    },
    {
        prop: "enterpriseAdress",
        label: "企业地址", 
    },
    {
        prop: "street",
        label: "街道办事处", 
    },
    {
        prop: "building",
        label: "大楼名称", 
    },
    {
        prop: "buildingNumber",
        label: "楼号", 
    },
    {
        prop: "floor",
        label: "楼层", 
    },
    {
        prop: "room",
        label: "房号", 
    },
    {
        prop: "registerType",
        label: "是否在地在册", 
        type:"state",
        option:[{label:"在地不在册",value:1},{label:"在册不在地",value:2},{label:"在地在册",value:3}]
    },
    {
        prop: "staff",
        label: "员工人数", 
    },
    {
        prop: "scaleArea",
        label: "租用面积", 
    },
    {
        prop: "taxPaymentPlace",
        label: "纳税地", 
    },
    {
        prop: "outputValue",
        label: "产值", 
    },
    // {
    //     prop: "province",
    //     label: "省份", 
    // },
    // {
    //     prop: "base",
    //     label: "省份缩写", 
    // },
    // {
    //     prop: "city",
    //     label: "城市", 
    // },
    // {
    //     prop: "county",
    //     label: "区/县", 
    // },
    {
        prop: "createTime",
        label: "创建时间"
    },
	{
	    prop: "updateTime",
	    label: "更新时间"
	}
]


export const formConfig= [
    {
        prop: "name",
        label: "角色名"
    },
    {
        prop: "code",
        label: "角色代码",
        // readOnly:true
    },
    {
        prop: "status",
        label: "状态",
        showType:"select",
        option:[{label:"禁用",value:0},{label:"启用",value:1}]
    }
]
