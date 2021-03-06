const request = require('request');
const iconv = require('iconv-lite');
module.exports = app => {
  // 市场资讯模块
  class Market extends app.Controller {

    // 内部函数，切换字符串
    cutString(DataStr, strFront, strBack) {
      var front = DataStr.indexOf(strFront) + strFront.length;
      var back = DataStr.indexOf(strBack);
      //console.log(DataStr, strFront, strBack, front, back);
      if (strBack === "") {
        return DataStr.substring(front);
      }
      return DataStr.substring(front, back);
    }

    // 拉取
    // 拉取
    async getMarketData() {
      console.log("getData");
      // try 捕获 reject：错误信息
      // 核心 Promise
      try {
        // await 等待执行
        const data = await new Promise((resolve, reject) => {
          // request('http://hq.sinajs.cn/list=sh000001,sz399006,sz399001 ',
          request({ encoding: null, url: 'http://hq.sinajs.cn/list=sh000001,sz399006,sz399001', gzip: true },
            (error, response, body) => {
              if (!error && response.statusCode === 200) resolve(iconv.decode(body, 'gb2312').toString());
              else {
                console.log("思密达，请求http://hq.sinajs.cn 失败");
                reject();
              }
            });
        });
        var stocksList = [];
        // 执行完毕输出
        const tempStockList = data.split(";");
        // console.log(stocksList);
        const stockInfo = function (id, name, priceCur, priceChange, priceChangeRatio, volume, flag) {
          return { id, name, priceCur, priceChange, priceChangeRatio, volume, flag };
        }
        tempStockList.forEach((stock) => {
          // console.log(stock);
          const tempList = stock.split(",");
          if (tempList.length > 16) {

            // let id = tempList[0];          // id
            let id = this.cutString(tempList[0], "str_", "=");          // id
            let name = this.cutString(tempList[0], "=\"", "");        // name
            let priceCur = parseFloat(tempList[3], 10).toFixed(2);    // 当前价
            let priceChange = parseFloat(tempList[3], 10).toFixed(2) - parseFloat(tempList[2], 10).toFixed(2);    // 差价
            let priceChangeRatio = (parseFloat(tempList[3], 10) - parseFloat(tempList[2], 10)) / parseFloat(tempList[2], 10) * 100;// 涨跌幅
            let volume = parseFloat(tempList[9], 10) / 100000000;         // 成交额
            let flag = (parseFloat(tempList[3], 10) - parseFloat(tempList[2], 10) > 0) ? 1 : 0;

            priceChange = priceChange.toFixed(2);
            priceChangeRatio = priceChangeRatio.toFixed(2);
            volume = volume.toFixed(2);
            stocksList.push(stockInfo(id, name, priceCur, priceChange, priceChangeRatio, volume, flag));
          }
          // console.log(tempList);
        });
        console.log(stocksList);
        this.ctx.body = {
          status: 1,
          list: stocksList,
        };
      } catch (error) {
        // 捕获异常
        console.error(error);
        this.ctx.body = {
          status: 0,
        };
      }
    }
  }
  return Market;
};
