/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-15 21:23:36
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-26 21:17:50
 */

function isThisType(val) {
  for (let key in this) {
    if (this[key] == val) {
      return true;
    }
  }
  return false;
}

const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 200,
  isThisType,
};

const ArtType = {
  MOVIE: 100,
  MUSIC: 200,
  SENTENCE: 300,
  BOOK: 400,
  isThisType,
};

module.exports = {
  LoginType,
  ArtType,
};
