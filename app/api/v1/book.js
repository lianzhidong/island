/*
 * @Description:书籍的api
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-09-24 21:57:51
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-04 20:51:59
 */
const Router = require("koa-router");
const { HotBook } = require("../../models/HotBook");
const { Book } = require("../../models/book");
const {
  PositiveIntegerValidator,
  SearchValidator,
  AddShortCommentValidator,
} = require("../../validators/validator");
const { Auth } = require("../../../middlewares/auth");
const { Favor } = require("../../models/favor");
const { Comment } = require("../../models/book-comment");
const { Success } = require("../../../core/http-exception");
const router = new Router({
  prefix: "/v1/book",
});

router.get("/hot_list", async (ctx, next) => {
  const books = await HotBook.getAll();
  ctx.body = books;
});

//书籍详情
router.get(":id/detail", async (ctx, next) => {
  const v = await new PositiveIntegerValidator().validate(ctx);
  const book = new Book();
  ctx.body = book.detail(v.get("path.id"));
});

//搜索
router.get("search", async (ctx) => {
  const v = await new SearchValidator().validate(ctx);
  const res = await Book.searchFromYunshu(
    v.get("query.q"),
    v.get("query.start"),
    v.get("query.count")
  );
  ctx.body = res;
});

//喜欢的数量
router.get("/favor/count", new Auth().m, async (ctx) => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid);
  ctx.body = { count };
});

//获取书籍点赞情况
router.get("/:book_id/favor", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id",
  });
  const favor = await Favor.getBookFavor(ctx.auth.uid, v.get("path.book_id"));
  ctx.body = {
    favor,
  };
});

//新增短评
router.post("/add/short_common", new Auth().m, async (ctx) => {
  const v = await new AddShortCommentValidator().validate(ctx, {
    id: "book_id",
  });
  Comment.addComment(v.get("body.book_id"), v.get("body.content"));
  Success();
});

//获取短评
router.get("/:book_id/short_comment", new Auth().m, async (ctx) => {
  const v = await new PositiveIntegerValidator().validate(ctx, {
    id: "book_id",
  });
  const comments = await Comment.getComments(v.get("path.book_id"));
  ctx.body = comments;
});
module.exports = router;
