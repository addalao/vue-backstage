<template>
    <div class="top-search">
        <el-icon style="color:#C3C7CF"><search /></el-icon>
        <el-input  placeholder="请输入菜单名称" v-model="isDisabled.menuName" clearable @input="searchEvent"/>
    </div>
    <div class="center-content">
        <ul class="list-item" v-if="menuListRight.length>0">
            <li v-for="(item,index) in menuListRight" :key="index" @click="showSubList(item,index)" :id="'Lli'+index">
                <div class="title">
                    <el-checkbox @click.stop="" :indeterminate="item.isIndeterminate" v-model="item.isChecked" @change="getFirstChange($event,item,index)"></el-checkbox>
                    <div class="title-right">
                        <span class="title-name">{{item.name}}</span>
                        <el-icon v-if="item.children && item.children.length>0" :style="{'color':'#C3C7CF','transform':item.isAccordion?'rotate(180deg)':'rotate(0deg)'}"><arrow-down /></el-icon>
                    </div>
                </div>
                <div class="children" :id="index+'Lsub'+index">
                    <div class="children-item" v-for="(sitem,sindex) in item.children" :key="sindex" @click.stop="showBtnList(sitem,sindex,index)" :id="index+'subw'+sindex">
                        <div class="sub-item">
                            <el-checkbox @click.stop="" :indeterminate="sitem.isIndeterminate" v-model="sitem.isChecked" @change="getSecondChange($event,sitem,sindex,item,index)"></el-checkbox>
                            <div class="subtitle-right">
                                <span class="subtitle-name">{{sitem.name}}</span>
                                <el-icon v-if="sitem.children && sitem.children.length>0" :style="{'color':'#C3C7CF','transform':sitem.isAccordion?'rotate(180deg)':'rotate(0deg)'}"><arrow-down /></el-icon>
                            </div>
                        </div>
                        <div class="btn-list">
                            <span :class="[bitem.isChecked?'active':'']" v-for="(bitem,bindex) in sitem.children" :key="bindex" @click.stop="selectBtn(bitem,bindex,sitem,sindex,item,index)">{{bitem.name}}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
        <div class="nodata" v-else>
            <img src="../assets/nodata.png">
            <span>没有数据哦</span>
        </div>
    </div>
    <div class="bottom-bar">
        <el-button type="primary" size="small" @click="selectAll">{{selectAllTitle}}</el-button>
    </div>
</template>
<script>
    export default{
        name:"RightLeftVue"
    }
</script>

<script setup>
    import { ref,reactive, watch } from 'vue';
    // import {bindMenuList} from '@/common/test.js'
    import {siblings,isIncludeStr} from '@/utils/tools.js'

    const props = defineProps({
        list:Array
    })
    const emits = defineEmits(['unBound','checkedVal'])

    watch(()=>props.list,val=>{
        menuListRight.value = val
    })

    const menuListRight = ref(props.list)
    const selectAllTitle = ref('全选')
    const isDisabled = reactive({
        left:true,
        right:true,
        menuName:''
    })

    //搜索事件
    const searchEvent = (e)=>{
        let arr = [],subArr=[],fnum = 0,snum = 0;
        if(!e.trim()){
           return menuListRight.value = props.list
        }
        props.list.map((v,index)=>{
            if(isIncludeStr(v.name,e.trim())){
                fnum++
                arr.push(v)
            }else{
                if(v.children && v.children.length>0){
                    v.children.map((s,sindex)=>{
                        if(isIncludeStr(s.name,e.trim())){
                            snum++
                            subArr.push({key:v.id,val:s})
                            arr.push({...v,children:[]})
                        }
                    })
                }
            }
        })
        if(fnum==0 && snum==0){
            arr = []
        }
        if(subArr.length>0){
            arr.map(v=>{
                subArr.map(s=>{
                    if(s.key==v.id){
                        v.children.push(s.val)
                    }
                })
            })
        }
        menuListRight.value = arr
    }

    //展示二级菜单权限,手风琴展示
    const showSubList = (item,index)=>{
        if(!item.children || item.children.length<1) return
        const height = document.getElementById(index+'Lsub'+index).clientHeight || document.getElementById(index+'Lsub'+index).offsetHeight
        const sibNode =  siblings(document.getElementById('Lli'+index))
        // currentIndex.value = index
        if(!item.isAccordion){
            document.getElementById('Lli'+index).style.height = (height+106) +'px'
            for(let i=0;i<sibNode.length;i++){
                sibNode[i].style.height = '40px'
            }
            menuListRight.value.map(v=>{
                if(v.id!=item.id){
                    v.isAccordion = false
                }
            })
        }else{
            document.getElementById('Lli'+index).style.height = '40px'
        }
        item.isAccordion = !item.isAccordion
    }

    //展示按钮
    const showBtnList = (item,index,zindex)=>{
        if(!item.children || item.children.length<1) return
        const bsibNode =  siblings(document.getElementById(zindex+'subw'+index))
        if(!item.isAccordion){
            document.getElementById(zindex+'subw'+index).style.height ='100px'
            for(let i=0;i<bsibNode.length;i++){
                bsibNode[i].style.height = '34px'
            }
            menuListRight.value[zindex].children.map(v=>{
                if(v.id!=item.id){
                    v.isAccordion = false
                }
            })
        }else{
            document.getElementById(zindex+'subw'+index).style.height ='34px'
        }
        item.isAccordion = !item.isAccordion
    }

    //全选事件
    const selectAll = ()=>{
        if(selectAllTitle.value =='全选'){
            selectAllTitle.value ='取消'
            setAllChecked(true)
            isDisabled.right = false
        }else{
            selectAllTitle.value ='全选'
            setAllChecked(false)
            isDisabled.right = true
        }
        emits('unBound',isDisabled.right)
        emits('checkedVal',menuListRight.value)
    }

    //按钮点击选择事件
    const selectBtn = (bitem,bindex,sitem,sindex,item,index)=>{
        bitem.isChecked = !bitem.isChecked
        //二级菜单的判断  1全选 2任一 3不选
        const isSelect = judgeIsSelect(sitem.children) 
        sitem.isChecked = false
        sitem.isIndeterminate = false
        if(isSelect==1 || isSelect==2){
            isDisabled.right = false
            item.isIndeterminate = true
            sitem.isIndeterminate = true
        }else{
            isDisabled.right = true
            sitem.isIndeterminate = false
            //再判断二层其他项的按钮有没有选中的
            itemCheck(item)
        }
        emits('unBound',isDisabled.right)
        emits('checkedVal',menuListRight.value)
    }
    function itemCheck(item){
         //1全选 2任一  3不选
        const btnIsSelect =  judgeSubIsSelect(item.children)
        if(btnIsSelect==1 || btnIsSelect==2){
            isDisabled.right = false
            item.isIndeterminate = true
        }else{
            isDisabled.right = true
            item.isIndeterminate = false
            //1全选 2任一  3不选  ,再判断第一层有没有选的
            const firstIsSelect =  judgeSubIsSelect(menuListRight.value)
            if(firstIsSelect==1 || firstIsSelect==2){
                isDisabled.right = false
            }else{
                isDisabled.right = true
            }
        }
    }

    //第一级change事件,选中/取消当前item下的所有子菜单及子菜单下的按钮
    const getFirstChange = (e,item,index) =>{
        item.isChecked = e
        item.isIndeterminate = false
         //二级菜单的判断  1全选 2任一 3不选
        const isSelect = judgeSubIsSelect(menuListRight.value) 
        if(isSelect==1 || isSelect==2){
            isDisabled.right = false
        }
        if(isSelect==3){
            isDisabled.right = true
        }
        (item.children && item.children.length>0) && item.children.map(v=>{
            v.isChecked = e
            v.isIndeterminate = false
            if(v.children && v.children.length>0){
                v.children.map(b=>{
                    b.isChecked = e
                })
            }
        })
        emits('unBound',isDisabled.right)
        emits('checkedVal',menuListRight.value)
    }
    //第二级change事件，选中/取消当前item下的所有按钮
    const getSecondChange = (e,sitem,sindex,item,index)=>{
        sitem.isChecked = e
          //1全选 2任一 3不选
        const isSelect = judgeSubIsSelect(item.children)
        item.isChecked = false
        sitem.isIndeterminate = false
        if(isSelect==1 || isSelect==2){
            isDisabled.right = false
            item.isIndeterminate = true
        }else{
            isDisabled.right = true
            item.isIndeterminate = false
            //1全选 2任一  3不选  ,再判断第一层有没有选的
            const firstIsSelect =  judgeSubIsSelect(menuListRight.value)
            if(firstIsSelect==1 || firstIsSelect==2){
                isDisabled.right = false
            }else{
                isDisabled.right = true
            }
        }
        (sitem.children && sitem.children.length>0) && sitem.children.map(v=>{
            v.isChecked = e
        })
        emits('unBound',isDisabled.right)
        emits('checkedVal',menuListRight.value)
    }

    /*函数*/

    //设置所有项选中值
    function setAllChecked(val){
        menuListRight.value.map(v=>{
            v.isChecked = val
            v.isIndeterminate = false
            if(v.children && v.children.length>0){
                v.children.map(s=>{
                    s.isChecked = val
                    s.isIndeterminate = false
                    if(s.children && s.children.length>0){
                        s.children.map(b=>{
                            b.isChecked = val
                        })
                    }
                })
            }
        })
    }

    //判断当前list中所有子项是否有任一被选中/全选/不选
    function judgeIsSelect(list){
        let isSelect = 1 //1全选 2任一 3不选
        let num = 0
        for(let i=0;i<list.length;i++){
            if(list[i].isChecked){
                num++
            }
        }
        if(num==list.length){
            isSelect = 1
        }else if(num<list.length && num>0){
            isSelect = 2
        }else{
            isSelect = 3
        }
        return isSelect
    }

    //判断二级当前list中所有子项是否有任一被选中/全选
    function judgeSubIsSelect(list){
        let IsSelect = 1 //1全选 2任一  3不选
        let num = 0
        for(let i=0;i<list.length;i++){
            if(list[i].isChecked || list[i].isIndeterminate){
                num++
            }
        }
        if(num==list.length){
            IsSelect = 1
        }else if(num<list.length && num>0){
            IsSelect = 2
        }else{
            IsSelect = 3
        }
        return IsSelect
    }
</script>

<style lang="scss" scoped>
    .top-search{
        height: 32px;
        border: 1px solid #DCDFE6;
        border-radius: 16px;
        width: 90%;
        margin-top: 15px;
        @include flex-style(row,nowrap,space-between,center);
        box-sizing: border-box;
        padding:0 10px;
        :deep(.el-input__inner){
            border: 0 !important;
            height: 28px;
            box-shadow: 0 0 0 0;
        }
    }
    .center-content{
        width: 100%;
        flex:1;
        overflow: auto;
        margin-top: 15px;
        @include scroll-bar-style(4px, 4px, #efefef, #c0c4cc);
        .list-item{
            width: 100%;
            margin: 0;
            padding: 0;
            // @include flex-style(row,nowrap,flex-start,flex-start);
            li{
                width: 90%;
                margin: 0 auto;
                padding: 6px 0;
                border-top: 1px solid #f4f5fa;
                height: 40px;
                overflow: hidden;
                transition: height 0.8s;
                // @include flex-style(row,nowrap,flex-start,flex-start);
                &:first-child{
                    border-top:0;
                }
                .title{
                    @include flex-style(row,nowrap,space-between,center);
                    .title-right{
                        flex: 1;
                        @include flex-style(row,nowrap,space-between,center);
                        cursor: pointer;
                    }
                    .title-name{
                        margin-left: 15px;
                        color: #666;
                        font-size:15px;
                        font-weight:bold;
                    }
                }
                .children{
                    .children-item{
                        padding-left:14px;
                        overflow: hidden;
                        height: 34px;
                        transition: height 0.5s;
                        .sub-item{
                            padding: 4px 0;
                            box-sizing: border-box;
                            @include flex-style(row,nowrap,flex-start,center);
                            :deep(.el-checkbox){
                                height: 26px;
                            }
                            :deep(.el-checkbox__input.is-checked){
                                background-color:#409EFF;
                                border-color: #409EFF;
                            }
                            .subtitle-right{
                                flex: 1;
                                @include flex-style(row,nowrap,space-between,center);
                                cursor: pointer;
                                .subtitle-name{
                                    font-size:14px;
                                    font-weight: bold;
                                    color: #888;
                                    margin-left: 10px;
                                }
                            }
                        }
                        .btn-list{
                            height:66px;
                            overflow: hidden;
                            // transition: height 0.5s;
                            border:1px solid #efefef;
                            margin-left: 14px;
                            @include flex-style(row,wrap,flex-start,flex-start);
                            span{
                                // background:#ECF5FF;
                                cursor: pointer;
                                background:#F4F4F5;
                                border: 1px solid #D3D4D6;
                                border-radius: 4px;
                                padding: 3px 8px;
                                font-size: 12px;
                                color: #9093B1;
                                margin: 4px;
                                &.active{
                                    background:#ECF5FF;
                                    border-color: #B3D8FF;
                                    color: #889EFF;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    .bottom-bar{
        width: 100%;
        text-align: center;
        height: 40px;
        line-height: 35px;
        border-top: 1px solid #EBEEF5;
    }
    .nodata{
        @include flex-style(column,nowrap,center,center);
        margin-top: 100px;
        span{
            font-size: 12px;
            color: rgb(173, 172, 172);
            margin-top: 6px;
        }
    }
</style>