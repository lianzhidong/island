/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-18 15:49:10
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-19 20:25:18
 */
const { User } = require("../models/user");
const { generateToken } = require("../../core/util");
const { Auth } = require("../../middlewares/auth");
const Util = require("util");
const axios = require("axios");
class WXManager {
  static async codeToToken(code) {
    const url = Util.format(
      global.config.wx.loginUrl,
      global.config.wx.appId,
      global.config.wx.appSecret,
      code
    );
    const result = await axios.get(url);
    if (result.status !== 200) {
      throw new global.errs.AuthFailed("openId获取失败");
    }
    if (result.data.errcode) {
      throw new global.errs.AuthFailed("openid获取失败" + result.data.errmsg);
    }
    let user = await User.getUserByOpenid(result.data.openid);
    if (!user) {
      user = await User.registerByOpenid(result.data.openid);
    }
    return generateToken(user.id, Auth.USER);
  }
}

module.exports = {
  WXManager,
};
