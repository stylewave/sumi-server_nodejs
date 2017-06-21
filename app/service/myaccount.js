
module.exports = app => {
  class MyaccountController extends app.Service {

    // 用户资金记录
    async userMoneylog(uid) {

      const field = 'log_id,log_content,log_uid,log_type,log_count,log_main_table,log_main_id,log_create_time,log_recharge_beans';
      const sql = `SELECT '${field}' FROM data_user_money_log  WHERE log_uid = '${uid}' ORDER BY log_id DESC`;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result;

    }
    // 豆币记录总的记录数
    async userBeanLogTotal(uid) {
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid='${uid}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 豆币记录列表
    async userBeanLog(uid, start, size) {

      const field = 'log_id,log_content,log_uid,log_type,log_count,log_main_table,log_main_id,log_create_time,log_remark';

      const sql = `SELECT ${field} FROM data_user_bean_log  WHERE log_uid = '${uid}' ORDER BY log_id DESC LIMIT ${start},${size}`;
      // console.log(sql);
      const result = await app.mysql.query(sql);
      return result;

    }
    //  豆币回收列表
    async beanReturnList(uid, status = '') {

      const field = 'return_id,return_uid,return_beans,return_money,return_account_type,DATE_FORMAT(return_create_time,"%m/%d %H:%i") as return_create_time,return_finish_time,return_status';
      let sql;
      if (status) {
        sql = `SELECT ${field} FROM data_user_bean_return  WHERE return_uid = ${uid} AND return_status=${status} ORDER BY return_id DESC `;
      } else {
        sql = `SELECT ${field} FROM data_user_bean_return  WHERE return_uid = ${uid}  ORDER BY return_id DESC `;
      }

      console.log(sql);
      const result = await app.mysql.query(sql);
      return {
        result,
      };

    }
    //  豆币回收详情
    async beanReturnDetail(returnId) {
      const data = await app.mysql.get('data_user_bean_return', { return_id: returnId });
      return data;
    }

    //  豆币回收
    async beanReturn(uid, beans, account_type, alipay_account = '', wxpay_account = '', unionpay_account = '', unionpay_name = '', unionpay_bank = '', mobile = '') {

      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const money = beans * 0.8;
      let user_beans;
      const u_money = userrow.user_money + money;
      const end = userrow.user_beans - beans;
      const userSql = `UPDATE data_user SET user_beans='${end}',user_money='${u_money}' WHERE user_id = ${uid}`;
      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {
        await conn.query(userSql);
        const be = await conn.insert('data_user_bean_return', {
          return_uid: userrow.user_id,
          return_user: userrow.user_name,
          return_nickname: userrow.user_nickname,
          return_beans: beans,
          return_money: money,
          return_account_type: account_type,
          return_create_time: this.app.mysql.literals.now,
          return_status: '0',

          return_alipay_account: alipay_account,
          return_wxpay_account: wxpay_account,
          return_unionpay_account: unionpay_account,
          return_unionpay_name: unionpay_name,
          return_unionpay_bank: unionpay_bank,
          return_mobile: mobile,

        });


        await conn.insert('data_user_bean_log', {
          log_uid: userrow.user_id,
          log_user: userrow.user_name,
          log_nickname: userrow.user_nickname,
          log_type: 'bean_return',
          log_main_table: 'data_user_bean_return',
          log_main_id: be.insertId,
          log_content: '豆回收(' + beans + ')',
          log_count: 0 - beans,
          log_bean_before: userrow.user_beans,
          log_bean_end: userrow.user_beans - beans,
          log_create_time: this.app.mysql.literals.now,
        });

        await conn.commit(); // 提交事务
        user_beans = userrow.user_beans - beans;

      } catch (err) {
        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }
      return user_beans;
    }


  }
  return MyaccountController;
};
