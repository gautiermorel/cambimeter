export default {
  chainWebpack: config => {
    config.plugin('html')
      .tap(args => {
        args[0].title = 'Cambio - Info prix';
        return args;
      })
  }
}
