export const tableConfig = [
    {
        prop: "realName",
        label: "用户姓名",
    },
    {
        prop: "nickName",
        label: "用户昵称",
    },
    {
        prop: "orderNo",
        label: "订单号",
    },
    {
        prop: "status",
        label: "扣款状态",
        type:"state",
        width:'200',
        option:[
            {label:"失败",value:0},
            {label:"成功",value:1}
        ] 
    },
    {
        prop: "amout",
        label: "扣款金额",
    },
    {
        prop: "note",
        label: "说明",
    },
    {
        prop: "createTime",
        label: "扣款时间",
    },
]