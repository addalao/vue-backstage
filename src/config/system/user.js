export const tableConfig=[
    {
        prop:"username",
        label:'账号',
    },
    {
        prop:'nickName',
        label:'昵称',
    },
    {
        prop:"phone",
        label:'手机号',
    },
    {
        prop:"email",
        label:'邮箱',
    },
    {
        prop:"icon",
        label:'头像',
        type:"img"
    },
    {
        prop: "roleVo",
        label: "绑定角色",
        type:"tags",
        key:"name",
        closable:true
    },
    {
        prop:"status",
        label:'账号状态',
        type:"state",
        option:[
            {label:'禁用',value:0},
            {label:'正常',value:1}
        ]
    },
]

export const formConfig=[
    {
        prop: "username",
        label: "账户"
    },
    {
        prop:"password",
        label:"密码",
        type:"pwd",
    },
    {
        prop: "nickName",
        label: "用户昵称",
        required:false
    },
    {
        prop: "phone",
        label: "手机号码",
        type:"phone",
        required:false
    },
    {
        prop: "email",
        label: "邮箱",
        required:false
    },
    {
        prop: "status",
        label: "状态",
        type:"select",
        option:[{label:"禁用",value:0},{label:"启用",value:1}]
    },
    {
        prop: "icon",
        label: "用户头像",
        required:false,
        type:"img",
    },
    {
        prop: "note",
        label: "备注",
        required:false,
        type:"textarea"
    }
]

export const editFormConfig=[
    {
        prop: "username",
        label: "账户"
    },
    {
        prop: "nickName",
        label: "用户昵称",
        required:false
    },
    {
        prop: "phone",
        label: "手机号码",
        type:"phone",
        required:false
    },
    {
        prop: "email",
        label: "邮箱",
        required:false
    },
    {
        prop: "status",
        label: "状态",
        type:"select",
        option:[{label:"禁用",value:0},{label:"启用",value:1}]
    },
    {
        prop: "icon",
        label: "用户头像",
        required:false,
        type:"img",
    },
    {
        prop: "note",
        label: "备注",
        required:false,
        type:"textarea"
    }
]