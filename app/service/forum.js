module.exports = app => {
  class ForumService extends app.Service {
    // 拉取新闻列表
    async boardDetail(id) {
      const field = '*';
      const sql = 'SELECT ' + field + " FROM data_forum_board WHERE board_id = '" + id + "' ";
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
    /*
    // 获取总的记录数
    async getTotal() {
      const sql = 'SELECT COUNT(*) as total FROM data_news WHERE news_show = \'1\'';
      const result = await app.mysql.query(sql);
      return result[0].total;
    }

    // 拉取新闻列表
    async list(start, size) {
      const field = 'news_id,news_title,news_intro,news_create_time,news_hits';
      const sql = 'SELECT ' + field + ' FROM data_news WHERE news_show = \'1\' ORDER BY news_id DESC LIMIT ' + start + ',' + size;
      const result = await app.mysql.query(sql);
      return result;
    }

    // 拉取新闻详情
    async newsDetail(newsId) {
      const field = 'news_id,news_title,news_content,news_create_time,news_hits';
      const sql = 'SELECT ' + field + ' FROM data_news WHERE news_show = \'1\' AND news_id=' + newsId;
      const result = await app.mysql.query(sql);
      return result.length > 0 ? result[0] : null;
    }
    */
  }
  return ForumService;
};