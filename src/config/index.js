export const formConfig=[
    {
        prop: "name",
        label: "角色名",
        type:'clickBtn',
        cpname:'test',
        // size:''抽屉尺寸
    },
    {
        prop: "sex",
        label: "性别",
        type:'textarea',
    },
    {
        prop: "age",
        label: "年龄",
        type:'number',
        required:false,
        exp:/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/,
        tips:'请输入正数'
    },
    {
        prop: "phone",
        label: "电话",
        type:'phone'
    },
    {
        prop: "name",
        label: "性别",
        type:'switch'
    },
    {
        prop: "code",
        label: "角色代码",
        type:'img'
    },
    {
        prop: "code",
        label: "角色代码",
        type:'mimg'
    },
    {
        prop: "status",
        label: "状态",
        type:"select",
        option:[
            {label:"禁用",value:0},
            {label:"启用",value:1}
        ]
    },
    {
        prop: "createTime",
        label: "创建时间",
        type:"datetime",
    }
]