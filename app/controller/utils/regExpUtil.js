module.exports = {
  checkMobile(mobile) {
    const regMobile = /^1(3|4|5|7|8)\d{9}$/;
    return regMobile.test(mobile);
  },


};
