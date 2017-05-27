module.exports = app => {
  class AdController extends app.Controller {
    // 拉取广告列表
    async list() {
      const { page } = this.ctx.request.body;
      if (this.ctx.service.utils.common.chechtype(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.ad.list(page);
      this.ctx.body = {
        status: 1,
        list: result,
      };
    }
  }
  return AdController;
};
