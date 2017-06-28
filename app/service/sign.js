module.exports = app => {
  class SignController extends app.Service {
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
    // 用户购买房间总数
    async chatRootTotal(uid) {
      const moment = require("moment");
      const time = moment().format("YYYY-MM-DD");
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid='${uid}' AND log_room_expire >='${time}'`;
      const result = await app.mysql.query(sql);
      return result[0].total;

    }
    // 购买房间列表
    async chatRootList(uid, start, size) {

      const moment = require("moment");
      const time = moment().format("YYYY-MM-DD");
      const field = 'log_id,log_main_id,log_room_expire,room_title as log_title ,room_photo as log_photo ,room_hits as log_hits';

      const sql = `SELECT ${field} FROM data_user_bean_log left join data_room on (room_id=log_main_id) WHERE log_uid = ${uid} AND log_type='join_room' AND log_room_expire >='${time}' ORDER BY log_id DESC LIMIT ${start},${size}`;
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
        sql = `SELECT COUNT(*) as total FROM data_msg WHERE msg_uid='${uid}' AND msg_type='${type}'`;
      } else {
        sql = `SELECT COUNT(*) as total FROM data_msg WHERE msg_uid='${uid}'`;
      }
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 用户消息列表
    async userMsgList(start, size, uid, type = '') {
      const field = 'msg_id,msg_type,msg_action,msg_isread,msg_main_id,msg_title,DATE_FORMAT(msg_create_time,"%Y-%m-%d %H:%i:%s") as msg_create_time';
      let sql;
      if (type) {
        sql = `SELECT ${field} FROM data_msg WHERE msg_uid='${uid}' AND msg_type=${type} ORDER BY msg_id DESC LIMIT ${start},${size}`;
      } else {
        sql = `SELECT ${field} FROM data_msg WHERE msg_uid='${uid}' ORDER BY msg_id DESC LIMIT ${start},${size}`;
      }
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result : null;
    }
    // 签到日历
    async signCalendar(uid) {
      const moment = require("moment");
      const times = moment().format("YYYY-MM-DD HH:mm:ss");
      // const week1 = moment().format('d');
      const week1 = moment(moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")).format('d'); // 一个月开始的一天是周几
      console.log(week1);
      console.log(moment().month(), moment().get('date'));
      const monthDay = moment(moment().endOf("month")).format('DD'); // 一个月多少天
      console.log(monthDay);
      const key = moment().format('YYYYMM');
      const sql = `select sign_id,DATE_FORMAT(sign_date,'%Y-%m-%d') as sign_date,DATE_FORMAT(sign_date,'%e') as news_date from data_sign_log where sign_uid='${uid}' and sign_key='${key}'`;
      console.log(sql);
      const list = await app.mysql.query(sql);
      const sign_array = [];
      if (list) {
        for (const value in list) {
          sign_array.push(list[value].news_date);
        }
      }

      let i;
      let issign;
      const date_array = [];
      for (i = 0; i <= monthDay; i++) {
        if (this.isCon(sign_array, i + 1) === 1) {
          issign = 1;
        } else {
          issign = 0;
        }
        date_array[i] = { date: i + 1, issign1: issign };
        // date_array.push(list[value].news_date);
      }
      return {
        status: 1,
        //  list1: list,
        time: times,
        week: week1,
        month: monthDay,
        list: date_array,
      };
    }


    isCon(arr, val) {
      let i = arr.length;
      while (i--) {
        const sign_key = parseInt(arr[i], 10);
        if (sign_key === val) {
          return 1;
        }
      }
      return 0;
    }




  }
  return SignController;
};
