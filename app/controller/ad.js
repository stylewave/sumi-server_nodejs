const _ = require('lodash');
const charUtil = require('./utils/charUtil.js');
module.exports = app => {
  class AdController extends app.Controller {
    // 拉取广告列表
    async list() {
      const { page, uid, token } = this.ctx.request.body;
      const arr = [uid, page];
      const strArr = [token];
      if (charUtil.checkNumT(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数格式不正确',
        };
        return;
      }

      if (charUtil.checkIntType(arr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
        };
        return;
      }


      if (charUtil.checkStringType(strArr) === false) {
        this.ctx.body = {
          status: 0,
          tips: '参数类型不正确',
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
      const result = await this.ctx.service.ad.list(page);

      this.ctx.body = {
        status: 1,
        list: result,
      };
    }

    * create() {
      // const result = yield app.curl('http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend?sn=SDK-ZZB-010-00025&pwd=93C8CF517DC35B021D7B50ADCA564850&mobile=18814188612&content=123456【速米科技】&ext=&stime=&rrid=&msgfmt=', {
      //   method: 'GET',
      //   dataType: 'json',
      // });

      const result = yield app.curl("http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend?sn=SDK-ZZB-010-00025&pwd=93C8CF517DC35B021D7B50ADCA564850&mobile=18814188612&content=sumikeji,code:958741[sumikeji]&ext=&stime=&rrid=&msgfmt=", {
        method: 'GET',
        dataType: 'json',
      });
      // const result = yield this.ctx.httpclient.curl("http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend?sn=SDK-ZZB-010-00025&pwd=93C8CF517DC35B021D7B50ADCA564850&mobile=18814188612&content=123456&ext=&stime=&rrid=&msgfmt=");


      // const result = yield this.ctx.curl("http://sdk.entinfo.cn:8061/webservice.asmx/mdsmssend?sn=SDK-ZZB-010-00025&pwd=93C8CF517DC35B021D7B50ADCA564850&mobile=18814188612&content=123456【速米科技】&ext=&stime=&rrid=&msgfmt=", {
      //   method: 'get',
      //   data: {},
      //   dataType: 'json',
      //   contentType: 'json',
      // });
      console.log(result.data);
      console.log('result');
      console.log(result);

    }

  }
  return AdController;
};
