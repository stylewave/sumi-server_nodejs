
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
      const field = 'room_id,room_title,room_photo,room_description,room_open_time,room_status,room_close_time,room_ishot,room_beans,room_at_least_beans,room_hits,room_ishot,room_max_client,room_package,room_assessment_type';
      let sql;
      console.log(order);
      if (order === 1) {
        sql = `SELECT ${field} FROM data_room ORDER BY room_hits DESC LIMIT ${start},${size}`;
      } else {
        sql = `SELECT ${field} FROM data_room ORDER BY room_id DESC LIMIT ${start},${size}`;
      }
      const unserialize = require('locutus/php/var/unserialize');
      const serialize = require('locutus/php/var/serialize');
      // const serialize = require('node-serialize');
      // const info = serialize.serialize({ id: 1 });
      // const uninfo = serialize.unserialize(info);

      const obj = {
        name: 'Bob',
        say: '2345644',
      };

      const objS = serialize(obj);
      const uninfo = unserialize(objS);

      console.log(objS);
      console.log(uninfo);
      const result = await app.mysql.query(sql);
      for (const v in result) {
        result[v].room_photo = app.config.host + result[v].room_photo;
        console.log(result[v].room_id);
        // const buffer = new Buffer(result[v].room_package, 'base64').toString();
        // console.log(buffer);
        const packStr = unserialize(result[v].room_package);
        console.log(packStr);
      }
      return result;
    }

    // 获取购买房间总的记录数
    async getTotal(uid) {
      const sql = `SELECT COUNT(*) as total FROM data_user_bean_log WHERE log_uid = '${uid}' AND log_type='join_room' AND log_room_expire>=DATE_FORMAT(${this.app.mysql.literals.now},"%Y-%m-%d")`;
      console.log(sql);
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    //  购买房间列表列表
    async buyRoomList(start, size, uid) {
      const field = 'log_id,log_nickname,room_id,room_title,room_description,room_status,room_photo,room_ishot,DATE_FORMAT(log_room_expire,"%Y-%m-%d") as log_room_expire';
      const sql = `SELECT ${field} FROM data_user_bean_log left join data_room on (room_id=log_room_id) where log_uid = '${uid}' AND log_type='join_room' AND log_room_expire>=DATE_FORMAT(${this.app.mysql.literals.now},"%Y-%m-%d")  ORDER BY log_id DESC LIMIT ${start},${size}`;
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
