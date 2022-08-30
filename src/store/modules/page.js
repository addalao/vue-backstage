import { getStorage, setStorage } from "@/utils/tools"


export const page = {
    namespaced: true,
	state: {
		isCollapsed:getStorage("isCollapsed") || false, // 菜单是否收起
        currentMenuItem:changeStrToObj(getStorage("currentMenuItem")) || {},//当前点击的菜单
        firstMenuItem:changeStrToObj(getStorage("firstMenuItem")) || {},//当前点击父菜单
        subMenuItem:changeStrToObj(getStorage("subMenuItem")) || {},//当前点击子菜单
	},
	mutations: {
		setCollapsed(state,isCollapsed){
            state.isCollapsed = isCollapsed
			setStorage("isCollapsed",isCollapsed)
        },
        setCurrentMenuItem(state,currentMenuItem){
            state.currentMenuItem = currentMenuItem
			setStorage('currentMenuItem',currentMenuItem)
        },
        setFirstMenuItem(state,firstMenuItem){
            state.firstMenuItem = firstMenuItem
			setStorage('firstMenuItem',firstMenuItem)
        },
        setSubMenuItem(state,subMenuItem){
            state.subMenuItem = subMenuItem
			setStorage('subMenuItem',subMenuItem)
        },
	}
}

function changeStrToObj(val){
    let result = {}
    if(val && typeof(val)=='string'){
       return result = JSON.parse(val)
    }
    
}