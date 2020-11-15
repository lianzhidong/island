/*
 * @Description:点赞业务
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-21 21:04:09
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-21 21:46:50
 */
const Router = require("koa-router");
const { Auth } = require("../../../middlewares/auth");
const { Favor } = require("../../models/favor");
const { LikeValidator } = require("../../validators/validator");
const { Success } = require("../../../core/http-exception");

const router = new Router({
  prefix: "/v1/like",
});
router.post("/", new Auth().m, async (ctx) => {
  const v = await new LikeValidator().validate(ctx, { id: "art_id" });
  await Favor.like(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid);
  Success("点赞成功");
});

module.exports = router;
