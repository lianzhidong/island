/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-20 21:47:05
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-05 19:37:57
 */

const { Movie, Music, Sentence } = require("./classic");
const { Op } = require("sequelize");
const { flatten } = require("lodash");

class Art {
  constructor(art_id, type) {
    this.art_id = art_id;
    this.type = type;
  }

  async getDetail(uid) {
    const art = await Art.getData(this.art_id, this.type);
    if (!art) {
      throw new global.errs.NotFound();
    }
    const { Favor } = require("./favor");
    const like = await Favor.userLikeIt(this.art_id, this.type, uid);
    return {
      art,
      like_status: like,
    };
  }
  //一次性查询多个
  static async getList(artInfoList) {
    const artInfoObj = {
      100: [],
      200: [],
      300: [],
    };
    for (let artInfo of artInfoList) {
      artInfoObj[artInfo.type].push(artInfo.art_id);
    }
    const arts = [];
    for (let key in artInfoObj) {
      const ids = artInfoObj[key];
      if (ids.length === 0) {
        continue;
      }
      arts.push(await Art._getListByType(ids, parseInt(key)));
    }
    return flatten(arts);
  }

  static async _getListByType(ids, type) {
    const finder = {
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    };
    let arts = null;
    const scope = "bh";
    switch (type) {
      case 100:
        //Movie
        arts = await Movie.scope(scope).findAll(finder);
        break;
      case 200:
        //Music
        arts = await Music.scope(scope).findAll(finder);
        break;
      case 300:
        //Sentence
        arts = await Sente.scope(scope).findAll(finder);
        break;
      case 400:
        break;
      default:
        break;
    }
    return arts;
  }

  static async getData(art_id, type) {
    const finder = {
      where: {
        id: art_id,
      },
    };
    let art = null;
    switch (type) {
      case 100:
        //Movie
        art = await Movie.findOne(finder);
        break;
      case 200:
        //Music
        art = await Music.findOne(finder);
        break;
      case 300:
        //Sentence
        art = await Sentence.findOne(finder);
        break;
      case 400:
        const { Book } = require("./book");
        art = await Book.scope(scope).findOne(finder);
        if (!art) {
          art = await Book.create({
            id: art_id,
          });
        }
        break;
      default:
        break;
    }
    // if (art && art.image) {
    //   let imgUrl = art.dataValues.image;
    //   art.dataValues.image = global.config.host + imgUrl;
    // }
    return art;
  }
}

module.exports = {
  Art,
};
