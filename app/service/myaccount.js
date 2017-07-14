module.exports = app => {
  class MyaccountController extends app.Service {
    // 获取总的资金记录数
    async getMoneylogTotal(uid, type = '') {
      let sql;
      if (type) {
        sql = `SELECT COUNT(*) as total FROM data_user_money_log WHERE log_uid = ${app.mysql.escape(uid)} AND log_type=${app.mysql.escape(type)}`;
      } else {
        sql = `SELECT COUNT(*) as total FROM data_user_money_log WHERE log_uid = ${app.mysql.escape(uid)}`;
      }
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 用户资金记录
    async userMoneylog(uid, start, size, type = '') {
      const field = 'log_id,log_content,log_uid,log_type,log_count,log_main_table,log_main_id,log_recharge_beans,log_recharge_sn,DATE_FORMAT(log_create_time,"%Y年%m月%d日 %H:%i") as log_create_time';
      let sql;
      if (type) {
        sql = `SELECT ${field} FROM data_user_money_log  WHERE log_uid = ${app.mysql.escape(uid)} AND log_recharge_beans > 0 AND log_type=${app.mysql.escape(type)} ORDER BY log_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      } else {
        sql = `SELECT ${field} FROM data_user_money_log  WHERE log_uid = ${app.mysql.escape(uid)} AND log_recharge_beans > 0 ORDER BY log_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      }
      const result = await app.mysql.query(sql);
      return result;
    }
    // 豆币记录总的记录数
    async userBeanLogTotal(uid) {
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid='${app.mysql.escape(uid)}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 豆币记录列表
    async userBeanLog(uid, start, size) {
      const where = { log_uid: uid };
      const data_columns = ['log_id', 'log_content', 'log_uid', 'log_type', 'log_count', 'log_main_table', 'log_main_id', 'log_remark', 'log_create_time'];
      const result = await this.ctx.service.utils.db.select('data_user_bean_log', where, data_columns, ['log_id', 'desc'], size, start);
      const moment = require("moment");
      if (result.length > 0) {
        for (const v in result) {
          result[v].log_create_time = moment(result[v].log_create_time).format("MM-DD HH:mm");
        }
      }
      return result;
    }
    // 回收记录总的记录数
    async beanReturnTotal(uid) {
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_return WHERE return_uid='${app.mysql.escape(uid)}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    //  豆币回收列表
    async beanReturnList(uid, start, size) {

      const where = { return_uid: uid };
      const data_columns = ['return_id', 'return_uid', 'return_beans', 'return_money', 'return_account_type', 'return_create_time', 'return_finish_time', 'return_status'];
      const result = await this.ctx.service.utils.db.select('data_user_bean_return', where, data_columns, ['return_id', 'desc'], size, start);
      const moment = require("moment");
      if (result.length > 0) {
        for (const v in result) {
          result[v].return_create_time = moment(result[v].return_create_time).format("MM/DD HH:mm");
        }
      }
      return result;
    }
    //  豆币回收详情
    async beanReturnDetail(returnId) {
      const data = await app.mysql.get('data_user_bean_return', { return_id: returnId });
      return data;
    }

    //  豆币回收
    async beanReturn(
      uid,
      beans,
      account_type,
      alipay_account = '',
      wxpay_account = '',
      unionpay_account = '',
      unionpay_name = '',
      unionpay_bank = '',
      mobile = ''
    ) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const money = beans * 0.8;
      let user_beans;
      const u_money = userrow.user_money + money;
      const end = userrow.user_beans - beans;
      const userSql = `UPDATE data_user SET user_beans= '${end}', user_money = '${u_money}' WHERE user_id = ${app.mysql.escape(uid)}`;
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
