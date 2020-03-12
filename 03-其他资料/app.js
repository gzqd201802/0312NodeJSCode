// 导入模块
const express = require('express')
// 导入 body-parser
const bodyParser = require('body-parser')
// 导入path模块处理路径
const path = require('path')
// 导入 操纵数据的模块
const db = require(path.join(__dirname, './utils/db.js'))
// 导入 接收文件的模块
var multer = require('multer')
// 创建一个接收文件的对象
var upload = multer({ dest: 'uploads/' })
// 导入cors中间件
const cors = require('cors')

// 实例化路由对象
const app = express()

// 托管静态资源 让外部可以访问
app.use(express.static('public'))

// 使用cors中间件
app.use(cors())

// 使用body-parser 解析post的数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// 注册路由
app.post('/login', (request, response) => {
  // 接收username和password
  const { username, password } = request.body
  // 判断是否正确
  if (username == 'admin' && password == '123456') {
    // 正确 200
    response.send({
      msg: '登录成功',
      code: 200
    })
  } else {
    // 错误400
    response.send({
      msg: '用户名或密码错误',
      code: 400
    })
  }
})

// 获取列表 无参数  get
app.get('/list', (request, response) => {
  // 读取数据并返回即可
  const data = db.getHeros()
  // 准备返回的结构
  response.send({
    msg: '获取成功',
    code: 200,
    data
  })
})

// 新增英雄 有参数 有文件 post
app.post('/add', upload.single('icon'), (req, res) => {
  // req.file is the `avatar` file
  // console.log(req.file)
  // req.body will hold the text fields, if there were any
  // console.log(req.body)
  // res.send('/add')

  //  获取数据
  const icon = req.file.path
  const { name, skill } = req.body
  // 保存
  if (db.addHero({ icon, name, skill })) {
    // 成功
    res.send({
      msg: '新增成功',
      code: 200
    })
  } else {
    // 失败
    res.send({
      msg: '参数错误',
      code: 400
    })
  }
})
// 删除英雄 有参数 get
app.get('/delete', (req, res) => {
  // 接收数据
  const id = req.query.id
  // 调用删除的方法
  if (db.deleteHeroById(id)) {
    // 成功
    res.send({
      msg: '删除成功',
      code: 200
    })
  } else {
    // 失败
    res.send({
      msg: '参数错误',
      code: 400
    })
  }
})

// 查询英雄有参数 get
app.get('/search', (req, res) => {
  // 接收参数
  const id = req.query.id
  // 获取对应的英雄
  const data = db.getHeroById(id)
  if (data) {
    // 有值
    res.send({
      code: 200,
      msg: '查询成功',
      data
    })
  } else {
    // 没值
    res.send({
      code: 400,
      msg: '参数错误'
    })
  }
})

// 编辑英雄 有参数 有文件 post
app.post('/edit', upload.single('icon'), (req, res) => {
  //  获取数据
  const icon = req.file.path
  const { name, skill, id } = req.body
  // 保存
  if (db.editHero({ id, icon, name, skill })) {
    // 成功
    res.send({
      msg: '修改成功',
      code: 200
    })
  } else {
    // 失败
    res.send({
      msg: '参数错误',
      code: 400
    })
  }
})

// 开启监听
app.listen(4399, () => console.log('success'))
