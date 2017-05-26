// const charUtil = require('../controller/utils/charUtil.js');

module.exports = app => {
  class UserLoginService extends app.Service {
    // 注册
    async reg(mobile, pwd, salt) {
      const result = await this.app.mysql.insert('data_user', {
        user_name: mobile,
        user_pwd: pwd,
        user_salt: salt,
        user_reg_time: this.app.mysql.literals.now,
      });
      if (result.affectedRows === 1) {
        const uid = result.insertId;
        const token = this.ctx.service.utils.common.createToken(uid, mobile);

        // 更新token及登录次数
        const sql2 = `UPDATE data_user SET user_token ='${token}',user_last_login=NOW(),user_login_count=user_login_count+1 WHERE user_id = '${uid}'`;
        await this.app.mysql.query(sql2);

        // 重新获取登录信息
        const info = await this.getLoginInfo(uid);
        // console.log('>>>>>>info', info);
        return info;
      }
      return result.affectedRows === 1;
    }

    // 修改密码
    async updatePwd(mobile, pwd, salt) {
      const sql = `UPDATE data_user SET user_pwd = '${pwd}',user_salt='${salt}' WHERE user_name ='${mobile}'`;
      const result = await this.app.mysql.query(sql);
      return result;
    }

    // 用户登录
    async login(mobile, pwd) {
      const field = 'user_id,user_status,user_name,user_last_login';
      const sql = `SELECT ${field}  FROM data_user WHERE user_pwd = MD5(CONCAT(MD5(${pwd}),user_salt)) AND user_name = '${mobile}' LIMIT 1`;
      const result = await app.mysql.query(sql);

      if (result.length) {
        const token = this.ctx.service.utils.common.createToken(result[0].user_id, result[0].user_name);
        // const token2 = this.ctx.service.utils.common.checkToken(result[0].user_id, token);
        // console.log('token>>>>>>>>', token2);

        // 更新token及登录次数
        const sql2 = `UPDATE data_user SET user_token ='${token}',user_last_login=NOW(),user_login_count=user_login_count+1 WHERE user_id = '${result[0].user_id}'`;
        await this.app.mysql.query(sql2);

        // 重新获取登录信息
        const info = await this.getLoginInfo(result[0].user_id);

        // 上回登录时间
        info.user_last_login = result[0].user_last_login;
        // const rs = this.config.crypKeys;
        // console.log('key>>>>>>>>', rs);
        return info;
      }
      return null;
    }

    // 查询用户登录数据
    async getLoginInfo(id) {
      const field = '*';
      const sql = `SELECT  ${field} FROM data_user WHERE user_id = '${id}' LIMIT 1`;
      const result = await app.mysql.query(sql);
      // console.log('getlogininfo>>>>', sql);
      return result.length ? result[0] : null;
    }
  }
  return UserLoginService;
};
