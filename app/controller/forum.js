const _ = require('lodash');
<<<<<<< HEAD

module.exports = app => {
  // 新闻资讯模块
=======
// const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  // 股吧模块
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
  class ForumController extends app.Controller {
    // 获取最大页码
    async getMaxPage() {
      const MAX_PAGE = 5;
      const result = await this.ctx.service.forum.getTotal();
      return result > MAX_PAGE ? MAX_PAGE : result;
    }

<<<<<<< HEAD
    /*
    // 拉取新闻列表
=======
    // 股吧列表
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
    async list() {
      let { page, size } = this.ctx.request.body;
      page = parseInt(page, 10);
      size = parseInt(size, 10);
<<<<<<< HEAD
      const maxPage = this.getMaxPage();
=======
      const maxPage = await this.getMaxPage();
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
<<<<<<< HEAD
      const result = await this.ctx.service.news.list(start, size);
=======
      const result = await this.ctx.service.forum.list(start, size);
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      this.ctx.body = {
        status: 1,
        list: result,
      };
<<<<<<< HEAD
    }*/

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
=======
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
>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
      this.ctx.body = {
        status: 1,
        detail: result,
      };
<<<<<<< HEAD
    }
=======

    }

    // 发新贴
    async addForum() {

      this.ctx.body = {
        status: 1,
        list: '发新贴',
      };
    }

    // 股吧评论
    async forumComment() {
    }



>>>>>>> 47a617870074d6cb260ef5bc99ab466ce893d41e
  }
  return ForumController;
};
