import { createRouter, createWebHashHistory } from 'vue-router'
import {getToken} from '@/utils/tools.js'

const routes= [
    {
        path: '/',
        redirect: '/index',
    },
    {
        path: '/',
        name: 'home',
        meta: {
            title: '后台管理系统',
            icon: 'education',
            roles: ['admin', 'editor']
        },
        component:() => import('@v/home.vue'),
        children: [
            {
                path: '/index',
                name: 'index',
                meta: {
                    title: '主页',
                    icon: 'education',
                    type:'custom',
                    formType:'custom'
                },
                component: () => import('@v/index.vue')
            },
            {
                path: '/other',
                name: 'other',
                meta: {
                    title: '其他设置'
                },
                component: () => import('@v/other.vue')
            },
            {
                path: '/system/:id',
                name: 'system',
                meta: {
                    title: '系统设置',
                    type:'default'
                },
                component: () => import('@c/generalList.vue')
            },
            {
                path: '/goods/:id',
                name: 'goods',
                meta: {
                    title: '商品管理',
                    type:'default'
                },
                component: () => import('@c/generalList.vue')
            },
            {
			    path: '/order/:id',
			    name: 'order',
			    meta: {
			        title: '订单管理',
			        type:'default',
					formType:'custom'
			    },
			    component: () => import('@c/generalList.vue')
			},
            {
                path: '/goods-detail',
                name: 'goods-detail',
                meta: {
                    title: '商品详情',
                    type:'custom',
					formType:'custom'
                },
                component: () => import('@c/customList/goods-detail.vue')
            },
            {
                path: '/menu',
                name: 'menu',
                meta: {
                    title: '菜单',
                    type:'custom',
                    formType:'custom'
                },
                component: () => import('@v/system/menu2.vue')
            },
            {
                path: '/case/:id',
                name: 'case',
                meta: {
                    title: '案例展示',
                    type:'default',
                },
                component: () => import('@c/generalList.vue')
            }, 
			{
                path: '/middleground/:id',
                name: 'middleground',
                meta: {
                    title: '中台管理',
                    type:'default',
                },
                component: () => import('@c/generalList.vue')
            },
			{
				path: '/user/:id',
				name: 'user',
				meta: {
				    title: '用户管理',
				    type:'default',
					formType:'custom'
				},
				component: () => import('@c/generalList.vue')
			},{
				path: '/finance/:id',
				name: 'finance',
				meta: {
				    title: '财务管理',
				    type:'default',
					formType:'custom'
				},
				component: () => import('@c/generalList.vue')
			},
            {
				path: '/financeExcel',
				name: 'financeExcel',
				meta: {
				    title: '财务报表',
				    type:'default',
					formType:'custom'
				},
				component: () => import('@v/finance/financeExcel.vue')
			},
			{
				path: '/news/setting',
				name: 'setting',
				meta: {
				    title: '消息设置',
				    type:'default',
					formType:'custom'
				},
				component: () => import('@v/news/setting.vue')
			},
            {
				path: '/index/payment',
				name: 'payment',
				meta: {
				    title: '首页扣款记录',
				},
				component: () => import('@v/indexHandle/payment.vue')
			},
            {
				path: '/index/order',
				name: 'orderhandle',
				meta: {
				    title: '首页订单快捷处理',
				},
				component: () => import('@v/indexHandle/order.vue')
			},
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登陆'
        },
        component: () => import('@v/login.vue')
    },
    {
        path: '/404',
        name: '404',
        meta: {
            title: '404',
        },
        component: () => import('@v/404.vue')
    }
]



const router = createRouter({
    history: createWebHashHistory(),
    routes
})

//全局路由守卫
router.beforeEach((to, from, next) => {
    const token = getToken('token') || false
    if (to.meta.title) {
        document.title = to.meta.title
    }
    //如果没登录,都导向登录页
    if (!token) {
        if (to.path !== '/login') {
            next({ path: '/login' })
        }
        else {
            next();
        }
    }
    else {
        next();
    }
})

export default router
