export const tableConfig=[
    {
        prop: "commodityName",
        label: "集装箱名称",
        width:'300'
    },
    {
        prop: "categoryName",
        label: "商品分类",
        width:'300'
    },
    {
        prop: "commodityPic",
        label: "集装箱主图",
        type:'img',
        width:'200'
    },
    {
        prop: "type",
        label: "租卖类型",
        type:"state",
        width:'200',
        option:[
            {label:"只租",value:1},
            {label:"只卖",value:2},
            {label:"可租可卖",value:3},
        ] 
    },
    {
        prop: "commodityStatus",
        label: "上架状态",
        type:"state",
        width:'200',
        option:[
            {label:"下架",value:0},
            {label:"上架",value:1}
        ]
    },
    {
        prop: "createTime",
        width:'250',
        label: "创建时间"
    }
]

export const formConfig=[
    {
        prop: "commodityName",
        label: "集装箱名称",
    },
    {
        prop: "categoryId",
        label: "商品分类",
        type:'select',
        option:[],
        lkey:'',
        vkey:'',
    },
    {
        prop: "labelId",
        label: "商品标签",
        type:'select',
        option:[],
        lkey:'',
        vkey:'',
    },
    // {
    //     prop: "categoryName",
    //     label: "商品分类",
    // },
    {
        prop: "commodityDescribe",
        label: "集装箱描述",
        type:'textarea',
    },
    {
        prop: "type",
        label: "租卖类型",
        type:"select",
        option:[
            {label:"只租",value:1},
            {label:"只卖",value:2},
            {label:"可租可卖",value:3},
        ],
    },
    // {
    //     prop: "skuCostPrice",
    //     label: "成本价",
    //     type:'number',
    // },
    {
        prop: "commodityOriginalPrice",
        label: "原价",
        type:'number',
    },
    {
        prop: "commodityActualPirce",
        label: "当前价格",
        type:'number',
    },
    {
        prop: "commodityStock",
        label: "库存",
        type:'number',
    },
    {
        prop: "commodityStatus",
        label: "上架状态",
        type:"select",
        option:[
            {label:"下架",value:0},
            {label:"上架",value:1}
        ],
    },
    {
        prop: "commodityPic",
        label: "集装箱主图",
        type:"img",
    },
    {
        prop: "commodityImages",
        label: "集装箱二级图片321*331",
        type:"mimg",
    },
    {
        prop: "commodityIntroduceTwo",
        label: "集装箱规格",
        type:"editor",
    },
    {
        prop: "commodityIntroduce",
        label: "集装箱详情介绍",
        type:"editor",
    }
]