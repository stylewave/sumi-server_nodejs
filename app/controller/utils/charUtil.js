const crypto = require('crypto');

module.exports = {
  // md5加密
  md5(value) {
    const md5Val = crypto.createHash('md5').update(Buffer(value)).digest('hex');
    return md5Val;
  },
  // 获取随机字符串
  getRandomNum(len = 1) {
    let code = '';
    for (let i = 0; i < len; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  },
  // 获取随机字符串
  getRandomChar(len = 1) {
    const list = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a',
      'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
      'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
      'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    ];
    let code = '';
    for (let i = 0; i < len; i++) {
      const index = Math.floor(Math.random() * list.length);
      code += list[index];
    }
    return code;
  },
  // 获取加密的字符串
  getMd5Char(len = 0) {
    const char = this.getRandomNum(len);
    return this.md5(char);
  },

  // 用户密码加密方式
  md5PWD(pwd, salt) {
    return this.md5(this.md5(pwd) + salt);
  },

  renew_point() {
    $.ajax({
        cache: true,
        url: "http://hq.sinajs.cn/list=s_sh000001,s_sz399006,s_sz399001,int_dji",
        type: "GET",
        dataType: "script",
        success: function() {
            var point1 = hq_str_s_sh000001.split(","); //上证指数
           var point2 = hq_str_s_sz399006.split(","); //创业指数
           var point3 = hq_str_s_sz399001.split(","); //深证指数
           var point4 = hq_str_int_dji.split(","); //道琼斯
            console.log(point1);
             console.log(point2);
              console.log(point3);


            // $("#point1-1").text(parseFloat(point1[1]).toFixed(2));
            // $("#point1-2").text(parseFloat(point1[2]).toFixed(2));
            // $("#point1-3").text(parseFloat(point1[3]).toFixed(2)+"%");

            // $("#point2-1").text(parseFloat(point2[1]).toFixed(2));
            // $("#point2-2").text(parseFloat(point2[2]).toFixed(2));
            // $("#point2-3").text(parseFloat(point2[3]).toFixed(2)+"%");

            // $("#point3-1").text(parseFloat(point3[1]).toFixed(2));
            // $("#point3-2").text(parseFloat(point3[2]).toFixed(2));
            // $("#point3-3").text(parseFloat(point3[3]).toFixed(2)+"%");

           

            // if($("#point1-2").text()<0){
            //     $(".mark-a").css('background-color','#5fc970');
            // }else{
            //      $(".mark-a").css('background-color','#ff5959');
            // }

            // if($("#point2-2").text()<0){
            //     $(".mark-b").css('background-color','#5fc970');
            // }else{
            //      $(".mark-b").css('background-color','#ff5959');
            // }

            // if($("#point3-2").text()<0){
            //    $(".mark-c").css('background-color','#5fc970');
            // }else{
            //      $(".mark-c").css('background-color','#ff5959');
            // }
        }
    });
    setTimeout(function() { renew_point() }, 10000); //30秒刷新
   },

};
