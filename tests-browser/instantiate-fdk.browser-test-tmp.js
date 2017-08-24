/* eslint-disable node/no-unsupported-features */

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const puppeteer = require('puppeteer')
const path = require('path')

const command = `
const eventGateway = fdk.eventGateway({
  url: 'http://localhost',
})
`

const runTest = async () => {
  let browser
  try {
    browser = await puppeteer.launch()
    const page = await browser.newPage()
    const htmlPath = path.join(__dirname, 'index.html')
    const url = `file://${htmlPath}`
    await page.goto(url)
    // if this command succeeds the FDK is available on window
    await page.evaluate(command)
    browser.close()
  } catch (err) {
    try {
      browser.close()
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    } catch (error) {
      // eslint-disable-next-line no-process-exit
      process.exit(1)
    }
  }
}

runTest()
