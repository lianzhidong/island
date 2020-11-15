/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-13 21:40:39
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-14 22:04:48
 */
const Router = require("koa-router");
const { RegisterValidator } = require("../../validators/validator");
const { User } = require("../../models/user");
const { ParameterException, Success } = require("../../../core/http-exception");
const router = new Router({
  prefix: "/v1/user",
});

//用户注册
router.post("/register", async (ctx) => {
  const v = await new RegisterValidator().validate(ctx);
  const user = {
    email: v.get("body.email"),
    password: v.get("body.password2"),
    nickname: v.get("body.nickname"),
  };
  const r = await User.create(user);
  //返回成功信息
  throw new global.errs.Success();
});

module.exports = router;
