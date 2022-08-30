<template>
    <div class="menu-box" :style="{'border-right':!showSubMenu?'0':''}">
        <div class="main-menu">
            <ul>
                <li v-for="(item,index) in menuList" :class="[currentIndex==index?'active':'']" :key="index" @click="menuClickEvent(item,index)">
                    <el-icon class="main-icon"><box /></el-icon>
                    <span>{{item.name}}</span>
                </li>
            </ul>
        </div>
        <div :class="['sub-menu',showSubMenu?'active':'uactive']">
            <div class="sub-box">
                <ul v-show="showSubMenu">
                    <li :class="[subCurrentIndex==subindex?'active':'']" 
                        v-for="(subitem,subindex) in subMenuList" :key="subindex" 
                        @click="subMenuClickEvent(subitem,subindex)"
                    >
                        <span>菜单菜单菜单</span>
                        <ul v-show="subitem.children && subitem.children.length>0" class="hove-show-box">
                            <li :class="[flowCurrentIndex==findex?'active':'']" v-for="(fitem,findex) in subitem.children" :key="findex" @click="flowMenuClick(fitem,findex,subindex)">{{fitem.name}}</li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div v-show="showSubMenu" class="sub-switch" @click="closeSubMenuList">
                <img src="../assets/kaihe.png">
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

    const showSubMenu = ref(false)
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
                {name:"租户",uri:"/system/tenant",children:[
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
                {name:"菜单",uri:"/system/right+",children:[
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

    //一级菜单点击事件
    const menuClickEvent = (item,index)=>{
        currentIndex.value = index
        if(item.children){
            showSubMenu.value = true
            subMenuList.value = item.children
            return 
        }
        subMenuList.value = []
        showSubMenu.value = false
    }
    //关闭二级菜单
    const closeSubMenuList = ()=>{
        showSubMenu.value = false
    }
    //二级菜单点击事件
    const subMenuClickEvent = (item,index)=>{
        subCurrentIndex.value = index
    }
    //悬浮菜单点击事件
    const flowMenuClick = (fitem,findex,subindex)=>{
        flowCurrentIndex.value = findex
        subCurrentIndex.value = subindex
    }

</script>
<style lang="scss" scoped>
    $borderColor:#EBEEF5;
    .menu-box{
        @include flex-style(row,nowrap,flex-start,center);
        height: 100%;
        border-right: 1px solid $borderColor;
        .main-menu{
            width: 80px;
            border-right: 1px solid $borderColor;
            height: 100%;
            overflow: auto;
            @include scroll-bar-style(2px,2px,#efefef,#C0C4CC);
            ul>li{
                text-align: center;
                padding: 10px 4px;
                font-size: 12px;
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
                }
            }
            .sub-box{
                height: calc(100% - 40px);
                ul{
                    li{
                        height: 40px;
                        line-height: 40px;
                        white-space: nowrap;
                        text-align: center;
                        font-size: 14px;
                        cursor: pointer;
                        color: $submenuDefault;
                        position: relative;
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
                    }
                    .hove-show-box{
                        position: absolute;
                        background: #fff;
                        z-index: 999;
                        left: 120px;
                        top: 0;
                        min-width: 140px;
                        height: 0;
                        overflow: hidden;
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        border-radius: 2px;
                        li{
                            list-style: none;
                            height: 40px;
                            line-height: 40px;
                            box-sizing: border-box;
                            cursor: pointer;
                            text-align: center;
                            &:hover{
                                background: $menuActiveBg;
                                color: $menuActive;
                                border-right: 2px solid #1890FF;
                            }
                        }
                        &.active{
                            animation: flowmenu 0.3s linear 0s 1 alternate forwards;
                            -webkit-animation: flowmenu 0.3s linear 0s 1 alternate forwards;
                        }
                    }
                }
            }
        }
    }
    @keyframes subMenuShow {
        from {
            display: none;
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
    @keyframes flowmenu {
        from {
            height: 0;
        }
        to {
            height: auto;
            box-shadow: 0px 2px 4px 2px rgba(0,0,0,0.2);
        }
    }
</style>