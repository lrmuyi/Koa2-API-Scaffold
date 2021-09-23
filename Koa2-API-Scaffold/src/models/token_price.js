const moment = require('moment')
// token_price 表
module.exports = (sequelize, dataTypes) => {
    const TokenPrice = sequelize.define(
        'token_price',
        {
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
            // text
            price_1_h: { type: dataTypes.TEXT(), allowNull: false },
            price_15_m: { type: dataTypes.TEXT(), allowNull: false },
            price_30_m: { type: dataTypes.TEXT(), allowNull: false },
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

    TokenPrice.associate = models => {
        TokenPrice.belongsTo(models.token_list, {
            foreignKey: 'tokenId',
            targetKey: 'id',
            constraints: false
        });
    }

    return TokenPrice
}
