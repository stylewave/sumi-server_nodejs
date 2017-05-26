/*
***
自定义Db操作 ,暂无使用
使用例子
const rs = await this.ctx.service.utils.db.getAll(`select * from data_user`);
***
*/

module.exports = app => {
  class DbService extends app.Service {
    // 获取单条记录数
    async getRow(sql) {
      if (sql.indexOf('LIMIT') === -1 && sql.indexOf('limit') === -1) {
        sql += ' LIMIT 1';
      }
      const result = await app.mysql.query(sql);
      // console.log('getRow>>>>>>', result);
      return result.length ? result[0] : null;
    }

    // 获取所有记录
    async getAll(sql) {
      const result = await app.mysql.query(sql);
      // console.log('getRow>>>>>>', result);
      return result.length ? result : null;
    }
  }
  return DbService;
};
