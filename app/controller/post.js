const _ = require('lodash');

module.exports = app => {
  class PostController extends app.Controller {
    async create() {
      const { ctx } = this;
      // 表单内容, ctx.request.body is object
      console.log('at post create', ctx.request.body);
      ctx.body = _.extend({ res: 'from sever' }, ctx.request.body);
      ctx.status = 200;
    }
  }
  return PostController;
};
