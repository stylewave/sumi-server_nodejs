const charUtil = require('./utils/charUtil.js');
const _ = require('lodash');
module.exports = app => {
  class SignController extends app.Controller {
    // 签到日历
    async signCalendar() {
      const { uid, token } = this.ctx.request.body;
      const numArr = [uid];
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }

      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const result = await this.ctx.service.sign.signCalendar(uid);
      this.ctx.body = result;

    }
    async userSign() {
      const { uid, token } = this.ctx.request.body;
      const numArr = [uid];
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }

      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const result = await this.ctx.service.sign.userSign(uid);
      if (result === 2) {
        this.ctx.body = {
          status: 0,
          tips: '今天您已经签到了',
        };
        return;
      }
      this.ctx.body = result;
    }


  }
  return SignController;
};
