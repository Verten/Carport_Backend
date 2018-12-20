'use strict'
var router = require('express').Router()
var axios = require('axios')
var Crypt = require('../../utilities/crypt')

// wechat code2Session
// https://api.weixin.qq.com/sns/jscode2session?appid=wx8ccb848564dad4f3&secret=d428ae2607d1c9126c2b8858d8827633&js_code=JSCODE&grant_type=authorization_code

router.get('/userinfo', function(req, res, next) {
  const { code = '', data = '', iv = '' } = req.query
  const appId = 'wx8ccb848564dad4f3'
  const secret = 'd428ae2607d1c9126c2b8858d8827633'
  let decryptedData = ''
  axios
    .get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`,
    )
    .then(response => {
      console.info(response.data)
      const { openid, session_key: sessionKey, unionid } = response.data
      var pc = new Crypt(appId, sessionKey)
      decryptedData = pc.decryptData(data, iv)
    })
    .catch(error => {
      console.log(error)
    })

  res.send({
    code,
    data,
    iv,
    decryptedData,
  })
})

module.exports = router
