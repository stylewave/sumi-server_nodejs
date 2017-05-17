
module.exports = app => {
  class LoginService extends app.Service {

    // 注册
    async insert(mobile, nickName, pwd) {
      const result = await this.app.mysql.insert('data_user', { user_name: mobile, user_nickname: nickName, user_pwd: pwd, user_reg_time: this.app.mysql.literals.now });
      return result.affectedRows === 1;
    }

    // 修改密码
    async updatePwd(mobile, pwd) {
      const sql = 'UPDATE data_user SET user_pwd = ' + pwd + ' WHERE user_name = ' + mobile;
      const result = await this.app.mysql.query(sql);
      return result;
    }

    // 用户登录
    async login(uid, pwd) {
      const userInfo = await app.mysql.get('data_user', { user_id: uid, user_pwd: pwd });
      return userInfo;
    }

    // 更新token
    async updateToken(uid, token) {
      const sql = 'UPDATE data_user SET user_token = ' + token + ',user_last_login=NOW() WHERE user_id = ' + uid;
      const result = await this.app.mysql.query(sql);
      return result;
    }

    // 查询用户信息
    async findByToken(uid, token) {
      const userInfo = await app.mysql.get('data_user', { user_id: uid, user_token: token });
      return userInfo;
    }
  }
  return LoginService;
};
