module.exports = app => {
  class NewsService extends app.Service {
    // 获取总的记录数
    async getTotal() {
      const sql = `SELECT COUNT(*) as total FROM data_news WHERE news_show = '1'`;
      const result = await this.ctx.service.utils.db.common(sql);
      //  const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 拉取新闻列表
    async list(start, size) {
      const where = { news_show: '1' };
      const data_columns = ['news_id', 'news_title', 'news_intro', 'news_create_time', 'news_hits', 'news_create_time'];
      const result = await this.ctx.service.utils.db.select('data_news', where, data_columns, ['news_id', 'desc'], size, start);
      const moment = require("moment");
      if (result.length > 0) {
        for (const v in result) {
          result[v].time = moment(result[v].msg_create_time).format("HH:mm");
        }
      }
      return result;
    }

    // 拉取新闻详情
    async newsDetail(newsId = '') {
      const field = "news_id,news_title,news_content,news_hits,DATE_FORMAT(news_create_time,'%y-%d-%m %H:%i:%s') as news_create_time";
      let sql;
      if (newsId) {
        sql = `SELECT ${field} FROM data_news WHERE news_show = '1' AND news_id='${app.mysql.escape(newsId)}'`;
      } else {
        sql = `SELECT ${field} FROM data_news WHERE news_show = '1' ORDER BY news_id DESC`;
      }

      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
  }
  return NewsService;
};
