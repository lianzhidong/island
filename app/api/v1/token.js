/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-15 20:55:06
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-21 20:30:49
 */
const Router = require("koa-router");
const {
  TokenValidator,
  NotEmptyValidator,
} = require("../../validators/validator");
const { LoginType } = require("../../lib/enum");
const { User } = require("../../models/user");
const { generateToken } = require("../../../core/util");
const { Auth } = require("../../../middlewares/auth");
const { WXManager } = require("../../services/wx");
const router = new Router({
  prefix: "/v1/token",
});

router.post("/", async (ctx) => {
  const v = await new TokenValidator().validate(ctx);
  let token;
  //处理不同的登录类型
  switch (v.get("body.type")) {
    //用户邮箱登录
    case LoginType.USER_EMAIL:
      token = await emailLogin(v.get("body.account"), v.get("body.secret"));
      break;
    //小程序登录
    case LoginType.USER_MINI_PROGRAM:
      token = await WXManager.codeToToken(v.get("body.account"));
      break;
    default:
      throw new global.errs.ParameterException("没有相应的处理函数");
      break;
  }
  ctx.body = token;
});

router.post("/verify", async (ctx) => {
  const v = await new NotEmptyValidator().validate(ctx);
  let result = Auth.verifyToken(v.get("body.token"));
  ctx.body = {
    is_velid: result,
  };
});

async function emailLogin(account, secret) {
  const user = await User.verifyEmailPassword(account, secret);
  return generateToken(user.id, Auth.USER);
}

module.exports = router;
