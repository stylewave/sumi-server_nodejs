module.exports = app => {
  class DebugController extends app.Controller {
    async get() {
      // console.log(app.io.sockets);
      // this.app.io.sockets.in('23').emit('res', 'test');
      const { mobile } = this.ctx.params;
      const result = await this.ctx.service.user.findByUid(mobile);
      if (result) {
        this.ctx.body = {
          status: 1,
          tips: '查询成功',
        };
      } else {
        this.ctx.body = {
          status: 0,
          tips: '查询失败',
        };
      }
    }
  }
  return DebugController;
};
