module.exports = app => {
  class ForumService extends app.Service {
<<<<<<< HEAD
    // 拉取新闻列表
    async boardDetail(id) {
      const field = '*';
      const sql = 'SELECT ' + field + " FROM data_forum_board WHERE board_id = '" + id + "' ";
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
    /*
    // 获取总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_news WHERE news_show = \'1\'';
=======

    // 获取总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_forum_board WHERE board_status = \'1\'';
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

<<<<<<< HEAD
    // 拉取新闻列表
    async list(start, size) {
      const field = 'news_id,news_title,news_intro,news_create_time,news_hits';
      const sql = 'SELECT ' + field + ' FROM data_news WHERE news_show = \'1\' ORDER BY news_id DESC LIMIT ' + start + ',' + size;
=======
    // 股吧列表
    async list(start, size) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\' ORDER BY board_id DESC LIMIT ' + start + ',' + size;
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      const result = await app.mysql.query(sql);
      return result;
    }

<<<<<<< HEAD
    // 拉取新闻详情
    async newsDetail(newsId) {
      const field = 'news_id,news_title,news_content,news_create_time,news_hits';
      const sql = 'SELECT ' + field + ' FROM data_news WHERE news_show = \'1\' AND news_id=' + newsId;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
    */
=======
    // 股吧详情
    async forumDetail(boardId) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\' AND board_id=' + boardId;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }

    async followForum(state, boardId) {

      const user = await app.mysql.get('data_user', { user_id: 51 });
      const board = await app.mysql.get('data_forum_board', { board_id: boardId });

      const userSql = 'UPDATE data_user SET user_follow_board = ' + boardId + ' WHERE user_id = ' + user.user_id;
      console.log(userSql);

      const forumSql = 'UPDATE data_forum_board SET board_follow = ' + board.board_follow + ' WHERE board_id = ' + boardId;
      console.log(forumSql);
      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {
        await conn.query(userSql);
        await conn.query(forumSql);
        await conn.commit(); // 提交事务
      } catch (err) {
        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }
    }
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
  }
  return ForumService;
};
