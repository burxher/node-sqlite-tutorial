/*
    倒序读取【旧数据库】单，单号日期大于【新数据库】单号日期的单放到重复组排查近一度排查，其他的直接插入【新数据库】

*/
const Promise = require('bluebird')
const AppDAO = require('./dao')
const OrderModel = require('./order_model') //order_count表
const ReturnOrderModel = require('./return_order_model') //return_order表
const Logger = require('./logger')

function main() {
    // 新数据库
    const dao = new AppDAO('./new_database/pos_order_pos_org_id.db')
    const returnOrderM = new ReturnOrderModel(dao)
    const OrderM = new OrderModel(dao)
    // 旧数据库
    const dao2 = new AppDAO('./old_database/pos_order_pos_org_id.db')
    const returnOrderM2 = new ReturnOrderModel(dao2)

    let newOrderList
    let oldOrderList
    let lastOrderNo //最新单号(order表)

    returnOrderM.createTable()
        .then(() => returnOrderM2.createTable())
        .then(() => OrderM.getAll())
        .then((order_list) => { //最新单号
            if (order_list && order_list.length > 0) {
                lastOrderNo = order_list[0].order_no
            }
        })
        .then(() => returnOrderM.getAll())
        .then((orderList) => {
            newOrderList = orderList
            Logger.log('\n新表return_order: ')
            newOrderList.forEach(el => {
                Logger.log(el.return_order_no)
            });
        })
        .then(() => returnOrderM2.getAll())
        .then((orderList) => {
            let newOrderFirstNo = 0 //新表最早一单单号
            let listTemp = [] //待排查单号

            if (newOrderList && newOrderList.length > 0) {
                newOrderFirstNo = newOrderList[newOrderList.length - 1].return_order_no
            }
            oldOrderList = orderList
            // 插入数据
            Logger.log('直接合并的退货单：')
            oldOrderList.forEach(el => {
                let { return_order_no, data } = el
                // 新订单表为空表 || 之前的单 || 当天流水号小的单
                if (newOrderFirstNo == 0 ||
                    getOrderDate(return_order_no) < getOrderDate(newOrderFirstNo) ||
                    getFlowNo(return_order_no) < getFlowNo(newOrderFirstNo)) { 
                    Logger.log(return_order_no)
                    returnOrderM.insert(el)
                    return false
                }
                listTemp.push(el)

            });
            return Promise.all(listTemp.map((el) => {
                for (let i = 0; i < newOrderList.length; i++) { //需要更新
                    if (el.return_order_no == newOrderList[i].return_order_no) {
                        return el
                    }
                }
                Logger.log(el.return_order_no)
                returnOrderM.insert(el)
            }))
        })
        .then((repeatList) => { //重复单，更新退货单单号
            //单号前缀
            let orderPre = getOrderPre(lastOrderNo) + '-' + getOrderDate(lastOrderNo) + '-' 
            //流水号
            let flowNo = getFlowNo(lastOrderNo) 
            repeatList.reverse() //倒序
            
            Logger.log('更新的退货单：')
            repeatList.map(el => {
                let old_return_order_no = el.return_order_no
                flowNo = flowNo < 9999 ? flowNo + 1 : 1

                updateOrder(el, orderPre + flowNoFormat(flowNo))
                Logger.log(old_return_order_no + " -> " + el.return_order_no)
                returnOrderM.insert(el)
            });
        })
        .catch((err) => {
            Logger.log('Error: ')
            Logger.log(JSON.stringify(err))
        })
}
main()
// 取单号前缀
function getOrderPre(order_no) {
    if (typeof (order_no) == 'string') {
        let arr = order_no.split('-')
        if (arr[0]) {
            return arr[0]
        }
    }

    Logger.log('getOrderDate error 单号前缀错误,单号:')
    Logger.log(order_no)
    return 0
}
// 取单号日期
function getOrderDate(order_no) {
    if (typeof (order_no) == 'string') {
        let arr = order_no.split('-')
        if (arr[1]) {
            return Number(arr[1])
        }
    }

    Logger.log('getOrderDate error 单号日期错误,单号:')
    Logger.log(order_no)
    return 0
}
//取流水号
function getFlowNo(order_no) {
    if (typeof (order_no) == 'string') {
        let arr = order_no.split('-')
        if (arr[2]) {
            return Number(arr[2])
        }
    }
    Logger.log('getFlowNo error 流水号错误,单号:')
    Logger.log(order_no)
    return 0
}
// 更新订单的单号
function updateOrder(order, order_no) {
    let dataTemp = JSON.parse(order.data)
    dataTemp.order.order_no = order.return_order_no = order_no
    order.data = JSON.stringify(dataTemp)

    return order
}
// 流水号保留四位
function flowNoFormat(flowNo) {
    let arr = (flowNo / 10000).toFixed(4).toString().split('.')
    return arr[1]
}