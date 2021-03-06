module.exports = {
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  io: {
    enable: true,
    package: 'egg-socket.io',
  },
  xtpl: {
    enable: true,
    package: 'egg-view-xtpl',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  proxyworker: {
    enable: true,
    package: 'egg-development-proxyworker',
  },
};
