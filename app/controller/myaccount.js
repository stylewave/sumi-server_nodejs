const _ = require('lodash');

module.exports = app => {
  // 我的账户模块
  class MyaccountController extends app.Controller {
    // 获取观点最大页码
    async getMaxPage() {
      const result = await this.ctx.service.viewpoint.getTotal();
      return result;
    }
    // 充值记录
    async userMoneylog() {
      const { userId } = this.ctx.request.body;

      const result = await this.ctx.service.myaccount.userMoneylog(userId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // 豆币记录
    async userBeanLog() {
      const { userId } = this.ctx.request.body;

      const result = await this.ctx.service.myaccount.userBeanLog(userId);
      this.ctx.body = {
        status: 1,
        list: result,
      };

    }



  }
  return MyaccountController;
};
