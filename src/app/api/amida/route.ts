import { NextResponse } from 'next/server'
import playwright from 'playwright'

export async function POST(req: Request) {
  try {
    new Promise(async () => {
      const browser = await playwright.chromium.launch({ headless: true })
      const context = await browser.newContext({
        recordVideo: {
          dir: './videos/', // 保存先のディレクトリ
          size: { width: 1200, height: 1000 }, // 録画するサイズ
        },
      })
      const page = await context.newPage()
      await page.goto('http://localhost:3000/')
      await page.click('text=あみだくじを生成')
      await new Promise((resolve) => setTimeout(resolve, 2000))
      await page.click('text=START')
      // await page.screenshot({ fullPage: true, path: './example.png' })
      await browser.close()
    })

    return NextResponse.json({
      status: 200,
    })
  } catch (e) {
    return NextResponse.json({
      status: 500,
      data: { message: `error ${e}` },
    })
  }
}
