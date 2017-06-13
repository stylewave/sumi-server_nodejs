// const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
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
      const { uid } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.myaccount.userMoneylog(uid);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // 豆币记录
    async userBeanLog() {
      const { uid, page, size } = this.ctx.request.body;
      // const rs = this.ctx.service.utils.common.chechtype(page);
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(size) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码数量格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.myaccount.userBeanLog(uid, page, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };

    }
    //  豆币回收列表
    async beanReturnList() {
      const { uid, page, size } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(size) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码数量格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.myaccount.beanReturnList(uid, page, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    //  豆币回收详情
    async beanReturnDetail() {
      const { returnId } = this.ctx.request.body;
      if (charUtil.checkNumT(returnId) === false) {
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
