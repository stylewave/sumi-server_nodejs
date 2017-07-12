module.exports = app => {
  class UserService extends app.Service {
    // 查询用户信息
    async findByUid(mobile) {
      const sql = `SELECT user_salt FROM data_user WHERE user_name=${app.mysql.escape(mobile)}`;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0].user_salt : null;
    }

    // 查询用户信息
    async findByToken(uid, token) {
      const userInfo = await app.mysql.get('data_user', { user_id: app.mysql.escape(uid), user_token: token });
      return userInfo;
    }
    // 头像和昵称设置
    async setUserPhoto(uid, photo, nickname) {
      const userphoto = '/public/images/icon/' + photo + '.png';
      const userSql = `UPDATE data_user SET user_photo =${app.mysql.escape(userphoto)},user_nickname=${app.mysql.escape(nickname)}  WHERE user_id = ${app.mysql.escape(uid)}`;
      console.log(userSql);
      const result = await this.app.mysql.query(userSql);
      return result.affectedRows;

    }
    // 用户购买房间总数
    async chatRootTotal(uid) {
      const moment = require("moment");
      const time = moment().format("YYYY-MM-DD");
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid=${app.mysql.escape(uid)} AND log_room_expire >='${time}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;

    }
    // 购买房间列表
    async chatRootList(uid, start, size) {

      const moment = require("moment");
      const time = moment().format("YYYY-MM-DD");
      const field = 'log_id,log_main_id,log_room_expire,room_title as log_title ,room_photo as log_photo ,room_hits as log_hits';

      const sql = `SELECT ${field} FROM data_user_bean_log left join data_room on (room_id=log_main_id) WHERE log_uid = ${app.mysql.escape(uid)} AND log_type='join_room' AND log_room_expire >='${time}' ORDER BY log_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      const result = await app.mysql.query(sql);
      for (const v in result) {
        console.log(v);
        result[v].log_photo = app.config.host + result[v].log_photo;
      }
      // console.log(result);
      return result;
    }
    // 用户消息总的记录数
    async userMsgTotal(uid, type = '') {
      let sql;
      if (type) {
        sql = `SELECT COUNT(*) as total FROM data_msg WHERE msg_uid=${app.mysql.escape(uid)} AND msg_type=${app.mysql.escape(type)}`;
      } else {
        sql = `SELECT COUNT(*) as total FROM data_msg WHERE msg_uid=${app.mysql.escape(uid)}`;
      }
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 用户消息列表
    async userMsgList(start, size, uid, type = '') {
      const field = 'msg_id,msg_type,msg_action,msg_isread,msg_main_id,msg_title,DATE_FORMAT(msg_create_time,"%Y-%m-%d %H:%i:%s") as msg_create_time';
      let sql;
      if (type) {
        sql = `SELECT ${field} FROM data_msg WHERE msg_uid=${app.mysql.escape(uid)} AND msg_type=${app.mysql.escape(type)} ORDER BY msg_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      } else {
        sql = `SELECT ${field} FROM data_msg WHERE msg_uid='${app.mysql.escape(uid)}' ORDER BY msg_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      }
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result : null;
    }

  }
  return UserService;
};
