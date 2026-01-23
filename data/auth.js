import SQ from "sequelize";
import { sequelize } from "../db/database.js";
// define Users Model
const DataTypes = SQ.DataTypes;

// Domain Model (Schema)
export const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: { type: DataTypes.STRING(45), allowNull: false },
    password: { type: DataTypes.STRING(128), allowNull: false },
    name: { type: DataTypes.STRING(128), allowNull: false },
    email: { type: DataTypes.STRING(128), allowNull: false },
    url: DataTypes.TEXT,
  },
  { timestamps: false },
);

export async function findByUsername(username) {
  // return User.findOne({ where: { username: username } });
  return User.findOne({ where: { username } }); // key: value 같으면 : value 생략가능
}

export async function findById(id) {
  return User.findByPk(id);
}

export async function createUser(user) {
  return User.create(user).then((data) => data.dataValues.id);
}
