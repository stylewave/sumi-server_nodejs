module.exports = app => {
  class AdController extends app.Controller {
    // 拉取广告列表
    async list() {
      const { page } = this.ctx.request.body;
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
