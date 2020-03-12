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
            // $ is Cheerio by default
            // 图片
            // $('.herolist-content img')

            // 详情页链接
            // $('.herolist-content a')
            const arr = [];
            $('.herolist-content a').each((index, item) => {
                const href = 'https://pvp.qq.com/web201605/' + $(item).attr('href');
                arr.push(href);
            });

            console.log(arr);
            
            const filePath = path.join(__dirname, './data/detailPage.json');
            fs.writeFile(filePath, JSON.stringify(arr), (err) => {
                if(err){
                    console.log('写入失败');
                }else{
                    console.log('写入成功');
                }
            });



            // $('.herolist-content img').each((index, item) => {
            //     const name = $(item).attr('alt');
            //     const icon = 'http:' + $(item).attr('src');
            //     const sqlStr = `insert into pvp(name,icon) values ('${name}','${icon}')`;
            //     connection.query(sqlStr, function (error, results) {
            //         if (error) {
            //             console.log('写入数据库失败');
            //         } else {
            //             console.log('写入数据库成功');
            //         }
            //     });
            // });
        }
        done();
    }
});

// 爬取页面队列
c.queue('https://pvp.qq.com/web201605/herolist.shtml');