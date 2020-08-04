const svgFiles = require.context('./assets/svg/', false, /\.svg$/)
const iconList = svgFiles.keys().map(item => {
  return item.replace(/^\.\//, '').replace(/\.svg$/, '')
})

export default {
  // 获取图标icon-(*).svg名称列表, 例如[icon-shouye, icon-xitong, icon-zhedie, ...]
  getNameList () {
    return iconList
  }
}
