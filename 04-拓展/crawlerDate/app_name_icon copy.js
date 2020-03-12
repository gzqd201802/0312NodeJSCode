// 按需导入 crawler 包
const Crawler = require("crawler");
const mysql = require('mysql');

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
            // $ is Cheerio by default
            // console.log($("title").text());
            console.log($('.herolist-content img').length);

            let i = 1;
            $('.herolist-content img').each((index, item) => {
                const name = $(item).attr('alt');
                const icon = 'http:' + $(item).attr('src');

                const heroObj = {
                    name,
                    icon,
                };
                // console.log(heroObj, i++);
                const sqlStr = `insert into pvp(name,icon) values ('${name}','${icon}')`;
                connection.query(sqlStr, function (error, results) {
                    if (error) {
                        console.log('写入数据库失败');
                    } else {
                        console.log('写入数据库成功', heroObj);
                    }
                });
            });
        }
        done();
    }
});

// 爬取页面队列
c.queue('https://pvp.qq.com/web201605/herolist.shtml');