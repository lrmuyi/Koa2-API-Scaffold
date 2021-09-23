const Joi = require('joi')
const axios = require('axios')
const { GITHUB } = require('../config')
// const { decodeQuery } = require('../utils')
// const { comparePassword, encrypt } = require('../utils/bcrypt')
// const { createToken } = require('../utils/token')
const { token_list: TokenListModel, token_address: TokenAddressModel, token_price: TokenPriceModel, sequelize } = require('../models')

/**
 * 读取 github 币种信息
 * @param {String} symbol - github 登录名
 */
async function getGithubInfo(symbol) {
    const result = await axios.get(`${GITHUB.fetch_user}${symbol}`)
    return result && result.data
}

class TokenController {
    // ===== utils methods
    // 查找币种
    static find(params) {
        return TokenListModel.findOne({ where: params })
    }

    // 录入币种
    static async createToken(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            symbol: Joi.string().required(),
            decimal: Joi.number().required(),
        })

        if (validator) {
            const { symbol, decimal } = ctx.request.body
            const result = await TokenListModel.findOne({ where: { symbol } })
            if (result) {
                // ctx.client(403, '币种已录入')
                ctx.throw(403, '币种已录入')
            } else {
                await TokenListModel.create({
                    symbol: symbol,
                    decimal: decimal,
                })
                // ctx.client(200, '录入成功')
                ctx.status = 204
            }
        }
    }

    // 更新币种信息
    static updateUserById(userId, data) {
        return TokenListModel.update(data, { where: { id: userId } })
    }
    // ===== utils methods

    /**
     * 获取币种列表
     */
    static async getTokenList(ctx) {
        const validator = ctx.validate(ctx.query, {
            symbol: Joi.string().allow(''),
            page: Joi.string(),
            pageSize: Joi.number()
        })

        if (validator) {
            const { page = 1, pageSize = 10, symbol } = ctx.query
            const where = {
                symbol: { $not: null }
            }

            if (symbol) {
                where.symbol['$like'] = `%${symbol}%`
            }

            const result = await TokenListModel.findAndCountAll({
                where,
                offset: (page - 1) * pageSize,
                limit: parseInt(pageSize),
                row: true,
                order: [['createdAt', 'DESC']]
            })

            // ctx.client(200, 'success', result)
            ctx.body = result
        }
    }

    static async delete(ctx) {
        const validator = ctx.validate(ctx.params, {
            symbol: Joi.string().required()
        })

        if (validator) {
            await sequelize.query(
                `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.id=${ctx.params.tokenId}`
            )
            await TokenListModel.destroy({ where: { symbol: ctx.params.symbol } })
            // ctx.client(200)
            ctx.status = 204
        }
    }

    /**
     * 更新币种
     */
    static async updateToken(ctx) {
        const validator = ctx.validate(
            {
                ...ctx.params,
                ...ctx.request.body
            },
            {
                symbol: Joi.string().required()
            }
        )
        if (validator) {
            const { symbol } = ctx.params
            const { decimal } = ctx.request.body
            // await TokenController.updateUserById(id, { notice, disabledDiscuss })
            if (typeof decimal !== 'undefined') {
                await TokenController.update({ ...ctx.request.body }, { where: { symbol } })
            }
            ctx.status = 204
        }
    }

    /**
     * 初始化币种
     * @param {String} githubLoginName - github name
     */
    static async initGithubUser(githubLoginName) {
        try {
            const github = await getGithubInfo(githubLoginName)
            const temp = await TokenController.find({ id: github.id })
            if (!temp) {
                TokenController.createGithubUser(githubLoginName, 1)
            }
        } catch (error) {
            console.trace('create github user error ==============>', error.message)
        }
    }
}

module.exports = TokenController