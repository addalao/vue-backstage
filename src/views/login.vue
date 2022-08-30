<template>
    <div class="login-bg">
        <div class="login-logo">
            <div style="text-align:center;">
                <img src="../assets/logo.jpg">
                <h1>本同大数据管理系统</h1>
            </div>
            <div>
                <!-- <h5>本软件由云科软件技术开发（云南）有限责任公司提供技术支持</h5> -->
            </div>
        </div>
        <div class="login-form">
            <h3 class="login-title">密码登录</h3>
            <div class="login-area">
                <div class="login-item">
                    <img src="../assets/count.png" alt="">
                    <el-input v-model="ruleForm.username" type="text" autocomplete="off" placeholder="请输入账号"></el-input>
                </div>
                <div class="login-item">
                    <img src="../assets/pwd.png" alt="">
                    <el-input v-model="ruleForm.password" type="password" autocomplete="off" placeholder="请输入密码"></el-input>
                    <!-- @keyup.enter="login" -->
                </div>
                <el-button class="login-btn" type="primary" @click="login">登录</el-button>
            </div>
        </div>       
    </div>
</template>
<script setup>
	import { ref,reactive } from 'vue';
	import _axios from '@/plugins/axios';
    import { useRouter,useRoute } from 'vue-router';
    import { useStore } from 'vuex';
    import { ElMessage } from 'element-plus'
    import {setToken} from '@/utils/tools.js'
    import { ElLoading } from 'element-plus'

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

	const ruleForm = reactive({
		username: '',
		password: ''
	});

	const rules = ref({});
	const ruleFormRef = ref(null)
	
	document.onkeydown = event => {
		var e = event || window.event || arguments.callee.caller.arguments[0];
		if (e && e.keyCode == 13 && route.path == '/login') {
			// enter 键
			login();
		}
	};

	const login = async ()=>{
        if(!ruleForm.username || !ruleForm.password) return ElMessage.warning('请输入账号或密码!')
        const loadingInstance = ElLoading.service({text:'正在登录'})
        try {
            const res = await _axios('post', '/sys/yunke/mgr/adminlogin', ruleForm);
            loadingInstance.close()
            ElMessage.success('登录成功!')
            const {token,userInfo} = res
            store.commit('user/setUserInfo',JSON.stringify(userInfo))
            setToken(token.tokenValue)
            store.commit('user/setToken',JSON.stringify(token))
            router.push('/index')
        } catch (error) {
            ElMessage.error('登陆失败!')
            loadingInstance.close()
        }
	}
</script>
<style lang="scss" scoped>
    .login-bg{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
        background-image: url(../assets/logobg.jpg);
        background-repeat: no-repeat;
        background-size: cover;
        @include flex-style(row,nowrap,space-between,center);
        .login-logo{
            // margin-right: 150px;
            height: 100vh;
            box-sizing: border-box;
            @include flex-style(column,nowrap,space-between,flex-start);
            padding: 80px 0 80px calc(50vw - 500px);
            color: #fff;
        }
        .login-form{
            width: calc(50vw - 150px);
            // height: 300px;
            box-sizing: border-box;
            .login-title{
                font-weight: 600;
                font-size: 20px;
                padding-bottom: 10px;
                margin-bottom: 40px;
                color: #fff;
                border-bottom: 3px solid rgba(173, 217, 244, 0.3);
            }
            .login-area{
                width: 100%;
                padding-right:calc(50vw - 500px);
                .login-item{
                    @include flex-style(row,nowrap,flex-start,center);
                    background: rgba(173, 217, 244, 0.3);
                    border: 1px solid #FFFFFF;
                    box-sizing: border-box;
                    border-radius: 15px;
                    height: 68px;
                    padding-left: 20px;
                    margin-bottom: 28px;
                    img{
                        width: 24px;
                        height: 24px;
                        margin-right: 40px;
                    }
                    :deep(.el-input__inner){
                        background: transparent !important;
                        outline: none !important;
                        box-shadow:0 0 0 0;
                        font-weight: 600;
                        font-size: 16px;
                        color: #fff;
                    }
                    :deep(.el-input){
                        &::after{
                            height: 0;
                            border: 0;
                        }
                    }
                }
                .login-btn{
                    background: #33A6DD;
                    border-radius: 15px;
                    height: 55px;
                    width: 100%;
                }
            }
        }
        
    }
</style>
