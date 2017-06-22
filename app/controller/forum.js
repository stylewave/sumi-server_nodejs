const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  // const charUtil = require('./utils/charUtil.js');

  // 股吧模块
  class ForumController extends app.Controller {
    // 获取板块最大页码
    async getMaxPage() {
      const result = await this.ctx.service.forum.getTotal();
      return result;
    }

    // 股吧板块列表order:1人气，0全部
    async get_stock_board_list() {
      let { page, size, uid, token, order } = this.ctx.request.body;
      let numArr;
      if (order) {
        numArr = [uid, page, size, order];
      } else {
        numArr = [uid, page, size];
      }

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

      const maxPage = await this.getMaxPage();
      // 总共页数
      const total = Math.ceil(maxPage / size);
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.forum.list(start, size, order);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }

    // 股吧热门四条
    async get_stock_board_hot() {
      let { size, uid, token } = this.ctx.request.body;
      const numArr = [uid, size];
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
      const numArr = [uid, id];
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
      let numArr;
      if (state) {
        numArr = [uid, boardId, state];
      } else {
        numArr = [uid, boardId];
      }
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
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
      let { page, size, boardId, order, uid, token } = this.ctx.request.body;

      let numArr;
      if (order) {
        numArr = [page, size, boardId, uid, order];
      } else {
        numArr = [page, size, boardId, uid];
      }
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
      order = parseInt(order, 10);
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
      let { uid, token, page, size, boardId } = this.ctx.request.body;

      const numArr = [page, size, boardId, uid];
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
      const { subId, uid, token } = this.ctx.request.body;

      const numArr = [subId, uid];
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
      const { subId, uid, token } = this.ctx.request.body;
      const numArr = [subId, uid];
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

      const result = await this.ctx.service.forum.commentdata(subId);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // 股吧主题评论增加
    async addComment() {
      const { subId, content, uid, token } = this.ctx.request.body;
      const numArr = [subId, uid];
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
      if (content.length < 5) {
        this.ctx.body = {
          status: 0,
          tips: '评论的内容太少了',
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
      const { title, content, boardId, uid, token } = this.ctx.request.body;
      const numArr = [uid, boardId];
      const strArr = [token, content, title];
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
    // 获取 我的关注股吧最大页码
    async myBoardTotal(uid) {
      const result = await this.ctx.service.forum.myBoardTotal(uid);
      return result;
    }
    // 我的关注股吧列表
    async myBoardlist() {
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
      const maxPage = await this.myBoardTotal(uid);
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

      const result = await this.ctx.service.forum.myBoardlist(start, size, uid);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }

  }
  return ForumController;
};
