export const tableConfig=[
    {
        prop: "account",
        label: "账号",
    },
    {
        prop: "nickName",
        label: "用户昵称",
    },
	{
	    prop: "realName",
	    label: "真实姓名",
	},
	{
		prop: "userMobile",
		label: "手机号码",
	},
	{
		prop: "pic",
		label: "用户头像",
		type:'img'
	},
	{
		prop: "balance",
		label: "余额",
	},
	{
		prop: "score",
		label: "积分",
	},
	{
		prop: "authentication",
		label: "认证状态",
		type:"state",
		option:[
		    {label:"未认证",value:0},
		    {label:"待审核",value:1},
		    {label:"已认证",value:2}
		] 
	},
	{
	    prop: "userType",
	    label: "账户类型",
	    type:"state",
	    option:[
	        {label:"微信用户",value:1},
	        {label:"中台用户",value:2}
	    ] 
	},
    {
        prop: "status",
        label: "状态",
        type:"state",
        option:[
            {label:"启用",value:1},
            {label:"禁用",value:0}
        ] 
    },
	{
		prop: "userRegtime",
		label: "注册时间",
	},
]