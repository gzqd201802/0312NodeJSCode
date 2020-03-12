// app.js 新建在项目的根目录下，和 package.json 同级
// app.js 一般称为 NodeJS 项目的入口文件。

// 按需导入 mysql 包
const mysql = require('mysql');
// 按需导入 express 包
const express = require('express');
// 按需导入 multer 包，用于处理 formdata 格式参数
const multer = require('multer');
// 按需导入 path 模块，用于处理绝对路径
const path = require('path');
// CV 大法过来的，是 multer 的配置，把相对路径改成绝对路径
const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// 创建个 express 服务器
const app = express();

// 创建 mysql 数据库连接
const connection = mysql.createConnection({
    // 本地数据库地址 (本地服务器固定写法)
    host: 'localhost',
    // 数据库用户名 - 默认用户名是 root
    user: 'root',
    // 数据库密码 - 默认密码是 root
    password: 'root',
    // 数据库名称
    database: 'hm43'
});

// 连接数据库
connection.connect();


// 创建后端路由接口
// ------------------ 接口书写开始 ------------------
// 接口1：### 英雄列表
// 请求地址：/list
// 请求方式：get
// 请求参数：无
// 返回数据：
// |  id   | number | 英雄id   |
// | name  | string | 英雄姓名 |
// | skill | string | 英雄技能 |
// | icon  | string | 英雄头像 |
app.get('/list', (request, response) => {
    // 1. 准备 mysql 语句，只返回 id,name,skill,icon 即可，条件是 isDelete=0
    const sqlStr = `select id,name,skill,icon from hero where isDelete=0`;
    // 2. 根据 sql 语句操作数据库
    connection.query(sqlStr, (error, results) => {
        // error    错误对象
        // results  结果
        if (error) {
            response.send({
                msg: '获取失败',
                code: 400
            });
        } else {
            // console.log('结果：results', results);
            // 最终返回的是 isDelete=0 的数据，因为 isDelete=1 是标记删除的，所以不返回
            response.send({
                msg: '获取成功',
                code: 200,
                // results 返回的结果，就是对象的格式，直接作为 data 的值
                data: results
            });
        }
    });
});

// 接口2：### 英雄删除
// 注意事项：这里其实不是真正把数据在数据库删掉了，而是把 isDelete 的标记改成 1 而已。
// 请求地址：/delete
// 请求方式：get
// 请求参数：
// |  id  | number | 英雄id |
app.get('/delete', (request, response) => {
    // 1. request.query 获取 get 请求中的 id 参数的值
    const { id } = request.query;
    // 2. 准备 mysql 语句，根据id查询一条数据
    const sqlStr = `update hero set isDelete=1 where id=${id}`;
    // 3. 根据 sql 语句操作数据库
    connection.query(sqlStr, (error, results) => {
        // error    错误对象
        // results  结果
        if (error) {
            response.send({
                msg: "缺少id参数",
                code: 400
            });
        } else {
            // 如果标记修改成功，就会有一行数据受到影响
            // results.changedRows 为影响行，固定写法，打印到控制台能看到
            if (results.changedRows === 1) {
                response.send({
                    msg: "删除成功",
                    code: 204
                });
            } else {
                response.send({
                    msg: "参数错误",
                    code: 400
                });
            }
        }
    });
});

// 接口3：### 英雄查询-根据id查单个英雄
// 请求地址：/search
// 请求方式：get
// 请求参数：
// |  id  | number | 英雄id |
app.get('/search', (request, response) => {
    // 1. request.query 解构获取 get 请求中的 id 参数的值
    const { id } = request.query;
    // 2. 准备 sql 语句
    const sqlStr = `select id,name,skill,icon from hero where id=${id} and isDelete=0`;
    // 3. 执行数据库操作
    connection.query(sqlStr, (error, results) => {
        // error    错误对象
        // results  结果
        if (error) {
            response.send({
                code: 400,
                msg: '缺少id参数'
            });
        } else {
            console.log(results);
            // 查询的结果是数组格式，把数据结构出第一份数据数据
            // 如果解构成功, 就会有值，走 if 逻辑 
            // 如果解构失败, 就是 undefined，走 else 逻辑
            const [data] = results;
            // data 对象如果存在
            if (data) {
                // 返回数据结构按文档来，查询单条数据的时候返回对象
                response.send({
                    msg: '查询成功',
                    code: 200,
                    data
                });
            } else {
                // undefined 就提示参数错误
                response.send({
                    msg: '参数错误',
                    code: 400,
                });
            }
        }
    });
    // 4. 根据数据库运行结果返回数据
});



// 接口4：### 英雄新增
// 请求地址：/add
// 请求方式：post
// 请求参数：请使用formData的方式提交
// | name  | string | 英雄姓名 |
// | skill | string | 英雄技能 |
// | icon  |  file  | 英雄头像 |
app.post('/add', upload.single('icon'), (request, response) => {
    // request.body 将具有文本域数据，如果存在的话
    const { name, skill } = request.body;
    // request.file 是 `icon` 文件的信息
    // console.log( request.file );
    // 结构出保存后的文件名
    const { filename } = request.file;
    // 把文件名拼接成路径，赋值给 icon
    const icon = `uploads/${filename}`;
    // 准备 sql 新增数据的语句
    // 坑点：sql 语句最终是运行在 mysql 中的，字符串数据写入的时候，值还需要外面多一对 引号。
    const sqlStr = `insert into hero(name,skill,icon) values ('${name}','${skill}','${icon}')`;
    // 操作数据库
    connection.query(sqlStr, (error, results) => {
        // error    错误对象
        // results  结果
        if (error) {
            response.send({
                code: 400,
                msg: '新增错误'
            });
        } else {
            response.send({
                code: 201,
                msg: '新增成功'
            });
        }
    });
});


// 接口5：### 英雄编辑
// 请求地址：/edit
// 请求方式：post
// 请求参数：请使用formData的方式提交
// |  id   | number | 英雄id   |
// | name  | string | 英雄姓名 |
// | skill | string | 英雄技能 |
// | icon  | file | 英雄头像 |
app.post('/edit', upload.single('icon'), (request, response) => {
    // 1. 数据准备
    // request.body 中解构出 id,name,skill 的值.
    const { id, name, skill } = request.body;
    // request.file 结构出 filename 文件名.
    const { filename } = request.file;
    // 把文件名拼接成路径，赋值给 icon
    const icon = `uploads/${filename}`;
    // 2. 准备 sql 更新语句
    // 这里也有坑点，${name} 需要写成 '${name}'
    const sqlStr = `update hero set name='${name}',skill='${skill}',icon='${icon}' where id=${id} and isDelete=0`;
    // 3. 操作数据库
    connection.query(sqlStr, (error, results) => {
        // error    错误对象
        // results  结果
        if (error) {
            response.send({
                code: 400,
                msg: '错误'
            });
        } else {
            // 一般是修改的时候才需要判断影响行
            if (results.changedRows === 1) {
                response.send({
                    code: 200,
                    msg: '修改成功'
                });
            } else {
                response.send({
                    code: 400,
                    msg: '参数错误'
                });
            }
        }
    });
});




// 端口监听
app.listen(3000, () => {
    console.log('服务器启动成功提示');
});

