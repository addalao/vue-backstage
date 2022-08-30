<template>
    <div class="body-top">
        <MainHeader></MainHeader>
    </div>
    <div class="body-content">
        <div class="body-menu">
            <LeftMenuTwo></LeftMenuTwo>
        </div>
        <div class="body-main">
            <div class="main-content">
                <router-view v-slot="{ Component,route }">
                    <transition 
                        enter-active-class="animate__animated animate__fadeInDown animate__faster animate__delay-1s"
                        leave-active-class="animate__animated animate__fadeOutDown animate__faster">
                        <keep-alive>
                            <div :key="route.fullPath">
                                <component :is="Component" />
                            </div>
                        </keep-alive>
                    </transition>
                </router-view>
            </div>
            <div class="copy-right">
                Copyright @ 2022 刺梨工坊
            </div>
        </div>
    </div>
</template>
<script setup>
    import { ref } from 'vue'
    import mitter from '@/plugins/mitt'
    import MainHeader from '@/components/mainHeader.vue'
    import LeftMenuTwo from '@/components/leftMenuTwo.vue'
    import { useRouter,useRoute } from "vue-router";
    // import LeftMenuThree from '@/components/leftMenuThree.vue'

    const router = useRouter()
    const route = useRoute()

    const copyRightPaddingRight = ref('80px')

    mitter.on('menuClose',(e)=>{
        if(e){
            copyRightPaddingRight.value = '200px'
        }else{
            copyRightPaddingRight.value = '80px'
        }
    })

</script>
<style lang="scss" scoped>
    .body-top{
        width: 100vw;
        height:48px;
		box-sizing: border-box;
    }
    .body-content{
        @include flex-style(row,nowrap,flex-start,center);
        height: calc(100vh - 50px);
		box-sizing: border-box;
        .body-menu{
            height: 100%;
            max-width: 200px;
        }
        .body-main{
            flex: 1;
            height: 100%;
            .main-content{
                height: calc(100% - 40px);
                padding:12px 12px;
                background: #f9f9f9;
            }
            .copy-right{
                height: 40px;
                line-height: 40px;
                width: 100%;
                background: #fff;
                border-top:1px solid $borderColor;
                text-align: center;
                color: #C0C4CC;
                font-size: 12px;
                padding-right: v-bind(copyRightPaddingRight);
            }
        }
    }

   .nodebook-enter,
	.nodebook-leave-to {
		transform: scale(0.9);
		opacity: 0;
	}

	.nodebook-enter-to,
	.nodebook-leave {
		transform: scale(1);
		opacity: 1;
	}
	.nodebook-enter-active,
	.nodebook-leave-active {
		transition: all 0.3s;
	}
  
</style>