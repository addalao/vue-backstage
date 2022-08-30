import OperateInProcess from './operateInProcess.vue'
import { createVNode, render } from 'vue'
export const operateInProcess = (options) => {
    // const modelDom = document.body.querySelector('.operate-process')
    // if (modelDom) {
    //     document.body.removeChild(modelDom)
    // }
    if(options.show){
		console.log("创建")
        const container = document.createElement('div')
        container.className = 'operate-process'
        const vm = createVNode(OperateInProcess, options)
        render(vm, container)
        document.body.appendChild(container)
    }else{
		console.log("销毁")
        const modelDom = document.body.querySelector('.operate-process')
        if (modelDom) {
            document.body.removeChild(modelDom)
        }
    }
    
    // if (!options.show) {
    //     document.body.removeChild(container)
    // }
}

// const _Process = {
//     install: (app) => {
//         app.component(OperateInProcess.name, OperateInProcess)
//         app.config.globalProperties.$test = operateInProcess
//     }
// }