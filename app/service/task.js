module.exports = app => {
  class TaskService extends app.Service {


    async taskList(userId) {
      const result = await app.mysql.get('data_task', { task_uid: userId });
      const rs = await this.ctx.service.utils.taskArray.task();
      const task_finish = [];
      const task_going = [];
      const task_none = [];
      for (const value in rs) {
        const task_json_row = result[rs[value].task_db_field];
        const task_row = JSON.parse(task_json_row);
        // 已领取
        if (task_row.status === '2') {
          rs[value].task_status = '2';
          rs[value].task_count = task_row.count;
          task_finish.push(rs[value]);
          console.log(task_finish);
        } else if (task_row.status === '1') {
          rs[value].task_status = '1';
          rs[value].task_count = task_row.count;
          task_going.push(rs[value]);
        } else {
          rs[value].task_status = '0';
          rs[value].task_count = '0';
          task_none.push(rs[value]);

        }

        // console.log(task_json_row);
        console.log(task_row.count);

      }
      console.log(task_going);
      console.log('task_none');
      console.log(task_none);
      const list = task_none.concat(task_going);
      return {
        list,

      };
    }
    async loadinfo(type = '') {
      const rs = await this.ctx.service.utils.taskArray.task();
      console.log(rs);
      console.log(type);
      for (const value in rs) {
        console.log("'key is: " + value);
        // console.log(tt[value]);
        console.log('name');
        // console.log(rs);
      }
      // if (type === '0') {
    }


  }
  return TaskService;
};
