/*
 * @Description:全局异常处理
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-08 12:37:32
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-13 22:04:08
 */
const { HttpException } = require("../core/http-exception");
const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    //开发环境抛出异常
    const isHttpException = error instanceof HttpException;
    const isDev = global.config.environment === "dev";
    if (!isHttpException && isDev) {
      throw error;
    }
    if (isHttpException) {
      //已知异常
      ctx.body = {
        msg: error.msg,
        error_code: error.errorCode,
        request: `${ctx.method} ${ctx.path}`,
      };
      ctx.sattus = error.code;
    } else {
      //未知异常
      ctx.body = {
        msg: "未知异常发生了",
        error_code: 999,
        request: `${ctx.method} ${ctx.path}`,
      };
      ctx.sattus = 500;
    }
  }
};

module.exports = catchError;
