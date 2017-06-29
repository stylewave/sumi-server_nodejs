module.exports = app => {
  class SignController extends app.Service {

    // 签到日历
    async signCalendar(uid) {
      const moment = require("moment");
      const times = moment().format("YYYY年MM月DD日");
      // const week1 = moment().format('d');
      const week1 = moment(moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")).format('d'); // 一个月开始的一天是周几
      // console.log(moment().month(), moment().get('date'));
      const today = moment().get('date');
      const monthDay = moment(moment().endOf("month")).format('DD'); // 一个月多少天
      const key = moment().format('YYYYMM');
      const sql = `select sign_id,DATE_FORMAT(sign_date,'%Y-%m-%d') as sign_date,DATE_FORMAT(sign_date,'%e') as news_date from data_sign_log where sign_uid='${uid}' and sign_key='${key}'`;
      console.log(sql);
      const list = await app.mysql.query(sql);
      const sign_array = [];
      if (list) {
        for (const value in list) {
          sign_array.push(list[value].news_date);
        }
      }

      let i;
      let issign1;
      const date_array = [];
      for (i = 0; i <= monthDay - 1; i++) {
        if (this.isCon(sign_array, i + 1) === 1) {
          issign1 = 1;
        } else {
          issign1 = 0;
        }
        date_array[i] = { date: i + 1, issign: issign1 };
        // date_array.push(list[value].news_date);
      }
      const items = [{ id: 1, title: '签到5天', beans: '10', count: '5' }, { id: 2, title: '签到10天', beans: '30', count: '10' }, { id: 3, title: '签到20天', beans: '60', count: '20' }, { id: 4, title: '满签', beans: '100', count: monthDay }];

      const today_issign = this.isCon(sign_array, today) ? '1' : '0';
      console.log(today_issign);

      return {
        status: 1,
        time: times,
        week: week1,
        month: monthDay,
        list: date_array,
        item: items,
        count: sign_array.length,
        todayIssign: today_issign,
      };
    }

    // 判断函数
    isCon(arr, val) {
      let i = arr.length;
      while (i--) {
        const sign_key = parseInt(arr[i], 10);
        if (sign_key === val) {
          return 1;
        }
      }
      return 0;
    }
    // 签到
    async userSign(uid) {
      const moment = require("moment");
      //  const create_time = moment().format("YYYY-MM-DD HH:mm:ss");
      const days = moment(moment().endOf("month")).format('DD'); // 一个月多少天
      const date = moment().format("YYYY-MM-DD");
      const key = moment().format('YYYYMM');

      // const week1 = moment().format('d');
      // const week1 = moment(moment().startOf('month').format("YYYY-MM-DD HH:mm:ss")).format('d'); // 一个月开始的一天是周几
      // console.log(moment().month(), moment().get('date'));
      // const today = moment().get('date');


      const sql = `select sign_id from data_sign_log where sign_uid=${uid} and sign_date='${date}'`;
      console.log(sql);
      const list = await app.mysql.query(sql);
      if (list.length > 0) {
        return 2;
      }
      const log = [];
      const user_row = await app.mysql.get('data_user', { user_id: uid });
      const SIGN_DEFAULT_BEAN = 5;
      log[0] = { title: '签到获得', beans: SIGN_DEFAULT_BEAN };
      let user_beans;
      user_beans = parseInt(user_row.user_bonus_beans, 10) + parseInt(SIGN_DEFAULT_BEAN, 10);
      const skill_list = await this.ctx.service.utils.jobArray.job().skill;

      let value = 0;
      let more_beans = 0;
      let more_text = '';

      if (!user_row.user_job_skill) {
        user_row.user_job_skill = 'test';
      }
      if (user_row.user_job_skill.indexOf('sign_more_bean1') !== -1) {
        value = skill_list.sign_more_bean1.value;
        more_beans = value;
        more_text = value;
        if (log.length > 0) {
          log[log.length] = { title: '职业额外获得', beans: value };
        }

      }

      if (user_row.user_job_skill.indexOf('sign_more_bean2') !== -1) {
        value = skill_list.sign_more_bean2.value;
        more_beans = parseInt(value, 10) + parseInt(more_beans, 10);
        more_text += more_text ? ' + ' + value : value;
        if (log.length > 0) {
          log[log.length] = { title: '职业额外获得', beans: value };
        }

      }

      const items = [{ id: 1, title: '签到5天', beans: '10', count: '5' }, { id: 2, title: '签到10天', beans: '30', count: '10' }, { id: 3, title: '签到20天', beans: '60', count: '20' }, { id: 4, title: '满签', beans: '100', count: days }];
      const sqlcount = `select count(*) as total  from data_sign_log where sign_uid='${uid}' and sign_key='${key}'`;
      const recount = await app.mysql.query(sqlcount);
      const sign_count = recount[0].total + 1;

      for (const v in items) {
        const count = parseInt(items[v].count, 10);
        if (count === sign_count) {
          value = v.beans;
          more_beans = parseInt(value, 10) + parseInt(more_beans, 10);
          more_text += more_text ? ' + ' + value : value;
          if (log.length > 0) {
            log[log.length] = { title: v.title + '额外获得', beans: value };
          }

          break;
        } else {
          continue;
        }
      }


      let log_remarks = '';
      if (more_text) {
        user_beans = parseInt(user_row.user_bonus_beans, 10) + parseInt(SIGN_DEFAULT_BEAN, 10) + parseInt(more_beans, 10);
        log_remarks = "额外获取(" + more_text + ")赠豆";
      }
      console.log(log_remarks);
      console.log(user_beans);

      const userSql = `UPDATE data_user SET user_bonus_beans ='${user_beans}' WHERE user_id ='${uid}'`;
      const conn = await app.mysql.beginTransaction(); // 初始化事务
      try {
        await conn.query(userSql);
        //  await conn.query(subSql);
        const r1 = await conn.insert('data_sign_log', {
          sign_uid: uid,
          sign_date: date,
          sign_key: key,
          sign_create_time: this.app.mysql.literals.now,
        });

        await conn.insert('data_user_bean_log', {
          log_uid: user_row.user_id,
          log_user: user_row.user_name,
          log_nickname: user_row.user_nickname,
          log_type: 'sign',
          log_main_table: 'data_sign_log',
          log_main_id: r1.insertId,
          log_content: '签到获得' + SIGN_DEFAULT_BEAN + '赠豆 ' + log_remarks,
          log_count: SIGN_DEFAULT_BEAN + more_beans,
          log_bean_before: user_row.user_beans + user_row.user_bonus_beans,
          log_bean_end: user_row.user_beans + user_row.user_bonus_beans + SIGN_DEFAULT_BEAN + more_beans,
          log_create_time: this.app.mysql.literals.now,
          log_remark: log_remarks,
        });


        await conn.commit(); // 提交事务
        const key2 = 'sign';
        const rss = await this.ctx.service.task.check_task(key2, uid);
        return { status: 1, rs: rss, list: log };

      } catch (err) {
        const output = { status: 0, tips: '签到失败,请稍后再试!' };

        await conn.rollback(); // 一定记得捕获异常后回滚事务！！
        //  throw err;
        return output;

      }

    }



  }
  return SignController;
};
