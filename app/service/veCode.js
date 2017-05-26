module.exports = app => {
  class VeCodeService extends app.Service {
    // 插入验证码
    async insert(mobile, code) {
      const result = await this.app.mysql.insert('data_sms', { sms_mobile: mobile, sms_type: 0, sms_content: code, sms_create_time: this.app.mysql.literals.now });
      return result.affectedRows === 1;
    }

    // 更新验证码状态
    async update(mobile, code, state) {
      const sql = 'UPDATE data_sms SET sms_status = ' + state + ' WHERE sms_mobile = ' + mobile + ' AND sms_content=' + code;
      const result = await this.app.mysql.query(sql);
      return result;
    }

    // 查询验证码是否有效
    async find(mobile, code) {
      const sql = 'SELECT COUNT(*) as total FROM data_sms WHERE sms_mobile=' + mobile + ' AND sms_content=' + code + ' AND TIMEDIFF(NOW(),sms_create_time) <= 60 AND sms_status = 0';
      const result = await app.mysql.query(sql);
      return result[0].total > 0;
    }

    // 查询验证码是否有效, 时间间断临时改为600s
    async findByMobile(mobile) {
      const sql = 'SELECT COUNT(*) as total FROM data_sms WHERE sms_mobile=' + mobile + ' AND TIMEDIFF(NOW(),sms_create_time) <= 600 AND sms_status = 0';
      const result = await app.mysql.query(sql);
      return result[0].total > 0;
    }

  }
  return VeCodeService;
};
