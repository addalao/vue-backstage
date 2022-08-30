import { ref,computed } from 'vue';

export default function(store){
    const firstMenuItem = computed(()=>store.state.page.firstMenuItem)
    const subMenuItem = computed(()=>store.state.page.subMenuItem)
    const currentMenuItem = computed(()=>store.state.page.currentMenuItem)
    const topBtnList = computed(()=>{
        if(store.state.page.currentMenuItem.children){
            return store.state.page.currentMenuItem.children.filter((item)=>{
                return item.code==='顶部' || item.code==='top'
            })
        }
    })
    const rightBtnList = computed(()=>{
        if(store.state.page.currentMenuItem.children){
            return store.state.page.currentMenuItem.children.filter((item)=>{
                return item.code==='右侧' || item.code==='right'
            })
        }
    })
    return{
        firstMenuItem,
        subMenuItem,
        currentMenuItem,
        topBtnList,
        rightBtnList
    }
}