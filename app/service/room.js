
module.exports = app => {
  class RoomService extends app.Service {

    // 获取房间总的记录数
    async getListTotal() {
      const sql = `SELECT COUNT(*) as total FROM data_room `;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    //  房间列表列表order:0表示时间，１表示人气
    async roomList(start, size, order) {
      let orderdata;
      const data_columns = ['room_id', 'room_title', 'room_photo', 'room_description', 'room_open_time', 'room_status', 'room_close_time', 'room_ishot', 'room_beans', 'room_at_least_beans', 'room_hits', 'room_ishot', 'room_max_client', 'room_package', 'room_assessment_type'];
      if (order === 1) {
        orderdata = ['room_hits', 'desc'];
      } else {
        orderdata = ['room_id', 'desc'];
      }
      const result = await this.ctx.service.utils.db.select('data_room', '', data_columns, orderdata, size, start);
      const unserialize = require('locutus/php/var/unserialize');
      for (const v in result) {
        result[v].room_photo = app.config.host + result[v].room_photo;
        result[v].room_package = unserialize(result[v].room_package);
      }
      return result;
    }

    // 获取购买房间总的记录数
    async getTotal(uid) {
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid = '${app.mysql.escape(uid)}' AND log_type='join_room' AND log_room_expire>=DATE_FORMAT(${this.app.mysql.literals.now},"%Y-%m-%d")`;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    //  购买房间列表列表
    async buyRoomList(start, size, uid) {
      const field = 'log_id,log_nickname,room_id,room_title,room_description,room_status,room_photo,room_ishot,DATE_FORMAT(log_room_expire,"%Y-%m-%d") as log_room_expire';
      const sql = `SELECT ${field} FROM data_user_bean_log left join data_room on (room_id=log_room_id) where log_uid = '${app.mysql.escape(uid)}' AND log_type='join_room' AND log_room_expire>=DATE_FORMAT(${this.app.mysql.literals.now},"%Y-%m-%d")  ORDER BY log_id DESC LIMIT ${app.mysql.escape(start)},${app.mysql.escape(size)}`;
      const result = await app.mysql.query(sql);
      for (const v in result) {
        console.log(v);
        result[v].room_photo = app.config.host + result[v].room_photo;
      }
      return result;
    }



  }
  return RoomService;
};
