const moment = require('moment')

module.exports = (sequelize, dataTypes) => {
  const TokenAddress = sequelize.define(
    'token_address',
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
      bsc_address: {
        type: dataTypes.INTEGER(42),
        allowNull: true
      },
      eth_address: {
        type: dataTypes.INTEGER(42),
        allowNull: true
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

  TokenAddress.associate = models => {
    TokenAddress.belongsTo(models.token_list, {
      foreignKey: 'tokenId',
      targetKey: 'id',
      constraints: false
    });
  }

  return TokenAddress
}