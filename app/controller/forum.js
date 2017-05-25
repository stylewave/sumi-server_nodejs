const _ = require('lodash');

module.exports = app => {
// const charUtil = require('./utils/charUtil.js');

  // 股吧模块
  class ForumController extends app.Controller {
    // 获取最大页码
    async getMaxPage() {
      const MAX_PAGE = 5;
      const result = await this.ctx.service.forum.getTotal();
      return result > MAX_PAGE ? MAX_PAGE : result;
    }

    // 股吧列表
    async list() {
      let { page, size } = this.ctx.request.body;
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
      const result = await this.ctx.service.forum.list(start, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 详情
    async boardDetail() {
      const { id } = this.ctx.request.body;
      const result = await this.ctx.service.forum.boardDetail(id);
      if (_.isEmpty(result)) {
        this.ctx.body = {
          status: 0,
          tips: '内容不存在或已被删除',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }

    // 股吧详情
    async detail() {
      const { boardId } = this.ctx.request.body;
      const result = await this.ctx.service.forum.forumDetail(boardId);
      if (_.isEmpty(result)) {
        this.ctx.body = {
          status: 0,
          tips: '该股吧不存在',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }

    // 关注股吧
    async follow() {
      const { state, boardId } = this.ctx.request.body;
      if (state === '1') {
        this.ctx.body = {
          status: 0,
          tips: '该股吧已关注',
        };
        return;
      }
      const result = await this.ctx.service.forum.followForum(state, boardId);
      this.ctx.body = {
        status: 1,
        detail: result,
      };

    }
  }
  return ForumController;
};
