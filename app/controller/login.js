const regExp = require('./utils/regExpUtil.js');
const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  class LoginController extends app.Controller {
    // 注册逻辑
    async register() {
      const { mobile, nickName, pwd, code } = this.ctx.request.body;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      const find = await this.ctx.service.veCode.find(mobile, code);
      if (find === false) {
        this.ctx.body = {
          status: 0,
          tips: '验证码不正确',
        };
        return;
      }
      // await Promise.all(this.ctx.service.veCode.update(mobile, code, 2), this.ctx.service.user.insert(mobile, nickName, pwd));
      this.ctx.service.veCode.update(mobile, code, 2);
      const md5Pwd = charUtil.md5(pwd);
      const result = await this.ctx.service.login.insert(mobile, nickName, md5Pwd);
      if (result) {
        this.ctx.body = { status: 1 };
      } else {
        this.ctx.body = {
          status: 0,
          tips: '用户已注册',
        };
      }
    }

    // 忘记密码
    async forgetPwd() {
      const { mobile, pwd, code } = this.ctx.request.body;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      const find = await this.ctx.service.veCode.find(mobile, code);
      if (find === false) {
        this.ctx.body = {
          status: 0,
          tips: '验证码不正确',
        };
        return;
      }
      this.ctx.service.veCode.update(mobile, code, 2);
      const md5Pwd = charUtil.md5(pwd);
      this.ctx.service.login.updatePwd(mobile, md5Pwd);
      this.ctx.body = {
        status: 1,
      };
    }

    // 登录
    async login() {
      const { uid, pwd } = this.ctx.request.body;
      const md5Pwd = charUtil.md5(pwd);
      const userInfo = await this.ctx.service.login.login(uid, md5Pwd);
      if (userInfo === null) {
        this.ctx.body = {
          status: 0,
          tips: '用户名密码错误',
        };
        return;
      }
      const token = charUtil.getMd5Char(6);
      this.ctx.service.login.updateToken(uid, token);
      this.ctx.body = {
        status: 1,
        uid: userInfo.user_id,
        token,
      };
    }

    // 重新登录
    async relogin() {
      const { uid, token } = this.ctx.request.body;
      const userInfo = await this.ctx.service.login.checkUser(uid, token);
      if (userInfo === null) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期',
        };
        return;
      }
      const newToken = charUtil.getMd5Char(6);
      this.ctx.service.login.updateToken(uid, newToken);
      this.ctx.body = {
        status: 1,
        uid: userInfo.user_id,
        token: newToken,
      };
    }
  }
  return LoginController;
};
