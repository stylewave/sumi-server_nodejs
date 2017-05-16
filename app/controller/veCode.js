const regExp = require('./utils/regExpUtil.js');

module.exports = app => {
  class VeCodeService extends app.Service {
    // 获取验证码
    getCode() {
      let code = '';
      for (let i = 0; i < 6; i++) {
        code += Math.floor(Math.random() * 10);
      }
      return code;
    }

    // 发送验证码
    async sendCode() {
      const { mobile } = this.ctx.params;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      const find = await this.ctx.service.veCode.findByMobile(mobile);
      if (find) {
        this.ctx.body = {
          status: 0,
          tips: '验证码发送太频繁，请稍候',
        };
        return;
      }
      const code = this.getCode();
      // 发送到短信服务器
      await this.ctx.service.veCode.insert(mobile, code);
      this.ctx.body = {
        status: 1,
        tips: '验证码发送成功',
      };
    }
  }
  return VeCodeService;
};
