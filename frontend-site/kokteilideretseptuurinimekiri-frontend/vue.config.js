const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Frontend dev server port configuration
  devServer: {
    port: 8081,  // Frontend will run on port 8081
    open: true,  // Automatically open browser
  }
})
