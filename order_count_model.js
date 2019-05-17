class OrderCountModel {
    constructor(dao) {
        this.dao = dao
    }
    // 创建表
    createTable() {
        const sql = `
            CREATE TABLE IF NOT EXISTS 'order_count'(
                order_no TEXT PRIMARY KEY,
                order_type TEXT,
                create_time INTEGER,
                is_confirm TEXT
            )
        `
        return this.dao.run(sql)
    }
    // 插入数据
    insert(data) {
        const { order_no, order_type, create_time, is_confirm } = data
        return this.dao.run(
            `INSERT INTO 'order_count' VALUES (?,?,?,?)`,
            [order_no, order_type, create_time, is_confirm]
        )
    }
    // 更新
    update(order_no, old_order_no) {
        return this.dao.run(
            `UPDATE 'order_count' SET order_no = ? WHERE order_no = ?`,
            [order_no, old_order_no]
        )
    }
    getAll() {
        return this.dao.all(`SELECT * FROM 'order_count' ORDER BY order_no DESC`)
    }
}

module.exports = OrderCountModel