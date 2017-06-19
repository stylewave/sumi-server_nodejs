const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  // 我的账户模块
  class RoomService extends app.Controller {
    // 获取房间总的记录数
    async getListTotal() {
      const result = await this.ctx.service.room.getListTotal();
      return result;
    }

    //  房间列表列表
    async roomList() {
      let { page, size, order } = this.ctx.request.body;
      if (charUtil.checkNumT(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }

      page = parseInt(page, 10);
      size = parseInt(size, 10);
      order = parseInt(order, 10);
      const maxPage = await this.getListTotal();
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
      const result = await this.ctx.service.room.roomList(start, size, order);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }

    // 获取购买房间总的记录数
    async getTotal(uid) {
      const result = await this.ctx.service.room.getTotal(uid);
      return result;
    }

    //  购买房间列表列表
    async buyRoomList() {
      let { uid, token, page, size } = this.ctx.request.body;
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
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getTotal(uid);
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
      const result = await this.ctx.service.room.buyRoomList(start, size, uid);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }

  }
  return RoomService;
};
