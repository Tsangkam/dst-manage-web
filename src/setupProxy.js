const { createProxyMiddleware } = require('http-proxy-middleware');

// eslint-disable-next-line func-names
module.exports = function (app) {

    app.use(createProxyMiddleware('/dst', {
        target: "https://dst.liuyh.com/",
        changeOrigin: true,
        pathRewrite: {
            '^/dst': ''
        },
    }))
    app.use(createProxyMiddleware('/api', {
        target: "http://192.168.31.113:8082/",
        changeOrigin: true,
    }))
    app.use(createProxyMiddleware('/version', {
        target: "http://ver.tugos.cn",
        changeOrigin: true,
        pathRewrite: {
            '^/version': ''
        },
    }))

    app.use(createProxyMiddleware('/py', {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true,
    }))

    app.use(createProxyMiddleware('/steam', {
        target: "http://192.168.31.113:8082/",
        changeOrigin: true,
    }))

}