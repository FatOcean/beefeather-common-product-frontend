/*
 * @Author: linchunmei linchunmei@linklogis.com
 * @Date: 2024-07-08 16:56:34
 * @LastEditors: linchunmei linchunmei@linklogis.com
 * @LastEditTime: 2024-10-31 09:44:04
 * @FilePath: \beefeather-doc-agent-frontend\.eslintrc.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    "keyword-spacing": "off",  
    "eqeqeq": "off",  
    "space-before-blocks": "off",  
    "no-trailing-spaces": "off"  ,
    "quotes": 'off',  
    "semi": 'off',  
    'comma-dangle': 'off',
    "no-unused-vars": "off", // 忽略未使用的变量  
    "no-dupe-keys": "off", // 忽略对象字面量中的重复键  
    "vue/no-dupe-keys": "off", // 忽略Vue组件中的重复键（如果你在使用Vue并且安装了eslint-plugin-vue）  
    "no-unneeded-ternary": "off", // 忽略不必要的三元表达式  
    "indent": "off", // 忽略缩进问题  
    "no-multi-spaces": "off", // 忽略多个空格  
    "no-unused-expressions": "off", // 忽略未使用的表达式  
    "handle-callback-err": "off", // 忽略未处理的错误回调  
    "eol-last": "off", // 忽略文件末尾缺少换行符的问题
    "curly": "off", // 忽略if/else语句后缺少大括号的错误  
    "comma-spacing": "off", // 忽略逗号后的空格要求  
    "space-in-parens": "off" // 忽略括号内空格的错误   
  }
}
