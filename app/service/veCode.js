module.exports = app => {
  class VeCodeService extends app.Service {
    // 插入验证码
    async insert(mobile, code) {
      const result = await this.app.mysql.insert('data_sms', { sms_mobile: mobile, sms_type: 0, sms_content: code, sms_create_time: this.app.mysql.literals.now });

      const content = '注册用户-验证码：' + code;
      const sdkurl = 'http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend?sn=SDK-ZZB-010-00025&pwd=93C8CF517DC35B021D7B50ADCA564850&mobile=' + mobile + '&content=' + content + '【速米科技】&ext=&stime=&rrid=&msgfmt=';
      const url = this.url_encode(sdkurl);
      const result2 = await this.app.curl(url, {
        method: 'GET',
        // dataType: 'json',
      });
      if (result2 && result) {
        return result.affectedRows === 1;
      }
      return 0;
    }

    url_encode(url) {
      url = encodeURIComponent(url);
      url = url.replace(/\%3A/g, ":");
      url = url.replace(/\%2F/g, "/");
      url = url.replace(/\%3F/g, "?");
      url = url.replace(/\%3D/g, "=");
      url = url.replace(/\%26/g, "&");

      return url;
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
