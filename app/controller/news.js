const _ = require('lodash');

module.exports = app => {
  // 新闻资讯模块
  class NewsController extends app.Controller {
    // 获取最大页码
    async getMaxPage() {
      const MAX_PAGE = 5;
      const result = await this.ctx.service.news.getTotal();
      return result > MAX_PAGE ? MAX_PAGE : result;
    }

    // 拉取新闻列表
    async list() {
      let { page, size } = this.ctx.request.body;
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = this.getMaxPage();
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.news.list(start, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 拉取新闻详情
    async newsDetail() {
      const { newsId } = this.ctx.request.body;
      const result = await this.ctx.service.news.newsDetail(newsId);
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
