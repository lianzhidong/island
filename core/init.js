/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-09-27 22:27:28
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-09 22:09:35
 */
const requireDirectory = require("require-directory");
const Router = require("koa-router");

class InitManager {
  //入口方法
  static initCore(app) {
    InitManager.app = app;
    InitManager.initLoadRouters();
    InitManager.loadHttpException();
    InitManager.loadConfig();
  }
  static initLoadRouters() {
    const apiDirectory = `${process.cwd()}/app/api`;
    //自动导入
    requireDirectory(module, apiDirectory, { visit: whenLoadModule });
    function whenLoadModule(obj) {
      if (obj instanceof Router) {
        InitManager.app.use(obj.routes());
      }
    }
  }

  //加载异常处理
  static loadHttpException() {
    const errors = require("./http-exception");
    global.errs = errors;
  }

  //加载配置文件
  static loadConfig(path = "") {
    const configPath = path || process.cwd() + "/config/config.js";
    const config = require(configPath);
    global.config = config;
  }
}

module.exports = InitManager;
