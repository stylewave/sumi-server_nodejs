const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  // 观点模块
  class ViewpointController extends app.Controller {
    // 获取观点最大页码
    async getMaxPage() {
      const result = await this.ctx.service.viewpoint.getTotal();
      return result;
    }
    // 观点列表
    async expertCommentList() {

      let { page, size } = this.ctx.request.body;

      if (charUtil.checkNumT(page) === false) {
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
      const result = await this.ctx.service.viewpoint.expertCommentList(start, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
    // // 观点购买
    // async commentbuy() {

    // }

    // 观点详情
    async commentDetail() {
      const { commentId, uid, token } = this.ctx.request.body;
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      if (charUtil.checkNumT(commentId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '观点ID格式不正确',
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


      const buydata = await this.ctx.service.viewpoint.buydata(commentId, uid);
      if (_.isEmpty(buydata)) {
        console.log('还没购买该文章');
        const detail = await this.ctx.service.viewpoint.commentDetail(commentId);
        if (_.isEmpty(detail)) {
          this.ctx.body = {
            status: 0,
            tips: '内容不存在或已被删除',
          };
          return;
        }
        this.ctx.body = {
          status: 1,
          tips: '还没购买该文章',
          data: detail,
          style: 'nobuy',
        };
        // return;

      } else {
        console.log('已购买该文章');
        const detail2 = await this.ctx.service.viewpoint.commentDetailBuy(commentId);
        if (_.isEmpty(detail2)) {
          this.ctx.body = {
            status: 0,
            tips: '内容不存在或已被删除',
          };
          return;
        }
        // if (detail2.comment_beans === 0) {
        //   this.ctx.body = {
        //     status: 0,
        //     tips: '此文章暂时免费,不需要购买',
        //   };
        //   return;
        // }
        this.ctx.body = {
          status: 1,
          tips: '已购买该文章',
          data: detail2,
          style: 'buy',
        };

      }

    }

    // 购买观点
    async buyExpertComment() {
      const { commentId, uid, token } = this.ctx.request.body;
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
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
      if (charUtil.checkNumT(commentId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '观点ID格式不正确',
        };
        return;
      }

      const detail = await this.ctx.service.viewpoint.commentDetail(commentId);
      if (_.isEmpty(detail)) {
        this.ctx.body = {
          status: 0,
          tips: '内容不存在或已被删除',
        };
        return;
      }
      const buyda = await this.ctx.service.viewpoint.buydata(commentId, uid);
      if (buyda) {
        this.ctx.body = {
          status: 0,
          tips: '此文章之前已经购买了',
        };
        return;
      }

      const beancount = await this.ctx.service.viewpoint.beanNum(detail.comment_beans, uid);

      if (beancount === 0) {
        this.ctx.body = {
          status: 0,
          tips: '您的咨询豆不足,请先充值',
        };
        return;
      }
      const buydata = await this.ctx.service.viewpoint.buyExpertComment(commentId, uid);
      this.ctx.body = {
        status: 1,
        detail: buydata,
        tips: '购买成功',
      };

      console.log(buydata);
    }

    // 大数据
    async bigdata() {
      this.ctx.body = '大数据';
    }
    // 获取多空舆情最大页码
    async getMarketMaxPage() {
      const result = await this.ctx.service.viewpoint.getMarketMaxPage();
      return result;
    }

    // 多空舆情
    async marketList() {
      let { page, size } = this.ctx.request.body;

      if (charUtil.checkNumT(page) === false) {
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

      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getMarketMaxPage();
      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }
      const start = (page - 1) * size;
      const result = await this.ctx.service.viewpoint.marketList(start, size);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

  }
  return ViewpointController;
};
