<template>
    <div class="transfer-box">
        <div class="data-box leftb">
            <div class="top-bar">当前绑定权限</div>
            <RightLeftVue
                :list="bindRightList"
                @unBound="getUnboundBtnStyle"
                @checkedVal="getUnBoundSelectVal"
            ></RightLeftVue>
        </div>
        <div class="centerh">
            <el-button type="primary" :disabled="isDisabled.left" @click="distributeRight">
                <el-icon>
                    <arrow-left />
                </el-icon>绑定
            </el-button>
            <el-button type="primary" :disabled="isDisabled.right" @click="distributeRight">
                解绑
                <el-icon>
                    <arrow-right />
                </el-icon>
            </el-button>
        </div>
        <div class="data-box rightb">
            <div class="top-bar">所有权限</div>
            <RightRightVue
                :list="allRightList"
                @bound="getBoundBtnStyle"
                @checkedVal="getBoundSelectVal"
            ></RightRightVue>
        </div>
    </div>
</template>
<script>
export default {
    name: "Right"
}
</script>
<script setup>
    import { ref,reactive,onBeforeMount,watch } from 'vue';
    import RightLeftVue from '../components/rightLeft.vue';
    import RightRightVue from '../components/rightRight.vue';
    import { menuList } from '@/common/test.js'
    import { siblings } from '@/utils/tools.js'
    import _axios from '../plugins/axios';
    // import {ElMessage} from "element-plus"
    import showToast from "../common/showToast.js"
    import emitter from "@/plugins/mitt";

    const props = defineProps({
        row: Object
    })

    const isDisabled = reactive({
        left:true,
        right:true
    })
    const bindRightList = ref([])
    const allRightList = ref([])
    const currentBindRightIdArr = ref([])
    const selectIds = ref([])

	watch(()=>props.row,val=>{
		getCurrentBindRight()
	})

    //获取解绑按钮是否可点的状态
    const getUnboundBtnStyle = (e)=>{
        isDisabled.right = e
    }
   //获取绑定按钮是否可点的状态
    const getBoundBtnStyle = (e)=>{
        isDisabled.left = e
    }
   //获取当前绑定权限所选值
    const getUnBoundSelectVal = (e)=>{
        console.log(e)
        getCheckedId(e, 'unbind')
    }
   //获取所有权限绑定所选值
    const getBoundSelectVal = (e)=>{
        console.log(e)
        getCheckedId(e, 'bind')
    }

    // 绑定权限
    const bindRight = ()=>{
        distributeRight(result)
    }
    // 权限解绑
    const unBindRight = ()=>{
        distributeRight(result)
    }

    const getCheckedId = (list, type) => {
        let addRight = []
        list.map((v) => {
            if(v.isChecked){
                addRight.push(v.id)
            }
            if(v.children){
                v.children.map(sub=>{
                    if(sub.isChecked){
                        addRight.push(sub.id)
                    }
                    if(sub.children){
                        sub.children.map(third=>{
                            if(third.isChecked){
                                addRight.push(third.id)
                            }
                        })
                    }
                })
            }
        })
        if (type == 'bind') {
            addRight = addRight.concat(currentBindRightIdArr.value)
            selectIds.value = [...new Set(addRight)]
        } else {
            selectIds.value = array_diff(currentBindRightIdArr.value,addRight)
        }
    }

    getCurrentBindRight()
    getAllRight()

    // 绑定权限
    async function distributeRight(){
        const params ={
            id:props.row.id,
            permissionIds:selectIds.value
        }
        const res = await _axios('POST', '/sys/sysRole/permissions', params, true);
        showToast.success("权限分配成功！")
        emitter.emit('refreshMenuList')
        getCurrentBindRight()
    }
    // 获取当前绑定的权限
    async function getCurrentBindRight() {
        const res = await _axios('GET', `/sys/sysRole/findPermissionsByRoleId?id=${props.row.id}`, {}, true)
        bindRightList.value = res || []
        bindRightList.value.map(first => {
            currentBindRightIdArr.value.push(first.id)
            if (first.children) {
                first.children.map(sub => {
                    currentBindRightIdArr.value.push(sub.id)
                    if (sub.children) {
                        sub.children.map(third => {
                            currentBindRightIdArr.value.push(third.id)
                        });
                    }
                });
            }
        });
    }
    // 获取所有权限
    async function getAllRight() {
        const res = await _axios('GET', `/sys/sysPermission/list`, {}, true)
        allRightList.value = res
    }

    //数组去重
    function array_diff(a, b) {
        for (var i = 0; i < b.length; i++) {
            for (var j = 0; j < a.length; j++) {
                if (a[j] == b[i]) {
                    a.splice(j, 1);
                    j = j - 1;
                }
            }
        }
        return a;
    }
</script>
<style lang="scss" scoped>
    .transfer-box{
        width: 880px;
        margin: 0 auto 60px !important;
        @include flex-style(row, nowrap, space-between, center);
        .data-box {
            border: 1px solid #ebeef5;
            width: 320px;
            height: 520px;
            background: #fff;
            @include flex-style(column,nowrap,space-between,center);
            .top-bar{
                width: 100%;
                background: #f5f7fa;
                height: 40px;
                border-bottom: 1px solid #ebeef5;
                font-size: 16px;
                text-align: center;
                line-height: 40px;
                font-weight: bold;
                color: #444;
            }
        }
    }

    @keyframes accordion {
        0% {
            height: 0;
            overflow: hidden;
        }
        100% {
            height: auto;
            overflow: auto;
        }
    }
    @keyframes accordion2 {
        0% {
            height: auto;
            overflow: auto;
        }
        100% {
            height: 0;
            overflow: hidden;
        }
    }
</style>