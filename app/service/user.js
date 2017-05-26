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
  }
  return UserService;
};
