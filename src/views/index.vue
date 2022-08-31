<template>
    <div>
        <img src="../assets/welcomindex.png" alt="欢迎您">
    </div>
</template>
<style lang="scss" scoped>
    div{
        height: calc(100vh - 100px);
        @include flex-style(column,nowrap,center,center);
        overflow: hidden;
        img{
            // display: block;
            width: 46%;
        }
    }
</style>