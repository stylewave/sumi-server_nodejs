
module.exports = app => {
  class UserLoginService extends app.Service {

    // 注册
    async insert(mobile, pwd, salt) {
      const result = await this.app.mysql.insert('data_user', { user_name: mobile, user_pwd: pwd, user_salt: salt, user_reg_time: this.app.mysql.literals.now });
      return result.affectedRows === 1;
    }

    // 修改密码
    async updatePwd(mobile, pwd, salt) {
      const sql = 'UPDATE data_user SET user_pwd = ' + pwd + ',user_salt=' + salt + ' WHERE user_name = ' + mobile;
      const result = await this.app.mysql.query(sql);
      return result;
    }

    // 用户登录
    async login(mobile, pwd) {
      const userInfo = await app.mysql.get('data_user', { user_name: mobile, user_pwd: pwd });
      return userInfo;
    }

    // 更新token
    async updateToken(uid, token) {
      const sql = 'UPDATE data_user SET user_token = ' + token + ',user_last_login=NOW() WHERE user_id = ' + uid;
      const result = await this.app.mysql.query(sql);
      return result;
    }
  }
  return UserLoginService;
};
