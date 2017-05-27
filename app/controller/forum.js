const _ = require('lodash');

module.exports = app => {
  // const charUtil = require('./utils/charUtil.js');

  // 股吧模块
  class ForumController extends app.Controller {
    // 获取板块最大页码
    async getMaxPage() {
      const MAX_PAGE = 5;
      const result = await this.ctx.service.forum.getTotal();
      return result > MAX_PAGE ? MAX_PAGE : result;
    }

    // 股吧板块列表
    async get_stock_board_list() {
      let { cpage, size } = this.ctx.request.body;
      cpage = parseInt(cpage, 10);
      size = parseInt(size, 10);
      // let { page, size } = this.ctx.request.body;
      console.log('ctx.request.body>>>', this.ctx.request.body);
      // const page = 1;// parseInt(page, 10);
      // const size = 4;// parseInt(size, 10);
      const maxPage = await this.getMaxPage();
      if (cpage > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (cpage - 1) * size;
      const result = await this.ctx.service.forum.list(start, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 股吧热门四条
    async get_stock_board_hot() {
      let { size, userId } = this.ctx.request.body;
      size = parseInt(size, 10);
      const result = await this.ctx.service.forum.hot(size, userId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 模块详情
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

    // 股吧板块详情
    async detail() {
      const { boardId } = this.ctx.request.body;
      const result = await this.ctx.service.forum.forumDetail(boardId);
      if (_.isEmpty(result)) {
        this.ctx.body = {
          status: 0,
          tips: '该股吧板块不存在',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }

    // 股吧板块关注与取消
    async follow() {
      const { state, boardId, userId } = this.ctx.request.body;
      if (state === '1') {
        this.ctx.body = {
          status: 0,
          tips: '该股吧已关注',
        };
        return;
      }
      if (state === 1) {
        console.log('取消关注');
        const cancle = await this.ctx.service.forum.cancleFollowForum(state, boardId, userId);
        console.log(cancle);
        console.log('cancle');
        if (cancle === 0) {
          this.ctx.body = {
            status: 0,
            tips: '您之前没关注此板块内容',
            detail: cancle,
          };
          return;
        }
        this.ctx.body = {
          status: 1,
          detail: cancle,
          tip: '取消关注成功',
        };

      } else {
        const result = await this.ctx.service.forum.followForum(state, boardId, userId);

        if (result === 0) {
          this.ctx.body = {
            status: 0,
            tips: '该股吧板块已关注',
          };
          return;
        }
        this.ctx.body = {
          status: 1,
          detail: result,
          tip: '关注成功',
        };
      }

    }
    // 获取主题最大页码
    async getSubTotal() {
      const result = await this.ctx.service.forum.getSubTotal();
      return result;
    }
    // 股吧主题列表
    async sublist() {
      let { page, size, boardId } = this.ctx.request.body;

      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getMaxPage(boardId);

      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }

      // const result = await this.ctx.service.forum.list(start, size);
      const boardstate = await this.ctx.service.forum.forumDetail(boardId);
      if (_.isEmpty(boardstate)) {
        this.ctx.body = {
          status: 0,
          tips: '该股吧模块不存在',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.forum.sublist(start, size, boardId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 获取热门主题最大页码
    async getSubHotTotal(boardId, type) {
      const result = await this.ctx.service.forum.getSubHotTotal(boardId, type);
      return result;
    }
    // 主题热门列表
    async subHotlist() {
      let { page, size, boardId, type } = this.ctx.request.body;
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getSubHotTotal(boardId, type);

      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const boardstate = await this.ctx.service.forum.forumDetail(boardId);
      if (_.isEmpty(boardstate)) {
        this.ctx.body = {
          status: 0,
          tips: '该股吧模块不存在',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.forum.subHotlist(start, size, boardId, type);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 股吧主题详情
    async forumSubjectDetail() {
      const { subId } = this.ctx.request.body;
      const result = await this.ctx.service.forum.forumSubjectDetail(subId);
      if (_.isEmpty(result)) {
        this.ctx.body = {
          status: 0,
          tips: '该股吧主题不存在',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }
    // 股吧主题评论信息
    async commentdata() {
      const { subId } = this.ctx.request.body;
      const result = await this.ctx.service.forum.commentdata(subId);
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }
    // 股吧主题评论增加
    async commentadd() {
      // let { subId, content } = this.ctx.request.body;
      const { subId, content, userId } = this.ctx.request.body;
      if (content.length < 5) {
        this.ctx.body = {
          status: 0,
          tips: '评论的内容太少了',
        };
        return;
      }
      const result = await this.ctx.service.forum.commentadd(subId, content, userId);
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }
    // 股吧主题的增加
    async addForumSubject() {
      const { title, content, boardId, userId } = this.ctx.request.body;
      if (content.length < 5) {
        this.ctx.body = {
          status: 0,
          tips: '帖子的内容太少了',
        };
        return;
      }
      const boardstate = await this.ctx.service.forum.forumDetail(boardId);
      if (_.isEmpty(boardstate)) {
        this.ctx.body = {
          status: 0,
          tips: '该股吧板块不存在',
        };
        return;
      }
      const allow = await this.ctx.service.forum.boardAllowSub(boardId);
      console.log(allow);
      if (allow === 0) {
        this.ctx.body = {
          status: 0,
          tips: '该板块不允许增加主题',
        };
        return;
      }
      const result = await this.ctx.service.forum.addForumSubject(title, content, boardId, userId);
      this.ctx.body = {
        status: 1,
        detail: result,
      };
    }

  }
  return ForumController;
};
