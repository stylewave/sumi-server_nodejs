module.exports = app => {
  class jobService extends app.Service {
    // 获取职业详情
    async jobDetail(uid) {
      const user_row = await this.checkDetail(uid);
      const rs = await this.ctx.service.utils.jobArray.job().job;
      const job_row = rs[user_row.user_job_id - 1];
      console.log(job_row);
      job_row.list[0].active = '1';
      job_row.list[1].active = '0';
      job_row.list[2].active = '0';
      if (user_row.user_job_level >= job_row.list[2].level) {
        job_row.list[0].active = '1';
        job_row.list[1].active = '1';
        job_row.list[2].active = '1';
      } else if (user_row.user_job_level >= job_row.list[1].level) {
        job_row.list[1].active = '1';
        job_row.list[0].active = '1';
      }
      user_row.list = job_row.list;
      user_row.job_levelup = '999999';
      // user_row.job_levelup = user_row.user_job_exp + '/999999';
      // user_row.job_level1 = job_row.list.job_level1;
      // user_row.job_level2 = job_row.list.job_level2;
      // user_row.job_level3 = job_row.list.job_level3;
      // console.log(user_row);
      return user_row;

    }
    // 查询是否选择职业
    async checkDetail(uid) {
      const field = 'user_id,user_name,user_nickname,user_job_id,user_job_exp,user_job_name,user_job_level,user_job_icon';
      const sql = `SELECT ${field} FROM data_user WHERE user_id = ${app.mysql.escape(uid)}`;
      const result = await app.mysql.query(sql);
      return result[0].user_job_id > 0 ? result[0] : null;
    }
    // 设置职业
    async setJob(id, uid) {
      const rs = await this.ctx.service.utils.jobArray.job().job;
      const job_row = rs[id - 1];
      let result;
      if (!job_row) {
        result = 2;
      } else {
        const userSql = `UPDATE data_user SET user_job_id = '${job_row.job_id}',user_job_name='${job_row.list[0].title}',user_job_icon='${job_row.job_icon}'  WHERE user_id = '${app.mysql.escape(uid)}'`;
        const re = await app.mysql.query(userSql);
        if (re) {
          job_row.job_name = job_row.list[0].title;
          result = job_row;
        } else {
          result = 0;
        }

      }
      // console.log(result);
      return result;
    }

    async checkUpgrade(uid, level, exp) {

      const exp_array = await this.ctx.service.utils.expArray.exp();
      let i;
      for (i = exp_array.length; i >= 1; i--) {
        if (exp >= exp_array[i]) {
          if (i >= level) {
            // 升级操作
            level = i + 1;
            await this.setJobLevel(uid, level);
          }
          break;
        }

      }

      const new_level = level;

      const output = [];
      output.user_job_level = new_level;
      if (new_level >= exp_array.length) {
        output.jop_exp = 0;
        output.jop_next_exp = 0;
      } else {
        output.jop_exp = exp - exp_array[new_level - 1];
        output.jop_next_exp = exp_array[new_level] - exp_array[new_level - 1];
      }

      return output;
    }

    async setJobLevel(uid, level) {
      const user_row = await app.mysql.get('data_user', { user_id: uid });
      const job_list = await this.ctx.service.utils.jobArray.job().job;
      let job_row;

      if (user_row.user_job_id) {
        job_row = job_list[user_row.user_job_id];
        // if(!job_row){
        // //	result ={status:0,tips:'您选择的职业不存在'};
        // //	return result;
        // }
      }
      console.log('output3');
      let skill;
      let job_name;
      let job_stage;
      skill = '';
      if (level >= job_row.list[0].level) {
        skill += job_row.list[0].key;
        job_name = job_row.list[0].title;
        job_stage = 'job_level1';
      }
      if (level >= job_row.list[1].level) {
        skill += skill ? ',' + job_row.list[1].key : job_row.list[1].key;
        job_name = job_row.list[1].title;
        job_stage = 'job_level2';
      }
      if (level >= job_row.list[2].level) {
        skill += skill ? ',' + job_row.list[2].key : job_row.list[2].key;
        job_name = job_row.list[2].title;
        job_stage = 'job_level3';
      }
      let userSql;
      let taskSql;
      let output;

      if (skill.indexOf('nomal_box_count1') !== -1) {
        const skill_list = await this.ctx.service.utils.jobArray.job().skill;
        taskSql = `UPDATE data_task SET task_nomal_box_max='${skill_list.nomal_box_count1.value}',task_las_update=${this.app.mysql.literals.now} WHERE task_uid = ${app.mysql.escape(uid)}`;
        app.mysql.query(taskSql);
      }

      if (job_name) {
        userSql = `UPDATE data_user SET user_job_skill='${skill}',user_job_level='${level}',user_job_level_stage='${job_stage}',user_job_name='${job_name}' WHERE user_id = ${app.mysql.escape(uid)}`;
      } else {
        userSql = `UPDATE data_user SET user_job_skill='${skill}',user_job_level='${level}',user_job_level_stage='${job_stage}' WHERE user_id = ${app.mysql.escape(uid)}`;
      }
      const user = app.mysql.query(userSql);
      if (user) {
        output = { status: 1, level2: level };
      } else {
        output = { status: 0, tips: '设置级别失败' };

      }
      return output;

    }

  }
  return jobService;
};
