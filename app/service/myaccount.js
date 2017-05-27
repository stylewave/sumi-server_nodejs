
module.exports = app => {
  class ViewpointService extends app.Service {

    // 获取观点总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_expert_comment WHERE comment_status = \'1\'';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 充值记录
    async userMoneylog(userId) {

      const field = 'log_id,log_content,log_uid,log_type,log_count,log_main_table,log_main_id,log_create_time,log_recharge_beans';
      const sql = 'SELECT ' + field + ' FROM data_user_money_log  WHERE log_uid = ' + userId + ' ORDER BY log_id DESC ';
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result;

    }
    // 豆币记录总的记录数
    async getBeanTotal(userId) {
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid='${userId}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 豆币记录
    async userBeanLog(userId, page, size) {
      const start = (page - 1) * size;
      // consloe.log();
      this.ctx.service.utils.page.paginate(page, size, this.getBeanTotal(userId));
      const prev = await this.ctx.service.utils.page.prev();
      const next = await this.ctx.service.utils.page.next();
      console.log(prev);
      console.log('rs2');
      console.log(next);
      // const field = 'log_id,log_content,log_uid,log_type,log_count,log_main_table,log_main_id,log_create_time,log_remark';
      const field = 'log_id';
      const sql = `SELECT ${field} FROM data_user_bean_log  WHERE log_uid = '${userId}' ORDER BY log_id DESC LIMIT ${start},${size}`;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return {
        result,
        prev,
        next,
      };

    }




  }
  return ViewpointService;
};
