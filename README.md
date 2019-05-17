安装环境
npm install

合并数据库
1.把新旧数据库分别拷贝到new_database、old_database目录（pos_order_pos_org_id_218.db），过程涉及修改表，记得留有备份

2.修改文件名（去掉组织后缀）（pos_order_pos_org_id.db）

3.运行 node main_order_count.js
4.再执行 node main_order.js
5.再执行 node main_return_order.js

6. 取./new_database下的新数据库文件，修改名字（添加组织后缀）（pos_order_pos_org_id_218.db）

7. log/normal.log文件有输出日志

