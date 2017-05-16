
module.exports = app => {
  class UserService extends app.Service {

    // 注册
    async insert(mobile, nickName, pwd) {
      const result = await this.app.mysql.insert('data_user', { user_name: mobile, user_nickname: nickName, user_pwd: pwd, user_reg_time: this.app.mysql.literals.now });
      return result.affectedRows === 1;
    }

    // 查询用户信息
    async getUser(uid, token) {
      const userInfo = await app.mysql.get('data_user', { user_id: uid, user_token: token });
      return userInfo;
    }

    // 判断用户信息是否有效
    async checkUser(uid, token) {
      const sql = 'SELECT COUNT(*) FROM data_user WHERE user_id=' + uid + ' AND user_token=' + token;
      const count = await app.mysql.query(sql);
      return count > 0;
    }
  }
  return UserService;
};
