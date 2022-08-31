"use strict";
import axios,{} from "axios";
import router from '@/router'
import store from '@/store'
import {getStorage} from '@/utils/tools'
// import { showToast } from 'element-plus'
import showToast from "@/common/showToast.js"
import {operateInProcess} from "@/components/operateInProcess/operateInProcess.js"
import {baseUrl} from "@/main.js"

// const baseUrl= import.meta.env.VITE_RES_URL=='/'?'/mey':import.meta.env.VITE_RES_URL

//axios请求
const  _axios = (methods,url, data, isToken,responseType) => {
    let tokenValue='',tokenName = ''
    if(typeof getStorage('tokenObj') == 'string'){
        const res = JSON.parse(getStorage('tokenObj'))
        tokenValue = res.tokenValue
        tokenName = res.tokenName
    }
	let httpDefaultOpts= {
		url:url,
		data: data,
		baseURL:baseUrl,
		method: methods,
		xhrFields: {
			withCredentials: true
		},
		headers: {
			'Content-Type': 'application/json;charset=UTF-8',
		},
		dataType: 'json',
	}
	// if (isToken && token) httpDefaultOpts.header.Authorization = tokenType+" "+token
	if (isToken && tokenValue){
		httpDefaultOpts.headers[tokenName] =tokenValue
	}
    if(responseType) httpDefaultOpts['responseType']=responseType
	const promise = new Promise((resolve, reject) => {
		axios(httpDefaultOpts).then(
			(res) => {
                if(responseType){
					return resolve(res);
				}
				const {data,data:{code,message}} = res
				if(code && code==200){
					if(data.data)
						resolve(data.data);
				}else{
					if(code==401){
                        console.log(401)
                        showToast.warning("token过期，请重新登陆！")
                        store.commit('user/loginOut')
                        router.push('/login')
					}else if(code=='99991'){
                        showToast.warning(data.message || data.msg)
                    }else if(code==30001){
						resolve({code:30001,msg:message});
					}else if(code==500){
                        showToast.warning(data.message || data.msg)
                        operateInProcess({show:false})
                    }else{
						showToast.warning(data.message || data.msg)
					}
				}
			}
		).catch(
			(response) => {
				console.log(response)
				if(response.response){
					switch (response.response.status){
                        case 400:
                            showToast.error('请求错误')
							break;
						case 401:
							showToast.warning("token过期，请重新登陆！")
                            store.commit('user/loginOut')
                            router.push('/login')
							break;
						case 403:
						case 404:
							showToast.warning("找不到罗！")
                            router.push('/404')
							break;
						case 500:
							showToast.error('网络服务错误Internal Server Error')
							break;
						default:
							
							break;
					}
				}else{
					
				}
				reject(response);
			}
		)
	})
	return promise
};

export default _axios;