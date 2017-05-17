const crypto = require('crypto');

module.exports = {
  // md5加密
  md5(value) {
    const md5Val = crypto.createHash('md5').update(Buffer(value)).digest('hex');
    return md5Val;
  },
  // 获取随机字符串
  getRandomNum(len = 0) {
    let code = '';
    for (let i = 0; i < len; i++) {
      code += Math.floor(Math.random() * 10);
    }
    return code;
  },
  // 获取加密的字符串
  getMd5Char(len = 0) {
    const char = this.getRandomNum(len);
    return this.md5(char);
  },
};
