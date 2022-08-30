export const tableConfig = [{
    prop: "userName",
    label: "用户名称",
},
{
    prop: "userPhone",
    label: "电话号码",
},
{
    prop: "orderNumber",
    label: "订单号",
},
{
    prop: "orderType",
    label: "订单类型",
    type: "state",
    option: [
        {
            label: "租赁",
            value: 1
        },
        {
            label: "购买",
            value: 2
        },
        {
            label: "买断价格",
            value: 3
        },
        {
            label: "充值",
            value: 4
        }
    ]
},
{
    prop: "orderAmount",
    label: "订单金额",
},
{
    prop: "deposit",
    label: "押金",
},
{
    prop: "freight",
    label: "运费",
},
{
    prop: "buyOutAmount",
    label: "买断金额",
},
// 订单类型   1 租赁  2 购买 3 买断价格  4 充值

{
    prop: "payNo",
    label: "支付单号",
},
{
    prop: "payStatus",
    label: "支付状态",
    type: "state",
    option: [
        {
            label: "已支付",
            value: 1
        },
        {
            label: "未支付",
            value: 0
        },
    ]
},
{
    prop: "payAmount",
    label: "支付金额",
},
{
    prop: "payType",
    label: "支付方式",
    type: "state",
    option: [
        {
            label: "微信支付",
            value: 1
        },
        {
            label: "支付宝",
            value: 2
        },
    ]
},
{
    prop: "prepaymentAmount",
    label: "预付金额",
},
{
    prop: "createTime",
    label: "创建时间",
}
]
