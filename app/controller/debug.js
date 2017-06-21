const regExp = require('./utils/regExpUtil.js');
module.exports = app => {
  class DebugController extends app.Controller {
    async get() {
      const { mobile } = this.ctx.params;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      const result = await this.ctx.service.user.findByUid(mobile);
      if (result) {
        this.ctx.body = {
          status: 1,
          tips: '查询成功',
        };
      } else {
        this.ctx.body = {
          status: 0,
          tips: '查询失败',
        };
      }
    }
  }
  return DebugController;
};
