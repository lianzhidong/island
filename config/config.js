/*
 * @Description:配置文件
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-09 22:03:55
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-04 21:37:43
 */
module.exports = {
  //开发环境
  environment: "dev",
  database: {
    dbName: "island",
    host: "localhost",
    post: 3306,
    user: "root",
    password: "lianzhidong",
  },
  security: {
    //jwt的key
    secretKey: "wewewewsdsad",
    //过期时间
    expiresIn: 60 * 60 * 24 * 30,
  },
  //微信小程序配置
  wx: {
    appId: "wx115a6ed098ec63e7",
    appSecret: "737efa16ce85177ca43b6cf290aa618b",
    loginUrl:
      "https://api.weixin.qq.com/sns/jscode2session?appid=%s&secret=%s&js_code=%s&grant_type=authorization_code",
  },
  yushu: {
    detailUrl: "http://t.yushu.im/v2/book/id/%s",
    keywordUrl:
      "http://t.yushu.im/v2/book/search?q=%s&count=%s&start=%s&summary=%s",
  },
  host: "",
};
