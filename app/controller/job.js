const charUtil = require('./utils/charUtil.js');
const _ = require('lodash');
module.exports = app => {
  class JobController extends app.Controller {

    // 职业列表
    async skillList() {
      const { uid, token } = this.ctx.request.body;

      const numArr = [uid];
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      const rs = await this.ctx.service.utils.jobArray.job().skill;
      this.ctx.body = {
        status: 1,
        list: rs,

      };
    }
    // 职业列表
    async jobList() {
      const { uid, token } = this.ctx.request.body;
      const numArr = [uid];
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const rs = await this.ctx.service.utils.jobArray.job().job;
      this.ctx.body = {
        status: 1,
        list: rs,

      };
    }
    // 获取职业详情
    async jobDetail() {
      const { uid, token } = this.ctx.request.body;
      const numArr = [uid];
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }

      const checkdetail = await this.ctx.service.job.checkDetail(uid);
      if (_.isEmpty(checkdetail)) {
        this.ctx.body = {
          status: 0,
          tips: '您还没有选择职业',
        };
        return;
      }
      const result = await this.ctx.service.job.jobDetail(uid);
      this.ctx.body = {
        status: 1,
        detail: result,

      };
    }
    // 设置职业
    async setJob() {
      const { id, uid, token } = this.ctx.request.body;
      const numArr = [uid, id];
      const strArr = [token];
      if (charUtil.checkType(numArr, strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数有错',
        };
        return;
      }
      const checktoken = await this.ctx.service.utils.common.checkToken(uid, token);
      if (_.isEmpty(checktoken)) {
        this.ctx.body = {
          status: 0,
          tips: '用户信息已过期,请重新登录',
        };
        return;
      }
      const checkdetail = await this.ctx.service.job.checkDetail(uid);
      // console.log(checkdetail);
      if (checkdetail) {
        this.ctx.body = {
          status: 0,
          tips: '您之前已经设置了职业为' + checkdetail.user_job_name,
        };
        return;
      }

      const result = await this.ctx.service.job.setJob(id, uid);
      console.log(result);
      if (result === 2) {
        this.ctx.body = {
          status: 0,
          tips: '您选择的职业不存在',
        };
        return;
      }
      if (result === 0) {
        this.ctx.body = {
          status: 0,
          tips: '设置职业失败',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        tips: '设置职业成功',
        detail: result,

      };
    }


  }
  return JobController;
};
