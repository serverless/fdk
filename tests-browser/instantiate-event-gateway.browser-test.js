/* eslint-disable node/no-unsupported-features */

// eslint-disable-next-line import/no-extraneous-dependencies, node/no-unpublished-require
const puppeteer = require('puppeteer')
const path = require('path')

const command = `
const eventGateway = fdk.eventGateway({
  url: 'http://localhost',
})
`

let browser
let page

beforeEach(async () => {
  browser = await puppeteer.launch()
  page = await browser.newPage()
  return
})

afterEach(() => {
  browser.close()
})

test('instantiate the event gateway', async () => {
  expect.assertions(1)
  const htmlPath = path.join(__dirname, 'index.html')
  const url = `file://${htmlPath}`
  await page.goto(url)
  // if this command succeeds the FDK is available on window
  await page.evaluate(command)
  expect(true).toBe(true)
})
