const regExp = require('./utils/regExpUtil.js');
const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  class VeCodeService extends app.Service {
    // 发送验证码
    async sendCode() {
      const mobile = this.ctx.request.body.mobile;
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
      const code = charUtil.getRandomNum(6);
      // 发送到短信服务器
      const rs = await this.ctx.service.veCode.insert(mobile, code);
      // console.log("sms:", rs);
      if (rs) {
        this.ctx.body = {
          status: 1,
          tips: '验证码发送成功',
        };
      } else {
        this.ctx.body = {
          status: 0,
          tips: '验证码发送失败,请稍后再试',
        };
      }
    }
  }
  return VeCodeService;
};
