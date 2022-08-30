import { getStorage, setStorage } from "@/utils/tools"

export const user = {
    namespaced: true,
	state: {
		isLogin:getStorage('isLogin') || false, // 是否登录
        userInfo:getStorage('userInfo') || {}, // 是否登录
        tokenObj:getStorage('tokenObj') || {}, // 登录token
	},
	mutations: {
        setToken(state,tokenObj){
            state.tokenObj = tokenObj
            setStorage("tokenObj",tokenObj)
        },
		setIsLogin(state,isLogin){
            state.isLogin = isLogin
            setStorage("isLogin",isLogin)
        },
        setUserInfo(state,userInfo){
            state.userInfo = userInfo
            setStorage("userInfo",userInfo)
        },
        loginOut(state){
            state.isLogin = false
            state.userInfo = {}
            state.tokenObj = {tokenName:'',tokenValue:''}
            setStorage("isLogin",false)
            setStorage("userInfo",{})
            setStorage("tokenObj",{})
        }
	}
}