module.exports = app => {
  class TaskService extends app.Service {
    // async taskTotal() {
    //   const sql = `SELECT COUNT(*) as total FROM data_task WHERE log_uid='${userId}'`;
    //   const result = await app.mysql.query(sql);
    //   return result[0].total;
    // }

    //  任务列表
    async taskList(uid) {
      const result = await app.mysql.get('data_task', { task_uid: uid });
      const rs = await this.ctx.service.utils.taskArray.task();
      const task_finish = [];
      const task_going = [];
      const task_none = [];
      for (const value in rs) {
        const task_json_row = result[rs[value].task_db_field];
        const task_row = JSON.parse(task_json_row);
        // const task_row = task_json_row;
        // 已领取
        if (task_row.status === '2') {
          rs[value].task_status = '2';
          rs[value].task_count = task_row.count;
          task_finish.push(rs[value]);
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
      // console.log(list);
      return list;
    }

    // 判断任务是否存在
    async taskContent(uid, content) {
      const field = 'task_id,' + content + ' as content';
      const sql = `SELECT ${field} FROM data_task WHERE task_uid = ${app.mysql.escape(uid)}`;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : 0;
    }
    // 领取完成任务
    async finishTask(uid, taskcontent, content, task_row) {
      const userrow = await app.mysql.get('data_user', { user_id: uid });
      const e = await this.taskContent(uid, content);
      const tcontent = JSON.parse(e.content);
      const user_bonus_beans = userrow.user_bonus_beans + task_row.task_bonus_beans;
      const user_job_exp = userrow.user_job_exp + task_row.task_exp;
      let contentdata;
      let taskSql;
      let userSql;
      let result;
      let conn;
      let re;
      let output;
      console.log('tcontent');
      // console.log(content);
      switch (tcontent.status) {
        // 完成未领取
        case '1':
          tcontent.status = '2';
          contentdata = JSON.stringify(tcontent);

          taskSql = `UPDATE data_task SET ${content}=${app.mysql.escape(contentdata)} WHERE task_uid = ${app.mysql.escape(uid)}`;
          userSql = `UPDATE data_user SET user_bonus_beans='${user_bonus_beans}',user_job_exp=${user_job_exp} WHERE user_id = ${app.mysql.escape(uid)}`;

          app.mysql.query(taskSql);
          conn = await app.mysql.beginTransaction(); // 初始化事务
          try {
            await conn.query(userSql);
            await conn.query(taskSql);
            await conn.insert('data_user_bean_log', {
              log_uid: userrow.user_id,
              log_user: userrow.user_name,
              log_nickname: userrow.user_nickname,
              log_type: 'finish_task',
              log_main_table: 'data_task',
              log_main_id: task_row.task_id,
              log_content: '完成任务获得' + task_row.task_bonus_beans + '赠豆',
              log_count: task_row.task_bonus_beans,
              log_bean_before: userrow.user_beans + userrow.user_bonus_beans,
              log_bean_end: userrow.user_beans + userrow.user_bonus_beans + task_row.task_bonus_beans,
              log_create_time: this.app.mysql.literals.now,
            });
            await conn.commit(); // 提交事务
            // 返回级别及2经验
            re = await this.ctx.service.job.checkUpgrade(uid, userrow.user_job_level, user_job_exp);
            // console.log(re);

            output = { user_job_level: re.user_job_level, jop_exp: re.jop_exp, jop_next_exp: re.jop_next_exp, status: 1, bonus_beans: task_row.task_bonus_beans, exp: task_row.task_exp };
            console.log(output);
            result = output;
            // result = output;
          } catch (err) {
            await conn.rollback(); // 一定记得捕获异常后回滚事务！！
            throw err;
          }


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

    async check_task(key2, uid) {
      const rs = await this.ctx.service.utils.taskArray.task();
      const key_array = [key2];
      let field_list = '';
      const task_array = [];
      for (const v in key_array) {
        const fi = key_array[v];
        const field = rs[fi].task_db_field;  //
        field_list += field_list ? ',' + field : field;
        task_array[v] = rs[fi];
      }
      // console.log(task_array);
      const sql = `select task_id,${field_list} from data_task where task_uid='${app.mysql.escape(uid)}'`;
      const user_task_row = await app.mysql.query(sql);
      // console.log(user_task_row[0]);
      for (const vv in task_array) {
        const key = task_array[vv].task_db_field;
        const content_json = user_task_row[0][key];						// 用户任务json
        if (content_json) {
          const content = JSON.parse(content_json);
          if (content.status === '0') {
            content.count = parseInt(content.count, 10) + 1;
          }
          if (content.count >= task_array[vv].task_need) {				// 大于等于需求则更新状态
            content.status = "1";
          }
          const contentdata = JSON.stringify(content);
          const taskSql = `UPDATE data_task SET ${key}='${contentdata}' WHERE task_uid = ${app.mysql.escape(uid)}`;
          const rs = await app.mysql.query(taskSql);
          let output;
          if (rs) {
            output = { status: 1, tips: '任务状态已更新' };
            return output;
          }
          output = { status: 0, tips: '没有更新内容' };
          return output;
        }
        // else {
        //   continue;
        // }

      }

    }



  }
  return TaskService;
};
