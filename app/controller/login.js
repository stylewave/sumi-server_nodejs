const _ = require('lodash');
const regExp = require('./utils/regExpUtil.js');
const charUtil = require('./utils/charUtil.js');

module.exports = app => {
  class LoginController extends app.Controller {
    // 注册逻辑
    async register() {
      const { mobile, pwd, code } = this.ctx.request.body;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      const check = await this.ctx.service.userLogin.checkuser(mobile, code);
      console.log(check);
      console.log('check');
      if (check !== 0) {
        this.ctx.body = {
          status: 0,
          tips: '该号码已经注册过了',
        };
        return;
      }
      const find = await this.ctx.service.veCode.find(mobile, code);
      console.log(find);
      // if (find === false) {
      //   this.ctx.body = {
      //     status: 0,
      //     tips: '验证码不正确',
      //   };
      //   return;
      // }

      this.ctx.service.veCode.update(mobile, code, 1);
      const salt = charUtil.getRandomChar(4);
      const md5Pwd = charUtil.md5PWD(pwd, salt);
      const userInfo = await this.ctx.service.userLogin.reg(mobile, md5Pwd, salt);
      if (userInfo) {
        this.ctx.body = {
          status: 1,
          row: userInfo,
        };
      } else {
        this.ctx.body = {
          status: 0,
          tips: '用户已注册',
        };
      }
    }

    // 忘记密码
    async forgetPwd() {
      const { mobile, pwd, code } = this.ctx.request.body;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      const find = await this.ctx.service.veCode.find(mobile, code);
      if (find === false) {
        this.ctx.body = {
          status: 0,
          tips: '验证码不正确',
        };
        return;
      }
      this.ctx.service.veCode.update(mobile, code, 2);
      const salt = charUtil.getRandomChar(4);
      const md5Pwd = charUtil.md5PWD(pwd, salt);
      this.ctx.service.userLogin.updatePwd(mobile, md5Pwd, salt);
      this.ctx.body = {
        status: 1,
      };
    }

    // 登录
    async login() {
      const { mobile, pwd } = this.ctx.request.body;
      if (regExp.checkMobile(mobile) === false) {
        this.ctx.body = {
          status: 0,
          tips: '手机号码格式不正确',
        };
        return;
      }
      if (pwd.length < 3) {
        this.ctx.body = {
          status: 0,
          tips: '密码不正确',
        };
        return;
      }
      const userInfo = await this.ctx.service.userLogin.login(mobile, pwd);

      if (_.isEmpty(userInfo)) {
        this.ctx.body = {
          status: 0,
          tips: '用户名密码错误',
        };
        return;
      }
      this.ctx.session.userInfo = userInfo;

      this.ctx.body = {
        status: 1,
        row: userInfo,
      };
    }

    // 重新登录
    async relogin() {
      const { uid, token } = this.ctx.request.body;

      // const userInfo = await this.ctx.service.user.checkUser(uid, token);
      const userInfo = await this.ctx.service.userLogin.relogin(uid, token);

      if (_.isEmpty(userInfo)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期',
        };
        return;
      }
      this.ctx.session.userInfo = userInfo;

      this.ctx.body = {
        status: 1,
        row: userInfo,
      };
    }

    async crypt() {
      const value_1 = charUtil.encrypt('中亠"{13245}acb_)+', app.config.crypKeys);
      const value_2 = charUtil.decrypt(value_1, app.config.crypKeys);
      this.ctx.body = {
        value1: value_1,
        value2: value_2,
      };
      // const result = await this.ctx.service.forum.getTotal();
      console.log(value_1);
      console.log(value_2);
      // return value;
    }
  }
  return LoginController;
};
