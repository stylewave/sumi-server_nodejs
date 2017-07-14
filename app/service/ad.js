module.exports = app => {
  class AdService extends app.Service {
    // 获取广告列表
    async list(page) {
      const where = { ad_status: '1', ad_page: page };
      const data_columns = ['ad_id', 'ad_title', 'ad_page', 'ad_url', 'ad_photo', 'ad_create_time', 'ad_content'];
      const result = await this.ctx.service.utils.db.select('data_ad', where, data_columns, ['ad_id', 'desc']);
      for (const v in result) {
        console.log(v);
        result[v].ad_photo = app.config.host + result[v].ad_photo;
      }
      return result;
    }
    // 活动总数
    async getActivityTotal() {
      const sql = `SELECT COUNT(*) as total FROM data_ad WHERE ad_status = 1 AND ad_page='activity'`;
      const result = await app.mysql.query(sql);
      return result[0].total;
    }
    // 活动列表
    async activityList(start, size) {
      const where = { ad_status: '1', ad_page: 'activity' };
      const data_columns = ['ad_id', 'ad_title', 'ad_page', 'ad_url', 'ad_photo', 'ad_create_time', 'ad_content'];
      const result = await this.ctx.service.utils.db.select('data_ad', where, data_columns, ['ad_id', 'desc'], size, start);

      for (const v in result) {
        result[v].ad_photo = app.config.host + result[v].ad_photo;
      }
      return result;
    }


  }
  return AdService;
};
