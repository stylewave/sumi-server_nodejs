module.exports = app => {
  class AdService extends app.Service {
    // 获取广告列表
    async list(page) {
      const field = 'ad_id,ad_title,ad_page,ad_url,ad_photo,ad_create_time';
      const sql = `SELECT ${field} FROM data_ad WHERE ad_status = '1' AND ad_page='${page}' ORDER BY ad_id`;
      const result = await app.mysql.query(sql);
      return result;
    }

  }
  return AdService;
};
