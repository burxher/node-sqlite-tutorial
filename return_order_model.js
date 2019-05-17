class ReturnOrderModel {
    constructor(dao) {
        this.dao = dao
    }
    // 创建表
    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS 'return_order' (
                order_no TEXT,
                return_order_no TEXT PRIMARY KEY,
                create_time INTEGER,
                is_confirm TEXT,
                data TEXT,
                submit_time INTEGER,
                user_integral TEXT,
                submit_count INTEGER
            )
        `
        return this.dao.run(sql)
    }
    // 插入数据
    insert(order) {
        const { order_no, return_order_no, create_time, is_confirm, data, submit_time, user_integral, submit_count } = order
        return this.dao.run(
            `INSERT INTO 'return_order' VALUES (?,?,?,?,?,?,?,?)`,
            [order_no, return_order_no, create_time, is_confirm, data, submit_time, user_integral, submit_count]
        )
    }
    // 更新
    update_order_no(row,new_order_no) {
        let data
        let dataTemp = JSON.parse(row.data)
        dataTemp.order.old_order_no = new_order_no
        data = JSON.stringify(dataTemp)
        return this.dao.run(
            `UPDATE 'return_order' SET order_no = ?,data = ? WHERE order_no = ?`,
            [new_order_no, data, row.order_no]
        )
    }
    update_return_order_no(row, new_return_order_no) {
        let data
        let dataTemp = JSON.parse(row.data)
        dataTemp.order.order_no = new_return_order_no
        data = JSON.stringify(dataTemp)
        return this.dao.run(
            `UPDATE 'return_order' SET return_order_no = ?, data = ? WHERE return_order_no = ?`,
            [new_return_order_no, data, row.return_order_no]
        )
    }
    getByOrderNo(order_no) {
        return this.dao.get(
            `SELECT * FROM 'return_order' WHERE order_no = ?`,
            [order_no]
        )
    }
    getByReturnOrderNo(return_order_no) {
        return this.dao.get(
            `SELECT * FROM 'return_order' WHERE return_order_no = ?`,
            [return_order_no]
        )
    }
    getAll() {
        return this.dao.all(`SELECT * FROM 'return_order' ORDER BY return_order_no DESC`)
    }
}

module.exports = ReturnOrderModel