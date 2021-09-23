import KoaRouter from 'koa-router'
import controllers from '../controllers'

const router = new KoaRouter()

export default router
  // .get('/public/get', function (ctx, next) {
  //   ctx.body = '禁止访问！'
  // }) // 以/public开头则不经过权限认证
  // .all('/upload', controllers.upload)
  // .get('/public/api/:name', controllers.api.Get)
  // .post('/api/:name', controllers.api.Post)
  // .put('/api/:name', controllers.api.Put)
  // .del('/api/:name', controllers.api.Delete)
  // .post('/auth/:action', controllers.auth.Post)
  // 币种
  .get('/api/token/list', controllers.token.getTokenList) // 获取列表
  .post('/api/token', controllers.token.createToken) // 录入币种
  .put('/api/token/:symbol', controllers.token.updateToken) // 录入币种
  // test
  .get('/api/user-info/list', controllers.user.getList) // 获取列表
  .put('/api/user-info/:userId', controllers.user.updateUser) // 更新用户信息
  .delete('/api/user-info/:userId', controllers.user.delete) // 删除用户


module.exports = router