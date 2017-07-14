const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
const regExp = require('./utils/regExpUtil.js');
module.exports = app => {
  // 我的账户模块
  class MyaccountController extends app.Controller {
    // 用户资金记录,type:buy_bean购买参数
    async userMoneylog() {
      const { uid, token, page, size, type } = this.ctx.request.body;
      const numArr = [uid, page, size];

      const strArr = [token];


      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
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
      const total = await this.ctx.service.myaccount.getMoneylogTotal(uid, type);
      // 总共页数
      const maxPage = Math.ceil(total / size);
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.myaccount.userMoneylog(uid, start, size, type);
      this.ctx.body = {
        status: 1,
        count: maxPage,
        list: result,
      };
    }
    // 获取豆币记录最大页码
    async userBeanLogTotal(uid, type) {
      const result = await this.ctx.service.myaccount.userBeanLogTotal(uid, type);
      return result;
    }

    // 豆币记录列表
    async userBeanLog() {
      let { uid, page, size, token } = this.ctx.request.body;
      const numArr = [uid, page, size];
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
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const total = await this.userBeanLogTotal(uid);
      // 总共页数
      const maxPage = Math.ceil(total / size);
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.myaccount.userBeanLog(uid, start, size);
      this.ctx.body = {
        status: 1,
        count: maxPage,
        list: result,
      };
    }
    //  豆币回收列表
    async beanReturnList() {
      let { uid, token, page, size } = this.ctx.request.body;
      const numArr = [uid, page, size];
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
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const total = await this.ctx.service.myaccount.beanReturnTotal(uid);
      // 总共页数
      const maxPage = Math.ceil(total / size);
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.myaccount.beanReturnList(uid, start, size);
      this.ctx.body = {
        status: 1,
        list: result,
        totalsub: maxPage,
      };
    }
    //  豆币回收详情
    async beanReturnDetail() {
      const { returnId, uid, token } = this.ctx.request.body;
      const numArr = [uid, returnId];
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

      const result = await this.ctx.service.myaccount.beanReturnDetail(returnId);

      this.ctx.body = {
        status: 1,
        list: result,
        // time: formatted,
      };
    }
    //  豆币回收
    async beanReturn() {
      let {
        token,
        uid,
        beans,
        account_type,
        alipay_account,
        wxpay_account,
        unionpay_account,
        unionpay_name,
        unionpay_bank,
        mobile,
      } = this.ctx.request.body;

      const numArr = [uid, beans, account_type];

      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }
      if (account_type === 0) {
        if (charUtil.check_string(alipay_account, 'mail') === false && regExp.checkMobile(alipay_account) === false) {
          this.ctx.body = {
            status: 0,
            tips: '支付宝账号的信息有误',
          };
          return;
        }
      }
      if (account_type === 2) {
        console.log(charUtil.check_string(unionpay_account, 'bank'));
        console.log(charUtil.check_string(unionpay_name, 'chinese'));
        if (charUtil.check_string(unionpay_account, 'bank') === false || charUtil.check_string(unionpay_name, 'chinese') === false) {
          this.ctx.body = {
            status: 0,
            tips: '填写的银行卡的信息有误',
          };
          return;
        }

      }

      if (mobile) {
        if (regExp.checkMobile(mobile) === false) {
          this.ctx.body = {
            status: 0,
            tips: '手机号码格式不正确',
          };
          return;
        }
      }

      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      beans = parseInt(beans, 10);
      if (beans < 100) {
        this.ctx.body = {
          status: 0,
          tips: '您输入的咨询豆数量必须大于100',
          // time: formatted,
        };
        return;
      }
      const result = await this.ctx.service.myaccount.beanReturn(
        uid,
        beans,
        account_type,
        alipay_account,
        wxpay_account,
        unionpay_account,
        unionpay_name,
        unionpay_bank,
        mobile
      );
      if (result) {
        this.ctx.body = {
          status: 1,
          tips: '回收提交成功',
          data: result,
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

  }
  return MyaccountController;
};
