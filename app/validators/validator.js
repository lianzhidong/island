/*
 * @Description:校验器
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-09 20:56:47
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-02 21:46:54
 */

const { LinValidator, Rule } = require("../../core/lin-validator");
const { User } = require("../models/user");
const { LoginType, ArtType } = require("../lib/enum");

//正整数
class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule("isInt", "需要正整数", { min: 1 })];
  }
}

class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [new Rule("isEmail", "不符合邮件格式")];
    this.password1 = [
      new Rule("isLength", "密码至少6个字符，最多32个字符", {
        min: 6,
        max: 32,
      }),
      new Rule(
        "matches",
        "密码不符合规范",
        "^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,.#%'+*-:;^_`]+$)[,.#%'+*-:;^_`0-9A-Za-z]{6,20}$"
      ),
    ];
    this.password2 = this.password1;
    this.nickname = [
      new Rule("isLength", "昵称不符合长度规范", {
        min: 4,
        max: 32,
      }),
    ];
  }
  validatePassword(vals) {
    const psw1 = vals.body.password1;
    const psw2 = vals.body.password2;
    if (psw1 !== psw2) {
      throw new Error("前后两次密码不相同");
    }
  }
  //email唯一
  async validateEmail(vals) {
    const email = vals.body.email;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new Error("email已存在");
    }
  }
}

//令牌校验器
class TokenValidator extends LinValidator {
  constructor() {
    super();
    this.account = [
      new Rule("isLength", "不符合账户规则", {
        min: 4,
        max: 32,
      }),
    ];
    //1.为空 2非空+校验
    this.secret = [
      new Rule("isOptional"),
      new Rule("isLength", "至少需要6个字符", {
        min: 6,
        max: 128,
      }),
    ];
  }
  //用户登录方式
  validateLoginType(vals) {
    if (!vals.body.type) {
      throw new Error("type是必须参数");
    }
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error("type参数不合法");
    }
  }
}

//非空校验器
class NotEmptyValidator extends LinValidator {
  constructor() {
    super();
    this.token = [new Rule("isLength"), "不允许为空", { min: 1 }];
  }
}

//检查登录type
function checkLoginType(vals) {
  const type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必须参数");
  }
  type = parseInt(type);
  if (!LoginType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}

//检查art的type
function checkArtType(vals) {
  const type = vals.body.type || vals.path.type;
  if (!type) {
    throw new Error("type是必须参数");
  }
  type = parseInt(type);
  if (!ArtType.isThisType(type)) {
    throw new Error("type参数不合法");
  }
}

//点赞校验
class LikeValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.validateType = checkArtType;
  }
}

class ClassicValidator extends LinValidator {}

//搜索书籍接口校验
class SearchValidator extends LinValidator {
  constructor() {
    super();
    this.q = [new Rule("isLength", "搜索关键词不能为空", { min: 1, max: 16 })];
    this.start = [
      new Rule("isInt", "start不符合规范", { min: 0, max: 60000 }),
      new Rule("isOptional", "", 0),
    ];
    this.count = [
      new Rule("isInt", "count不符合规范", {
        min: 1,
        max: 20,
      }),
      new Rule("isOptional", "", 20),
    ];
  }
}

//短评
class AddShortCommentValidator extends PositiveIntegerValidator {
  constructor() {
    super();
    this.content = [
      new Rule("isLength", "必须在1-12个字符之间", { min: 1, max: 24 }),
    ];
  }
}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator,
  SearchValidator,
  AddShortCommentValidator,
};
