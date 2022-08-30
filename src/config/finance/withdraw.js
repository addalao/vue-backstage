export const tableConfig = [{
		prop: "nikeName",
		label: "用户昵称",
	},
	{
		prop: "userPhone",
		label: "电话号码",
	},
	{
		prop: "amount",
		label: "提现总额",
	},
	{
		prop: "actualAmount",
		label: "实际到账金额",
	},
	{
		prop: "type",
		label: "提现类型",
		type: "state",
		option: [{
			label: "微信收款码 ",
			value: 1
		}, {
			label: "支付宝账号",
			value: 2
		}, {
			label: "支付宝收款码",
			value: 3
		}, {
			label: "银行卡",
			value: 4
		}]
	},
	{
		prop: "status",
		label: "提现状态",
		type: "state",
		option: [{
			label: "待审批 ",
			value: 1
		}, {
			label: "同意",
			value: 2
		}, {
			label: "拒绝",
			value: 3
		}]
	},
	{
		prop: "payStatus",
		label: "打款状态",
	},
	{
		prop: "payTime",
		label: "打款时间",
	},
	{
		prop: "createTime",
		label: "发起时间",
	},
	{
		prop: "note",
		label: "备注",
	},
	{
		prop: "errCode",
		label: "微信错误code",
		type: "state",
	},
	{
		prop: "errCodeDes",
		label: "微信错误描述",
		type: "state",
	},
]
