import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
// import 'element-plus/theme-chalk/el-message.css'
import * as eleIcons from '@element-plus/icons-vue';
import HeaderTitle from '@/components/headerTitle.vue'
import Pagination from '@/components/pagination.vue';
import MainBody from '@/components/mainBody.vue'
import FuzzyQuery from '@/components/searchBar/fuzzyQuery.vue'
import ConditionQuery from '@/components/searchBar/conditionQuery.vue'

export const app = createApp(App)

export const baseUrl= import.meta.env.VITE_RES_URL=='/'?'/mey':import.meta.env.VITE_RES_URL
export const uploadpath = baseUrl+'/sys/file-upload/upload'

const eIcons = eleIcons
for(let i in eIcons){
    app.component(i,eIcons[i])
}


export const modulesConfig = import.meta.globEager('./config/**/*.js')
export const modulesList =  import.meta.globEager('./customList/**/*.js')
export const modulesForm =  import.meta.globEager('./customForm/**/*.js')

//顶部导航全局组件
app.component('HeaderTitle',HeaderTitle)
//分页全局组件
app.component('Pagination',Pagination)
//中间内容盒子全局组件
app.component('MainBody',MainBody)
//单条件模糊搜索全局组件
app.component('FuzzyQuery',FuzzyQuery)
//多条件搜索全局组件
app.component('ConditionQuery',ConditionQuery)

app.use(VueAxios,axios).use(store).use(router).mount('#app')