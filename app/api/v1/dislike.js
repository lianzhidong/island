/*
 * @Description:取消点赞业务
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-21 21:04:09
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-21 22:00:33
 */
const Router = require("koa-router");
const { Auth } = require("../../../middlewares/auth");
const { Favor } = require("../../models/favor");
const { DisikeValidator } = require("../../validators/validator");
const { Success } = require("../../../core/http-exception");

const router = new Router({
  prefix: "/v1/dislike",
});
router.post("/", new Auth().m, async (ctx) => {
  const v = await new DisikeValidator().validate(ctx, { id: "art_id" });
  await Favor.dislike(v.get("body.art_id"), v.get("body.type"), ctx.auth.uid);
  Success("取消点赞成功");
});
