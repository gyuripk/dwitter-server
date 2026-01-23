import SQ from "sequelize";
import { sequelize } from "../db/database.js";
import { User } from "./auth.js";
// Model(data)
// data 읽고 쓰는 로직은 여기에

// DB에서 데이터 읽고 쓸 때는 시간 오래 걸림
// 데이터관련 일 수행하는 동안 서버가 다른 것도 실행할 수 있게
// 비동기적으로 처리해주는 것이 좋음 async
// async 키워드 붙으면 다른 걸 리턴 하게 코드 작성해도 무조건 promise을 반환함 (JS 문법)

// define tweet Model
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;
const Tweet = sequelize.define("tweet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  text: { type: DataTypes.TEXT, allowNull: false },
});
Tweet.belongsTo(User); // relation : 자동으로 foreinkey 만들어짐

const INCLUDE_USER = {
  attributes: [
    "id",
    "text",
    "createdAt",
    "userId",
    [Sequelize.col("user.username"), "username"], // 중첩데이터 -> flat하게 가져오기
    [Sequelize.col("user.name"), "name"],
    [Sequelize.col("user.url"), "url"],
  ],
  include: { model: User, attributes: [] },
};
const ORDER_DESC = {
  order: [["createdAt", "DESC"]],
};

export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}

export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: { ...INCLUDE_USER.include, where: { username } },
  });
}

export async function getById(id) {
  return Tweet.findOne({ where: { id }, ...INCLUDE_USER });
}

export async function create(text, userId) {
  return Tweet.create({ text, userId }) //
    .then((data) => this.getById(data.dataValues.id));
}

export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
    tweet.text = text;
    return tweet.save(); // save()는 저장한 자기자신을 Promise로 반환함
  });
}

export async function remove(id) {
  return Tweet.findByPk(id).then((tweet) => {
    tweet.destroy();
  });
}
