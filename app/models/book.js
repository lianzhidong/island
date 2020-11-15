/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-11-01 11:10:10
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-04 20:51:40
 */
const { Model, Sequelize } = require("sequelize");
const { sequelize } = require("../../core/db");
const util = require("util");
const { default: Axios } = require("axios");
const { Favor } = require("../models/favor");

class Book extends Model {
  // constructor(id) {
  //   super();
  //   this.id = id;
  // }

  //获取书籍详细信息
  async detail(id) {
    const url = util.format(global.config.yushu.detailUrl, id);
    const detail = await Axios.get(url);
    return detail.data;
  }

  //书籍搜索
  static async searchFromYunshu(q, start, count, summary = 1) {
    const url = util.format(
      global.config.yushu.keywordUrl,
      encodeURI(q),
      count,
      start,
      summary
    );
    const result = await Axios.get(url);
    return result.data;
  }
  //喜欢的数量
  static async getMyFavorBookCount(uid) {
    const count = await Favor.count({
      where: {
        type: 400,
        uid,
      },
    });
    return count;
  }
}

Book.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    fav_nums: { type: Sequelize.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    tableName: "book",
  }
);

module.exports = {
  Book,
};
