const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  class AdController extends app.Controller {


    // 拉取广告列表page=index,index_top,activity活动,
    async list() {
      const { page, uid, token } = this.ctx.request.body;
      const numArr = [uid];
      const strArr = [token, page];
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
      const result = await this.ctx.service.ad.list(page);

      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 获取活动最大页码
    async getActivityTotal(page) {
      const result = await this.ctx.service.ad.getActivityTotal(page);
      return result;
    }
    // 活动列表
    async activityList() {
      let { page, size, uid, token } = this.ctx.request.body;
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
      const maxPage = await this.getActivityTotal();

      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }

      // 总共页数
      const total = Math.ceil(maxPage / size);
      const start = (page - 1) * size;
      const result = await this.ctx.service.ad.activityList(start, size);

      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }

  }
  return AdController;
};
