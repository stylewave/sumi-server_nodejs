module.exports = app => {
  class LoginService extends app.Service {
    // 用户登录
    // async login(uid, pwd) {
    async login(uid) {
      // const password = base64(md5(pwd));
      const userInfo = await app.mysql.get('data_user', { user_id: uid });
      return userInfo;
    }

    // 注册
    async insert(mobile, nickName, pwd) {

    }
  }
  return LoginService;
};
