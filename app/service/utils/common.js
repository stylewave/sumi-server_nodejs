/*
***
自定义通用service
const rs = this.ctx.service.utils.common.createToken(id,name,);
***
*/
const _ = require('lodash');
const charUtil = require('../../controller/utils/charUtil.js');
module.exports = app => {
  class CommonService extends app.Service {
    // 创建token
    createToken(user_id, user_name) {
      const str = user_id + '|' + user_name + '|' + Date.now();
      return charUtil.encrypt(str, app.config.crypKeys);
    }
    // 检测token
    async checkToken(uid, token, field = '') {
      uid = Number(uid);

      if (uid <= 0) {
        return false;
      }
      if (_.isEmpty(token)) {
        return false;
      }
      const str = charUtil.decrypt(token, app.config.crypKeys);
      // console.log(app.config.crypKeys);
      let array = {}; // 定义一数组
      array = str.split('|'); // 字符分割
      const user_id = Number(array[0]);
      // let user_name = array[1];
      const time = Number(array[2]);
      console.log('token array>>>>>>', array);
      if (uid !== user_id) {
        console.log('uid fail', uid, user_id);
        return false;
      }
      if (Date.now() - time > 86400 * 30000) {
        // 毫秒
        // 有效30天
        console.log('time fail', Date.now(), time, Date.now() - time);
        return false;
      }

      if (_.isEmpty(field)) {
        field = 'user_id,user_name,user_token';
      } else {
        field = 'user_id,user_name,user_token,' + field;
      }

      const sql = `SELECT ${field} FROM data_user WHERE user_id='${uid}' AND user_token='${token}' LIMIT 1`;
      const result = await this.app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
      // if (result) {
      //   // console.log('>>>>>>>', result[0]);
      //   return result[0];
      // }
    }

    checkVersion() { }
  }

  return CommonService;
};
