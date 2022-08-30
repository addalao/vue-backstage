import { reactive } from 'vue';

export const rules = reactive({
    name: [
        {
            required: true,
            message: '请填写菜单名称',
            trigger: 'blur',
        }
    ],
    icon: [
        {
            required: true,
            message: '请选择图标',
            trigger: 'blur',
        }
    ],
    uri: [
        {
            required: true,
            message: '请填写路由',
            trigger: 'blur',
        }
    ]
})

export const btnRules = reactive({
    name: [
        {
            required: true,
            message: '请选择或填写按钮名称',
            trigger: ['blur','change'],
        }
    ],
    uri: [
        {
            required: true,
            message: '请选择或填写事件',
            trigger: ['blur','change'],
        }
    ],
    code:[
        {
            required: true,
            message: '请选择按钮位置',
            trigger: ['blur','change'],
        }
    ]
})

export const statusOption = [
    {label:"启用",value:1},
    {label:"禁用",value:0},
]

export const rightOption = [
    {label:"目录",value:0},
    {label:"菜单",value:1},
    {label:"按钮",value:2},
]

export const btnNameOption = ["新建", "编辑", "删除", "查看"]

export const btnPositionOption = [
    {label:"顶部区域",value:'top'},
    {label:"列表右侧",value:'right'},
]

export const btnEventOption = ["newData", "editData", "delData", "viewData"]

export const btnStyleListArr=[
    {type:"方形默认",list:[
        {name:"默认",type:"",plain:false},
        {name:"主要",type:"primary",plain:false},
        {name:"成功",type:"success",plain:false},
        {name:"信息",type:"info",plain:false},
        {name:"警告",type:"warning",plain:false},
        {name:"危险",type:"danger",plain:false},
        // {name:"我的",type:"custom",plain:false},
    ]},
    {type:"方形朴素",list:[
        {name:"默认",type:"",plain:true},
        {name:"主要",type:"primary",plain:true},
        {name:"成功",type:"success",plain:true},
        {name:"信息",type:"info",plain:true},
        {name:"警告",type:"warning",plain:true},
        {name:"危险",type:"danger",plain:true},
        // {name:"我的",type:"custom",plain:true},
    ]},
    {type:"圆角默认",list:[
        {name:"默认",type:"",round:true,plain:false},
        {name:"主要",type:"primary",round:true,plain:false},
        {name:"成功",type:"success",round:true,plain:false},
        {name:"信息",type:"info",round:true,plain:false},
        {name:"警告",type:"warning",round:true,plain:false},
        {name:"危险",type:"danger",round:true,plain:false},
        // {name:"我的",type:"custom",round:true,plain:false},
    ]},
    {type:"圆角朴素",list:[
        {name:"默认",type:"",round:true,plain:true},
        {name:"主要",type:"primary",round:true,plain:true},
        {name:"成功",type:"success",round:true,plain:true},
        {name:"信息",type:"info",round:true,plain:true},
        {name:"警告",type:"warning",round:true,plain:true},
        {name:"危险",type:"danger",round:true,plain:true},
        // {name:"我的",type:"custom",round:true,plain:true},
    ]},
    {type:"圆形默认",list:[
        {name:"",type:"",icon:"Search",circle:true,plain:false},
        {name:"",type:"primary",icon:"Edit",circle:true,plain:false},
        {name:"",type:"success",icon:"Check",circle:true,plain:false},
        {name:"",type:"info",icon:"Message",circle:true,plain:false},
        {name:"",type:"warning",icon:"Star",circle:true,plain:false},
        {name:"",type:"danger",icon:"Delete",circle:true,plain:false},
        // {name:"",type:"custom",icon:"el-icon-plus",circle:true,plain:false},
    ]},
    {type:"圆形朴素",list:[
        {name:"",type:"",icon:"Search",circle:true,plain:true},
        {name:"",type:"primary",icon:"Edit",circle:true,plain:true},
        {name:"",type:"success",icon:"Check",circle:true,plain:true},
        {name:"",type:"info",icon:"Message",circle:true,plain:true},
        {name:"",type:"warning",icon:"Star",circle:true,plain:true},
        {name:"",type:"danger",icon:"Delete",circle:true,plain:true},
        // {name:"",type:"custom",icon:"el-icon-plus",circle:true,plain:true},
    ]}
]