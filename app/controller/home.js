module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      // get current env: app.config.env
      // get query string: this.ctx.query
      this.ctx.body = app.config.custom;
    }

    async news() {
      // get router params
      const { page } = this.ctx.params;
      this.ctx.body = await this.ctx.service.news.list(page);
    }
  }

  return HomeController;
};
