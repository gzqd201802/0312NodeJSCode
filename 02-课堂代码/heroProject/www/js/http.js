(function(w){
    // 请求基地址
    const baseURL = 'http://127.0.0.1:3000';

    // 把所有请求用一个对象管理
    const urls = {
        list: `${baseURL}/list`,
        add: `${baseURL}/add`,
        delete: `${baseURL}/delete`,
        search: `${baseURL}/search`,
        edit: `${baseURL}/edit`,
    };

    // 把局部的 urls 添加到全局 window 上
    w.urls = urls;

})(window)