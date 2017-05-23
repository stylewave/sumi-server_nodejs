const _ = require('lodash');

module.exports = app => {
  //观点模块
  class ViewpointController extends app.Controller {

    //观点列表
    async get_expert_comment_list(){
       this.ctx.body='观点列表';
    }
    //大数据
    async bigdata() {
     this.ctx.body='大数据';
    }

    // 多空舆情
    async get_market_list() {
     
      this.ctx.body = {
        status: 1,
        list: '多空舆情',
      };
    }



    // 观点详情
    async forumDetail() {
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

  //股吧评论
  async forumComment(){

  }



  }
  return ViewpointController;
};
