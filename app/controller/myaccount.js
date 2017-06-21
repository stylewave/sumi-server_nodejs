const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  // 我的账户模块
  class MyaccountController extends app.Controller {
    // 用户资金记录
    async userMoneylog() {
      const { uid, token, page, size } = this.ctx.request.body;
      const arr = [uid];
      const strArr = [token];
      if (charUtil.checkNumT(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数格式不正确',
        };
        return;
      }

      if (charUtil.checkIntType(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
        };
        return;
      }

      if (charUtil.checkStringType(strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
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

      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const total = await this.ctx.service.myaccount.getMoneylogTotal(uid);
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
      const result = await this.ctx.service.myaccount.userMoneylog(uid, start, size);
      this.ctx.body = {
        status: 1,
        count: total,
        list: result,
      };
    }
    // 获取豆币记录最大页码
    async userBeanLogTotal(uid) {
      const result = await this.ctx.service.myaccount.userBeanLogTotal(uid);
      return result;
    }

    // 豆币记录列表
    async userBeanLog() {
      let { uid, page, size, token } = this.ctx.request.body;
      const arr = [uid, page, size];
      const strArr = [token];
      if (charUtil.checkNumT(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数格式不正确',
        };
        return;
      }

      if (charUtil.checkIntType(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
        };
        return;
      }

      if (charUtil.checkStringType(strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
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
        count: total,
        list: result,
      };
    }
    //  豆币回收列表
    async beanReturnList() {
      const { uid, token, status } = this.ctx.request.body;
      const arr = [uid];
      const strArr = [token];
      if (charUtil.checkNumT(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数格式不正确',
        };
        return;
      }

      if (charUtil.checkIntType(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
        };
        return;
      }

      if (charUtil.checkStringType(strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
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

      const result = await this.ctx.service.myaccount.beanReturnList(uid, status);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    //  豆币回收详情
    async beanReturnDetail() {
      const { returnId, uid, token } = this.ctx.request.body;
      const arr = [uid];
      const strArr = [token];
      if (charUtil.checkNumT(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数格式不正确',
        };
        return;
      }

      if (charUtil.checkIntType(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
        };
        return;
      }

      if (charUtil.checkStringType(strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
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
      token = this.ctx.request.header.token;
      console.log(token);
      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      beans = parseInt(beans, 10);
      if (!beans || beans < 100) {
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
