module.exports = {
  publicPath: './',

  devServer: {
    port: 9005,
    open: true,
    https: false,
  },

  productionSourceMap: false,

  css: {
    sourceMap: false,
    loaderOptions: {
      sass: {
        data: '@import "@/assets/styles/scss/_var.scss";@import "@/assets/styles/scss/_mixin.scss"; @import "~sass-rem";',
      },
    },
  },
}
