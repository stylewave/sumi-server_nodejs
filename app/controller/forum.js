const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  //股吧模块
  class ForumController extends app.Controller {
     // 获取最大页码
    async getMaxPage() {
       const MAX_PAGE = 5;
       const result = await this.ctx.service.forum.getTotal();
       return result > MAX_PAGE ? MAX_PAGE : result;
    }

    //股吧列表
    async listForum(){
      let { page, size } = this.ctx.request.body;
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.getMaxPage();
      console.log(size);
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
   //股吧详情
    async detailForum(){
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
    async followForum() {
        const { state,boardId } = this.ctx.request.body;
        if(state=='1'){
           this.ctx.body = {
              status: 0,
              tips: '该股吧已关注',
          };
          return;
        }
        const result = await this.ctx.service.forum.followForum(state,boardId);
         this.ctx.body = {
          status: 1,
          detail: result,
        };
     
    }

    // 发新贴
    async addForum() {
     
      this.ctx.body = {
        status: 1,
        list: '发新贴',
      };
    }




  //股吧评论
  async forumComment(){

  }



  }
  return ForumController;
};
