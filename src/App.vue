<template>
    <el-config-provider :locale="locale">
        <router-view />
    </el-config-provider>
</template>
<script setup>
    import {ref} from "vue"
    import zhCn from 'element-plus/es/locale/lang/zh-cn'

    const locale = ref(zhCn)
</script>
<style>
    @import 'animate.css';
    *{
        margin:0;
        padding: 0;
        box-sizing: border-box;
    }
    ul li{
        list-style: none;
    }
    body{
        -webkit-text-size-adjust: none; 
    }
    .tox-dialog-wrap__backdrop{
        display: none;
    }
    .tox-tinymce-aux{
        z-index: 99999999999 !important;
    }

    
    input:-webkit-autofill {

        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;

        transition: background-color 50000s ease-in-out 0s !important;

    }
</style>
