<template>
	<div style="height: 100%;overflow: auto;margin-bottom:60px">
		<el-form ref="form" :model="detail" label-width="80px">
			<el-row>
				<el-col :span="18" v-if="detail.type == 2">
					<el-form-item label-width="120px" label="支付宝账号"><el-input disabled v-model="detail.alipayAccount"></el-input></el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 2 || detail.type == 3">
					<el-form-item label-width="120px" label="支付宝收款人"><el-input disabled v-model="detail.alipayName"></el-input></el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 3">
					<el-form-item label-width="120px" label="支付宝二维码">
						<el-image style="width: 100px; height: 100px" z-index="60000" :src="detail.alipayCode" :preview-src-list="[detail.alipayCode]"></el-image>
					</el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 2 || detail.type == 3">
					<el-form-item label-width="120px" label="备注"><el-input disabled v-model="detail.note"></el-input></el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="18" v-if="detail.type == 1">
					<el-form-item label-width="120px" label="微信二维码">
						<el-image style="width: 100px; height: 100px" z-index="60000" :src="detail.wxCode" :preview-src-list="[detail.wxCode]"></el-image>
					</el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 1">
					<el-form-item label-width="120px" label="备注"><el-input disabled v-model="detail.note"></el-input></el-form-item>
				</el-col>
			</el-row>
			<el-row>
				<el-col :span="18" v-if="detail.type == 4">
					<el-form-item label-width="150px" label="银行开户行"><el-input disabled v-model="detail.bankName"></el-input></el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 4">
					<el-form-item label-width="150px" label="银行账号"><el-input disabled v-model="detail.bankNumber"></el-input></el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 4">
					<el-form-item label-width="150px" label="银行收款人真实姓名"><el-input disabled v-model="detail.bankUserName"></el-input></el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 4">
					<el-form-item label-width="150px" label="银行收款人联系电话"><el-input disabled v-model="detail.bankUserPhone"></el-input></el-form-item>
				</el-col>
				<el-col :span="18" v-if="detail.type == 4">
					<el-form-item label-width="150px" label="备注"><el-input disabled v-model="detail.note"></el-input></el-form-item>
				</el-col>
			</el-row>
		</el-form>
	</div>
	<bottom-handle v-if="item.status==1" ltitle="拒绝" rtitle="通过" @close="refuse" @confirm="agree"></bottom-handle>
	<h4 v-if="item.status==2" style="font-size:16px;font-weight:bold;color:#666;text-align: right;">审核已通过</h4>
	<h4 v-if="item.status==3" style="font-size:16px;font-weight:bold;color:#e2b15d;text-align: right;">审核已拒绝</h4>
</template>

<script>
	import {ElMessage} from 'element-plus'
	import _axios from '@/plugins/axios';
	import BottomHandle from '../bottomHandle.vue';
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				detail: {}
			};
		},
		created() {
			this.getDetail();
		},
		watch:{
			item(newValue, oldValue) {
			    this.getDetail();
			}
		},
		methods: {
			async refuse(){
				const res = await _axios('POST',`/sys/withdrawal/examine`,{
					withdrawalId:this.item.withdrawalId,
					userId:this.item.userId,
					status:3
				}, true)
				if(res.code=='30001'){
					return ElMessage.warning(res.msg);
				}
				ElMessage.warning('已拒绝！');
				this.$emit('confirm')
			},
			async agree(){
				const res = await _axios('POST',`/sys/withdrawal/examine`,{
					withdrawalId:this.item.withdrawalId,
					userId:this.item.userId,
					status:2
				}, true)
				if (res.code == '30001') {
					return ElMessage.warning(res.msg);
				}
				ElMessage.success('已审核通过！');
				this.$emit('confirm')
			},
			async getDetail() {
				const res = await _axios('POST', `/sys/collectionAccountNumber/details`, { accountId: this.item.collectionId }, true);
				this.detail = res;
			}
		}
	};
</script>

<style scoped>
	
</style>
