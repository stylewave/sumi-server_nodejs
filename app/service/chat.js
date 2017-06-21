module.exports = app => {
  class ChatService extends app.Service {
    // 查询用户信息
    async getUserInfo(uid) {
      const sql = `SELECT user_id,user_name,user_nickname,user_photo,user_headimg,user_level,user_job_id,user_job_level,user_job_name,user_job_icon FROM data_user WHERE user_id='${uid}'`;
      const result = await app.mysql.query(sql);
      if (result.length) {
        const info = result[0];
        if (info.user_headimg) {
          info.user_logo = info.user_headimg;
        } else {
          if (info.user_photo) {
            info.user_logo = app.config.rootUrl + info.user_photo;
          }
        }
        delete info.user_headimg;
        delete info.user_photo;
      } else {
        return null;
      }
      return result.length > 0 ? result[0] : null;
    }

    // 清空当前redis数据库, 只作测试用
    async removeDB() {
      await this.app.redis.flushdb();
    }

    // 写入在线用户
    async addUser(fd, data) {
      const result = await this.app.redis.hmset(fd, data);
      this.app.redis.expire(fd, 36000);
      return result;
    }

    async getUser(fd) {
      const result = await this.app.redis.hgetall(fd);
      return result;
    }

    async removeUser(fd) {
      const result = await this.app.redis.del(fd);
      return result;
    }

    async getHistory(uid, level, roomid) {
      const adminlevel2 = 6; // 助理级别
      // const adminlevel = 7;
      const field =
        'chat_id ,chat_fd,chat_content  ,chat_nickname ,chat_uid ,chat_level,chat_logo,chat_create_time,chat_reply_time,chat_reply,chat_reply_nickname,chat_reply_level,chat_reply_toid,chat_reply_logo,chat_show,chat_job_id,chat_job_level,chat_job_name';
      let history = [];
      let history2 = [];
      if (level >= adminlevel2) {
        // 助理级别以上
        history = await app.mysql.query(
          `select ${field} from data_chat where chat_room='${roomid}' order by chat_id desc limit 50 `
        );
      } else {
        history = await app.mysql.query(
          `select ${field} from data_chat where chat_room='${roomid}' and chat_show='1' and (chat_level>='${adminlevel2}' or chat_reply_level>='${adminlevel2}') order by chat_id desc `
        );

        history2 = await app.mysql.query(
          `select ${field} from data_chat where chat_room='${roomid}' and chat_level<'${adminlevel2}' and (chat_show='1' or chat_uid='{$uid}') order by chat_id desc `
        );
      }
      // if (history || history2) {
      // }
      const result = {};
      result.list = history;
      result.list2 = history2;
      return result;
    }

    // 写入数据
    async addChat(data) {
      let id;
      const result = await this.app.mysql.insert('data_chat', data);
      if (result.affectedRows === 1) {
        id = result.insertId;
      }
      return id;
    }

    // 获取一条信息
    async getChat(id) {
      const result = await this.app.mysql.get('data_chat', { chat_id: id });
      return result;
    }

    // 回复数据
    async replyChat(data, replyid) {
      let id;
      const result = await this.app.mysql.insert('data_chat', data);
      if (result.affectedRows === 1) {
        id = result.insertId;

        const sql = `UPDATE data_chat SET chat_show = '1' WHERE chat_id ='${replyid}'`;
        await this.app.mysql.query(sql);
      }
      return id;
    }

    // 记录通过
    async passChat(id) {
      const sql = `UPDATE data_chat SET chat_show = '1' WHERE chat_id ='${id}'`;
      const result = await this.app.mysql.query(sql);
      console.log('update res', result);
      return result;
    }
  }
  return ChatService;
};
