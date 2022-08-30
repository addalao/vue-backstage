export const tableConfig=[
    {
        prop: "prodName",
        label: "商品名称",
    },
    {
        prop: "orderNumber",
        label: "订单号",
    },
	{
	    prop: "isPayed",
	    label: "是否支付",
		type:"state",
		option:[
			{label:"已支付",value:1},
			{label:"未支付",value:0},
		]
	},
    {
        prop: "status",
        label: "订单状态",
        type:"state",
        option:[
			//1 待确认  2待付款(20待签约 21 签约中/待审核 22已签约  23审核失败)  3已付款/待发货  4已发货/待收货  5确认收货/租赁中  6待结算/断租/租赁到期/续约  7完成   8待评价   9已评价
            {label:"待确认",value:1},
            {label:"待付款",value:2},
            {label:"已付款/待发货",value:3},
            {label:"已发货/待收货",value:4},
            {label:"确认收货/租赁中",value:5},
            {label:"待结算",value:6},
            {label:"完成",value:7},
        ]
    },
	{
	    prop: "productNums",
	    label: "订单商品总数",
	},
	{
	    prop: "total",
	    label: "订单总额",
	},
	{
	    prop: "actualTotal",
	    label: "订单实付金额",
	},
	{
	    prop: "reduceAmount",
	    label: "订单优惠总额",
	},
    {
        prop: "phone",
	    label: "联系电话",
    },
	{
		prop: "payTime",
		label: "支付时间",
	},
    {
        prop: "createTime",
        label: "下单时间"
    }
]