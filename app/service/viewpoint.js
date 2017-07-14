
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

      const field = 'comment_id,comment_expert_id,comment_title,comment_hits,comment_beans,comment_intro,ep_name as  comment_expert_name,ep_photo as comment_expert_photo,DATE_FORMAT(comment_create_time,"%m/%d %H:%i") as comment_create_time';
      let where = [];
      where = [['comment_status', '1']];
      const limit = app.mysql.escape(start) + ',' + app.mysql.escape(size);
      const result = await this.ctx.service.utils.db.getAll(field, 'data_expert_comment left join data_expert on (comment_expert_id=ep_id)', where, 'comment_id', limit);
      for (const v in result) {
        result[v].comment_expert_photo = app.config.host + result[v].comment_expert_photo;
      }


      return result;

    }

    // 没购买观点详情
    async commentDetail(commentId = '') {
      const field = 'comment_id,comment_title,comment_intro,comment_hits,comment_beans,comment_expert_id,ep_name as comment_expert_name,ep_photo as comment_expert_photo,DATE_FORMAT(comment_create_time,"%m-%d %H:%i") as comment_create_time';
      let sql;
      let result;
      if (commentId) {
        let where = [];
        where = [['comment_status', '1'], ['comment_id', commentId]];
        result = await this.ctx.service.utils.db.getAll(field, 'data_expert_comment left join data_expert on (comment_expert_id=ep_id)', where);

        // sql = `SELECT ${field} FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = 1 AND comment_id = ${app.mysql.escape(commentId)}`;
      } else {
        const sql2 = `SELECT comment_id,comment_title,comment_intro FROM data_expert_comment ORDER BY comment_id DESC LIMIT 1`;
        const re = await app.mysql.query(sql2);
        sql = `SELECT ${field} FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = 1 AND comment_id = ${re[0].comment_id}`;
        result = await app.mysql.query(sql);
      }


      for (const v in result) {
        // console.log(v);
        result[v].comment_expert_photo = app.config.host + result[v].comment_expert_photo;
      }
      return result.length > 0 ? result[0] : null;
    }


    // 购买观点详情
    async commentDetailBuy(commentId = '') {
      const field = 'comment_id,comment_title,comment_intro,comment_hits,comment_beans,comment_content,comment_expert_id,ep_name as comment_expert_name,ep_photo as comment_expert_photo,DATE_FORMAT(comment_create_time,"%m-%d %H:%i") as comment_create_time';
      let sql;
      let result;
      if (commentId) {
        let where = [];
        where = [['comment_status', '1'], ['comment_id', commentId]];
        result = await this.ctx.service.utils.db.getAll(field, 'data_expert_comment left join data_expert on (comment_expert_id=ep_id)', where);
        //  sql = `SELECT ${field} FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = 1 AND comment_id = '${app.mysql.escape(commentId)}'`;
      } else {
        const sql2 = `SELECT comment_id,comment_title,comment_intro FROM data_expert_comment ORDER BY comment_id DESC LIMIT 1`;
        const re = await app.mysql.query(sql2);
        sql = `SELECT ${field} FROM data_expert_comment left join data_expert on (comment_expert_id=ep_id) WHERE comment_status = 1 AND comment_id = '${re[0].comment_id}'`;
        result = await app.mysql.query(sql);
      }

      for (const v in result) {
        console.log(v);
        result[v].comment_expert_photo = app.config.host + result[v].comment_expert_photo;
      }
      return result.length > 0 ? result[0] : null;
    }

    // 判断是否已购买了该观点
    async buydata(commentId = '', uid) {
      let data;
      if (commentId) {
        data = await app.mysql.get('data_user_bean_log', { log_uid: uid, log_main_id: commentId, log_type: 'buy_expert_comment' });
      } else {
        const field = "comment_id,comment_title,comment_intro";
        const sql = `SELECT ${field} FROM data_expert_comment  ORDER BY comment_id DESC LIMIT 1`;
        const result = await app.mysql.query(sql);
        // console.log(result[0].comment_id);
        data = await app.mysql.get('data_user_bean_log', { log_uid: uid, log_main_id: result[0].comment_id, log_type: 'buy_expert_comment' });

      }
      return data;
    }

    // 判断是否用户的豆币是否可以购买
    async beanNum(beannum, uid) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const userbeans = userrow.user_beans + userrow.user_bonus_beans;
      if (beannum > userbeans) {
        return 0;
      }
      return 1;
    }

    // 购买观点
    async buyExpertComment(commentId, uid) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const userbeans = userrow.user_beans + userrow.user_bonus_beans;
      const dedata = await this.commentDetail(commentId);
      const total = dedata.comment_beans;

      const end = userbeans - total;
      let subSql;
      if (userrow.user_bonus_beans >= total) {
        const userbean = userrow.user_bonus_beans - total;
        subSql = `UPDATE data_user SET user_bonus_beans ='${userbean}' WHERE user_id = ${app.mysql.escape(uid)}`;

      } else {
        const userbean = userbeans - total;
        subSql = `UPDATE data_user SET user_beans ='${userbean}',user_bonus_beans = 0  WHERE user_id =${app.mysql.escape(uid)}`;

      }
      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {

        await conn.insert('data_user_bean_log', { log_uid: userrow.user_id, log_user: userrow.user_name, log_nickname: userrow.user_nickname, log_type: 'buy_expert_comment', log_main_table: 'data_expert_comment', log_main_id: commentId, log_content: '购买投顾文章[' + dedata.comment_title + ']', log_count: 0 - dedata.comment_beans, log_bean_before: userbeans, log_bean_end: end, log_create_time: this.app.mysql.literals.now });

        await conn.query(subSql);

        await conn.commit(); // 提交事务
        return end;
      } catch (err) {
        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }


    }


    // 大数据列表
    async marketList() {
      const sql = 'SELECT mk_point1,mk_point2,mk_point3,mk_point4 FROM data_market  ORDER BY mk_id DESC';
      const result = await app.mysql.query(sql);
      return result[0];

    }
    // 获取多空策略的记录数
    async getVideoPage() {
      const sql = 'SELECT COUNT(*) as total FROM data_video WHERE video_status=1';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 多空策略
    async marketVideo(start, size) {

      // const field = 'video_id,video_title,video_url,video_photo,video_hits';
      const where = { video_status: '1' };
      const data_columns = ['video_id', 'video_title', 'video_url', 'video_photo', 'video_hits'];
      const result = await this.ctx.service.utils.db.select('data_video', where, data_columns, 'video_id', size, start);
      for (const v in result) {
        result[v].video_photo = app.config.host + result[v].video_photo;
      }

      return result;
    }
    async marketVideoDetail(videoId) {
      const field = 'video_id,video_title,video_url,video_content,video_hits,DATE_FORMAT(video_create_time,"%Y-%d-%m %H:%i") AS video_create_time';
      const sql = `SELECT ${field} FROM data_video WHERE video_status=1 and video_id = ${app.mysql.escape(videoId)}`;

      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;

    }


  }
  return ViewpointService;
};
