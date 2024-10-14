export const ConfigDB = {
  host: process.env.HOST_DB || '113.160.154.39', //deploy
  port: process.env.PORT_DB ? parseInt(process.env.PORT_DB) : 4343, //deploy
  username: `sa`,
  password: 'JHcos@123@123', //deplay

  // host: 'TUANIT-PC\\SQLEXPRESS', //office
  // port: 1433,
  // username: `sa`,
  // password: '1234',

  // host: 'localhost', //security
  // port: 1433,
  // username: `sa`,
  // password: '1234',

  database: 'RND',
};
