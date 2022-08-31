<template>
    <div class="logo-bar">
        <div class="logo">
            <img src="../assets/logo.png">
            <span>本同大数据</span>
            <span class="line"></span>
        </div>
        <!-- <div class="top-menu-list">

        </div> -->
        <div class="user-counter">
           <div class="user-name">
               <span>{{userInfo.nickName || userInfo.username}}</span>
               <ul class="drown-list">
                   <li>
                       <img src="../assets/user.png">
                       <span>{{userInfo.nickName || userInfo.username}}</span>
                   </li>
                   <li @click="exitSys">
                       <img src="../assets/exit.png">
                       <span>退出</span>
                   </li>
               </ul>
           </div>
           <span class="line"></span>
           <img src="../assets/welcom.png">
        </div>
    </div>
    <!-- <operate-in-process :show="showLoading" title="正在退出···"></operate-in-process> -->
</template>
<script>
    export default {
        name:"MainHeader"
    }
</script>
<script setup>
	import _axios from "@/plugins/axios";
	import {
		computed,
		ref
	} from "vue";
	import {
		useRouter,
		useRoute
	} from "vue-router"
	// import OperateInProcess from '../components/operateInProcess/operateInProcess.vue';
	import {
		operateInProcess
	} from "../components/operateInProcess/operateInProcess.js"
	import {
		useStore
	} from 'vuex';

    //获取路由
    const router = useRouter()
    const route = useRoute()
    //vuex
    const store = useStore()
	
	const htmltitle = import.meta.env.VITE_APP_TITLE

    const userInfo = computed(()=>{
        return JSON.parse(typeof store.state.user.userInfo =='string'?store.state.user.userInfo:'{}')
    })
    const tokenObj = computed(()=>{
        return JSON.parse(typeof store.state.user.tokenObj =='string'?store.state.user.tokenObj:'{}')
    })

    const showLoading = ref(false)
    // console.log(userInfo.value)

	const exitSys = () => {
		operateInProcess({
			show: true,
			title: '正在退出···'
		})
		setTimeout(async () => {
			await _axios("get", `/sys/yunke/mgr/logout?token=${tokenObj.value.tokenValue}`, {}, true)
			operateInProcess({
				show: false
			})
			router.push({
				path: '/login'
			})
			store.commit('user/loginOut')
		}, 1500)
	}
</script>
<style lang="scss" scoped>
    .login-out{
        position: fixed;
        top: 70px;
        left: 50%;
        margin-left: -20px;
        z-index: 999999;
    }
    .logo-bar{
        height: 48px;
        width: 100%;
        min-width:768px;
        background: $headerBg;
        color: #CEd0d9;
        box-sizing: border-box;
        .logo{
            @include flex-style(row,nowrap,center,center);
            height: 100%;
            width: 200px;
            box-sizing: border-box;
            position: relative;
            img{
                width: 40px;
            }
            span{
                color: #fff;
                font-weight: bold;
                margin-left: 10px;
                font-size: 18px;
            }
            .line{
                display: block;
                height: 26px;
                width: 2px;
                background: #000;
                position: absolute;
                right: 0;
            }
        }
        .user-counter{
            position: absolute;
            top: 0;
            bottom: 0;
            right: 20px;
            height: 48px;
            @include flex-style(row,nowrap,flex-end,center);
            .user-name{
                font-weight: bold;
                font-size: 14px;
                padding: 0 20px;
                box-sizing: border-box;
                height: 100%;
                line-height: 48px;
                position: relative;
                cursor: pointer;
                .drown-list{
                    height: 0;
                    position: absolute;
                    z-index: 999;
                    background: #171826;
                    top: 48px;
                    right: 0;
                    margin: 0;
                    padding: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    transition:height 0.6s; 
                    -moz-transition:height 0.6s;
                    -webkit-transition:height 0.6s;
                    -o-transition:height 0.6s;
                    li{
                        list-style: none;
                        @include flex-style(row,nowrap,flex-start,center);
                        padding: 0 10px;
                        box-sizing: border-box;
                        line-height: 2.2;
                        cursor: pointer;
                        img{
                            width: 16px;
                            margin-right: 10px;
                        }
                        span{
                            flex: 1;
                            font-size: 14px;
                            font-weight: normal;
                            color: #CEd0d9;
                        }
                        &:hover{
                            background: $headerBg;
                            color: #fff !important;
                        }
                    }
                }
                &:hover{
                    background: #171826;
                    color: #fff !important;
                }
                &:hover .drown-list{
                    height: 60px;
                }
                
            }
            .line{
                height: 26px;
                width: 2px;
                background: #000;
                margin-right: 20px;
            }
        }
    }
</style>