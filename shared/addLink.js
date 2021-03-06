const path = require('path')

const addLink = (dir, url) => {
  let link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.href = (url === undefined) ? dir : path.join(dir, url)
  document.getElementsByTagName('head')[0].appendChild(link)
}
module.exports = addLink
