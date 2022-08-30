import _axios from '@/plugins/axios';
export default function (tbody,Sortable,tableData,keys,url,callback) {
    // 表格行拖拽
    Sortable.create(tbody, {
        // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
        // group: {//设置多组之间排序
        //     name: "words",
        //     pull: true,
        //     put: true,
        // },
        animation: 150, // ms, number 单位：ms，定义排序动画的时间
        // onAdd: function (evt) {
        //     // 拖拽时候添加有新的节点的时候发生该事件
        //     console.log("onAdd.foo:", [evt.item, evt.from]);
        // },
        // onUpdate: function (evt) {
        //     // 拖拽更新节点位置发生该事件
        //     console.log("onUpdate.foo:", [evt.item, evt.from]);
        // },
        // onRemove: function (evt) {
        //     // 删除拖拽节点的时候促发该事件
        //     console.log("onRemove.foo:", [evt.item, evt.from]);
        // },
        // onStart: function (evt) {
        //     // 开始拖拽出发该函数
        //     console.log("onStart.foo:", [evt.item, evt.from]);
        // },
        // onSort: function (evt) {
        //     // 发生排序发生该事件
        //     console.log("onUpdate.foo:", [evt.item, evt.from]);
        // },
        async onEnd(evt) {
            // 结束拖拽
            // console.log("结束表格拖拽", evt);
            console.log(tableData)
            // 如果拖拽结束后顺序发生了变化，则对数据进行修改
            if (evt.oldIndex !== evt.newIndex) {
                let type = -1 //下移动
                if(evt.oldIndex>evt.newIndex){
                    type = 1 //上移动
                }
                console.log(evt.oldIndex)
                console.log(evt.newIndex)
                const oldId = tableData[evt.oldIndex][keys];
                const newId = tableData[evt.newIndex][keys];
                await _axios('post',url,{
                    startSortId:oldId,
                    endSortId:newId,
                    sortFlag:type
                },true)
                if(callback){
                    callback()
                }
            }
        },
    });
}

