// import fs from 'fs'
import { installMouseHelper } from '../installMouseHelper'
import puppeteer, { Page } from 'puppeteer'

const ARGS = ['--window-size=2400,1280', '--disable-features=site-per-process']
const URL = 'https://di.fm'

const isDev = process.env.NODE_ENV === 'development'

export class DiFm {
  page!: Page
  constructor() {
    console.log('DiFm class is initialised')
  }

  launch = async (): Promise<void> => {
    const browser = await puppeteer.launch({
      args: ARGS,
      headless: !isDev
    })

    this.page = await browser.newPage()

    if (isDev) {
      await installMouseHelper(this.page)
    }

    await this.page.goto(URL)
  }
}
