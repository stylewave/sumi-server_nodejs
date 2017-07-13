const charUtil = require('./utils/charUtil.js');
const _ = require('lodash');
module.exports = app => {
  class UserController extends app.Controller {
    // 头像和昵称设置
    async setUserPhoto() {
      const { uid, photo, nickname, token } = this.ctx.request.body;
      const numArr = [photo, uid];
      const strArr = [nickname, token];
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

      if (nickname.length < 2 || charUtil.check_string(nickname, 'checkSpecial')) {
        this.ctx.body = {
          status: 0,
          tips: '昵称输入有误',
        };
        return;
      }
      const result = await this.ctx.service.user.setUserPhoto(uid, photo, nickname);
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

    // 获取购买房间列表最大页码
    async chatRootTotal(uid) {
      const result = await this.ctx.service.user.chatRootTotal(uid);
      return result;
    }
    // 购买房间列表
    async chatRootList() {
      let { uid, page, size, token } = this.ctx.request.body;
      const numArr = [page, size, uid];
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

      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.chatRootTotal(uid);

      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }

      // 总共页数
      const total = Math.ceil(maxPage / size);
      const start = (page - 1) * size;
      const result = await this.ctx.service.user.chatRootList(uid, start, size);

      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,

      };

    }


    // 获取消息列表最大页码
    async userMsgTotal(uid, type) {
      const result = await this.ctx.service.user.userMsgTotal(uid, type);
      return result;
    }

    // 用户消息列表
    async userMsgList() {
      let { uid, token, page, size, type } = this.ctx.request.body;
      let numArr;
      if (type) {
        numArr = [page, size, uid, type];
      } else {
        numArr = [page, size, uid];
      }
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
      page = parseInt(page, 10);
      size = parseInt(size, 10);
      const maxPage = await this.userMsgTotal(uid, type);

      if (page > maxPage) {
        this.ctx.body = {
          status: 0,
          tips: '没有更多数据了',
        };
        return;
      }

      // 总共页数
      const total = Math.ceil(maxPage / size);
      const start = (page - 1) * size;
      const result = await this.ctx.service.user.userMsgList(start, size, uid, type);
      this.ctx.body = {
        status: 1,
        totalsub: total,
        list: result,
      };
    }

    // 专门测试的
    async test() {

      // const results = await this.app.mysql.select('data_ad', { // 搜索 post 表
      //   where: { ad_url: 'Lottery', ad_page: ['like', '%1%', 'weww'] }, // WHERE 条件
      //   columns: ['ad_page', 'ad_url', 'ad_id', 'ad_title', "DATE_FORMAT(ad_create_time,'%Y-%m-%d')"], // 要查询的表字段
      //   orders: [['ad_id', 'desc']], // 排序方式
      //   limit: 10, // 返回数据量
      //   offset: 1, // 数据偏移量
      // });
      // console.log(results);
      // console.log('res');
      const field = 'ad_id,ad_title,ad_page,ad_url,ad_photo,ad_create_time,ad_content';
      let where = [];
      let userdata = [];
      // where = [['ad_status', '1; or ad_status=0 ', '='], ['ad_page', 'index']];
      where = [['ad_id', '23']];
      const aa = ['ad_id', 'ad_title', 'ad_create_time'];
      //  userdata = [['ad_title', '123455,ad_page=1232323']];
      userdata = { ad_page: '123', ad_url: 'Lottery' };
      const or = ['ad_id', 'desc'];

      // where[0] = ['ad_status', 1, '='];
      // where[1] = ['ad_page', 'index'];
      // const start = 0;
      // const size = 10;
      // const limit = start + ',' + size;
      // const data = await this.ctx.service.utils.db.getAllRow(field, 'data_ad', where, '', limit);
      const sql22 = `SELECT COUNT(*) as total FROM data_user_bean_log`;
      const data = await this.ctx.service.utils.db.common(sql22);
      console.log(data[0].total);
      console.log('data');
      const { uid } = this.ctx.request.body;
      console.log(app.mysql.escape(uid));
      const moment = require("moment");
      const time = moment().format("YYYY-MM-DD HH:mm:ss");
      const week1 = moment().format('d');
      const key = moment().format('YYYYMM');
      //   const sql = `select sign_id,DATE_FORMAT(sign_date,'%Y-%m-%d') as sign_date,DATE_FORMAT(sign_date,'%e') as news_date from data_sign_log where sign_uid='${uid}' and sign_key='${key}'`;
      const sql = `select sign_id,DATE_FORMAT(sign_date,'%Y-%m-%d') as sign_date,DATE_FORMAT(sign_date,'%e') as news_date from data_sign_log where sign_uid=${app.mysql.escape(uid)} and sign_key='${key}'`;
      // console.log(sql);
      const list = await app.mysql.query(sql);


      const sql2 = `select user_id from data_user where user_id=${app.mysql.escape(uid)}`;
      // const sql2 = `select user_id from data_user where user_id=${uid}`;
      // console.log(sql2);
      const list2 = await app.mysql.query(sql2);



      // const rs = await this.ctx.service.utils.taskArray.task();
      // let up = [];
      // const insert = {};
      // for (const ve in rs) {
      //   insert.task_uid = 66;
      //   insert.task_las_update = moment().format("YYYY-MM-DD HH:mm:ss");
      //   insert.task_date = moment().format("YYYY-MM-DD");
      //   console.log(rs[ve].task_db_field);
      //   up = { key: rs[ve].task_key, status: '0', count: '0' };

      //   insert[rs[ve].task_db_field] = JSON.stringify(up);
      //   //  insert[rs[ve].key] = up;
      //   //	$insert[$v['task_db_field']] = json_encode($update_row);
      // }
      // const re = await this.app.mysql.insert('data_task', insert);
      // console.log(re);


      // console.log(insert);

      //  $sign_array = array();
      const sign_array = [];
      if (list) {
        for (const value in list) {
          sign_array.push(list[value].news_date);
        }
      }

      let i;
      let issign;
      const date_array = [];
      for (i = 1; i <= 30; i++) {
        if (this.isCon(sign_array, i) === 1) {
          issign = 1;
        } else {
          issign = 0;
        }
        //  $date_array[] = array('date'=>$i, 'issign'=>$issign);
        date_array[i] = { date: i, issign1: issign };
        // date_array.push(list[value].news_date);
      }
      // const item = [{ id: 1, title: '签到5天', beans: '10', count: '5' }, { id: 2, title: '签到10天', beans: '30', count: '10' }, { id: 3, title: '签到20天', beans: '60', count: '20' }, { id: 4, title: '满签', beans: '100', count: moment().format('LL') }];
      // const today_issign = in_array($today,$sign_array) ? '1' : '0';
      this.ctx.body = {
        status: 1,
        list1: list2,
        times: time,
        week: week1,
        month: moment().month(),
        result1: sign_array,
        dat: data,
        // da: date_array,
      };
    }
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

  }
  return UserController;
};
