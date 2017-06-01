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
    // 购买房间列表
    async chatRootList() {
      const { userId, page, size } = this.ctx.request.body;
      if (this.ctx.service.utils.common.chechtype(userId) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(page) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页数格式不正确',
        };
        return;
      }
      if (this.ctx.service.utils.common.chechtype(size) === false) {
        this.ctx.body = {
          status: 0,
          tips: '页码数量格式不正确',
        };
        return;
      }
      const result = await this.ctx.service.user.chatRootList(userId, page, size);
      const rs = await this.ctx.service.utils.taskArray.task();
      for (const i in rs) {
        console.log(i);
        // if (rs[i].sign === 'sign') {
        //   console.log(rs[i]);
        // }
        console.log(rs[i]);
      }

      // console.log(rs);
      this.ctx.body = {
        status: 1,
        list: result,

      };

    }

  }
  return UserController;
};
