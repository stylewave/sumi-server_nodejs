
module.exports = app => {
  class ViewpointService extends app.Service {

    // 获取观点总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_expert_comment WHERE comment_status = \'1\'';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 观点列表
    async expertCommentList(start, size) {

      const field = 'comment_id,comment_expert_id,comment_title,comment_hits,comment_beans,comment_intro,comment_create_time,ep_name as  comment_expert_name,ep_photo as comment_expert_photo';
      const sql = 'SELECT ' + field + ' FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = \'1\' ORDER BY comment_id DESC LIMIT ' + start + ',' + size;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result;

    }

    // 没购买观点详情
    async commentDetail(commentId) {
      const field = 'comment_id,comment_title,comment_intro,comment_hits,comment_create_time,comment_beans,comment_expert_id,ep_name as comment_expert_name,ep_photo as comment_expert_photo';
      const sql = 'SELECT ' + field + " FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = \'1\' AND comment_id = '" + commentId + "' ";
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }


    // 购买观点详情
    async commentDetailBuy(commentId) {
      const field = 'comment_id,comment_title,comment_intro,comment_hits,comment_create_time,comment_beans,comment_content,comment_expert_id,ep_name as comment_expert_name,ep_photo as comment_expert_photo';
      const sql = 'SELECT ' + field + " FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = \'1\' AND comment_id = '" + commentId + "' ";
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }

    // 判断是否已购买了该观点
    async buydata(commentId, userId) {
      const data = await app.mysql.get('data_user_bean_log', { log_uid: userId, log_main_id: commentId, log_type: 'buy_expert_comment' });
      return data;
    }

    // 判断是否用户的豆币是否可以购买
    async beanNum(beannum, userId) {
      const userrow = await app.mysql.get('data_user', { user_id: userId });
      const userbeans = userrow.user_beans + userrow.user_bonus_beans;
      if (beannum > userbeans) {
        return 0;
      }
      return 1;
    }

    // 购买观点
    async buyExpertComment(commentId, userId) {
      const userrow = await app.mysql.get('data_user', { user_id: userId });
      const userbeans = userrow.user_beans + userrow.user_bonus_beans;
      const dedata = await this.commentDetail(commentId);
      const total = dedata.comment_beans;

      const end = userbeans - total;
      let subSql;
      if (userrow.user_bonus_beans >= total) {
        const userbean = userrow.user_bonus_beans - total;
        subSql = 'UPDATE data_user SET user_bonus_beans =' + userbean + ' WHERE user_id = ' + userId;

      } else {
        const userbean = userbeans - total;
        subSql = 'UPDATE data_user SET user_beans =' + userbean + ',`user_bonus_beans` = 0  WHERE user_id = ' + userId;

      }
      console.log(subSql);


      // const result = await this.app.mysql.insert('data_user_bean_log', { log_uid: userrow.user_id, log_user: userrow.user_name, log_nickname: userrow.user_nickname, log_type: 'buy_expert_comment', log_main_table: 'data_expert_comment', log_main_id: commentId, log_content: '购买投顾文章[' + userrow.comment_title + ']', log_count: 0 - dedata.comment_beans, log_bean_before: userbeans, log_bean_end: end, log_create_time: this.app.mysql.literals.now });

      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {

        await conn.insert('data_user_bean_log', { log_uid: userrow.user_id, log_user: userrow.user_name, log_nickname: userrow.user_nickname, log_type: 'buy_expert_comment', log_main_table: 'data_expert_comment', log_main_id: commentId, log_content: '购买投顾文章[' + dedata.comment_title + ']', log_count: 0 - dedata.comment_beans, log_bean_before: userbeans, log_bean_end: end, log_create_time: this.app.mysql.literals.now });

        await conn.query(subSql);

        await conn.commit(); // 提交事务
      } catch (err) {
        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }


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
