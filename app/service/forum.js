module.exports = app => {
  class ForumService extends app.Service {

    // 获取总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_forum_board WHERE board_status = \'1\'';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 股吧列表
    async list(start, size) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\' ORDER BY board_id DESC LIMIT ' + start + ',' + size;
      const result = await app.mysql.query(sql);
      return result;
    }

    // 股吧详情
    async forumDetail(boardId) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\' AND board_id=' + boardId;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }

    async followForum(state, boardId) {

      const user = await app.mysql.get('data_user', { user_id: this.ctx.session.userInfo.user_id });
      const board = await app.mysql.get('data_forum_board', { board_id: boardId });

      console.log(board.board_follow);
      console.log(user.user_id);
      const row1 = {
        user_id: user.user_id,
        user_follow_board: user.user_follow_board + boardId,
      };
      console.log(row1);
      const count = parseInt(board.board_follow) - parseInt(1);
      console.log(count);

      const row2 = {
        board_id: board.board_id,
        board_follow: board.board_follow,
      };


      // const conn = await app.mysql.beginTransaction(); // 初始化事务
      // try {

      //   await conn.update('data_user', row1);
      //   await conn.update('data_forum_board', row2);
      //   await conn.commit(); // 提交事务
      // } catch (err) {
      //   // error, rollback
      //   await conn.rollback(); // 一定记得捕获异常后回滚事务！！
      //   throw err;
      // }

      const result = await app.mysql.beginTransactionScope(function* (conn) {
        // don't commit or rollback by yourself
        await app.mysql.update('data_user', row1);
        await app.mysql.update('data_forum_board', row2);
        return { success: true };
      }, this.ctx);
    }


  }
  return ForumService;
};
