const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  // 新闻资讯模块
  class NewsController extends app.Controller {
    // 获取最大页码
    async getMaxPage() {
      //  const MAX_PAGE = 5;
      const result = await this.ctx.service.news.getTotal();
      console.log(result);
      // return result > MAX_PAGE ? MAX_PAGE : result;
      return result;
    }

    // 拉取新闻列表
    async list() {
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
      const checktoke = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoke)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }



      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getMaxPage();

      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      // 总共页数
      const total = Math.ceil(maxPage / size);
      const result = await this.ctx.service.news.list(start, size);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,

      };
    }

    // 拉取新闻详情
    async newsDetail() {
      const { newsId, uid, token } = this.ctx.request.body;
      let numArr;
      if (newsId) {
        numArr = [uid, newsId];
      } else {
        numArr = [uid];
      }
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

      const result = await this.ctx.service.news.newsDetail(newsId);
      console.log(result);
      if (_.isEmpty(result)) {
        this.ctx.body = {
          status: 0,
          tips: '访问的新闻不存在',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }
  }
  return NewsController;
};
