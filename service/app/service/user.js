const Service = require('egg').Service;
const uuid = require('uuid');
const crypto = require('crypto');

class UserService extends Service{
    async register(user) {
        const { ctx, app } = this;
    user.userId = uuid.v4().replace(/-/g, '');
    // console.log(user.userId)
    const queryResult = await this.hasRegister(user.email);
    console.log(queryResult);
    if (queryResult) {
      ctx.status = 200;
      ctx.body = {
        msg: '邮箱已被使用',
        flag: false
      }
      return
    }

    // 加密保存用户密码
    user.password = crypto.createHmac('sha256', app.config.password_secret)
      .update(user.password)
      .digest('hex');

    const userInfo = await this.ctx.model.User.create(user);
    ctx.status = 200;
    ctx.body = {
      msg: '注册成功',
      userId: user.userId,
      flag: true
    }
    return userInfo.dataValues;
    }

    async hasRegister(email) {
        const user = await this.ctx.model.User.findOne({
            where: { email: email }
          });
          if (user && user.dataValues.userId) {
            return true;
          }
          return false;
    }

    async login (user) {
        const { app } = this;
        const existUser = await this.getUserByMail(user.email);
        if (!existUser) {
          return null;
        }
    }    
}

module.exports = UserService;