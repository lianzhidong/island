/*
 * @Description:入口程序
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-09-22 20:39:57
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-04 21:38:53
 */
const Koa = require("koa");
const InitManager = require("./core/init");
const parser = require("koa-bodyparser");
const catchError = require("./middlewares/exception");
const path = require("path");

//应用程序对象
const app = new Koa();
app.use(parser());
app.use(catchError);
app.use(bodyParser());
InitManager.initCore(app);
app.use(static(path.join(__dirname, "./static")));

app.listen(3001);
