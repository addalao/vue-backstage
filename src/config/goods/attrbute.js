export const tableConfig=[
    {
        prop: "propName",
        label: "规格名称",
        width:'300'
    },
    {
        prop: "prodPropValues",
        label: "属性",
        type:"tags",
        width:'500',
        key:'propValue'
    },
    {
        prop: "rule",
        label: "类型",
        type:"state",
        width:'200',
        option:[
            {label:"销售属性(规格)",value:1},
            {label:"参数属性",value:2}
        ] 
    },
]

export const formConfig=[
    {
        prop: "propName",
        label: "规格名称",
    },
    {
        prop: "rule",
        label: "类型",
        type:"select",
        option:[
            {label:"销售属性(规格)",value:1},
            {label:"参数属性",value:2}
        ]
    }
]