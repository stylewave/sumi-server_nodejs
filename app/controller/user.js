module.exports = app => {
  class UserController extends app.Controller {
    // 头像和昵称设置
    async setUserPhoto() {
      const { userId, photo, nickname } = this.ctx.request.body;
      if (this.ctx.service.utils.common.chechtype(userId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(photo) === false) {
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
      // const res = this.ctx.service.utils.common.checkToken(userId, token);
      // if (res === false) {
      //   this.ctx.body = {
      //     status: 0,
      //     tips: '用户信息已过期,请重新登录',
      //   };
      //   return;
      // }
      const result = await this.ctx.service.user.setUserPhoto(userId, photo, nickname);
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
  }
  return UserController;
};
