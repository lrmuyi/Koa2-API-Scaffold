const moment = require('moment')

module.exports = (sequelize, dataTypes) => {
  const TokenList = sequelize.define(
    'token_list',
    {
      // id sequelize 默认创建...
      id: {
        type: dataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true
      },
      symbol: {
        type: dataTypes.STRING(6),
        allowNull: false
        // unique: true
      },
      decimal: {
        type: dataTypes.INTEGER(2),
        allowNull: false
      },
      createdAt: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      updatedAt: {
        type: dataTypes.DATE,
        defaultValue: dataTypes.NOW,
        get() {
          return moment(this.getDataValue('updatedAt')).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    {
      timestamps: true
    }
  )

  TokenList.associate = models => {
    TokenList.hasMany(models.token_address)
    TokenList.hasMany(models.token_price)
  }

  return TokenList
}