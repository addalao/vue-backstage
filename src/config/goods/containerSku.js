export const formConfig=[
    // {
    //     prop: "skuName",
    //     label: "sku名称",
    // },
    {
        prop: "skuType",
        label: "租卖类型",
        type:"select",
        option:[
            {label:"只租",value:1},
            {label:"只卖",value:2},
            {label:"可租可卖",value:3},
        ]
    },
    // {
    //     prop: "skuCostPrice",
    //     label: "成本价",
    //     type:'number',
    // },
    {
        prop: "skuOriPrice",
        label: "原价",
        type:'number',
        required:false
    },
    {
        prop: "skuPrice",
        label: "当前零售价",
        type:'number',
    },
    {
        prop: "skuLeasePrice",
        label: "出租价",
        type:'number',
    },
	{
		prop: "skuCompany",
		label: "出租单位",
	},
    {
        prop: "leseBillingMethod",
        label: "计费方式",
        type:"select",
        option:[
            // 0 日租 1 月租 3年租
            {label:"日租",value:0},
            {label:"月租",value:1},
            {label:"年租",value:2},
        ]
    },
    {
        prop: "skuActualStocks",
        label: "库存",
        type:'number',
    },
    {
        prop: "skuVolume",
        label: "体积",
        type:'number',
        required:false
    },
    {
        prop: "skuWeight",
        label: "重量",
        type:'number',
        required:false
    },
    {
        prop: "status",
        label: "上架状态",
        type:"select",
        option:[
            {label:"下架",value:0},
            {label:"上架",value:1}
        ]
    },
    {
        prop: "skuPic",
        label: "sku图片",
        type:"img"
    },
    // {
    //     prop: "properties",
    //     label: "规格",
    //     type:"custom"
    // }
]

export const formConfigZu=[
    // {
    //     prop: "skuName",
    //     label: "sku名称",
    // },
    {
        prop: "skuType",
        label: "租卖类型",
        type:"select",
        option:[
            {label:"只租",value:1},
            {label:"只卖",value:2},
            {label:"可租可卖",value:3},
        ]
    },
    {
        prop: "skuOriPrice",
        label: "原价",
        type:'number',
        required:false
    },
    {
        prop: "skuLeasePrice",
        label: "出租价",
        type:'number',
    },
    {
        prop: "skuActualStocks",
        label: "库存",
        type:'number',
    },
    {
        prop: "skuVolume",
        label: "体积",
        type:'number',
        required:false
    },
    {
        prop: "skuWeight",
        label: "重量",
        type:'number',
        required:false
    },
	{
		prop: "skuCompany",
		label: "出租单位",
	},
    {
        prop: "leseBillingMethod",
        label: "计费方式",
        type:"select",
        option:[
            // 0 日租 1 月租 3年租
            {label:"日租",value:0},
            {label:"月租",value:1},
            {label:"年租",value:2},
        ]
    },
    {
        prop: "status",
        label: "上架状态",
        type:"select",
        option:[
            {label:"下架",value:0},
            {label:"上架",value:1}
        ]
    },
    {
        prop: "skuPic",
        label: "sku图片",
        type:"img"
    },
    // {
    //     prop: "properties",
    //     label: "规格",
    //     type:"custom"
    // }
]

export const formConfigSel=[
    // {
    //     prop: "skuName",
    //     label: "sku名称",
    // },
    {
        prop: "skuType",
        label: "租卖类型",
        type:"select",
        option:[
            {label:"只租",value:1},
            {label:"只卖",value:2},
            {label:"可租可卖",value:3},
        ]
    },
    {
        prop: "skuOriPrice",
        label: "原价",
        type:'number',
    },
    {
        prop: "skuPrice",
        label: "当前零售价",
        type:'number',
    },
    {
        prop: "skuActualStocks",
        label: "库存",
        type:'number',
    },
    {
        prop: "skuVolume",
        label: "体积",
        type:'number',
        required:false
    },
    {
        prop: "skuWeight",
        label: "重量",
        type:'number',
        required:false
    },
    {
        prop: "status",
        label: "上架状态",
        type:"select",
        option:[
            {label:"下架",value:0},
            {label:"上架",value:1}
        ]
    },
    {
        prop: "skuPic",
        label: "sku图片",
        type:"img",
    },
    // {
    //     prop: "properties",
    //     label: "规格",
    // }
]