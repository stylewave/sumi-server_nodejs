/*
***
自定义通用session
***
*/
// const charUtil = require('../../controller/utils/charUtil.js');
module.exports = app => {
  class SessionService extends app.Service { }

  return SessionService;
};
