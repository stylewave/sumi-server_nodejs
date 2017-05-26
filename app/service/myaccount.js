
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

    // 豆币记录
    async userBeanLog(userId) {

      const field = 'log_id,log_content,log_uid,log_type,log_count,log_main_table,log_main_id,log_create_time,log_recharge_beans';
      const sql = 'SELECT ' + field + ' FROM data_user_money_log  WHERE log_uid = ' + userId + ' ORDER BY log_id DESC ';
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result;

    }

    // 观点详情
    async commentDetail(id) {
      const field = 'comment_id,comment_title,comment_intro,comment_hits,comment_create_time,comment_beans,comment_content,comment_expert_id,ep_name as comment_expert_name,ep_photo as comment_expert_photo';
      const sql = 'SELECT ' + field + " FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = \'1\' AND comment_id = '" + id + "' ";
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }




    // 获取多空舆情总的记录数
    async getMarketMaxPage() {
      const sql = 'SELECT COUNT(*) as total FROM data_market ';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 多空舆情列表
    async marketList(start, size) {
      const sql = 'SELECT * FROM data_market  ORDER BY mk_id DESC LIMIT ' + start + ',' + size;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result;

    }


  }
  return ViewpointService;
};
