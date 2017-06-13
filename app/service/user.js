module.exports = app => {
  class UserService extends app.Service {
    // 查询用户信息
    async findByUid(mobile) {
      const sql = `SELECT user_salt FROM data_user WHERE user_name='${mobile}'`;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0].user_salt : null;
    }

    // 查询用户信息
    async findByToken(uid, token) {
      const userInfo = await app.mysql.get('data_user', { user_id: uid, user_token: token });
      return userInfo;
    }
    // 头像和昵称设置
    async setUserPhoto(userId, photo, nickname) {
      const userphoto = '/public/images/icon/' + photo + '.png';
      const userSql = `UPDATE data_user SET user_photo ='${userphoto}',user_nickname='${nickname}'  WHERE user_id = '${userId}'`;
      const result = await this.app.mysql.query(userSql);
      return result.affectedRows;

    }

    async chatRootList(userId, page, size) {
      const start = (page - 1) * size;
      const moment = require("moment");
      const time = moment().format("YYYY-MM-DD");
      const sqlcount = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid='${userId}' AND log_room_expire >='${time}'`;
      const total = await app.mysql.query(sqlcount);
      const roomtotal = total[0].total;
      this.ctx.service.utils.page.paginate(page, size, roomtotal);
      const prev = await this.ctx.service.utils.page.prev();
      const next = await this.ctx.service.utils.page.next();
      const field = 'log_id,log_main_id,log_room_expire,room_title as log_title ,room_photo as log_photo ,room_hits as log_hits';

      const sql = `SELECT ${field} FROM data_user_bean_log left join data_room on (room_id=log_main_id) WHERE log_uid = ${userId} AND log_type='join_room' AND log_room_expire >='${time}' ORDER BY log_id DESC LIMIT ${start},${size}`;
      const result = await app.mysql.query(sql);
      // console.log(result);
      return {
        result,
        prev,
        next,
      };
    }

  }
  return UserService;
};
