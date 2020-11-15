/*
 * @Description:
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-20 20:32:43
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-10-21 21:45:07
 */
const { Model, Sequelize } = require("sequelize");
const { sequelize } = require("../../core/db");

class Flow extends Model {}
Flow.init(
  {
    index: Sequelize.INTEGER,
    //外键
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
    // type:100->Movie
    // type:200->Music
    // type:300->Sentence
  },
  { sequelize, tableName: "flow" }
);

module.exports = {
  Flow,
};
