// 按需导入 crawler 包
const Crawler = require("crawler");
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hm43'
});

connection.connect();


// 创建一个爬虫实例
const c = new Crawler({
    // 最大连接数
    maxConnections: 10,
    // 这将调用每一个抓取的页面
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            // 可以像 jQuery 一样访问到 DOM 节点
            const $ = res.$;
            // 获取文件全名
            const [num] = path.basename(res.request.href).split('.');


            const name = $('.cover-name').text();
            const icon = `http://game.gtimg.cn/images/yxzj/img201606/heroimg/${num}/${num}.jpg`;
            const skill = $('.skill-name b').eq(0).text();

            const sqlStr = `insert into pvphero(name,icon,skill) values ('${name}','${icon}','${skill}')`;
            connection.query(sqlStr, function (error, results) {
                if (error) {
                    console.log('写入数据库失败');
                } else {
                    console.log('写入数据库成功');
                }
            });

        }
        done();
    }
});

// 爬取页面队列
try {
    const filePath = path.join(__dirname, './data/detailPage.json');
    const pages = JSON.parse(fs.readFileSync(filePath));
    c.queue(pages);
} catch (error) {
    console.log('出错');
}