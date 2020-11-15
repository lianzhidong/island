/*
 * @Description:权限校验
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-18 12:42:38
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-19 21:16:29
 */
const basicAuth = require("basic-auth");
const jwt = require("jsonwebtoken");
class Auth {
  //level:aoi级别
  constructor(level) {
    this.level = level || 1;
    Auth.USER = 8; //普通用户
    Auth.ADMIN = 16; //管理员
    Auth.SUPER_ADMIN = 32; //超级管理员
  }
  get m() {
    return async (ctx, next) => {
      //token检测
      const userToken = basicAuth(ctx.req);
      let decode = {};
      //禁止访问
      if (!userToken || !userToken.name) {
        throw new global.errs.Forbidden();
      }
      try {
        decode = jwt.verify(userToken.name, global.config.security.secretKey);
        console.log("******************");
        console.log(decode);
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          //过期
          throw new global.errs.Forbidden("token已过期");
        } else {
          throw new global.errs.Forbidden("token不合法");
        }
      }

      if (decode.scope < this.level) {
        throw new global.errs.Forbidden("暂无权限");
      }
      //下面为token合法的操作
      ctx.auth = {
        uid: decode.uid,
        scope: decode.scope,
      };
      await next();
    };
  }
  //验证token
  static verifyToken(token) {
    try {
      jwt.verify(token, global.config.security.secretKey);
      return true;
    } catch (error) {
      return false;
    }
  }
}
module.exports = {
  Auth,
};
