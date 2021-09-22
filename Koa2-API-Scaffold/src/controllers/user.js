const Joi = require('joi')
const axios = require('axios')
const { GITHUB } = require('../config')
// const { decodeQuery } = require('../utils')
// const { comparePassword, encrypt } = require('../utils/bcrypt')
// const { createToken } = require('../utils/token')
const { user: UserModel, comment: CommentModel, reply: ReplyModel, ip: IpModel, sequelize } = require('../models')

/**
 * 读取 github 用户信息
 * @param {String} username - github 登录名
 */
async function getGithubInfo(username) {
    const result = await axios.get(`${GITHUB.fetch_user}${username}`)
    return result && result.data
}

class UserController {
    // ===== utils methods
    // 查找用户
    static find(params) {
        return UserModel.findOne({ where: params })
    }

    // 创建用户
    static createGithubUser(data, role = 2) {
        const { id, login, email } = data
        return UserModel.create({
            id,
            username: login,
            role,
            email,
            github: JSON.stringify(data)
        })
    }

    // 更新用户信息
    static updateUserById(userId, data) {
        return UserModel.update(data, { where: { id: userId } })
    }
    // ===== utils methods

    // 登录
    static async login(ctx) {
        const { code } = ctx.request.body
        if (code) {
            await UserController.githubLogin(ctx, code)
        } else {
            await UserController.defaultLogin(ctx)
        }
    }



    // 注册
    static async register(ctx) {
        const validator = ctx.validate(ctx.request.body, {
            username: Joi.string().required(),
            password: Joi.string().required(),
            email: Joi.string()
                .email()
                .required()
        })

        if (validator) {
            const { username, password, email } = ctx.request.body
            const result = await UserModel.findOne({ where: { email } })
            if (result) {
                // ctx.client(403, '邮箱已被注册')
                ctx.throw(403, '邮箱已被注册')
            } else {
                const user = await UserModel.findOne({ where: { username } })
                if (user && !user.github) {
                    ctx.throw(403, '用户名已被占用')
                } else {
                    const saltPassword = await encrypt(password)
                    await UserModel.create({ username, password: saltPassword, email })
                    // ctx.client(200, '注册成功')
                    ctx.status = 204
                }
            }
        }
    }

    /**
     * 获取用户列表
     */
    static async getList(ctx) {
        const validator = ctx.validate(ctx.query, {
            username: Joi.string().allow(''),
            type: Joi.number(), // 检索类型 type = 1 github 用户 type = 2 站内用户 不传则检索所有
            'rangeDate[]': Joi.array(),
            page: Joi.string(),
            pageSize: Joi.number()
        })

        if (validator) {
            const { page = 1, pageSize = 10, username, type } = ctx.query
            const rangeDate = ctx.query['rangeDate[]']
            const where = {
                role: { $not: 1 }
            }

            if (username) {
                where.username = {}
                where.username['$like'] = `%${username}%`
            }

            if (type) {
                where.github = parseInt(type) === 1 ? { $not: null } : null
            }

            if (Array.isArray(rangeDate) && rangeDate.length === 2) {
                where.createdAt = { $between: rangeDate }
            }

            const result = await UserModel.findAndCountAll({
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
            userId: Joi.number().required()
        })

        if (validator) {
            await sequelize.query(
                `delete comment, reply from comment left join reply on comment.id=reply.commentId where comment.userId=${ctx.params.userId}`
            )
            await UserModel.destroy({ where: { id: ctx.params.userId } })
            // ctx.client(200)
            ctx.status = 204
        }
    }

    /**
     * 更新用户
     */
    static async updateUser(ctx) {
        const validator = ctx.validate(
            {
                ...ctx.params,
                ...ctx.request.body
            },
            {
                userId: Joi.number().required(),
                notice: Joi.boolean(),
                disabledDiscuss: Joi.boolean()
            }
        )

        if (validator) {
            const { userId } = ctx.params
            const { notice, disabledDiscuss } = ctx.request.body
            await UserController.updateUserById(userId, { notice, disabledDiscuss })
            if (typeof disabledDiscuss !== 'undefined') {
                await IpModel.update({ auth: !disabledDiscuss }, { where: { userId: parseInt(userId) } })
            }
            ctx.status = 204
        }
    }

    /**
     * 初始化用户
     * @param {String} githubLoginName - github name
     */
    static async initGithubUser(githubLoginName) {
        try {
            const github = await getGithubInfo(githubLoginName)
            const temp = await UserController.find({ id: github.id })
            if (!temp) {
                UserController.createGithubUser(githubLoginName, 1)
            }
        } catch (error) {
            console.trace('create github user error ==============>', error.message)
        }
    }
}

module.exports = UserController