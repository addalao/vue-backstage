export const tableConfig=[
    {
        prop: "name",
        label: "角色名",
    },
    {
        prop: "code",
        label: "角色代码",
    },
    {
        prop: "status",
        label: "状态",
        type:"state",
        option:[
            {label:"禁用",value:0},
            {label:"启用",value:1}
        ]
    },
    {
        prop: "createTime",
        label: "创建时间"
    }
]

export const formConfig=[
    {
        prop: "name",
        label: "角色名"
    },
    {
        prop: "code",
        label: "角色代码",
    },
    {
        prop: "status",
        label: "状态",
        type:"select",
        option:[{label:"禁用",value:0},{label:"启用",value:1}]
    }
]