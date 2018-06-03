const {nativeImage} = require('electron').remote
const B64_SVG_PREFIX = 'data:image/svg+xml;base64,'
const MULTI_SVG = window.atob(require('shared/b64Assets').MULTI_SVG.replace(B64_SVG_PREFIX, ''))

class TrayRenderer {

  /**
  * @param config: the config to merge into the default config
  * @return the config for rendering the tray icon
  */
  static defaultConfig (config) {
    if (config.__defaultMerged__) {
      return config
    } else {
      return Object.assign({
        pixelRatio: window.devicePixelRatio,
        color: 'rgb(71,71,71)',
        backgroundColor: '#FFFFFF',
        size: 100,
        thick: process.platform === 'win32',
        __defaultMerged__: true
      }, config)
    }
  }

  /**
  * Renders the tray icon as a canvas
  * @param config: the config for rendering
  * @return promise with the canvas
  */
  static renderCanvas (config) {
    return new Promise((resolve, reject) => {
      config = TrayRenderer.defaultConfig(config)

      const SIZE = config.size * config.pixelRatio
      const PADDING = SIZE * 0.1
      const color = config.color

      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')

      // Count or Icon
      const image = B64_SVG_PREFIX + window.btoa(MULTI_SVG.replace(/fill="rgb\(71,71,71\)"/g, `fill="${color}"`))
      const loader = new window.Image()
      loader.onload = function () {
        const ICON_SIZE = SIZE - (PADDING * 2)// * (config.thick ? 1.0 : 0.5)
        const POS = PADDING
        ctx.drawImage(loader, POS, POS, ICON_SIZE, ICON_SIZE)
        resolve(canvas)
      }
      loader.src = image
    })
  }

  /**
  * Renders the tray icon as a data64 png image
  * @param config: the config for rendering
  * @return promise with the native image
  */
  static renderPNGDataImage (config) {
    config = TrayRenderer.defaultConfig(config)
    return Promise.resolve()
     .then(() => TrayRenderer.renderCanvas(config))
     .then((canvas) => Promise.resolve(canvas.toDataURL('image/png')))
  }

  /**
  * Renders the tray icon as a native image
  * @param config: the config for rendering
  * @return the native image
  */
  static renderNativeImage (config) {
    config = TrayRenderer.defaultConfig(config)
    return Promise.resolve()
      .then(() => TrayRenderer.renderCanvas(config))
      .then((canvas) => {
        const pngData = nativeImage.createFromDataURL(canvas.toDataURL('image/png')).toPNG()
        return Promise.resolve(nativeImage.createFromBuffer(pngData, config.pixelRatio))
      })
  }
}

module.exports = TrayRenderer
