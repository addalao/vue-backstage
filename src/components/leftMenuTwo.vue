<template>
    <div class="menu-box" :style="{'border-right':!showSubMenu?'0':''}">
        <div class="main-menu">
            <ul>
                <li v-for="(item,index) in menuList" :class="[currentIndex==index?'active':'']" :key="index" @click="menuClickEvent(item,index)">
                    <el-icon class="main-icon">
                        <component v-if="item.icon" :is="item.icon"></component>
                        <box v-else />
                    </el-icon>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <div :class="['sub-menu',showSubMenu?'active':'uactive']">
            <div class="sub-box">
                <ul>
                    <li :class="[subCurrentIndex==subindex?'active':'']" 
                        v-for="(subitem,subindex) in subMenuList" :key="subindex" 
                        @click="subMenuClickEvent(subitem,subindex)"
                    >
                        <span>{{subitem.name}}</span>
                        <el-icon v-if="subCurrentIndex!=subindex" class="sub-icon"><arrow-right /></el-icon>
                    </li>
                </ul>
            </div>
            <div class="sub-switch" @click="closeSubMenuList">
                <img :class="[showSubMenu?'active':'']" src="../assets/kaihe.png">
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        name:"LeftMenu"
    }
</script>
<script setup>
    import { ref } from 'vue';
    import _axios from '@/plugins/axios'
    import mitter from '@/plugins/mitt'
    import { useRouter } from "vue-router";
    import { useStore } from "vuex";
    import emitter from "@/plugins/mitt";

    const router = useRouter()
    const store = useStore()

    const showSubMenu = ref(false)
	const firstSelectItem = ref({})
    const currentIndex = ref(0)
    const subCurrentIndex = ref(-1)
    const flowCurrentIndex = ref(-1)
    const menuList = ref([
        {
            name:"首页", 
            uri:"/index" 
        },
        {
            name:"系统设置",
            children:[
                {name:"租户租户",uri:"/system/tenant",children:[
                    {name:"编辑",code:"右侧",uri:"edit"},
                    {name:"删除",code:"右侧",uri:"del"},
                    {name:"新建",code:"顶部",uri:"create"}
                ]},
                {name:"用户",uri:"/system/user",children:[
                    {name:"编辑",code:"右侧",uri:"edit"},
                    {name:"新建",code:"顶部",uri:"create"}
                ]},
                {name:"角色",uri:"/system/role",children:[
                    {name:"编辑",code:"右侧",uri:"edit"},
                    {name:"新建",code:"顶部",uri:"create"}
                ]},
                {name:"菜单",uri:"/system/right",children:[
                    {name:"编辑",code:"右侧",uri:"edit"},
                    {name:"新建",code:"顶部",uri:"create"},
                    {name:"新建",code:"顶部",uri:"create"},
                    {name:"新建",code:"顶部",uri:"create"},
                    {name:"新建",code:"顶部",uri:"create"},
                    {name:"新建",code:"顶部",uri:"create"}
                ]},
                {name:"日志",uri:"/system/role"},
            ]
        }
    ])
    const subMenuList = ref([])
	
	window.addEventListener("beforeunload", function (e) {
	    store.commit("page/setCollapsed",false)
	    // mitter.emit('menuClose',true)     
	});

    //监听菜单变化
    emitter.on("refreshMenuList",()=>{
        showSubMenu.value = false
        getMenuList()
    })

    //一级菜单点击事件
    const menuClickEvent = (item,index)=>{
        currentIndex.value = index
        subCurrentIndex.value = -1
		firstSelectItem.value = item
        if(item.children){
            showSubMenu.value = true
            subMenuList.value = item.children 
        }else{
            subMenuList.value = []
            showSubMenu.value = false 
			store.commit("page/setFirstMenuItem",item)
            store.commit("page/setCurrentMenuItem",item)
			store.commit("page/setSubMenuItem",{})
            router.push({path:item.uri})
        }
        store.commit("page/setCollapsed",showSubMenu.value)
        mitter.emit('menuClose',showSubMenu.value)        
    }
    //关闭二级菜单
    const closeSubMenuList = ()=>{
        showSubMenu.value = false
        store.commit("page/setCollapsed",showSubMenu.value)
        mitter.emit('menuClose',showSubMenu.value)     
    }
    //二级菜单点击事件
    const subMenuClickEvent = (item,index)=>{
        subCurrentIndex.value = index
		store.commit("page/setFirstMenuItem",firstSelectItem.value)
        store.commit("page/setCurrentMenuItem",item)
        store.commit("page/setSubMenuItem",item)
        store.commit("page/setCollapsed",showSubMenu.value)
        mitter.emit('menuClose',showSubMenu.value)
        router.push({path:item.uri})
    }

    /*函数*/
    getMenuList()
    async function getMenuList(){
        const res = await _axios("get","/sys/sysPermission/Treelist",{},true)
        menuList.value = res
    }
</script>
<style lang="scss" scoped>
    .menu-box{
        @include flex-style(row,nowrap,flex-start,center);
        height: 100%;
        border-right: 1px solid $borderColor;
        overflow: hidden;
        .main-menu{
            width: 80px;
            border-right: 1px solid $borderColor;
            height: 100%;
            overflow: auto;
            @include scroll-bar-style(2px,2px,#efefef,#C0C4CC);
            ul>li{
                text-align: center;
                padding: 10px 4px;
                font-size: 14px;
                border-bottom: 1px solid #f9f9f9;
                border-right: 0;
                color: $menuDefault;
                cursor: pointer;
                position: relative;
                @include flex-style(column,nowrap,center,center);
                &.active{
                    background: $menuActiveBg;
                    color: $menuActive;
                    // border-right: 2px solid #1890FF;
                }
                &:hover{
                    background: $menuActiveBg;
                    color: $menuActive;
                }
                &:hover:after{
                    width: 100%;
                }
                &:after{
                    position: absolute;
                    bottom: 0;
                    content: '';
                    left: 0;
                    right: 0;
                    width: 0;
                    height: 2px;
                    background: $menuActive;
                    transition: 0.8s;
                }
                .main-icon{
                    font-size: 18px;
                    margin-bottom: 4px;
                }
            }
        }
        .sub-menu{
            width: 0;
            height:100%;
            &.active{
                animation: subMenuShow 0.3s linear 0s 1 alternate forwards;
                -webkit-animation: subMenuShow 0.3s linear 0s 1 alternate forwards;
            }
            &.uactive{
                animation: subMenuShowU 0.3s linear 0s 1 alternate forwards;
                -webkit-animation: subMenuShowU 0.3s linear 0s 1 alternate forwards;
            }
            .sub-switch{
                height: 40px;
                border-top: 1px solid $borderColor;
                text-align: center;
                padding-top: 7px;
                cursor: pointer;
                img{
                    width: 24px;
                    animation: myend 0.5s linear 0s 1 alternate forwards;
                    -webkit-animation: myend 0.5s linear 0s 1 alternate forwards;
                }
                img.active {
                    animation: myfirst 0.5s linear 0s 1 alternate forwards;
                    -webkit-animation: myfirst 0.5s linear 0s 1 alternate forwards;
                }
            }
            .sub-box{
                height: calc(100% - 40px);
                ul{
                    overflow: hidden;
                    li{
                        height: 40px;
                        line-height: 40px;
                        white-space: nowrap;
                        text-align: center;
                        font-size: 14px;
                        cursor: pointer;
                        color: $submenuDefault;
                        position: relative;
                        @include flex-style(row,nowrap,space-between,center);
                        padding: 0 10px;
                        &:hover{
                            background: $menuActiveBg;
                            color: $menuActive;
                        }
                        &:hover .hove-show-box{
                            animation: flowmenu 0.4s linear 0s 1 alternate forwards;
                            -webkit-animation: flowmenu 0.4s linear 0s 1 alternate forwards;
                        }
                        &.active{
                            border-right: 2px solid #1890FF;
                            background: $menuActiveBg;
                            color: $menuActive;
                        }
                        .sub-icon{
                            font-size: 12px;
                        }
                    }
                }
            }
        }
    }
    @keyframes subMenuShow {
        from {
            width: 0;
        }
        to {
            width: 120px;
        }
    }
    @keyframes subMenuShowU {
        from {
            width: 120px;
        }
        to {
            width: 0;
        }
    }
    @keyframes myfirst {
        from {
            transform: rotate(0deg);
            -ms-transform: rotate(0deg); /* IE 9 */
            -webkit-transform: rotate(0deg); /* Safari and Chrome */
        }
        to {
            transform: rotate(180deg);
            -ms-transform: rotate(180deg); /* IE 9 */
            -webkit-transform: rotate(180deg); /* Safari and Chrome */
        }
    }
    @keyframes myend {
        from {
            transform: rotate(180deg);
            -ms-transform: rotate(180deg); /* IE 9 */
            -webkit-transform: rotate(180deg); /* Safari and Chrome */
        }
        to {
            transform: rotate(0deg);
            -ms-transform: rotate(0deg); /* IE 9 */
            -webkit-transform: rotate(0deg); /* Safari and Chrome */
        }
    }
</style>