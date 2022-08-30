export const tableConfig=[
    {
        prop: "categoryName",
        label: "分类名称",
        width:'300'
    },
    {
        prop: "icon",
        label: "分类图标",
        type:"img",
        width:'300'
    },
    {
        prop: "status",
        label: "分类状态",
        type:"state",
        width:'300',
        option:[
            {label:"启用",value:1},
            {label:"禁用",value:0}
        ] 
    },
]

export const formConfig=[
    {
        prop: "categoryName",
        label: "分类名称",
    },
    {
        prop: "icon",
        label: "分类图标",
        type:"img",
        required:false
    },
    {
        prop: "seq",
        label: "排序",
        type:'number',
        required:false
    },
    {
        prop: "status",
        label: "分类状态",
        type:"select",
        option:[
            {label:"启用",value:1},
            {label:"禁用",value:0}
        ]
    }
]