/*
***
自定义通用service
const rs = this.ctx.service.utils.common.createToken(id,name,);
***
*/
const charUtil = require('../../controller/utils/charUtil.js');
module.exports = app => {
  class CommonService extends app.Service {
    // 获取单条记录数
    createToken(user_id, user_name) {
      const str = user_id + '|' + user_name + '|' + Date.now();
      return charUtil.encrypt(str, app.config.crypKeys);
    }

    checkToken(uid, str) {
      if (uid <= 0) {
        return false;
      }
      if (str === '' || str === undefined || str === null) {
        return false;
      }

      str = charUtil.decrypt(str, app.config.crypKeys);
      let array = {}; // 定义一数组
      array = str.split('|'); // 字符分割
      const user_id = Number(array[0]);
      // let user_name = array[1];
      const time = Number(array[2]);
      // console.log('array>>>>>>', array);
      if (uid !== user_id) {
        return false;
      }
      if (Date.now() - time > 86400 * 24) {
        // 有效1天
        return false;
      }

      return true;
    }
  }

  return CommonService;
};
