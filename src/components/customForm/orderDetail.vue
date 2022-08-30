<template>
	<div style="overflow-y: auto;height:auto;position: relative;">
		<!-- //1 待确认  2待付款(20 待签约 21 签约审核 22 合同已创建  23 已发起签约   24 签约审核失败 25 签约完成 )
		// 3已付款/待发货  4已发货/待收货  5确认收货/租赁中  
		// 6待结算/断租/租赁到期/续约(60待结算 61审核中 62已结算 63审核失败)  7完成   8待评价   9已评价 
		// 买断 buyOutStatus 1是 0 否    // 买断状态buyOut 1 待审核 2 待支付  3 支付成功 
		-->
		<div class="order-handle" v-if="orderDetail.orderType!==1 && (orderDetail.status==1 || orderDetail.status==3)">
			<span>订单操作</span>
			<el-button v-if="orderDetail.status==1" type="primary" @click="confirmOrder">确认订单</el-button>
			<el-button v-if="orderDetail.status==3" type="primary" @click="deliverGoods">发货</el-button>
		</div>
		<div class="order-handle" v-if="orderDetail.orderType!==2">
			<!-- && (orderDetail.status==1 || orderDetail.status==2 || orderDetail.status==3 || orderDetail.signStatus==21 || orderDetail.signStatus==22 || orderDetail.buyOut==1 || orderDetail.status==6) -->
			<span>订单操作</span>
			<div v-if="orderDetail.status==1 || orderDetail.status==2">
				<el-button type="primary" plain @click="changep">修改价格</el-button>
				<el-button v-if="orderDetail.status==1" type="primary" @click="confirmOrder">确认订单</el-button>
			</div>
			<template v-if="orderDetail.status==2">
				<el-button v-if="orderDetail.signStatus==21" type="primary" @click="createContract">创建合同</el-button>
				<div v-if="orderDetail.signStatus==22">
					<el-button type="primary" @click="sendContractToUser">发起签署</el-button>
					<el-button @click="checkContract(1)">查看合同</el-button>
				</div>
			</template>
			<div>
				<template v-if="orderDetail.status==5 && orderDetail.buyOutStatus==1">
					<el-button type="primary" v-if="orderDetail.buyOut==1" @click="confirmBuyOut">买断确认</el-button>
				</template>
				<el-button v-if="orderDetail.status==3" type="primary" @click="deliverGoods">发货</el-button>
				<el-button v-if="orderDetail.status!=1 && orderDetail.status!=2" type="primary" plain @click="checkContract()">查看合同</el-button>
			</div>
		</div>
		<!-- 订单操作相关输入 -->
		<div class="input-box" v-if="showCondition">
			<div class="input-container">
				<div class="search-title">
					<span v-if="showType==1">运费</span>
					<span v-if="showType==2">运费/押金</span>
					<span v-if="showType==3">修改价格</span>
					<span v-if="showType==4">拒绝原因</span>
					<span v-if="showType==5">发货信息</span>
					<span v-if="showType==6">买断价格</span>
				</div>
				<el-input class="input-text" type="number" v-model="changeObj.deposit" placeholder="请输入押金" v-if="showType==2"/>
				<el-input class="input-text" type="number" v-model="changeObj.freight" placeholder="请输入运费" v-if="showType==1 || showType==2"/>
				<el-input class="input-text" type="number" v-model="changeObj.price" placeholder="请输入价格(若有小数最多保留2位)" v-if="showType==3"/>
				<el-input class="input-text" type="number" v-model="changeObj.buyOutPrice" placeholder="请输入买断价格(若有小数最多保留2位)" v-if="showType==6"/>
				<!-- <picker v-if="showType==4" @change="getReason" :range="reasonArr" range-key="label">
					<div class="input-text">{{changeObj.reason}}</div>
				</picker> -->
				<template v-if="showType==5">
					<el-input class="input-text" v-model="deliverGoodsObj.driver" placeholder="请输入司机姓名" />
					<el-input class="input-text" v-model="deliverGoodsObj.contactNumber" type="number" placeholder="请输入联系电话" />
					<el-input class="input-text" v-model="deliverGoodsObj.carNumber" placeholder="请输入车牌号" />
				</template>
				<div style="text-align: right;">
					<el-button @click='showCondition=false'>关闭</el-button>
					<el-button type="primary" @click='confirmChange'>确定</el-button>
				</div>
			</div>
		</div>
		<!-- //1 待确认  2待付款(20 待签约 21 签约审核 22 合同已创建  23 已发起签约   24 签约审核失败 25 签约完成 )
		// 3已付款/待发货  4已发货/待收货  5确认收货/租赁中  
		// 6待结算/断租/租赁到期/续约(60待结算 61审核中 62已结算 63审核失败)  7完成   8待评价   9已评价 
		// 买断 buyOutStatus 1是 0 否    // 买断状态buyOut 1 待审核 2 待支付  3 支付成功 
		-->
		<el-row class="status-bar">
			<el-col :xs="24" :sm="12" :md="6" :span="6">订单号：{{ orderDetail.orderNumber }}</el-col>
			<el-col :xs="24" :sm="12" :md="4" :span="6">支付状态： {{ orderDetail.isPayed === 1 ? '已支付' : '未支付' }}</el-col>
			<el-col :xs="24" :sm="12" :md="4" :span="6">
				订单状态：
				{{
					orderDetail.status === 1
						? '待确认'
						: orderDetail.status === 2
						? '待付款'
						: orderDetail.status === 3
						? '已付款/待发货'
						: orderDetail.status === 4
						? '已发货/待收货'
						: orderDetail.status === 5
						? '确认收货/租赁中'
						: orderDetail.status === 6
						? '待结算'
						: orderDetail.status === 7
						? '完成'
						:''
				}}
			</el-col>
			<!-- //1 待确认  2待付款(20 待签约 21 签约审核 22 合同已创建  23 已发起签约   24 签约审核失败 25 签约完成 )
			// 3已付款/待发货  4已发货/待收货  5确认收货/租赁中  
			// 6待结算/断租/租赁到期/续约(60待结算 61审核中 62已结算 63审核失败)  7完成   8待评价   9已评价 
			// 买断 buyOutStatus 1是 0 否    // 买断状态buyOut 1 待审核 2 待支付  3 支付成功 -->
			<el-col :xs="24" :sm="12" :md="4" :span="6">
				退款状态：
				{{
					orderDetail.refundSts === 0
						? '未处理'
						: orderDetail.refundSts === 1
						? '处理中'
						: orderDetail.refundSts === 2
						? '处理完成'
						: orderDetail.refundSts === 3
						? '已拒绝'
						: orderDetail.refundSts === 4
						? '售后过期'
						: ''
				}}
				<!-- {label:"未处理",value:0},{label:"在处理",value:1},{label:"处理完成",value:2},{label:"拒绝",value:3},{label:"售后过期",value:4}] -->
			</el-col>
		</el-row>
		<div class="current-box">
			<!-- //1 待确认  2待付款(20 待签约 21 签约审核 22 合同已创建  23 已发起签约   24 签约审核失败 25 签约完成 )
			// 3已付款/待发货  4已发货/待收货  5确认收货/租赁中  
			// 6待结算/断租/租赁到期/续约(60待结算 61审核中 62已结算 63审核失败)  7完成   8待评价   9已评价 
			// 买断 buyOutStatus 1是 0 否    // 买断状态buyOut 1 待审核 2 待支付  3 支付成功 --> 
			<el-container class="current-status">
				<el-aside class="aside-box" width="360px">
					<h3 v-if="orderDetail.status===1">待商家确认</h3>
					<h3 v-if="orderDetail.status===2 && orderDetail.orderType==2">
						待付款
					</h3>
					<h3 v-if="orderDetail.status===2 && orderDetail.orderType==1">
						待付款--
						{{orderDetail.signStatus === 20
						? '待签约'
						: orderDetail.signStatus === 21
						? '签约中/待审核'
						: orderDetail.signStatus === 22
						? '合同已创建'
						: orderDetail.signStatus === 23
						? '已发起签约'
						:orderDetail.signStatus === 24
						?'签约审核失败'
						:orderDetail.signStatus === 25
						?'签约完成':'待签约'}}
					</h3>
					<h3 v-if="orderDetail.status===3">已付款,待商家发货</h3>
					<h3 v-if="orderDetail.status===4">已发货，待买家收货</h3>
					<h3 v-if="orderDetail.status===5 && orderDetail.orderType==1">
						<template v-if="orderDetail.buyOutStatus==1">
							<!-- 买断状态buyOut 1 待审核 2 待支付  3 支付成功 -->
							买断
							{{orderDetail.buyOut === 1
							? '--待审核'
							: orderDetail.buyOut === 2
							? '--待支付'
							: orderDetail.buyOut === 3
							? '--支付成功':''}}
						</template>
						<template v-else>
							租赁中
						</template>
					</h3>
					<h3 v-if="orderDetail.status===6 && orderDetail.orderType==1">
						待结算
						{{orderDetail.settlementStatus === 61? '--审核中':''}}
					</h3>
					<h3 v-if="orderDetail.status===7">订单完成</h3>
				</el-aside>
				<el-main class="main-box">
					<div class="main-line-step">
						<span class="number active">1</span>
						<span class="line active"></span>
						<span :class="['number',orderDetail.status!==1?'active':'']">2</span>
						<span :class="['line',orderDetail.status!==1?'active':'']"></span>
						<span :class="['number',orderDetail.status!==1 && orderDetail.status!==2?'active':'']">3</span>
						<span :class="['line',orderDetail.status!==1 && orderDetail.status!==2?'active':'']"></span>
						<span :class="['number',orderDetail.status==7?'active':'']">4</span>
					</div>
					<div class="main-line-step" style="margin-top: 10px;">
						<h4 class="active">
							<div>买家下单</div>
							<div></div>
						</h4>
						<h4 :class="[orderDetail.status!==1?'active':'']">
							<div>买家付款</div>
							<div></div>
						</h4>
						<h4 :class="[orderDetail.status!==1 && orderDetail.status!==2?'active':'']">
							<div>等待商家确认</div>
							<div></div>
						</h4>
						<h4 :class="[orderDetail.status==7?'active':'']">
							交易完成
						</h4>
					</div>
				</el-main>
			</el-container>
			<div class="order-remark" style="border-top:1px solid #ededed;">
				备注:{{orderDetail.remarks?orderDetail.remarks:''}}
			</div>
		</div>
		<el-container class="user-info">
			<el-header class="info-header">
				<el-row>
					<el-col :span="7">用户信息</el-col>
					<el-col :span="6">配送信息</el-col>
					<el-col :span="6">支付信息</el-col>
					<el-col :span="5">订单信息</el-col>
				</el-row>
			</el-header>
			<!-- //1 待确认  2待付款(20 待签约 21 签约审核 22 合同已创建  23 已发起签约   24 签约审核失败 25 签约完成 )
			// 3已付款/待发货  4已发货/待收货  5确认收货/租赁中  
			// 6待结算/断租/租赁到期/续约(60待结算 61审核中 62已结算 63审核失败)  7完成   8待评价   9已评价 
			// 买断 buyOutStatus 1是 0 否    // 买断状态buyOut 1 待审核 2 待支付  3 支付成功 --> 
			<el-main class="info-main">
				<el-row>
					<el-col :span="7" v-if="orderDetail.userAddrOrder">
						<h4><span class="info-label">姓名：</span>{{orderDetail.userAddrOrder.receiver}}</h4>
						<h4><span class="info-label">联系电话：</span>{{orderDetail.userAddrOrder.mobile}}</h4>
						<h4><span class="info-label">发货地址：</span>{{orderDetail.deliveryBase && orderDetail.deliveryBase.name}}</h4>
						<h4><span class="info-label">收货地址：</span>{{orderDetail.userAddrOrder.province+orderDetail.userAddrOrder.city+orderDetail.userAddrOrder.area+orderDetail.userAddrOrder.addr}}</h4>
					</el-col>
					<el-col :span="6">
						<h4><span class="info-label">车牌号：</span>{{orderDetail.logisticsInfo && orderDetail.logisticsInfo.carNumber || '_'}}</h4>
						<h4><span class="info-label">联系人：</span>{{orderDetail.logisticsInfo && orderDetail.logisticsInfo.driver || '_'}}</h4>
						<h4><span class="info-label">联系电话：</span>{{orderDetail.logisticsInfo && orderDetail.logisticsInfo.contactNumber || "_"}}</h4>
					</el-col>
					<el-col :span="6" v-if="orderDetail.orderType==1"><!-- 租 -->
						<h4><span class="info-label">日租单价：</span>￥{{ orderDetail.actualTotal || '_'}}</h4>
						<template v-if="orderDetail.status!=1">
							<h4><span class="info-label">运费：</span>￥{{orderDetail.freight || 0}}</h4>
							<h4><span class="info-label">押金：</span>￥{{orderDetail.deposit || 0}}</h4>
						</template>
						<h4 v-if="orderDetail.buyOutStatus==1 && orderDetail.buyOut!=1"><span class="info-label">买断价：</span>￥{{orderDetail.buyOutAmount || 0}}</h4>
						<h4 v-if="orderDetail.status!=1 && orderDetail.status!=2"><span class="info-label">已付运费押金：</span>￥{{orderDetail.freight+orderDetail.deposit || 0}}</h4>
						<h4 v-else><span class="info-label">待付运费押金：</span>￥{{orderDetail.freight+orderDetail.deposit || 0}}</h4>
					</el-col>
					<el-col :span="6" v-if="orderDetail.orderType==2"><!-- 卖 -->
						<h4><span class="info-label">商品总价：</span>￥{{ orderDetail.total || '_'}}</h4>
						<h4 v-if="orderDetail.status!=1"><span class="info-label">运费：</span>￥{{orderDetail.freight || 0}}</h4>
						<template v-if="orderDetail.status!=1 && orderDetail.status!=2">
							<h4><span class="info-label">优惠金额：</span>￥{{orderDetail.reduceAmount || 0}}</h4>
							<h4><span class="info-label">实付金额：</span>￥{{orderDetail.actualTotal+orderDetail.freight || 0}}</h4>
						</template>
					</el-col>
					<el-col :span="5">
						<h4><span class="info-label">订单号：</span>{{orderDetail.orderNumber || '_'}}</h4>
						<h4><span class="info-label">下单时间：</span>{{orderDetail.createTime || '_'}}</h4>
						<h4 v-if="orderDetail.orderType==2 && (orderDetail.status!=1 && orderDetail.status!=2)"><span class="info-label">付款时间：</span>{{orderDetail.payTime || '_'}}</h4>
						<h4 v-if="orderDetail.orderType==1 && orderDetail.status==7 && orderDetail.buyOutStatus!=1"><span class="info-label">结算时间：</span>{{orderDetail.settlementTime || '_'}}</h4>
						<h4 v-if="orderDetail.orderType==1 && orderDetail.buyOut==3"><span class="info-label">买断支付时间：</span>{{orderDetail.buyOutPayTime || '_'}}</h4>
					</el-col>
				</el-row>
			</el-main>
		</el-container>
		<el-container class="user-info">
			<el-header class="info-header">
				<el-row>
					<el-col :span="7">商品信息</el-col>
					<el-col :span="3" class="item-center">规格/sku</el-col>
					<el-col :span="4" class="item-center">单价</el-col>
					<el-col :span="4" class="item-center">数量</el-col>
					<!-- <el-col :span="3" class="item-center">优惠信息</el-col> -->
					<el-col :span="4" class="item-center">小计</el-col>
					<!-- <el-col :span="2" class="item-center">运费</el-col> -->
					<!-- <el-col :span="4" class="item-center">售后</el-col> -->
				</el-row>
			</el-header>
			<el-main class="info-main">
				<el-row class="info-item" v-for="(item,index) in orderDetail.orderItems" :key="index">
					<el-col :span="7">
						<div class="product-img">
							<el-image 
								:z-index="60000"
							    style="width: 100px; height: 100px"
							    :src="item.pic" 
							    :preview-src-list="[item.pic]">
							</el-image>
							<span>{{item.prodName}}</span>
						</div>
					</el-col>
					<el-col :span="3">
						<div class="item-center" v-if="item.skuName">{{item.skuName}}</div>
						<div class="item-center" v-else>{{item.prodName}}</div>
					</el-col>
					<el-col :span="4">
						<div class="item-center">￥{{item.price}}</div>
					</el-col>
					<el-col :span="4">
						<div class="item-center">{{item.prodCount}}</div>
					</el-col>
					<el-col :span="4">
						<div class="item-center">￥{{item.productTotalAmount}}</div>
					</el-col>
					<!-- <el-col :span="2">
						<div class="item-center">_</div>
					</el-col> -->
				</el-row>
				<div class="order-remark" style="padding-top: 15px;">
					<!-- 卖 -->
					<el-row v-if="orderDetail.orderType==2">
                        <el-col :span="4">
						    订单总价:￥{{orderDetail.total || 0}}
                        </el-col>
                        <el-col :span="4">
                            优惠金额:￥{{orderDetail.reduceAmount || 0}}
                        </el-col>
                        <el-col :span="4">
                            实际支付金额:￥{{orderDetail.actualTotal || 0}}
                        </el-col>
                        <el-col :span="4">
                            退款状态:{{orderDetail.refundSts==1?'处理中':orderDetail.refundSts==2?'处理完成':'_'}}
                        </el-col>
                        <el-col :span="4">
                            关单状态:{{orderDetail.closeType==1?'超时未支付':orderDetail.closeType==2?'退款关闭':orderDetail.closeType==4?'买家取消':orderDetail.closeType==15?'已通过货到付款交易':'_'}}
                        </el-col>
                    </el-row>
					<!-- 租 -->
					<el-row v-else>
					    <el-col :span="4">
					        日租单价:￥{{orderDetail.actualTotal || 0}}
					    </el-col>
					    <el-col :span="4">
					        退款状态:{{orderDetail.refundSts==1?'处理中':orderDetail.refundSts==2?'处理完成':'_'}}
					    </el-col>
					    <el-col :span="4">
					        关单状态:{{orderDetail.closeType==1?'超时未支付':orderDetail.closeType==2?'退款关闭':orderDetail.closeType==4?'买家取消':orderDetail.closeType==15?'已通过货到付款交易':'_'}}
					    </el-col>
					</el-row>
				</div>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import _axios from '@/plugins/axios';
import {ElMessage} from 'element-plus'
import {checkMobile} from '../../utils/tools.js'
import {customToast} from '@/common/toast.js'
export default {
	props: {
		item: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			showCondition:false,
			showType:1,//1运费  2运费 押金 3改价格 4拒绝理由 5发货 6买断价格，
			changeObj:{
				deposit:'',//押金
				freight:'',//运费
				closeType:'' ,//订单关闭原因 1-超时未支付 2-退款关闭 4-买家取消 15-已通过货到付款交易
				price:'' ,//修改价格
				reason:'点击选择拒绝原因',
				buyOutPrice:''//
			},
			reasonArr:[
				{label:'超时未支付',value:1},
				{label:'退款关闭',value:2},
				{label:'买家取消',value:4},
				{label:'已通过货到付款交易',value:15},
				{label:'订单信息有误',value:20},
			],
			deliverGoodsObj:{
				driver:"",
				contactNumber:"",
				carNumber:"",
				orderNumber:""
			},
			orderDetail: {}
		};
	},
	created() {
		this.getOrderDetail();
	},
	watch:{
		item(val){
			this.getOrderDetail();
		}
	},
	methods: {
		// 确认订单
		confirmOrder(){
			this.showCondition = true
			if(this.orderDetail.orderType==1){
				this.showType = 2
			}else{
				this.showType = 1
			}
		},
		//发货
		deliverGoods(){
			this.showCondition = true
			this.showType=5
		},
		confirmBuyOut(){
			this.showCondition = true
			this.showType=6
		},
		changep(){
			this.showCondition = true
			this.showType=3
		},
		//弹窗确定事件
		confirmChange(){
			if(this.showType == 1){
				this.buyConfirm()
			}
			if(this.showType==3){
				this.changePrice()
			}
			if(this.showType==2){
				this.leaseConfirm()
			}
			if(this.showType==4){
				this.closeOrder()
			}
			if(this.showType==5){
				this.sendGoods()
			}
			if(this.showType==6){
				this.buyOut()
			}
		},
		//创建合同
		async createContract(){
			await _axios('get',`/sys/eSignRecord/createSignFile?orderNumber=${this.item.orderNumber}`,{},true)
			ElMessage.success('合同已创建！')
			this.getOrderDetail()
		},
		//发送合同给用户,发起签署
		async sendContractToUser(){
			const res = await _axios('get',`/sys/eSignRecord/InitiateSigningProcess?orderNumber=${this.item.orderNumber}`,{},true)
			ElMessage.success('已向用户发起签署邀请！')
			this.getOrderDetail()
		},
		//查看已创建合同
		async checkContract(type=0){
			const res = await _axios('get',`/sys/eSignRecord/getESignRecord?orderNumber=${this.item.orderNumber}`,{},true)
			const {filePath,documentsUrl} = res
			if(type==1){
				window.location.href=filePath
			}else{
				window.location.href=filePath
			}
		},
		//买断确认
		buyOut(){
			if(!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.changeObj.buyOutPrice)) || this.changeObj.buyOutPrice==0) return ElMessage.warning('价格必须大于0(若有小数最多保留2位)')
			customToast('确定这么做吗?',async ()=>{
			    await _axios('get',`/sys/order/buyOut?orderNumber=${this.item.orderNumber}&buyOutAmount=${this.changeObj.buyOutPrice}`,{},true)
			    ElMessage.success('买断已确认！')
			    this.showCondition = false
			    this.getOrderDetail()
			    return true
			})
		},
		//修改价格
		changePrice(){
			if(!(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(this.changeObj.price)) || this.changeObj.price==0) return ElMessage.warning('价格必须大于0(若有小数最多保留2位)')
			customToast('该操作将直接修改订单价格?',async ()=>{
			    await _axios('get',`/sys/order/updateOrderAmount?orderNumber=${this.item.orderNumber}&amount=${this.changeObj.price}`,{},true)
			    ElMessage.success('价格已修改！')
			    this.showCondition = false
			    this.getOrderDetail()
			    return true
			})
		},
		//租赁订单确认
		async leaseConfirm(){
			if(!(/^[0-9]+(\.?[0-9]{0,2})$/g.test(this.changeObj.deposit))) return ElMessage.warning('押金不能小于0(若有小数最多保留2位)')
			if(!(/^[0-9]+(\.?[0-9]{0,2})$/g.test(this.changeObj.freight))) return ElMessage.warning('运费不能小于0(若有小数最多保留2位)')
			await _axios('get',`/sys/order/confirmOrderInfo?orderNumber=${this.item.orderNumber}&deposit=${this.changeObj.deposit || 0}&freight=${this.changeObj.freight || 0}`,{},true)
			this.showCondition = false
			ElMessage.success("订单已确认！")
			this.getOrderDetail()
		},
		// 购买订单确认
		async buyConfirm(){
			if(!(/^[0-9]+(\.?[0-9]{0,2})$/g.test(this.changeObj.freight))) return ElMessage.warning("运费不能小于0(若有小数最多保留2位)");
			await _axios('get',`/sys/order/confirmOrderInfo?orderNumber=${this.item.orderNumber}&freight=${this.changeObj.freight || 0}`,{},true)
			this.showCondition = false
			ElMessage.success("订单已确认！")
			this.getOrderDetail()
		},
		//发货
		async sendGoods(){
			if(!this.deliverGoodsObj.driver) return ElMessage.warning('请输入司机姓名！')
			if(!checkMobile(this.deliverGoodsObj.contactNumber)) return ElMessage.warning('请输入正确的手机号码！')
			if(!this.deliverGoodsObj.carNumber) return ElMessage.warning('请输入车牌号！')
			this.deliverGoodsObj.orderNumber = this.item.orderNumber
			await _axios('post',`/sys/logisticsInfo/submit`,this.deliverGoodsObj,true)
			this.showCondition = false
			ElMessage.success("订单已发货！")
			this.getOrderDetail()
		},
		//订单拒绝
		async closeOrder(){
			if(!changeObj.closeType) return showToast('请选择拒绝理由！')
			// await httpRequest('get',`/middleGround/order/confirmOrderInfo`,{
			// 	orderNumber:orderNumber.value,
			// 	deposit:changeObj.deposit || 0,
			// 	freight:changeObj.freight || 0
			// },true)
			showCondition.value = false
			showToast('订单已确认！')
			backRefresh(0)
		},
		async getOrderDetail() {
			const res = await _axios('get', `/sys/order/orderInfo?orderNumber=${this.item.orderNumber}`, {}, true);
			this.orderDetail = res;
		}
	}
};
</script>

<style lang="scss" scoped>
	.order-handle{
		border: 1px solid #ededed;
		border-bottom: 0;
		height: 44px;
		@include flex-style(row,nowrap,space-between,center);
		padding: 0 20px;
		box-sizing: border-box;
	}
	.input-box{
		position: absolute;
		z-index: 99;
		top: 100px;
		left: calc(50% - 210px);
		right: 100px;
		width: 420px;
		background-color: #fff;
		@include flex-style(column,nowrap,center,center);
		box-shadow: 1px 1px 1px 1px rgba(0,0,0,.2);
		border-radius: 4px;
		box-sizing: border-box;
		padding: 0 22px;
		.input-container{
			background: #FFFFFF;
			border-radius: 20px;
			min-height: 200px;
			width: 100%;
			padding: 24px 15px;
			box-sizing: border-box;
			.search-title{
				@include flex-style(row,nowrap,flex-start,center);
				margin-bottom: 35px;
				image{
					width: 24px;
					height: 24px;
				}
				span{
					font-weight: 700;
					font-size: 18px;
					color: #041324;
					margin-left: 6px;
				}
			}
			.input-text{
				text-align: left;
				height: 44px;
				line-height: 44px;
				font-weight: 400;
				font-size: 15px;
				color: rgba(4, 19, 36, 0.8);
				padding: 0 23px;
				margin-bottom: 25px;
			}
			.input-textarea{
				background: rgba(103, 143, 231, 0.1);
				border-radius: 20px;
				padding: 13px 23px;
				font-weight: 400;
				height: 120px;
				font-size: 15px;
				color: rgba(4, 19, 36, 0.8);
				margin-bottom: 25px;
				box-sizing: border-box;
			}
			.confirm-btn{
				height: 33px;
				line-height: 33px;
				background: #6D9FF6;
				border-radius: 8px;
				font-weight: 500;
				font-size: 14px;
				color: #FFFFFF;
				&:after{
					height: 0;
					border: 0;
				}
			}
		}
	}
	.status-bar {
		border-top: 1px solid #ededed;
		padding-top: 15px;
	}
	.current-box{
		border: 1px solid #ededed;
		margin-top: 15px;
		.current-status {
			height: 100px;
			box-sizing: border-box;
			.aside-box {
				border-right: 1px solid #ededed;
				height: 100px;
				box-sizing: border-box;
				background: #fff;
				padding: 0 20px;
				@include flex-style(row,wrap,flex-start,center);
			}
			.main-box {
				height: 100px;
				box-sizing: border-box;
				.main-line-step{
					@include flex-style(row,nowrap,flex-start,center);
					.number{
						border: 1px solid #204274;
						width: 20px;
						height: 20px;
						border-radius: 50%;
						text-align: center;
						color: #204274;
						&.active{
							color: royalblue;
							border-color: royalblue;
						}
					}
					.line{
						width: 20%;
						border-bottom: 1px solid #204274;
						&.active{
							border-color: royalblue;
						}
					}
					h4{
						width: calc(20% + 22px);
						&.active{
							color: royalblue;
						}
					}
				}
			}
		}
		.order-remark{
			min-height: 30px;
			padding: 2px 20px;
		}
	}
	.user-info{
		border: 1px solid #ededed;
		margin-top: 30px;
		.info-header{
			background: #f4f4f4;
			border-bottom: 1px solid #ededed;
			height: 42px !important;
			line-height: 42px;
			.item-center{
				text-align: center;
			}
		}
		.info-main{
			.info-label{
				min-width: 70px;
				display: inline-block;
				text-align: right;
			}
			.info-item{
				border-bottom: 1px solid #ededed;
				padding: 10px 0;
				&:last-child{
					border-bottom: 0;
				}
				.item-center{
					width: 100%;
					height: 100px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.product-img{
					@include flex-style(row,nowrap,flex-start,flex-start);
					>span{
						flex: 1;
						padding: 10px;
					}
				}
			}
		}
	}
	
	
</style>
