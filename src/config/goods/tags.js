export const tableConfig=[
    {
        prop: "labelName",
        label: "标签名称",
        width:'300'
    },
    {
        prop: "labelCode",
        label: "标签Code码",
        width:'300'
    },
    {
        prop: "status",
        label: "状态",
        type:"state",
        width:'200',
        option:[
            {label:"启用",value:1},
            {label:"禁用",value:0}
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
        prop: "labelName",
        label: "标签名称",
    },
    {
        prop: "labelCode",
        label: "标签Code码",
    },
    {
        prop: "status",
        label: "状态",
        type:"select",
        option:[
            {label:"启用",value:1},
            {label:"禁用",value:0}
        ]
    }
]