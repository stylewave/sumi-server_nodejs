// const _ = require('lodash');

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

      if (this.ctx.service.utils.common.chechtype(userId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.myaccount.userMoneylog(userId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // 豆币记录
    async userBeanLog() {
      const { userId, page, size } = this.ctx.request.body;
      // const rs = this.ctx.service.utils.common.chechtype(page);
      if (this.ctx.service.utils.common.chechtype(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(userId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(size) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码数量格式不正确',
        };
        return;
      }
      const result = await this.ctx.service.myaccount.userBeanLog(userId, page, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };

    }
    //  豆币回收列表
    async beanReturnList() {
      const { userId, page, size } = this.ctx.request.body;
      if (this.ctx.service.utils.common.chechtype(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(userId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(size) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码数量格式不正确',
        };
        return;
      }
      const result = await this.ctx.service.myaccount.beanReturnList(userId, page, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    //  豆币回收详情
    async beanReturnDetail() {
      const { returnId } = this.ctx.request.body;
      if (this.ctx.service.utils.common.chechtype(returnId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '豆币id格式不正确',
        };
        return;
      }
      const result = await this.ctx.service.myaccount.beanReturnDetail(returnId);

      this.ctx.body = {
        status: 1,
        list: result,
        // time: formatted,
      };
    }


  }
  return MyaccountController;
};
