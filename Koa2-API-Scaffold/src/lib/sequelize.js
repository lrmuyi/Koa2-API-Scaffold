import Sequelize from 'sequelize'

import { DB as DBConfig, System as SystemConfig } from '../config'

const Op = Sequelize.Op
export const DataTypes = Sequelize.DataTypes
export const sequelize = new Sequelize(DBConfig.database, DBConfig.username, DBConfig.password, {
  host: DBConfig.host,
  dialect: SystemConfig.db_type,
  dialectOptions: { // MySQL > 5.5，其它数据库删除此项
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_520_ci',
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  pool: {
    max: 50,
    min: 0,
    idle: 10000
  },
  logging: null,
  timezone: "+00:00",
  seederStorage: "sequelize",
  // 在 sequelize V4 版本以后新加了符号运算符来代替 Op.xxx
  // https://sequelize.org/master/manual/querying.html#operators
  operatorsAliases: {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
  }
}
)
