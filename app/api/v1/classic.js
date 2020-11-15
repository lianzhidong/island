/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-09-24 21:57:59
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-28 21:03:44
 */
const Router = require("koa-router");
const router = new Router({
  prefix: "/v1/classic",
});
const {
  PositiveIntegerValidator,
  ClassicValidator,
} = require("../../validators/validator");
const { Flow } = require("../../models/flow");
const { Auth } = require("../../../middlewares/auth");
const { Art } = require("../../models/art");
const { Favor } = require("../../models/favor");

router.get("/latest", new Auth(7).m, async (ctx, next) => {
  //查询最新数据，即index最大的数据,按照index倒序排列
  const flow = await Flow.findOne({
    order: [["index", "DESC"]],
  });
  const art = await Art.getData(flow.art_id, flow.type);
  const likePrevious = await Favor.userLikeIt(
    flow.art_id,
    flow.type,
    ctx.auth.uid
  );
  art.setDataValue("index", flow.index);
  art.setDataValue("like_status", likePrevious);
  ctx.body = art;
});

//获取期刊的点赞情况
router.get("/:type/:id/favor", new Auth().m, async (ctx) => {
  const v = await new ClassicValidator().validate(ctx);
  const id = v.get("path.id");
  const type = parseInt(v.get("path.type"));
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  if (!art) {
    throw new global.errs.NotFound();
  }
  ctx.body = {
    art: artDetail.art,
    like_status: artDetail.like_status,
  };
});

//用户所有喜欢的期刊列表
router.get("/favor", new Auth().m, async (ctx) => {
  const uid = ctx.auth.uid;
  ctx.body = await Favor.getMyClassicFavors(uid);
});

//获取用户喜欢的某个期刊信息
router.get("./:type/:id", new Auth.m(), async (ctx) => {
  const v = await new ClassicValidator().validate(ctx);
  const id = v.get("path.id");
  const type = parseInt(v.get("path.type"));
  const artDetail = await new Art(id, type).getDetail(ctx.auth.uid);
  ctx.body = {
    art: artDetail.art,
    like_status: artDetail.like_status,
  };
});
module.exports = router;
