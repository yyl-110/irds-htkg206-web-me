import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { CaptchaImage } from './CaptchaImage'

describe('1. 对图片进行解码', () => {
  it('解析 base64 格式的图片', async () => {
    const codeImage = readFileSync(join(process.cwd(), 'tests/fixtures/code-image.png')).toString('base64')
    const puzzleImage = readFileSync(join(process.cwd(), 'tests/fixtures/puzzle-image.png')).toString('base64')
    const captchImage = new CaptchaImage(codeImage, puzzleImage)
    await captchImage.getMoveLeftDistance()
    // console.log(captchImage.moveLeftDistance)
    expect(captchImage.image).not.toBeNull()
    expect(captchImage.puzzleImage).not.toBeNull()
    expect(captchImage.moveLeftDistance).gt(0)
  })
})
