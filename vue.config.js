// 这里只列一部分，具体配置惨考文档啊
module.exports = {
    // baseUrl  type:{string} default:'/' 
    // 将部署应用程序的基本URL
    // 将部署应用程序的基本URL。
    // 默认情况下，Vue CLI假设您的应用程序将部署在域的根目录下。
    // https://www.my-app.com/。如果应用程序部署在子路径上，则需要使用此选项指定子路径。例如，如果您的应用程序部署在https://www.foobar.com/my-app/，集baseUrl到'/my-app/'.

    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',

    // outputDir: 在npm run build时 生成文件的目录 type:string, default:'dist'

    // outputDir: 'dist',
    //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
    lintOnSave: true,
    // productionSourceMap：{ type:Bollean,default:true } 生产源映射
    // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
    productionSourceMap: false,
    // devServer:{type:Object} 3个属性host,port,https
    // 它支持webPack-dev-server的所有选项
    // devServer: {
    //     port: 9527, // 端口号
    //     host: '192.168.10.174',
    //     https: false, // https:{type:Boolean}
    //     open: true, //配置自动启动浏览器
    //     proxy: 'http://101.132.226.216:8300', // 配置跨域处理,只有一个代理
    //     // proxy: {
    //     //     '/api': {
    //     //         target: '<url>',
    //     //         ws: true,
    //     //         changeOrigin: true
    //     //     },
    //     //     '/foo': {
    //     //         target: '<other_url>'
    //     //     }
    //     // },  // 配置多个代理
    // }
}