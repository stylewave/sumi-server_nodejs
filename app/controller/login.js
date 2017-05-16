const regExp = require('./utils/regExpUtil.js');

module.exports = app => {
  class LoginController extends app.Controller {
    async sendCode() {
      // const { mobile } = this.ctx.params;
    }

    async register() {
      const { mobile, nickName, pwd, code } = this.ctx.params;
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
      const result = await this.ctx.service.user.insert(mobile, nickName, pwd);
      if (result) {
        this.ctx.body = { status: 1 };
      } else {
        this.ctx.body = {
          status: 0,
          tips: '用户已注册',
        };
      }
    }
  }
  return LoginController;
};
