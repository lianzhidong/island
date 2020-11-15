/*
 * @Description:点赞业务模型
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-21 20:27:22
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-02 21:10:01
 */
const { Model, Sequelize, Op } = require("sequelize");
const { sequelize } = require("../../core/db");
const { Art } = require("../models/art");

class Favor extends Model {
  static async like(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: { art_id, type, uid },
    });
    if (favor) {
      throw new global.errs.LikeError();
    }
    //数据库的事务
    return sequelize.transaction(async (t) => {
      await Favor.create(
        { art_id, type, uid },
        {
          transaction: t,
        }
      );
      const art = await Art.getData(art_id, type);
      art.increment("fav_nums", { by: 1, transaction: t });
    });
  }
  static async dislike(art_id, type, uid) {
    const favor = await Favor.findOne({
      where: { art_id, type, uid },
    });
    if (favor) {
      throw new global.errs.DislikeError();
    }
    //数据库的事务
    return sequelize.transaction(async (t) => {
      await Favor.destroy({ force: false, transaction: t });
      const art = await Art.getData(art_id, type);
      art.decrement("fav_nums", { by: 1, transaction: t });
    });
  }

  //用户是否点赞
  static async userLikeIt(artId, type, uid) {
    const favor = await Favor.findOne({
      where: {
        uid,
        artId,
        type,
      },
    });
    return favor ? true : false;
  }

  //用户所有点赞信息
  static async getMyClassicFavors(uid) {
    const arts = Favor.findAll({
      where: {
        uid,
        //type不等于400，即不包括书籍
        type: {
          [Op.not]: 400,
        },
      },
    });
    if (!arts) {
      throw new global.errs.NotFound();
    }
    //此时只拿到art_id，并没有art的详细信息
    return await Art.getList(arts);
  }

  //获取书籍点赞情况
  static async getBookFavor(uid, bookID) {
    const favorNum = await Favor.count({
      where: {
        art_id: bookID,
        type: 400,
      },
    });
    const myFavor = await Favor.findOne({
      where: {
        art_id: bookID,
        uid,
        type: 400,
      },
    });
    return {
      fav_nums: favorNum,
      like_status: myFavor ? 1 : 0,
    };
  }
}

Favor.init(
  {
    uid: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
  },
  {
    sequelize,
    tableName: "favor",
  }
);

module.exports = {
  Favor,
};
