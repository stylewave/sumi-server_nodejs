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
      '0',
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'a',
      'b',
      'c',
      'd',
      'e',
      'f',
      'g',
      'h',
      'i',
      'j',
      'k',
      'l',
      'm',
      'n',
      'o',
      'p',
      'q',
      'r',
      's',
      't',
      'u',
      'v',
      'w',
      'x',
      'y',
      'z',
      'A',
      'B',
      'C',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
      'U',
      'V',
      'W',
      'X',
      'Y',
      'Z',
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

  algorithm: { ecb: 'des-ecb', cbc: 'des-cbc' },
  // DES 加密
  encrypt(value, key, iv = 0) {
    key = new Buffer(key);
    iv = new Buffer(iv ? iv : 0);
    const cipher = crypto.createCipheriv(this.algorithm.ecb, key, iv);
    cipher.setAutoPadding(true);
    let ciph = cipher.update(value, 'utf8', 'base64');
    ciph += cipher.final('base64');
    return ciph;
  },
  // DES 解密
  decrypt(value, key, iv = 0) {
    key = new Buffer(key);
    iv = new Buffer(iv ? iv : 0);
    const decipher = crypto.createDecipheriv(this.algorithm.ecb, key, iv);
    decipher.setAutoPadding(true);
    let txt = decipher.update(value, 'base64', 'utf8');
    txt += decipher.final('utf8');
    return txt;
  },
};
