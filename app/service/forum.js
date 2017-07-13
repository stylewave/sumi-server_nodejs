module.exports = app => {
  class ForumService extends app.Service {
    // 股吧板块详情
    async boardDetail(boardId, uid) {
      const field = '*';
      const sql = 'SELECT ' + field + " FROM data_forum_board WHERE board_id = '" + app.mysql.escape(boardId) + "' ";
      const result = await app.mysql.query(sql);
      const user = await this.userBoard(uid);

      for (const i in result) {
        const followb = ',' + result[i].board_id + ',';
        if (user.user_follow_board.indexOf(followb) !== -1) {
          console.log('已关注');
          result[i].isfollow = 1;
        } else {
          console.log('没关注');
          result[i].isfollow = 0;
        }
      }
      console.log(result);
      return result.length > 0 ? result[0] : null;
    }

    // 获取股吧板块总的记录数
    async getTotal() {
      const sql = `SELECT COUNT(*) as total FROM data_forum_board WHERE board_status =1`;
      // const sql = "SELECT COUNT(*) as total FROM data_forum_board WHERE board_status = '1'";
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 股吧板块列表
    async list(start, size, order = '') {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      let sql;
      if (order) {
        sql = `SELECT ${field} FROM data_forum_board  WHERE board_status =1  ORDER BY board_hits DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      } else {
        sql = `SELECT ${field} FROM data_forum_board  WHERE board_status =1  ORDER BY board_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      }
      // const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\'   ORDER BY board_id DESC LIMIT ' + start + ',' + size;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result;
    }
    // 热门股吧
    async hot(size) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + ' FROM data_forum_board WHERE board_status = \'1\'  AND board_ishot=1 ORDER BY board_id DESC LIMIT ' + app.mysql.escape(size);
      const result = await app.mysql.query(sql);

      // const user = await this.userBoard(userId);
      // for (const i in result) {
      //   const followb = ',' + result[i].board_id + ',';
      //   if (user.user_follow_board.indexOf(followb) !== -1) {
      //     console.log('已关注');
      //     result[i].isfollow = 1;
      //   } else {
      //     console.log('没关注');
      //     result[i].isfollow = 0;
      //   }
      // }
      return result;
    }
    async userBoard(uid) {
      const user = await app.mysql.get('data_user', { user_id: uid });
      return user;
    }


    // 股吧板块详情
    async forumDetail(boardId) {
      const field = 'board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot';
      const sql = 'SELECT ' + field + " FROM data_forum_board WHERE board_status = '1' AND board_id=" + app.mysql.escape(boardId);
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
    // 关注股吧板块
    async followForum(state, boardId, uid) {
      const user = await app.mysql.get('data_user', { user_id: uid });
      const boardid = ',' + boardId + ',';
      console.log(boardid);
      console.log(user);
      if (user.user_follow_board.indexOf(boardid) !== -1) {
        console.log('已关注');
        return 0;
      }
      const board = await app.mysql.get('data_forum_board', { board_id: boardId });
      const userfollow = user.user_follow_board + boardId + ',';
      const boardfollowcount = parseInt(board.board_follow) + parseInt(1);

      const userSql = 'UPDATE data_user SET user_follow_board = "' + userfollow + '"  WHERE user_id = ' + user.user_id;
      // console.log(userSql);

      const forumSql =
        'UPDATE data_forum_board SET board_follow = ' + boardfollowcount + ' WHERE board_id = ' + app.mysql.escape(boardId);
      // console.log(forumSql);
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
    async cancleFollowForum(state, boardId, uid) {
      const user = await app.mysql.get('data_user', { user_id: uid });
      const boardid = ',' + boardId + ',';
      if (user.user_follow_board.indexOf(boardid) === -1) {
        // console.log('您之前没关注此板块内容');
        return 0;
      }
      const board = await app.mysql.get('data_forum_board', { board_id: boardId });

      const userfollow = user.user_follow_board.replace(boardId + ',', '');
      const boardfollowcount = parseInt(board.board_follow) - parseInt(1);

      const userSql = 'UPDATE data_user SET user_follow_board = "' + userfollow + '"  WHERE user_id = ' + user.user_id;
      console.log(userSql);
      // console.log(boardfollowcount);
      // console.log(userfollow);
      const forumSql =
        'UPDATE data_forum_board SET board_follow = ' + boardfollowcount + ' WHERE board_id = ' + app.mysql.escape(boardId);
      // console.log(forumSql);
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
    async commentdata(boardId, subId = '') {
      const field =
        'reply_id,reply_board_id,reply_user,reply_user_icon,reply_nickname,reply_content,reply_status,DATE_FORMAT(reply_create_time,"%m-%d %H:%i") AS reply_create_time ';
      let sql;
      if (subId) {
        sql = `SELECT ${field} FROM data_forum_reply WHERE reply_status = '1' AND  reply_suject_id=${app.mysql.escape(subId)} AND  reply_board_id=${app.mysql.escape(boardId)} ORDER BY reply_id DESC `;
      } else {
        sql = `SELECT ${field} FROM data_forum_reply WHERE reply_status = '1' AND  reply_board_id=${app.mysql.escape(boardId)} ORDER BY reply_id DESC `;
      }

      // const sql = 'SELECT ' +field +" FROM data_forum_reply WHERE reply_status = '1' AND  reply_suject_id= " + subId +' ORDER BY reply_id DESC ';
      const result = await app.mysql.query(sql);
      return result;
    }

    // 获取股吧主题总的记录数
    async getSubTotal(boardId) {
      const sql = "SELECT COUNT(*) as total FROM data_forum_subject WHERE sub_status = '1' AND sub_board_id=" + app.mysql.escape(boardId);
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 主题列表 order:0表示全部，１表示热门
    async sublist(start, size, boardId, order) {
      let sql;
      const field = 'sub_id,sub_board_id,sub_title,sub_uid,sub_nickname,sub_user_icon,sub_hits,sub_hot_type,sub_reply_count,DATE_FORMAT(sub_create_time,"%m/%d %H:%i") AS sub_create_time';
      if (order === 1) {
        sql = `SELECT ${field} FROM data_forum_subject WHERE sub_status = 1  AND sub_board_id=${app.mysql.escape(boardId)} ORDER BY sub_hits DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      } else {
        sql = `SELECT ${field} FROM data_forum_subject WHERE sub_status = 1  AND sub_board_id=${app.mysql.escape(boardId)} ORDER BY sub_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      }
      console.log(sql);

      const result = await app.mysql.query(sql);
      return result;
    }
    // 获取热门主题总的记录数
    async getSubHotTotal(boardId) {
      const sql = `SELECT COUNT(*) as total FROM data_forum_subject WHERE sub_status = 1  AND sub_board_id='${app.mysql.escape(boardId)}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 主题热门列表
    async subHotlist(start, size, boardId) {

      const field = '*';
      const sql = `SELECT ${field} FROM data_forum_subject WHERE sub_status = 1  AND sub_board_id='${app.mysql.escape(boardId)}' ORDER BY sub_hits DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      const result = await app.mysql.query(sql);
      return result;
    }
    // 股吧主题详情
    async forumSubjectDetail(boardId, subId = '') {
      const field =
        'sub_id,sub_board_id,sub_title,sub_content,sub_uid,sub_user,sub_nickname,sub_user_icon,sub_hits,sub_hot_type,sub_reply_count,DATE_FORMAT(sub_create_time,"%m/%d %H:%i") AS sub_create_time ';
      let sql;
      if (subId) {
        //  sql = 'SELECT ' + field + 'FROM data_forum_subject where sub_status="1" and sub_id=' + subId;
        sql = `SELECT ${field} FROM data_forum_subject where sub_status="1" and sub_id=${app.mysql.escape(subId)} AND sub_board_id=${app.mysql.escape(boardId)}`;
      } else {
        sql = `SELECT ${field} FROM data_forum_subject where sub_status="1" and sub_board_id=${app.mysql.escape(boardId)} ORDER BY sub_id DESC`;
      }
      console.log(sql);

      const result = await app.mysql.query(sql);
      const randhit = parseInt(Math.random() * 5 + 1, 10);
      console.log(randhit);
      const subSql = 'UPDATE data_forum_subject SET sub_hits = sub_hits+' + randhit + '  WHERE sub_id = ' + result[0].sub_id;
      app.mysql.query(subSql);
      return result.length > 0 ? result[0] : null;
    }
    // 股吧主题评论增加
    async commentadd(subId, content, uid) {
      const board = await app.mysql.get('data_forum_subject', { sub_id: subId });
      const user = await app.mysql.get('data_user', { user_id: uid });
      const reply_board_id1 = board.sub_board_id;
      const subSql = 'UPDATE data_forum_subject SET sub_reply_count =sub_reply_count+1 WHERE sub_id = ' + subId;
      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {
        // await conn.query(userSql);
        await conn.query(subSql);
        await conn.insert('data_forum_reply', {
          reply_board_id: reply_board_id1,
          reply_suject_id: subId,
          reply_uid: user.user_id,
          reply_user: user.user_name,
          reply_nickname: user.user_nickname,
          reply_user_icon: user.user_photo,
          reply_content: content,
          reply_create_time: this.app.mysql.literals.now,
        });
        await conn.commit(); // 提交事务
      } catch (err) {
        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        throw err;
      }
    }
    // 股吧主题增加
    async addForumSubject(title, content, boardId, uid) {
      const user = await app.mysql.get('data_user', { user_id: uid });
      const result = await this.app.mysql.insert('data_forum_subject', {
        sub_board_id: boardId,
        sub_title: title,
        sub_content: content,
        sub_uid: user.user_id,
        sub_user: user.user_name,
        sub_nickname: user.user_nickname,
        sub_user_icon: user.user_photo,
        sub_create_time: this.app.mysql.literals.now,
      });
      return result.affectedRows === 1;
    }
    // 判断该股吧板块是否可以增加主题
    async boardAllowSub(boardId) {
      const boardallow = await app.mysql.get('data_forum_board', { board_id: boardId });
      return boardallow.board_allow_subject > 0 ? boardallow.board_allow_subject : 0;
    }
    // 我的关注股吧列表
    async myBoardlist(start, size, uid) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const field = "board_id,board_title,board_description,board_stock_code,board_follow,board_hits,board_ishot";
      const board_id_list = userrow.user_follow_board.replace(/(^,*)|(,*$)/g, "");
      let result;
      if (board_id_list) {
        const sql = `SELECT ${field} FROM data_forum_board where board_status='1' AND board_id in (${board_id_list})  ORDER BY board_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
        const result2 = await app.mysql.query(sql);
        result = result2;
      } else {
        result = 0;
      }
      return result;
    }
    async myBoardTotal(uid) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const board_id_list = userrow.user_follow_board.replace(/(^,*)|(,*$)/g, "");
      let result;
      if (board_id_list) {
        const sql = `SELECT COUNT(*) as total FROM data_forum_board WHERE board_status = 1  AND board_id in (${board_id_list})`;
        const result2 = await app.mysql.query(sql);
        result = result2[0].total;
      } else {
        result = 0;
      }


      return result;
    }


  }
  return ForumService;
};
