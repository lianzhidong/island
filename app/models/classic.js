/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-20 19:59:09
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-05 19:50:50
 */
const { Model, Sequelize } = require("sequelize");
const { sequelize } = require("../../core/db");

const classicFields = {
  image: {
    type: Sequelize.STRING,
    //   get(){
    //     return global.config.host + this.getDataValue('image')
    //   }
  },
  content: Sequelize.STRING,
  pubdate: Sequelize.STRING,
  fav_nums: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  title: Sequelize.STRING,
  type: Sequelize.TINYINT,
};

class Movie extends Model {}
Movie.init(classicFields, { sequelize, tableName: "movie" });

class Sentence extends Model {}
Sentence.init(classicFields, { sequelize, tableName: "sentence" });

class Music extends Model {}
Music.init(
  Object.assign(
    {
      url: Sequelize.STRING,
    },
    classicFields
  ),
  { sequelize, tableName: "music" }
);

module.exports = {
  Movie,
  Music,
  Sentence,
};
