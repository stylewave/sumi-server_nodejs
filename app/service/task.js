module.exports = app => {
  class TaskService extends app.Service {

    //  任务列表
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
      }
      const list = task_none.concat(task_going);
      return list;
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
    // 判断任务是否存在
    async taskContent(uid, content) {
      const field = 'task_id,' + content + ' as content';
      const sql = `SELECT ${field} FROM data_task WHERE task_uid = ${uid}`;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : 0;
    }
    // 领取完成任务
    async finishTask(uid, taskcontent, content, task_row) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      console.log(userrow);
      const tcontent = JSON.parse(taskcontent.content);
      const user_bonus_beans = userrow.user_bonus_beans + task_row.task_bonus_beans;
      const user_job_exp = userrow.user_job_exp + task_row.task_exp;
      console.log(user_bonus_beans);
      console.log(user_job_exp);
      let contentdata;
      let taskSql;
      let userSql;
      let result;
      let exp;
      switch (tcontent.status) {
        // 完成未领取
        case '1':
          tcontent.status = '2';
          contentdata = JSON.stringify(tcontent);
          console.log(contentdata);
          taskSql = `UPDATE data_task SET ${content}='${contentdata}' WHERE task_uid = ${uid}`;
          userSql = `UPDATE data_user SET user_bonus_beans='${user_bonus_beans}',user_job_exp=${user_job_exp} WHERE user_id = ${uid}`;
          console.log(taskSql);
          console.log(userSql);
          console.log(task_row.task_title);
          exp = await this.ctx.service.utils.expArray.exp();
          console.log(exp.length);
          let i;
          for (i = exp.length; i >= 1; i--) {
            // console.log(i);
            // console.log(exp[i]);
            if (user_job_exp >= exp[i]) {
              console.log(user_job_exp);
              if (i >= userrow.user_job_level) {
                console.log('us');
                console.log(i);
                // 职业级别 还没做完
                // $data = array('uid'=>$uid, 'level'=>$i + 1);
                // $rs = $this ->set_job_level($data);

              }
              break;
            }

          }
          //  app.mysql.query(taskSql);
          // const conn = await app.mysql.beginTransaction(); // 初始化事务
          // try {
          //   // await conn.query(userSql);
          //   await conn.query(taskSql);
          //   await conn.insert('data_user_bean_log', {
          //     log_uid: userrow.user_id,
          //     log_user: userrow.user_name,
          //     log_nickname: userrow.user_nickname,
          //     log_type: 'finish_task',
          //     log_main_table: 'data_task',
          //     log_main_id: task_row.task_id,
          //     log_content: '完成任务获得' + task_row.task_bonus_beans + '赠豆',
          //     log_count: task_row.task_bonus_beans,
          //     log_bean_before: userrow.user_beans + userrow.user_bonus_beans,
          //     log_bean_end: userrow.user_beans + userrow.user_bonus_beans + task_row.task_bonus_beans,
          //     log_create_time: this.app.mysql.literals.now,
          //   });
          //   await conn.commit(); // 提交事务
          // } catch (err) {
          //   await conn.rollback(); // 一定记得捕获异常后回滚事务！！
          //   throw err;
          // }


          break;
        // 已完成并领取了
        case '2':
          console.log('不能重复领取奖励');
          result = 2;
          break;
        default:
          console.log('此任务还没完成');
          result = 0;
      }
      // console.log(test);
      return result;
    }

  }
  return TaskService;
};