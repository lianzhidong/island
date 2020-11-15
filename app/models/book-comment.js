/*
 * @Description:短评
 * @Version: 2.0
 * @Autor: Lianzhidong
 * @Date: 2020-11-02 21:33:49
 * @LastEditors: Lianzhidong
 * @LastEditTime: 2020-11-02 21:59:26
 */
const { Model, Sequelize } = require("sequelize");
const { sequelize } = require("../../core/db");

class Comment extends Model {
  //新增评论
  static async addComment(bookId, content) {
    const comment = await Comment.findOne({
      where: {
        book_id: bookId,
        content,
      },
    });
    //如果评论相等，则评论加1
    if (!comment) {
      return Comment.create({
        book_id: bookId,
        content,
        nums: 1,
      });
    } else {
      return await Comment.increment("nums", {
        by: 1,
      });
    }
  }
  //查询短评
  static async getComments(bookId) {
    const comment = await Comment.findAll({
      where: {
        book_id: bookId,
      },
    });
    return comment;
  }
}

Comment.init(
  {
    content: Sequelize.STRING(12),
    nums: {
      type: Sequelize.INTERGER,
      defaultValue: 0,
    },
    book_id: Sequelize.INTERGER,
  },
  {
    sequelize,
    tableName: "comment",
  }
);

module.exports = {
  Comment,
};
