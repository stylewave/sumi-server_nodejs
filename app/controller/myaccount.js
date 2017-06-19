const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  // 我的账户模块
  class MyaccountController extends app.Controller {

    // 用户资金记录
    async userMoneylog() {
      const { uid, token } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      const result = await this.ctx.service.myaccount.userMoneylog(uid);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // async user_bean_log() {

    // }
    // 豆币记录
    async userBeanLog() {
      const { uid, page, size, token, test } = this.ctx.request.body;
      // const rs = this.ctx.service.utils.common.chechtype(page);
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      for (const value in test) {
        console.log(value);
        console.log('test');
        console.log(test[value]);

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
      const { uid, token, status } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const result = await this.ctx.service.myaccount.beanReturnList(uid, status);
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
    //  豆币回收
    async beanReturn() {
      let { token, uid, beans, account_type, alipay_account, wxpay_account, unionpay_account, unionpay_name, unionpay_bank, mobile } = this.ctx.request.body;
      // const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      // if (_.isEmpty(checktoke)) {
      //   this.ctx.body = {
      //     status: 0,
      //     tips: '用户信息已过期,请重新登录',
      //   };
      //   return;
      // }
      beans = parseInt(beans, 10);
      if (beans < 100) {
        this.ctx.body = {
          status: 0,
          tips: '您输入的咨询豆数量必须大于100',
          // time: formatted,
        };
        return;
      }
      const result = await this.ctx.service.myaccount.beanReturn(uid, beans, account_type, alipay_account, wxpay_account, unionpay_account, unionpay_name, unionpay_bank, mobile);
      if (result) {
        this.ctx.body = {
          status: 1,
          tips: '回收提交成功',
          // time: formatted,
        };
      } else {
        this.ctx.body = {
          status: 1,
          tips: '回收提交失败',
          // time: formatted,
        };
      }

    }
    async test() {
      const result = await this.app.mysql.insert('data_user', {
        user_name: '123456633',
        user_pwd: '1413',
        user_salt: '1222',
        user_reg_time: this.app.mysql.literals.now,
      });
      console.log(result.insertId);
      this.ctx.body = {
        status: 1,
        list: result.insertId,
        // time: formatted,
      };

    }


  }
  return MyaccountController;
};
