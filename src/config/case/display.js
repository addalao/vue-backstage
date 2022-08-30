export const tableConfig=[
    {
        prop: "title",
        label: "案例标题",
        width:'300'
    },
    {
        prop: "describe",
        label: "案例描述",
    },
    {
        prop: "pic",
        label: "案例图标",
        type:'img'
    },
    {
        prop: "type",
        label: "类型",
        type:"state",
        width:'200',
        option:[
            {label:"合作伙伴",value:1},
            {label:"公司团队",value:2}
        ] 
    },
    {
        prop: "createTime",
        label: "创建时间",
    }
]

export const formConfig=[
    {
        prop: "title",
        label: "案例标题",
    },
    {
        prop: "describe",
        label: "案例描述",
        type:"textarea",
    },
    {
        prop: "pic",
        label: "案例图标",
        type:'img'
    },
    {
        prop: "type",
        label: "类型",
        type:"select",
        width:'200',
        option:[
            {label:"合作伙伴",value:1},
            {label:"公司团队",value:2}
        ] 
    },
    {
        prop: "note",
        label: "案例详情",
        type:'editor'
    }
]