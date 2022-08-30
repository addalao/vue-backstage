<template>
    <HeaderTitle :title="navBarTxt.firstMenuItem.value.name" :content="navBarTxt.subMenuItem.value.name"></HeaderTitle>
    <MainBody>
        <el-row :gutter="15">
            <el-col v-for="(item,index) in menuList" :md="6" :sm="8" :xs="12" :key="index">
                <el-card shadow="hover" :key="index" style="margin-top:8px;margin-bottom:8px;">
                    <template #header>
                        <div class="card-header">
                            <span>{{item.name}}</span>
                            <el-icon class="menu-icon">
                                <component :is="item.icon"></component>
                            </el-icon>
                        </div>
                    </template>
                    <div class="handle-area">
                        <el-button size="small" type="primary" plain round @click="editMenu(item,index,1)">编辑</el-button>
                        <el-popconfirm 
                            confirm-button-text="OK"
                            cancel-button-text="No"
                            icon-color="red"
                            title="确定删除该菜单?"
                            @confirm="delMenu(item,index,'first')"
                        >
                            <template #reference>
                                <el-button size="small" type="danger" plain round>删除</el-button>
                            </template>
                        </el-popconfirm>
                        <el-button size="small" type="info" plain round @click="showSubList(item,index)">子菜单</el-button>
                    </div>
                </el-card>
            </el-col>
            <el-col :md="6" :sm="8" :xs="12">
                <el-card shadow="hover" style="margin-top:8px;margin-bottom:8px" @click="createMenu(1)">
                    <template #header>
                        <div class="card-header">
                            <span>创建主菜单</span>
                            <el-icon class="menu-icon"><circle-plus /></el-icon>
                        </div>
                    </template>
                    <div class="handle-area">
                        <el-button size="small" type="primary" round>新建</el-button>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </MainBody>
    <el-drawer :size="600" v-model="drawer" direction="rtl" @close="closeRightDrawer">
        <template #header>
            <h4 style="color:#444">{{drawerInfo.name}}</h4>
        </template>
        <template #default>
            <div>
                <el-collapse v-model="activeName" accordion>
                    <el-collapse-item v-for="(item,index) in subMenuList" :name="index" :key="index">
                        <template #title>
                            <el-icon class="col-icon edit" @click.stop="editMenu(item,index,2)"><EditPen /></el-icon>
                            <el-popconfirm 
                                confirm-button-text="OK"
                                cancel-button-text="No"
                                icon-color="red"
                                title="确定删除该菜单?"
                                @confirm="delMenu(item,index,'second')"
                            >
                                <template #reference>
                                    <el-icon class="col-icon delete" @click.stop=""><delete /></el-icon>
                                </template>
                            </el-popconfirm>
                            <span class="collapse-title">{{item.name}}</span>
                        </template>
                        <div class="handlebtn-box">
                            <el-button size="small" v-for="(bitem,bindex) in item.children" :key="bindex" @click="editBtn(bitem,bindex)"
								:type="JSON.parse(bitem.icon).type"
								:icon="JSON.parse(bitem.icon)['icon'] || ''" 
								:circle="JSON.parse(bitem.icon)['circle'] || false" 
								:round="JSON.parse(bitem.icon)['round'] || false" 
								:plain="JSON.parse(bitem.icon)['plain'] || false"
							>
                                {{JSON.parse(bitem.icon)['circle'] ? '':bitem.name}}
                                <el-popconfirm 
                                    confirm-button-text="OK"
                                    cancel-button-text="No"
                                    icon-color="red"
                                    title="确定删除该按钮?"
                                    @confirm="delBtn(bitem,bindex)"
                                >
                                    <template #reference>
                                        <!-- <el-icon class="col-icon delete" @click.stop="delBtn(bitem,bindex)"><delete /></el-icon> -->
                                        <el-icon class="col-icon delete" @click.stop=""><delete /></el-icon>
                                    </template>
                                </el-popconfirm>
                            </el-button>
                            <el-button style="margin-right:0" size="small" type="primary" :icon="Plus" plain @click="createBtn(item,index)">新增</el-button>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <div class="add-sub-menu">
                    <el-button type="primary" @click="createMenu(2)">
                        新增菜单<el-icon><circle-plus /></el-icon>
                    </el-button>
                </div>
            </div>
            <!-- 按钮表单 -->
            <div class="custom-dialog" v-if="showBtnDialog" @click="closeBtnForm(btnFormRef)">
                <div class="btn-form" @click.stop="">
                    <el-form
                        label-width="100px"
                        ref="btnFormRef"
                        :model="btnFormProp"
                        :rules="btnRules"
                    >
                        <el-form-item class="menu-form-item" label="名称" prop="name">
                            <el-select v-model="btnFormProp.name" filterable allow-create placeholder="请选择或输入按钮名称">
                                <el-option
                                    v-for="(item,index) in btnNameOption"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="menu-form-item" label="样式" prop="icon">
                            <el-input v-model="btnFormProp.icon" placeholder="请选择按钮样式" readonly @click="showBtnStyle = true"></el-input>
                        </el-form-item>
                        <el-form-item class="menu-form-item" label="事件" prop="uri">
                            <el-select v-model="btnFormProp.uri" filterable allow-create placeholder="请选择或输入按钮事件">
                                <el-option
                                    v-for="(item,index) in btnEventOption"
                                    :key="index"
                                    :label="item"
                                    :value="item"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="menu-form-item" label="位置" prop="code">
                            <el-select v-model="btnFormProp.code" placeholder="请选择按钮位置">
                                <el-option
                                    v-for="item in btnPositionOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="menu-form-item" label="排序" prop="sort">
                            <el-input-number v-model="btnFormProp.sort" :min="0" placeholder="请输入排序"/>
                        </el-form-item>
                        <el-form-item class="menu-form-item" label="启用状态" prop="status">
                            <el-select v-model="btnFormProp.status" placeholder="请设置启用状态">
                                <el-option
                                    v-for="item in statusOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="menu-form-item" label="权限类型" prop="type">
                            <el-select disabled v-model="btnFormProp.type" placeholder="请设置权限类型">
                                <el-option
                                    v-for="item in rightOption"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <div class="btn-forn-handle">
                        <el-button @click="closeBtnForm(btnFormRef)">取消</el-button>
                        <el-button type="primary" @click="confirmBtnForm(btnFormRef)">确定</el-button>
                    </div>
                </div>
                <div class="btn-style-box" @click.stop="" v-if="showBtnStyle">
                    <Btns @select="selectBtnStyle"></Btns>
                </div>
            </div>
        </template>
    </el-drawer>
    <!-- 菜单表单 -->
    <el-dialog
        v-model="menuDialogVisible"
        :title="formTitle"
        width="30%"
    >
        <el-form
            label-width="120px"
            ref="menuFormRef"
            :model="formProp"
            :rules="rules"
        >
            <el-form-item class="menu-form-item" label="名称" prop="name">
                <el-input v-model="formProp.name" placeholder="请输入菜单名称" clearable></el-input>
            </el-form-item>
            <el-form-item class="menu-form-item" label="图标" prop="icon">
                <el-input v-model="formProp.icon" placeholder="请选择图标" readonly @click="showIcon = true"></el-input>
            </el-form-item>
            <el-form-item class="menu-form-item" label="路由" prop="uri">
                <el-input v-model="formProp.uri" placeholder="请输入菜单绑定路由" clearable></el-input>
            </el-form-item>
            <el-form-item class="menu-form-item" label="排序" prop="sort">
                <el-input-number v-model="formProp.sort" :min="0" placeholder="请输入排序"/>
            </el-form-item>
            <el-form-item class="menu-form-item" label="启用状态" prop="status">
                <el-select v-model="formProp.status" placeholder="请设置启用状态">
                    <el-option
                        v-for="item in statusOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="menu-form-item" label="权限类型" prop="type">
                <el-select disabled v-model="formProp.type" placeholder="请设置权限类型">
                    <el-option
                        v-for="item in rightOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeMenuForm(menuFormRef)">取消</el-button>
                <el-button type="primary" @click="confirmForm(menuFormRef)">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 菜单图标选择抽屉 -->
    <el-drawer
        v-model="showIcon"
        title=""
        direction="btt"
    >
        <Icons @chose="getSelectIcon"></Icons>
    </el-drawer>
</template>

<script setup>
    // import {menuList} from '@/common/test.js'
    // import {ElMessage} from "element-plus"
    import _axios from '@/plugins/axios'
    import Icons from '@/components/icons.vue'
    import Btns from '@/components/btns.vue'
    import {Plus} from '@element-plus/icons-vue'
    import CurrentNavBar from '@/common/currentNavBar.js'
    import {rules,btnRules,statusOption,rightOption,btnNameOption,btnPositionOption,btnEventOption} from "@/common/menu.js"
    import { useRouter } from "vue-router";
    import { useStore } from "vuex";
    import { ref,reactive } from 'vue';
    import emitter from "@/plugins/mitt";
    import showToast from "../../common/showToast"

    const router = useRouter()
    const store = useStore()

    const navBarTxt = CurrentNavBar(store)
    const menuList = ref([])
    const subMenuList = ref([])
    const drawer = ref(false)
    const showBtnDialog = ref(false)
    const showIcon = ref(false)
    const showBtnStyle = ref(false)
    const menuDialogVisible = ref(false)//菜单dialog控制
    const drawerInfo = ref({})
    const activeName = ref(0)
    const formTitle = ref('新建菜单')
    const formProp = ref({
        code:1,
        name: '',
        icon: '',
        uri: '',
        sort: 0,
        type: 1,
        pid:'0',
        permission: 1,
        status: 1
    })
    const btnFormProp = ref({
        name: '',
        icon: '',
        uri: '',
        pid: '0',
        sort: 0,
        type: 2,
        status: 1,
        permission: 1
    })
    const controFormObj = reactive({
        createType:1//1主菜单新建  2二级菜单新建
    })
    const menuFormRef = ref()
    const btnFormRef = ref()

    //新建菜单
    const createMenu = (type)=>{ //type 1主菜单新建  2二级菜单新建
        controFormObj.createType = type
        formProp.value = {
            sort: 0,
            type: 1,
            status: 1,
            permission: 1,
            pid:0
        }
        menuDialogVisible.value = true
        formTitle.value = '新建菜单'
        if(type==2){
            formProp.value.pid = drawerInfo.value.id
        }
    }

    //编辑菜单
    const editMenu = (item,index,type)=>{
        controFormObj.createType = type
        formProp.value = item
        menuDialogVisible.value = true
        formTitle.value = item.name + '-编辑'
    }

    //删除菜单
    const delMenu = async (item,index,type)=>{ 
        await _axios("post",`/sys/sysPermission/delete?id=${item.id}`,{},true)
        showToast.success("删除成功");
        if(type=='first'){
            getSystemMenuList()
        }else{
            getSystemMenuListById(drawerInfo.value.id)
        }
        emitter.emit('refreshMenuList')
    }

    //新建按钮
    const createBtn = (item,index)=>{
        btnFormProp.value = {
            sort: 0,
            type: 2,
            status: 1,
            permission: 2
        }
        btnFormProp.value.pid = item.id
        showBtnDialog.value = true
    }

    //编辑按钮
    const editBtn = (item,index)=>{
        btnFormProp.value = item
        showBtnDialog.value = true
    }

    //删除按钮
    const delBtn = async (item,index)=>{
        await _axios("post",`/sys/sysPermission/delete?id=${item.id}`,{},true)
        showToast.success("删除成功");
        getSystemMenuListById(drawerInfo.value.id)
        emitter.emit('refreshMenuList')
    }

    // 展示侧滑二级菜单
    const showSubList = (item,index)=>{
        drawerInfo.value = item
        getSystemMenuListById(item.id,(res)=>{
            subMenuList.value = res
            drawer.value = true
        })
        
    }

    //获取选择的icon
    const getSelectIcon = (e)=>{
        formProp.value.icon = e
        showIcon.value = false
    }

    //获取选择的按钮样式
    const selectBtnStyle = (e)=>{
        btnFormProp.value.icon = JSON.stringify(e)
        showBtnStyle.value = false
    }

    //菜单表单提交事件
    const confirmForm = (menuFormRef)=>{
        menuFormRef.validate(async (valid) => {
            if (valid) {
                try {
                    await _axios('post',`/sys/sysPermission/savaOrupdate`,formProp.value,true)
                    showToast.success("保存成功");
                    menuDialogVisible.value = false
                    if(controFormObj.createType==1){
                        getSystemMenuList()
                    }else{
                        getSystemMenuListById(drawerInfo.value.id)
                    }
                    emitter.emit('refreshMenuList')
                } catch (error) {
                    showToast.success("保存出错");
                }
            } else {
                showToast.success("请检查并完善表单再提交！");
                return false
            }
        })
    }

    //按钮表单提交事件
    const confirmBtnForm = (btnFormRef)=>{
        btnFormRef.validate(async (valid) => {
            if (valid) {
                try {
                    await _axios('post',`/sys/sysPermission/savaOrupdate`,btnFormProp.value,true)
                    showToast.success("保存成功");
                    showBtnDialog.value = false
                    getSystemMenuListById(drawerInfo.value.id)
                    emitter.emit('refreshMenuList')
                } catch (error) {
                    showToast.success("保存出错");
                }
            } else {
                showToast.success("请检查并完善表单再提交！");
                return false
            }
        })
    }

    //菜单关闭事件
    const closeMenuForm = (menuFormRef)=>{
        menuDialogVisible.value = false
        // menuFormRef.resetFields()
		formProp.value = {
		    code:1,
		    name: '',
		    icon: '',
		    uri: '',
		    sort: 0,
		    type: 1,
		    pid:'0',
		    permission: 1,
		    status: 1
		}
    }

    //按钮关闭事件
    const closeBtnForm = (btnFormRef)=>{
        showBtnDialog.value = false
        showBtnStyle.value = false
        // btnFormRef.resetFields()
		btnFormProp.value = {
		    name: '',
		    icon: '',
		    uri: '',
		    pid: '0',
		    sort: 0,
		    type: 2,
		    status: 1,
		    permission: 1
		}
    }
    
    //又侧滑抽屉关闭
    const closeRightDrawer = ()=>{
        showBtnDialog.value = false
        showBtnStyle.value = false
    }

    // //侧滑抽屉确定事件
    // const confirmClick = ()=>{
        
    // }
     /*函数*/
    getSystemMenuList()

    //获取权限菜单
    async function getSystemMenuList() {
        const res = await _axios("get", `/sys/sysPermission/list`, {}, true)
        menuList.value = res
    } 
    //根据父id获取权限菜单
    async function getSystemMenuListById(id,callback) {
        const res = await _axios("get",`/sys/sysPermission/listByPid?pid=${id}`, {}, true)
        if(callback){
            callback(res)
        }else{
            subMenuList.value = res
        }
    } 
</script>
<style lang="scss" scoped>
    :deep(.el-card){
        .el-card__header{
            padding: 10px 30px;
        }
        .el-card__body{
            padding: 10px;
        }
    }
    .card-header{
        @include flex-style(row,nowrap,space-between,center);
        .menu-icon{
            font-size: 22px;
            color: #B3D8FF;
        }
        span{
            color: #666;
        }
    }
    .handle-area{
        text-align: center;
        button{
            &:nth-child(1){
                // color: ;
            }
            &:nth-child(2){}
            &:nth-child(3){}
        }
    }
    :deep(.el-drawer__body){
        position: relative;
    }
    .collapse-title{
        font-size: 15px;
        font-weight: bold;
        color: #666;
    }
    .col-icon{
        font-size: 16px;
        &.edit{
            color: #B3D8FF;
        }
        &.delete{
            color: #FBC4C4;
            margin-left: 10px;
            margin-right: 14px;
        }
    }
    .handlebtn-box{
        min-height: 40px;
        border: 1px solid #f4f4f4;
        padding: 10px 8px 5px;
        @include flex-style(row,wrap,flex-start,center);
        :deep(.el-button--small){
            height: 28px;
        }
        button{
            margin-bottom: 6px;
            :deep(.col-icon){
                margin-right: 0 !important;
            }
        }
        .el-button{
            margin-left: 0;
            margin-right: 12px;
        }
    }
    .add-sub-menu{
        text-align: center;
        padding: 20px 0; 
        button{
            padding-left: 32px !important;
            padding-right: 32px !important;
        }
    }
    .custom-dialog{
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background:rgba(0,0,0,.3);
        box-sizing: border-box;
        @include flex-style(column,nowrap,center,center);
        .btn-form{
            background:#fff;
            padding: 20px 10px;
            border-radius: 10px;
            .btn-forn-handle{
                text-align: center;
                padding-top: 10px;
            }
        }
    }
    .menu-form-item{
        width: 86%;
    }
    :deep.el-drawer__header{
        margin-bottom: 0 !important;
    }
</style>
