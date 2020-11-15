/*
 * @Description:数据库连接
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-10 21:54:49
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-05 19:47:46
 */
const { Sequelize, Model } = require("sequelize");
const { unset, clone, isArray } = require("lodash");
const {
  dbName,
  host,
  port,
  user,
  password,
} = require("../config/config").database;

const sequelize = new Sequelize(dbName, user, password, {
  dialect: "mysql",
  host,
  port,
  logging: true,
  timezone: "+08:00",
  definde: {
    timestamps: true,
    paranoid: true,
  },
});

sequelize.sync({ force: false });

Model.prototype.toJSON = function () {
  let data = clone(this.dataValues);
  if (isArray(this.exclude)) {
    this.exclude.forEach((val) => {
      unset(data, val);
    });
  }
  //图片格式转化
  for (key in data) {
    if (key === "image") {
      data[key] = global.config.host + data[key];
    }
  }
  unset(data, "updated_at");
  unset(data, "created_at");
  unset(data, "deleted_at");
  return data;
};

module.exports = {
  sequelize,
};
