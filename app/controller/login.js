const _ = require('lodash');
const regExp = require('./utils/regExpUtil.js');
const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  class LoginController extends app.Controller {
    // 注册逻辑
    async register() {
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
      // await Promise.all(this.ctx.service.veCode.update(mobile, code, 2), this.ctx.service.user.insert(mobile, nickName, pwd));
      this.ctx.service.veCode.update(mobile, code, 2);
      const salt = charUtil.getRandomChar(4);
      const md5Pwd = charUtil.md5PWD(pwd, salt);
      const result = await this.ctx.service.userLogin.insert(mobile, md5Pwd, salt);
      if (_.isEmpty(result)) {
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
      const salt = charUtil.getRandomChar(4);
      const md5Pwd = charUtil.md5PWD(pwd, salt);
      this.ctx.service.userLogin.updatePwd(mobile, md5Pwd, salt);
      this.ctx.body = {
        status: 1,
      };
    }

    // 登录
    async login() {
      const { mobile, pwd } = this.ctx.request.body;
      const salt = await this.ctx.service.user.findByUid(mobile);
      if (_.isEmpty(salt)) {
        this.ctx.body = {
          status: 0,
          tips: '用户名密码错误',
        };
        return;
      }
      const md5Pwd = charUtil.md5PWD(pwd, salt);
      const userInfo = await this.ctx.service.userLogin.login(mobile, md5Pwd);
      if (_.isEmpty(userInfo)) {
        this.ctx.body = {
          status: 0,
          tips: '用户名密码错误',
        };
        return;
      }
      const token = charUtil.getMd5Char(6);
      this.ctx.service.userLogin.updateToken(userInfo.user_id, token);
      this.ctx.body = {
        status: 1,
        uid: userInfo.user_id,
        token,
      };
    }

    // 重新登录
    async relogin() {
      const { uid, token } = this.ctx.request.body;
      const userInfo = await this.ctx.service.user.checkUser(uid, token);
      if (_.isEmpty(userInfo)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期',
        };
        return;
      }
      const newToken = charUtil.getMd5Char(6);
      this.ctx.service.userLogin.updateToken(uid, newToken);
      this.ctx.body = {
        status: 1,
        uid: userInfo.user_id,
        token: newToken,
      };
    }
  }
  return LoginController;
};
