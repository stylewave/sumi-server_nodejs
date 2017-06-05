const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
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
      if (charUtil.checkNumT(cpage) === false) {
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
      let { size } = this.ctx.request.body;
      if (charUtil.checkNumT(size) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码数量格式不正确',
        };
        return;
      }

      size = parseInt(size, 10);
      const result = await this.ctx.service.forum.hot(size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 模块详情
    async boardDetail() {
      const { id, uid, token } = this.ctx.request.body;

      if (charUtil.checkNumT(id) === false) {
        this.ctx.body = {
          status: 0,
          tips: 'ID格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      const rs = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(rs)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const result = await this.ctx.service.forum.boardDetail(id, uid);
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

    // 股吧板块关注与取消
    async follow() {
      let { state, boardId, uid, token } = this.ctx.request.body;

      if (charUtil.checkNumT(boardId) === false) {
        this.ctx.body = {
          status: 0,
          tips: 'ID格式不正确',
        };
        return;
      }

      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      state = parseInt(state, 10);
      const rs = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(rs)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      if (state === 0) {
        const cancle = await this.ctx.service.forum.cancleFollowForum(state, boardId, uid);
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
        const result = await this.ctx.service.forum.followForum(state, boardId, uid);

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
    // 取消关注,现在暂时没用
    async cancelfollow() {
      const { state, boardId, uid, token } = this.ctx.request.body;
      if (charUtil.checkNumT(boardId) === false) {
        this.ctx.body = {
          status: 0,
          tips: 'ID格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      const rs = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(rs)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      if (state === '1') {
        this.ctx.body = {
          status: 0,
          tips: '该股吧已关注',
        };
        return;
      }

      console.log('取消关注');
      const cancle = await this.ctx.service.forum.cancleFollowForum(state, boardId, uid);
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

    }
    // 获取主题最大页码
    async getSubTotal() {
      const result = await this.ctx.service.forum.getSubTotal();
      return result;
    }
    // 股吧主题列表
    async sublist() {
      let { page, size, boardId, order } = this.ctx.request.body;
      order = parseInt(order, 10);
      if (charUtil.checkNumT(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(boardId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '股吧ID格式不正确',
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
      // 总共页数
      const total = Math.ceil(maxPage / size);
      const start = (page - 1) * size;
      const result = await this.ctx.service.forum.sublist(start, size, boardId, order);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,

      };
    }

    // 获取热门主题最大页码
    async getSubHotTotal(boardId) {
      const result = await this.ctx.service.forum.getSubHotTotal(boardId);
      return result;
    }
    // 主题热门列表
    async subHotlist() {
      let { page, size, boardId } = this.ctx.request.body;
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
      if (charUtil.checkNumT(boardId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '股吧ID格式不正确',
        };
        return;
      }

      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getSubHotTotal(boardId);

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
      const result = await this.ctx.service.forum.subHotlist(start, size, boardId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    // 股吧主题详情
    async forumSubjectDetail() {
      const { subId } = this.ctx.request.body;
      if (charUtil.checkNumT(subId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '主题ID格式不正确',
        };
        return;
      }
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

      if (charUtil.checkNumT(subId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '主题ID格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.forum.commentdata(subId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // 股吧主题评论增加
    async addComment() {
      // let { subId, content } = this.ctx.request.body;
      const { subId, content, uid, token } = this.ctx.request.body;

      if (charUtil.checkNumT(subId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '主题ID格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (content.length < 5) {
        this.ctx.body = {
          status: 0,
          tips: '评论的内容太少了',
        };
        return;
      }
      const rs = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(rs)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const result = await this.ctx.service.forum.commentadd(subId, content, uid);
      this.ctx.body = {
        status: 1,
        tips: '评论提交成功！',
        detail: result,
      };
    }
    // 股吧主题的增加
    async addForumSubject() {
      const { title, content, boardId, uid } = this.ctx.request.body;

      if (charUtil.checkNumT(boardId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '股吧id格式不正确',
        };
        return;
      }
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }

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
      const result = await this.ctx.service.forum.addForumSubject(title, content, boardId, uid);
      this.ctx.body = {
        status: 1,
        tips: '增加主题成功',
        detail: result,
      };
    }
    // 我的关注股吧列表
    async myBoardlist() {
      const { uid, token } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户id格式不正确',
        };
        return;
      }
      const rs = await this.ctx.service.utils.common.checkToken(uid, token);

      if (_.isEmpty(rs)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      const result = await this.ctx.service.forum.myBoardlist(uid);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

  }
  return ForumController;
};
