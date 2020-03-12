
// 按需导入
const express = require('express');

// 创建 express 服务器
const app = express();


// 中间件语法：
//   中间件主要功能：可以对请求和响应做统一处理。
app.use((request, response, next) => {
    // 给所有的响应报文都添加一个作者信息
    response.setHeader('Author', 'Su');
    // 易错点：
    //   不要在 app.use() 中写 response.send()，否则其他接口的 response.send() 都凉凉了。
    // 每个 app.use() 中都要写上 next()，代表继续运行下一个中间件
    next();
});

app.use((request, response, next) => {
    console.log(222);
    // 给所有的响应报文都添加 Access-Control-Allow-Origin 配置，所有的请求都可以实现 cors 跨源资源共享
    response.setHeader('Access-Control-Allow-Origin', '*');
    // 代表继续运行下一个中间件
    next();
});


app.get('/a', (request, response) => {
    response.send('a接口响应');
});


app.get('/b', (request, response) => {
    response.send('b接口响应');
});

// 监听端口
app.listen(4399, () => {
    console.log('服务器启动成功提示');
});