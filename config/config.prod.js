module.exports = {
  rootUrl: 'http://127.0.0.1:7001',
  custom: 'prod hello',
  crypKeys: '12345678',
  mysql: {
    client: {
      // host
      host: '192.168.16.254',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '111111',
      // 数据库名
      database: 'cq',
    },
  },
  redis: {
    client: {
      host: '192.168.16.254',
      port: '8000',
      family: '',
      password: '',
      db: '1',
    },
  },
};
