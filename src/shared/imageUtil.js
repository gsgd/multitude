class ImageUtil {

  constructor (url) {
    // console.log();
    this.__data__ = { url: url }
  }

  get b64() {
    return new Promise((resolve, reject) => {
      // Load the image
      if (this.__data__.b64) { return resolve(this.__data__.b64) }

      // const reader = new window.FileReader()
      // reader.addEventListener('load', () => {

      // Get the image size
      const image = new window.Image()
      image.onload = () => {
        // console.log('image.onload', image)
        // Scale the image down
        const scale = 150 / (image.width > image.height ? image.width : image.height)
        const width = image.width * scale
        const height = image.height * scale

        // Resize the image
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, width, height)

        // Save it
        this.__data__.b64 = canvas.toDataURL()
        return resolve(this.__data__.b64)
      }
      image.src = this.url
      // }, false)
      // reader.readAsDataURL(this.url)
    })
  }

  get url() {
    return this.__data__.url
  }

}

module.exports = ImageUtil