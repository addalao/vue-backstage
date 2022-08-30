export const tableConfig=[
    {
        prop: "name",
        label: "基地名称",
        width:'300'
    },
    {
        prop: "code",
        label: "基地编码",
        width:'300',
    },
    {
        prop: "commonStatus",
        label: "是否为默认基地",
        type:"state",
        width:'300',
        option:[
            {label:"是",value:1},
            {label:"否",value:0}
        ] 
    },
    {
        prop: "status",
        label: "状态",
        type:"state",
        width:'300',
        option:[
            {label:"启用",value:1},
            {label:"禁用",value:0}
        ] 
    },
    {
        prop: "createTime",
        label: "创建时间",
    }
]

export const formConfig=[
    {
        prop: "name",
        label: "基地名称",
    },
    {
        prop: "code",
        label: "基地编码",
        required:false
    },
    {
        prop: "commonStatus",
        label: "是否为默认基地",
        type:"select",
        option:[
            {label:"是",value:1},
            {label:"否",value:0}
        ]
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