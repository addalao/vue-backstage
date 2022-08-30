<template>
    <div class="index-box">
        <div class="left">
            <div class="top-count">
                <div class="today-success" @click="cutPayment(1)">
                    <h4>今日扣款成功总额:</h4>
                    <h5>
                        <span>￥</span>
                        <span>{{countObj.successMoney}}</span>
                    </h5>
                </div>
                <div class="today-fail" @click="cutPayment(0)">
                    <h4>今日扣款失败总额:</h4>
                    <h5>
                        <span>￥</span>
                        <span>{{countObj.failMoney}}</span>
                    </h5>
                </div>
            </div>
            <div class="notice-box">
                <div class="notice-title">
                    <h4>待处理任务</h4>
                </div>
                <div class="wait-list">
                    <div class="wait-item" v-for="(item, index) in waitHandleItemArr" :key="index"
                        @click="handleOrder(item, index)" :style="{ 'background-color': item.bgColor }">
                        <img :src="item.url" />
                        <span class="title">{{ item.title }}</span>
                        <span class="num" :style="{ 'background-color': item.color }">{{ orderMumberObj[item.prop] }}</span>
                    </div>
                </div>
            </div>
            <div class="refresh-box">
                <el-button type="primary" :icon="Loading" @click="refreshData">刷新</el-button>
            </div>
        </div>
        <div class="right">
            <div class="notice-title">
                <h4>通知列表</h4>
                <h5>{{countObj.noticeNum}}</h5>
            </div>
            <template v-if="noticeList.length>0">
                <div class="notice-list">
                    <div class="notice-item" v-for="(item, index) in noticeList" :key="index" @click="toDetail(item)">
                        <img src="../assets/Envelope.png">
                        <div class="left">
                            <span>{{ item.note }}</span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <img v-if="item.type==1" src="../assets/botice-iconR.png" />
                    </div>
                </div>
                <!-- 分页 -->
                <Pagination :total="pageParams.dataTotal" :currentPage="pageParams.page" :pageSize="pageParams.pageSize" @sizeChange="sizeChange"
                    @currentChange="currentChange"></Pagination>
            </template>
            <div v-else class="notice-list">
                <h5>暂时没有通知哦！</h5>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, reactive, watch } from 'vue'
import { useStore } from "vuex";
import { useRoute, useRouter } from 'vue-router';
import _axios from "../plugins/axios"
import {Loading} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const pageParams = reactive({//页面相关参数配置
    pageSize: 9,//条数
    page: 1,//页码
    show: false,//表单的显隐控制
    dataTotal: 0,//总数
})
const noticeList = ref([])

const orderMumberObj = reactive({
    zuConfirm: 0,
    buyConfirm: 0,
    buyOutConfirm: 0,
    jiesuanConfirm: 0,
    hetong: 0,
    sendConfirm: 0
})
const countObj = reactive({
    noticeNum:0,
    successMoney:0,
    failMoney:0
})

const waitHandleItemArr = [
    { prop: 'zuConfirm', title: '租赁待确认', url: new URL('../assets/wait-handle-icon1.png', import.meta.url).href, color: '#F5B544', bgColor: "rgba(245, 181, 68, 0.1)", orderType: 1, status: 1, index: 0, number: '' },
    { prop: 'buyConfirm', title: '购买待确认', url: new URL('../assets/wait-handle-icon2.png', import.meta.url).href, color: '#4B9F47', bgColor: "rgba(75, 159, 71, 0.1)", orderType: 2, status: 1, index: 1, number: 1 },
    { prop: 'buyOutConfirm', title: '买断确认', url: new URL('../assets/wait-handle-icon3.png', import.meta.url).href, color: '#EA8777', bgColor: "rgba(234, 135, 119, 0.1)", orderType: 1, status: 5, index: 2, number: 1 },
    { prop: 'jiesuanConfirm', title: '结算确认', url: new URL('../assets/wait-handle-icon4.png', import.meta.url).href, color: '#6D9FF6', bgColor: "rgba(109, 159, 246, 0.1)", orderType: 1, status: 6, index: 3, number: 1 },
    { prop: 'hetong', title: '电子合同', url: new URL('../assets/wait-handle-icon5.png', import.meta.url).href, color: '#3DC9B8', bgColor: "rgba(61, 201, 184, 0.1)", orderType: 1, status: 2, index: 4, number: 1 },
    // {title:'结算清单',url:'../assets/wait-handle-icon6.png',color:'rgba(9, 27, 61, 0.6)',bgColor:"rgba(9, 27, 61, 0.05)",orderType:1,status:6,index:5,number:1},
    { prop: 'sendConfirm', title: '发货确认', url: new URL('../assets/wait-handle-icon7.png', import.meta.url).href, color: '#DA7BC5', bgColor: "rgba(218, 123, 197, 0.1)", orderType: 3, status: 3, index: 5, number: 1 },//两种订单一起
]

//扣款
const cutPayment = (type)=>{
    router.push({path:'/index/payment',query:{type:type}})
}


//订单处理
const handleOrder = (item, index) => {
    router.push({path:'/index/order',query:{orderType:item.orderType,status:item.status,title:item.title}})
}

//通知详情
const toDetail = (item) => {
    if (item.type == 1) {
        let title
        if (item.orderType == 1 && item.orderStatus == 1) {
            title = '租赁待确认'
        }
        if (item.orderType == 2 && item.orderStatus == 1) {
            title = '购买待确认'
        }
        if (item.orderType == 1 && item.orderStatus == 5) {
            title = '买断确认'
        }
        if (item.orderType == 1 && item.orderStatus == 6) {
            title = '结算确认'
        }
        if (item.orderType == 1 && item.orderStatus == 2) {
            title = '电子合同'
        }
        if (item.orderType == 3 && item.orderStatus == 3) {
            title = '发货确认'
        }
        router.push({path:'/index/order',query:{orderType:item.orderType,status:item.orderStatus,title:title}})
    }
}

// 刷新
    const refreshData = ()=>{
        pageParams.page = 1
        getReduceList()
        getReduceNumber()
        refreshNumber()
    }

    // 分页
    const sizeChange = (e)=>{
        pageParams.pageSize = e
        getReduceList()
    }
    const currentChange = (e)=>{
        pageParams.page = e
        getReduceList()
    }
    //获取扣款通知列表
	getReduceList()
	async function getReduceList(){
		const res = await _axios('post','/sys/tidings/page',{
			pageNum:pageParams.page,
			pageSize:pageParams.pageSize,
		},true)
		const {records,total} = res
        pageParams.dataTotal = parseInt(total)
		noticeList.value = records
		countObj.noticeNum = total
	}

	//获取扣款金额
	getReduceNumber()
	async function getReduceNumber(){
		const res = await _axios('get','/sys/reductionRecord/count',{},true)
		if(res){
			const {success,fail} = res
			countObj.successMoney = success
			countObj.failMoney = fail
		}
	}
	
	//获取订单数量
    refreshNumber()
	function refreshNumber(){
		getListMumber(1,1,'zuConfirm')
		getListMumber(1,2,'buyConfirm')
		getListMumber(5,1,'buyOutConfirm')
		getListMumber(6,1,'jiesuanConfirm')
		getListMumber(2,1,'hetong')
		getListMumber(3,3,'sendConfirm')
	}
	async function getListMumber(status,orderType,prop){
		let params = {}
		if(orderType){
			params.orderType = orderType
		}
		if(status==5){
			params.buyOutStatus = 1
		}
		const res = await _axios("post","/sys/order/page",{
			pageNum: 0,
			pageSize:0,
			status:status,
			...params
		},true)
		const {total} = res
		orderMumberObj[prop] = total
	}

</script>
<style lang="scss" scoped>
.index-box {
    width: 100%;
    height: calc(100vh - 114px);
    border: 1px solid #ebeef5;
    background: #fff;
    @include flex-style(row, nowrap, space-between, center);
    box-sizing: border-box;

    .notice-title {
        @include flex-style(row, nowrap, flex-start, center);
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 20px;

        h4 {
            font-weight: 700;
            font-size: 20px;
            color: #041324;
        }

        h5 {
            height: 24px;
            box-sizing: border-box;
            padding: 0 10px;
            line-height: 24px;
            font-weight: 500;
            font-size: 18px;
            color: #FFFFFF;
            background: #EA8777;
            border-radius: 5px;
            margin-left: 60px;
        }
    }

    .left {
        width: 48%;
        height: 100%;
        box-sizing: border-box;
        padding: 40px 20px;

        .top-count {
            @include flex-style(row, nowrap, space-between, center);

            div {
                width: 48%;
                height: 100px;
                border-radius: 20px;
                text-align: center;
                box-sizing: border-box;
                padding-top: 20px;
                cursor: pointer;
                h4 {
                    font-weight: 500;
                    font-size: 16px;
                    color: #FFFFFF;
                }

                h5 {
                    font-weight: 700;
                    font-size: 24px;
                    color: #FFFFFF;
                    margin-top: 10px;
                }

                &.today-success {
                    background: #3FC9B8;
                }

                &.today-fail {
                    background: #F19393;
                }
            }
        }

        .notice-box {
            // border: 1px solid #ebeef5;
            padding: 20px;
            margin-top: 40px;

            .wait-list {
                margin-top: 23px;
                @include flex-style(row, wrap, space-between, center);

                .wait-item {
                    width: 46%;
                    box-shadow: 1px 3px 4px rgba(4, 19, 36, 0.05);
                    border-radius: 5px;
                    @include flex-style(row, wrap, space-between, center);
                    box-sizing: border-box;
                    padding: 13px 10px;
                    margin-bottom: 35px;
                    cursor: pointer;

                    image {
                        width: 24px;
                        height: 24px;
                    }

                    .title {
                        font-weight: 500;
                        font-size: 16px;
                        color: rgba(9, 27, 61, 0.8);
                    }

                    .num {
                        border-radius: 5px;
                        text-align: center;
                        padding: 2px;
                        min-width: 23px;
                        box-sizing: border-box;
                        font-weight: 500;
                        font-size: 14px;
                        color: #FFFFFF;
                    }
                }
            }
        }
        .refresh-box{
            text-align: center;
            padding: 40px 20px 0;
            button{
                height: 70px;
                width: 100%;
                font-size: 24px;
            }
        }
    }

    .right {
        width: 48%;
        height: 100%;
        box-sizing: border-box;
        padding: 40px 20px;
        .notice-list {
            margin-top: 20px;
            margin-bottom: 20px;
            height: calc(100% - 106px);
            overflow: auto;
            box-sizing: border-box;
            padding-right: 20px;
            @include scroll-bar-style(2px, 2px, #F2F2F2, #2DCCCE);

            >h5 {
                font-size: 16px;
                color: #666;
                text-align: center;
            }

            .notice-item {
                @include flex-style(row, nowrap, flex-start, center);
                background: #FFFFFF;
                box-shadow: 0px 4px 4px rgba(9, 27, 61, 0.1);
                border-radius: 20px;
                box-sizing: border-box;
                height: 48px;
                padding: 0 20px;
                margin: 20px 0;
                cursor: pointer;
                img{
                    width: 24px;
                    height: 24px;
                }
                div {
                    flex: 1;
                    margin-left: 20px;
                    @include flex-style(column, nowrap, center, flex-start);
                    span {
                        &:first-child {
                            font-size: 16px;
                            color: #666;
                        }

                        &:last-child {
                            font-size: 14px;
                            color: #999;
                        }
                    }
                }
            }
        }
    }
}
</style>