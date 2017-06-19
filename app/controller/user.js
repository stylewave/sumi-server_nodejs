const charUtil = require('./utils/charUtil.js');
const _ = require('lodash');
module.exports = app => {
  class UserController extends app.Controller {
    // 头像和昵称设置
    async setUserPhoto() {
      const { uid, photo, nickname, token } = this.ctx.request.body;
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);

      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      if (charUtil.checkNumT(photo) === false) {
        this.ctx.body = {
          status: 0,
          tips: '头像图片的格式不正确',
        };
        return;
      }


      if (nickname.length < 2) {
        this.ctx.body = {
          status: 0,
          tips: '昵称不能少于两位',
        };
        return;
      }
      const result = await this.ctx.service.user.setUserPhoto(uid, photo, nickname);
      if (result !== 1) {
        this.ctx.body = {
          status: 0,
          tips: '头像和昵称设置失败!',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        tips: '头像和昵称设置成功!',

      };
    }
    // 购买房间列表
    async chatRootList() {
      const { uid, page, size, token } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
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
      if (charUtil.checkNumT(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页数格式不正确',
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

      const result = await this.ctx.service.user.chatRootList(uid, page, size);

      this.ctx.body = {
        status: 1,
        list: result,

      };

    }


    // 获取任务列表最大页码
    async userMsg(uid, type) {
      const result = await this.ctx.service.user.userMsg(uid, type);
      return result;
    }

    // 用户消息列表
    async userMsgList() {
      let { uid, token, type, page, size } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
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
      const maxPage = await this.userMsg(uid, type);

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
      const result = await this.ctx.service.user.userMsgList(start, size, uid, type);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }


  }
  return UserController;
};
