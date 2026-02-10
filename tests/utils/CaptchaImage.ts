// import getPixels from 'get-pixels'

type RGBA = [number, number, number, number]
type ImageRGBAArray = Array<Array<RGBA>>
type Point = [number, number]

/**
 * CaptchaImage
 */
export class CaptchaImage {
  /** 右下角文字坐标 */
  static TEXT_POSITION: Point = [262, 143]
  /** base64 图片的前缀 */
  static BASE64_IMAGE_PREFIX: string = 'data:image/png;base64,'
  /**
   * constructor
   * @param image
   * @param puzzleImage
   */
  constructor(
    /** 验证码图片 */
    public image: string,
    /** 需要拖动的拼图图片 */
    public puzzleImage: string,
  ) {
    if (!this.image || !this.puzzleImage)
      throw new Error('Invalid Image')
  }

  /** 拼图需要拖动的距离 */
  moveLeftDistance: number = 0
  /**
   * get move left distance
   * @param canvasWidth
   */
  async getMoveLeftDistance(canvasWidth?: number) {
    const image = await this.toDecodeImage(this.image)
    const puzzleImage = await this.toDecodeImage(this.puzzleImage)
    // 1. 获取拼图中的每列第一个非透明像素(边框)
    const firstBorderColorPoints = this.getFirstBorderColorPoints(puzzleImage)
    // 2. 从右下角的文字中提取验证码图片中拼图部分的边框色(文字与边框色相同, 但与拼图中的边框不同)
    const borderColor = this.getBorderColorByImage(image)
    // 3. 逐列对比边框色
    const distance = this.diffImage(borderColor, image, firstBorderColorPoints)
    if (distance === -1)
      throw new Error('External Error: Diff failed')
    this.moveLeftDistance = distance
    // console.log(canvasWidth, image[0].length, distance)
    return canvasWidth ? Math.floor(canvasWidth / image[0].length * distance) : distance
  }

  /**
   * diff image
   * @param borderColor
   * @param image
   * @param firstBorderColorPoints
   */
  diffImage(borderColor: RGBA, image: ImageRGBAArray, firstBorderColorPoints: Array<Point>): number {
    for (let x = 0; x < image[0].length; x++) {
      // 与拼图边框像素位置进行对比
      let existsBorder = true
      for (const point of firstBorderColorPoints) {
        if (this.isSameRGBA(image[point[1]][x + point[0]], borderColor))
          continue
        existsBorder = false
        break
      }
      if (existsBorder)
        return x
    }
    return -1
  }

  /**
   * is same color
   * @param colorA
   * @param colorB
   */
  isSameRGBA(colorA: RGBA, colorB: RGBA) {
    return colorA[0] === colorB[0]
      && colorA[1] === colorB[1]
      && colorA[2] === colorB[2]
      && colorA[3] === colorB[3]
  }

  /**
   * getBorderColorByImage
   * @param image
   */
  getBorderColorByImage(image: ImageRGBAArray) {
    return image[CaptchaImage.TEXT_POSITION[1]][CaptchaImage.TEXT_POSITION[0]]
  }

  /**
   * isTranparentPixel
   * @param pixel
   */
  isTranparentPixel(pixel: Array<number>) {
    return pixel[0] === 0 && pixel[1] === 0 && pixel[2] === 0 && pixel[3] === 0
  }

  /**
   * 从拼图图片中提取每行第一个边框像素坐标
   * @param image 拼图图片
   */
  getFirstBorderColorPoints(image: ImageRGBAArray) {
    const points: Array<Point> = []
    // 遍历每个像素
    for (let y = 0; y < image.length; y++) {
      for (let x = 0; x < image[0].length; x++) {
        const pixel = image[y][x]
        if (this.isTranparentPixel(pixel))
          continue
        points.push([x, y])
        break
      }
    }
    return points
  }

  /**
   * getPixelPoint
   * @param index
   * @param width
   */
  getPixelPoint(index: number, width: number): [number, number] {
    return [Math.floor(index / width), index % width]
  }

  /**
   * getImageBase64
   * @param image
   */
  getImageBase64(image: string) {
    if (image.indexOf('data:image') === 0)
      return image.split(',')[1]
    return image
  }

  /**
   * toDecodeImageWithCanvas
   * @param image
   */
  toDecodeImageWithCanvas(image: string): Promise<ImageRGBAArray> {
    const imageResultArray: ImageRGBAArray = []
    // 创建一个 Image 对象
    const img = new Image()
    // 设置图片的 src 为 Base64 数据
    img.src = image.indexOf(CaptchaImage.BASE64_IMAGE_PREFIX) === 0 ? image : (CaptchaImage.BASE64_IMAGE_PREFIX + image) // 替换为你的 Base64 图片数据
    // 等待图片加载完成后执行回调函数
    return new Promise((resolve) => {
      img.onload = function () {
        // 创建一个 canvas 元素和 2D 上下文对象
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        // 设置 canvas 的宽度和高度与图片相同
        canvas.width = img.width
        canvas.height = img.height
        // 在 canvas 上绘制图片
        ctx!.drawImage(img, 0, 0)
        // 获取指定区域的像素数据
        const imageData = ctx!.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        // 遍历像素数据，提取 RGBA 值
        for (let i = 0; i < pixels.length; i += 4) {
          const red = pixels[i]
          const green = pixels[i + 1]
          const blue = pixels[i + 2]
          const alpha = pixels[i + 3]
          const y = Math.floor(i / 4 / canvas.width)
          const x = (i / 4) % canvas.width
          if (!imageResultArray[y])
            imageResultArray[y] = []
          imageResultArray[y][x] = [red, green, blue, alpha]
        }
        resolve(imageResultArray)
      }
    })
  }

  /**
   * toDecodeImage
   * @param image
   */
  toDecodeImage(image: string): Promise<ImageRGBAArray> {
    let _Buffer
    try {
      // eslint-disable-next-line node/prefer-global/buffer
      _Buffer = Buffer
    }
    catch (err) {
      console.log(err)
      return this.toDecodeImageWithCanvas(image)
    }
    const imageBuffer = _Buffer.from(this.getImageBase64(image), 'base64')
    return new Promise((resolve, reject) => {
      const imageResultArray: ImageRGBAArray = []
      import('get-pixels').then(({ default: getPixels }) => {
        getPixels(imageBuffer, 'image/png', (error, pixels) => {
          if (error)
            return reject(error)
          // 获取图片尺寸
          const { shape: [width, height, channels] } = pixels

          // 遍历每个像素
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const r = pixels.get(x, y, 0)
              const g = pixels.get(x, y, 1)
              const b = pixels.get(x, y, 2)
              const a = channels === 4 ? pixels.get(x, y, 3) : 255 // 如果有 alpha 通道，获取 alpha 值，否则默认为 255
              if (!imageResultArray[y])
                imageResultArray[y] = []
              imageResultArray[y][x] = [r, g, b, a]
            }
          }

          resolve(imageResultArray)
        })
      })
    })
  }
}
