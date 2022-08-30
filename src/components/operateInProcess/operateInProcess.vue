<template>
    <div class="operate-in-process" id="opp">
        <span class="shadow">
            {{title}}
        </span>
    </div>
</template>
<script>
    export default{
        name: "operate-in-process"
    }
</script>

<script setup>
    import { ref, watch,nextTick } from 'vue'

    const props = defineProps({
        show:Boolean,
        title:{
            type:String,
            default:'正在登陆···'
        }
    })
    const emits = defineEmits(['select'])

    const animateType = ref('smallBig')

    watch(()=>props.show,val=>{
        console.log(val)
        if(val){
            animateType.value = 'smallBig'
        }else{
            animateType.value = 'bigSmall'
        }
    })

    const selectBtnStyle = (item)=>{
        emits('select',item)
    }
</script>
<style lang="scss" >
    .operate-in-process{
        position: fixed;
        z-index: 999999999;
        top: 20px;
        left: calc(50vw - 165px);
        width: 330px;
        height: 100px;
        padding: 14px 26px 14px 13px;
        border-radius: 8px;
        background:#fff;
        box-shadow: 0px 0px 4px 2px #797979;
        @include flex-style(column,nowrap,center,center);
        transform: scale(0);
        animation:v-bind(animateType) .3s linear 0s 1 alternate forwards;
        span{
            color: #010819;
            font-size: 18px;
            letter-spacing: 0.3rem;
            text-shadow: 3px 3px 3px #797979;
        }

    }

    @keyframes bigSmall {
        from {
            transform: scale(1);
        }
        to {
            transform: scale(0);
        }
    }
    @keyframes smallBig {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    .shadow {
        text-align: center;
        /* 背景颜色线性渐变 */
            /* 老式写法 */
                /* linear为线性渐变，也可以用下面的那种写法。left top，right top指的是渐变方向，左上到右上 */
                /* color-stop函数，第一个表示渐变的位置，0为起点，0.5为中点，1为结束点；第二个表示该点的颜色。所以本次渐变为两边灰色，中间渐白色 */
        background: -webkit-gradient(linear, left top, right top, color-stop(0, #4d4d4d), color-stop(.4, #4d4d4d), color-stop(.5, white), color-stop(.6, #4d4d4d), color-stop(1, #4d4d4d));
            /* 新式写法 */
        /* background: -webkit-linear-gradient(left top, right top, color-stop(0, #4d4d4d), color-stop(.4, #4d4d4d), color-stop(.5, white), color-stop(.6, #4d4d4d), color-stop(1, #4d4d4d)); */

        /* 设置为text，意思是把文本内容之外的背景给裁剪掉 */
        -webkit-background-clip: text;
        /* 设置对象中的文字填充颜色 这里设置为透明 */
        -webkit-text-fill-color: transparent;
        /* 每隔.2秒调用下面的CSS3动画 infinite属性为循环执行animate */
        -webkit-animation: animateprocess 1.5s infinite;
    }
    /* 兼容写法，要放在@keyframes前面 */
    @-webkit-keyframes animateprocess {
        /* 背景从-100px的水平位置，移动到+100px的水平位置。如果要移动Y轴的，设置第二个数值 */
        from {background-position: -100px;}
        to {background-position: 100px;}
    }
    @keyframes animateprocess {
        from {background-position: -100px;}
        to {background-position: 100px;}
    }
</style>