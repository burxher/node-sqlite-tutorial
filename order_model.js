class OrderModel {
    constructor(dao) {
        this.dao = dao
    }
    // 创建表
    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS 'order' (
                order_no TEXT PRIMARY KEY,
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
        const { order_no, create_time, is_confirm, data, submit_time, user_integral, submit_count } = order
        return this.dao.run(
            `INSERT INTO 'order' VALUES (?,?,?,?,?,?,?)`,
            [order_no, create_time, is_confirm, data, submit_time, user_integral, submit_count])
    }
    delete(order_no) {
        return this.dao.run(
            `DELETE FROM 'order' WHERE order_no = ?`,
            [order_no]
        )
    }
    update(row, new_order_no) {
        let data
        let dataTemp = JSON.parse(row.data)
        dataTemp.order.order_no = new_order_no
        data = JSON.stringify(dataTemp)
        return this.dao.run(
            `UPDATE 'order' SET order_no = ?,data = ? WHERE order_no = ?`,
            [new_order_no, data, row.order_no]
        )
    }
    getByOrderNo(order_no) {
        return this.dao.get(
            `SELECT * FROM 'order' WHERE order_no = ?`,
            [order_no])
    }
    getAll() {
        return this.dao.all(`SELECT * FROM 'order' ORDER BY order_no DESC`)
    }
}

module.exports = OrderModel