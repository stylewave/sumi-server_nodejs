const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  class TaskController extends app.Controller {

    // 任务列表
    async taskList() {
      const { uid } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }

      const result = await this.ctx.service.task.taskList(uid);

      this.ctx.body = {
        status: 1,
        list: result,

      };
    }
    // 领取完成任务
    async finishTask() {
      const { key, uid } = this.ctx.request.body;
      if (charUtil.checkNumT(uid) === false) {
        this.ctx.body = {
          status: 0,
          tips: '用户ID格式不正确',
        };
        return;
      }

      const rs = await this.ctx.service.utils.taskArray.task();
      const task_row = rs[key];
      if (!task_row) {
        this.ctx.body = {
          status: 0,
          tips: '此任务不存在',
        };
        return;
      }
      const content = task_row.task_db_field;
      const taskcontent = await this.ctx.service.task.taskContent(uid, content);
      if (taskcontent === 0) {
        this.ctx.body = {
          status: 0,
          tips: '此任务不存在',
        };
        return;
      }
      const result = await this.ctx.service.task.finishTask(uid, taskcontent, content, task_row);
      if (result === 0) {
        this.ctx.body = {
          status: 0,
          tips: '此任务还没完成',
        };
        return;
      }
      if (result === 2) {
        this.ctx.body = {
          status: 0,
          tips: '不能重复领取奖励',
        };
        return;
      }
      this.ctx.body = {
        status: 1,
        list: result,

      };
    }


  }
  return TaskController;
};
