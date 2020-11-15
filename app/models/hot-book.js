/*
 * @Description:热门书籍
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-10-29 20:23:24
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-04 21:01:51
 */
const { Model, Sequelize, Op } = require("sequelize");
const { Favor } = require("./favor");

class HotBook extends Model {
  static async getAll() {
    const book = await HotBook.findAll({
      order: ["index"],
    });
    const ids = books.map((book) => book.id);
    const favors = await Favor.findAll({
      where: {
        artId: {
          [Op.in]: ids,
          type: 400,
        },
        type: 400,
      },
      group: ["artId"],
      attributes: ["artId", [Sequelize.fn("COUNT", "*"), "count"]],
    });

    books.forEach((book) => {
      HotBook._getEachBookStatus(book, favors);
    });

    return books;
  }

  static _getEachBookStatus(book, favors) {
    let count = 0;
    favors.forEach((favor) => {
      if (book.id === favor.art_id) {
        count = favor.get("count");
      }
    });
    book.setDataVallue("fav_nums", count);
    return book;
  }
}

HotBook.init({
  index: Sequelize.INTEGER,
  image: Sequelize.STRING,
  author: Sequelize.STRING,
  title: Sequelize.STRING,
});

module.exports = {
  HotBook,
};
