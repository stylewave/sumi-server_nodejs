/*
***
自定义Db操作
使用例子
const rs = await this.ctx.service.utils.db.getAll(data,data);
***
*/

module.exports = app => {
  class DbService extends app.Service {

    /*
     *获取多条记录数  执行 sql 语句
     *string field
     *string table
     *array where =[['value1','value2','value3']];value1为字段名，value2为查看的对应信息，value3是条件，默认为"="
     ***
   */
    async getAll(field, table, where, order = '', limit = '') {
      if (!table || !field || !where) {
        return 0;
      }
      let wherefield = '';
      let new_key;
      let sign;
      for (const v in where) {
        new_key = app.mysql.escape(where[v][1]);
        sign = where[v][2] ? where[v][2] : '=';
        const where2 = `${where[v][0]} ${sign} ${new_key}`;
        wherefield += wherefield ? ' AND ' + where2 : where2;

      }
      order = order ? 'ORDER BY ' + order + ' DESC' : '';
      limit = limit ? 'LIMIT ' + limit : '';
      const sql = `SELECT ${field} FROM ${table} WHERE ${wherefield} ${order} ${limit}`;
      const result = await app.mysql.query(sql);
      console.log(wherefield);
      console.log(sql);
      return result.length ? result : null;
    }

    /*
    *获取单条记录数  执行 sql 语句
    *string field
    *string table
    *array where =[['value1','value2','value3']];value1为字段名，value2为查看的对应信息，value3是条件，默认为"="
    ***
    */
    async getRow(field, table, where, order = '') {
      if (!table || !field || !where) {
        return 0;
      }
      let wherefield = '';
      let new_key;
      let sign;
      for (const v in where) {
        new_key = app.mysql.escape(where[v][1]);
        sign = where[v][2] ? where[v][2] : '=';
        const where2 = `${where[v][0]} ${sign} ${new_key}`;
        wherefield += wherefield ? ' AND ' + where2 : where2;

      }
      order = order ? 'ORDER BY ' + order + ' DESC' : '';
      const sql = `SELECT ${field} FROM ${table} WHERE ${wherefield} ${order} LIMIT 1`;
      const result = await app.mysql.query(sql);
      return result.length ? result : null;
    }

    /*
    *插入数据
    *string table
    *object data   { id: '1' }
   */
    async insert(table, data) {
      if (!table || !data) {
        return 0;
      }
      const result = await this.app.mysql.insert(table, data);
      return result.length ? result.insertId : null;
    }

    /*
     *更新数据
     *string table
	   *array data =[['value1','value2']] value1为字段名，value2为增加的内容信息
     *array where =[['value1','value2','value3']];value1为字段名，value2为查看的对应信息，value3是条件，默认为"="
     ***
   */
    async update(table, data, where) {
      if (!table || !data || !where) {
        return 0;
      }
      let wherefield = '';
      let datafield = '';
      let new_key;
      let sign;
      let new_key2;
      for (const v in where) {
        new_key = app.mysql.escape(where[v][1]);
        sign = where[v][2] ? where[v][2] : '=';
        const where2 = `${where[v][0]} ${sign} ${new_key}`;
        wherefield += wherefield ? ' AND ' + where2 : where2;

      }
      for (const vv in data) {
        new_key2 = app.mysql.escape(data[vv][1]);
        const where3 = `${data[vv][0]} = ${new_key2}`;
        datafield += datafield ? ',' + where3 : where3;

      }
      const sql = `UPDATE ${table} SET ${datafield} WHERE ${wherefield}`;
      console.log(sql);
      const result = await this.app.mysql.query(sql);
      return result;
    }

    /*
    *删除数据
    *string table
    *object data   { id: '1' }
   */
    async delete(table, data) {
      if (!table || !data) {
        return 0;
      }
      const result = await this.app.mysql.delete(table, data);
      return result.affectedRows;
    }

    /*
    *获取单个数据
    *string table
    *object data   { id: '1' }
   */
    async getone(table, data) {
      if (!table || !data) {
        return 0;
      }
      const result = await this.app.mysql.get(table, data);
      return result;
    }

    /*
    *查询数据
    *string table
    *object datawhere   { id: '1' } 条件
    *array datacolumns ['id', 'name'] 要查询的表字段
    *array dataorders ['id', 'desc'] 排序方式
    *int size 返回数据量
    *int start 数据偏移量
    ***
  */
    async select(table, data_where = '', data_columns, data_orders = '', size = '', start = '') {
      if (!table || !data_columns) {
        return 0;
      }
      start = start ? start : '';
      size = size ? size : '';
      data_where = data_where ? data_where : '';
      data_orders = data_orders ? [data_orders] : '';
      const result = await this.app.mysql.select(table, {
        where: data_where,
        columns: [data_columns],
        orders: data_orders,
        limit: size,
        offset: start,
      });
      return result;
    }

    //  共用的执行sql语句
    async common(sql) {
      const result = await this.app.mysql.query(sql);
      return result;
    }

    // 获取单条记录数
    // async getRow(sql) {
    //   if (sql.indexOf('LIMIT') === -1 && sql.indexOf('limit') === -1) {
    //     sql += ' LIMIT 1';
    //   }
    //   const result = await app.mysql.query(sql);
    //   // console.log('getRow>>>>>>', result);
    //   return result.length ? result[0] : null;
    // }

  }
  return DbService;
};
