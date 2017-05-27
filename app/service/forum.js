module.exports = app => {
  class ForumService extends app.Service {

    // 股吧板块详情
    async boardDetail(id) {
      const field = '*';
      const sql = 'SELECT ' + field + " FROM data_forum_board WHERE board_id = '" + id + "' ";
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }

    // 获取股吧板块总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_forum_board WHERE board_status = \'1\'';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 股吧板块列表
    async list(start, size) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\'   ORDER BY board_id DESC LIMIT ' + start + ',' + size;
      const result = await app.mysql.query(sql);
      return result;
    }
    // 热门股吧
    async hot(size) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\'  AND board_ishot=1 ORDER BY board_id DESC LIMIT ' + size;
      const result = await app.mysql.query(sql);
      // console.log(result);
      // var myStringArray = ["Hello","World"];

      console.log('board_hits');
      for (const i in result) {
        console.log(result[i].board_title);
      }

      // if (key === 'sh') {
      //   break;
      // }
      // }
      return result;
    }

    // 股吧板块详情
    async forumDetail(boardId) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\' AND board_id=' + boardId;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
    // 关注股吧板块
    async followForum(state, boardId, userId) {

      const user = await app.mysql.get('data_user', { user_id: userId });
      console.log(user.user_follow_board);

      if (user.user_follow_board.indexOf(boardId) !== -1) {
        console.log('已关注');
        return 0;
      }
      const board = await app.mysql.get('data_forum_board', { board_id: boardId });
      const userfollow = user.user_follow_board + boardId + ',';
      const boardfollowcount = parseInt(board.board_follow) + parseInt(1);

      const userSql = 'UPDATE data_user SET user_follow_board = "' + userfollow + '"  WHERE user_id = ' + user.user_id;
      console.log(userSql);

      const forumSql = 'UPDATE data_forum_board SET board_follow = ' + boardfollowcount + ' WHERE board_id = ' + boardId;
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

    // 取消关注股吧板块
    async cancleFollowForum(state, boardId, userId) {

      const user = await app.mysql.get('data_user', { user_id: userId });
      if (user.user_follow_board.indexOf(boardId) === -1) {
        console.log('您之前没关注此板块内容');
        return 0;
      }
      const board = await app.mysql.get('data_forum_board', { board_id: boardId });

      const userfollow = user.user_follow_board.replace(boardId + ',', '');
      const boardfollowcount = parseInt(board.board_follow) - parseInt(1);

      const userSql = 'UPDATE data_user SET user_follow_board = "' + userfollow + '"  WHERE user_id = ' + user.user_id;
      console.log(userSql);
      // console.log(boardfollowcount);
      // console.log(userfollow);
      const forumSql = 'UPDATE data_forum_board SET board_follow = ' + boardfollowcount + ' WHERE board_id = ' + boardId;
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

    // 股吧主题评论
    async commentdata(subId) {
      const field = 'reply_id,reply_board_id,reply_user,reply_user_icon,reply_nickname,reply_content,reply_create_time,reply_status';
      const sql = 'SELECT ' + field + ' FROM data_forum_reply WHERE reply_status = \'1\' AND  reply_suject_id= ' + subId + ' ORDER BY reply_id DESC ';
      const result = await app.mysql.query(sql);
      return result;
    }

    // 获取股吧主题总的记录数
    async getSubTotal(boardId) {
      const sql = 'SELECT COUNT(*) as total FROM data_forum_subject WHERE sub_status = \'1\' AND sub_board_id=' + boardId;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 主题列表
    async sublist(start, size, boardId, type) {
      let hot;
      if (type === 1) {
        hot = "and sub_hot_type='1'";
      } else {
        hot = '';
      }
      // const hot = style === 'hot' ? 'and sub_set_hot_info=1' : '';
      console.log(hot);

      // const sql = 'SELECT sub_title FROM data_forum_subject WHERE sub_status = \'1\'  AND sub_board_id=' + boardId + ' ORDER BY `sub_id` DESC LIMIT ' + start + ',' + size;
      const field = 'sub_title';
      const sql = `SELECT ${field} FROM data_forum_subject WHERE sub_status = 1 ${hot} AND sub_board_id='${boardId}' ORDER BY sub_id DESC LIMIT ${start},${size}`;
      console.log(sql);

      const result = await app.mysql.query(sql);
      return result;
    }
    // 股吧主题详情
    async forumSubjectDetail(subId) {
      const field = 'sub_id,sub_board_id,sub_title,sub_content,sub_uid,sub_user,sub_nickname,sub_user_icon,sub_hits,sub_hot_type,sub_reply_count,DATE_FORMAT(sub_create_time,"%m-%d %H:%i") AS sub_create_time ';
      const sql = 'SELECT ' + field + 'FROM data_forum_subject where sub_status="1" and sub_id=' + subId;
      const result = await app.mysql.query(sql);
      const randhit = parseInt(Math.random() * 5 + 1, 10);
      console.log(randhit);
      const subSql = 'UPDATE data_forum_subject SET sub_hits = sub_hits+' + randhit + '  WHERE sub_id = ' + subId;
      app.mysql.query(subSql);
      return result.length > 0 ? result[0] : null;
    }
    // 股吧主题评论增加
    async commentadd(subId, content, userId) {
      const board = await app.mysql.get('data_forum_subject', { sub_id: subId });
      const user = await app.mysql.get('data_user', { user_id: userId });
      const reply_board_id1 = board.sub_board_id;
      const subSql = 'UPDATE data_forum_subject SET sub_reply_count =sub_reply_count+1 WHERE sub_id = ' + subId;
      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {
        // await conn.query(userSql);
        await conn.query(subSql);
        await conn.insert('data_forum_reply', { reply_board_id: reply_board_id1, reply_suject_id: subId, reply_uid: user.user_id, reply_user: user.user_name, reply_nickname: user.user_nickname, reply_user_icon: user.user_photo, reply_content: content, reply_create_time: this.app.mysql.literals.now });
        await conn.commit(); // 提交事务
      } catch (err) {
        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }
    }
    // 股吧主题增加
    async addForumSubject(title, content, boardId, userId) {
      const user = await app.mysql.get('data_user', { user_id: userId });
      const result = await this.app.mysql.insert('data_forum_subject', { sub_board_id: boardId, sub_title: title, sub_content: content, sub_uid: user.user_id, sub_user: user.user_name, sub_nickname: user.user_nickname, sub_user_icon: user.user_photo, sub_create_time: this.app.mysql.literals.now });
      return result.affectedRows === 1;
    }
    // 判断该股吧板块是否可以增加主题
    async boardAllowSub(boardId) {
      const boardallow = await app.mysql.get('data_forum_board', { board_id: boardId });
      return boardallow.board_allow_subject > 0 ? boardallow.board_allow_subject : 0;
    }

  }
  return ForumService;
};
