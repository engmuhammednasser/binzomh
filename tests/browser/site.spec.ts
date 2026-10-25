import { test, expect, type Page } from '@playwright/test'

const staticMode = process.env.E2E_STATIC === '1'
const basePath = process.env.E2E_BASE_PATH || '/'

async function visit(page: Page, path: string) {
  const response = await page.goto(path)
  expect(response?.status()).toBe(200)
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as Element & { __vue_app__?: unknown })?.__vue_app__))
}

for (const locale of ['en', 'ar']) {
  test(`${locale}: public routes hydrate, assets load and layouts fit`, async ({ page }) => {
    const errors: string[] = []
    const failed: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', (message) => {
      if (message.type() === 'error' || /hydration/i.test(message.text())) errors.push(message.text())
    })
    page.on('response', (response) => {
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`)
    })
    for (const path of ['', '/about', '/brands', '/brands/embryolisse', '/brands/zoa', '/brands/rvb-lab', '/capabilities', '/network', '/contact']) {
      await visit(page, `${locale}${path}`)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
      const activePath = path.startsWith('/brands/') ? '/brands' : path
      await expect(page.locator('.app-header__link.is-active')).toHaveAttribute('href', `${basePath}${locale}${activePath}`)
      await page.locator('footer').scrollIntoViewIfNeeded()
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true)
    }
    expect(errors).toEqual([])
    expect(failed).toEqual([])
  })

  test(`${locale}: brand enquiry preselects a valid editable brand`, async ({ page }) => {
    await visit(page, `${locale}/brands/zoa`)
    const enquiry = page.locator('.brand-detail__enquiry a')
    await expect(enquiry).toHaveAttribute('href', `${basePath}${locale}/contact?brand=zoa`)
    await enquiry.click()
    await expect(page.locator('#contact-brand')).toHaveValue('zoa')
    await page.locator('#contact-brand').selectOption('embryolisse')
    await expect(page.locator('#contact-brand')).toHaveValue('embryolisse')
    await visit(page, `${locale}/contact?brand=constructor`)
    await expect(page.locator('#contact-brand')).toHaveValue('')
    if (staticMode) await expect(page.locator('button[type="submit"]')).toBeDisabled()
  })

  test(`${locale}: mobile menu has a visible close, traps focus and restores it`, async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile drawer only')
    await visit(page, `${locale}/brands/zoa`)
    const opener = page.locator('.app-header__toggle')
    await opener.click()
    const dialog = page.getByRole('dialog')
    const close = dialog.locator('.mobile-nav__close')
    await expect(close).toBeFocused()
    await expect(dialog.locator('.mobile-nav__link.is-active')).toHaveAttribute('href', `${basePath}${locale}/brands`)
    await page.keyboard.press('Shift+Tab')
    await expect(dialog.locator('.mobile-nav__link').last()).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(close).toBeFocused()
    await close.click()
    await expect(dialog).toHaveCount(0)
    await expect(opener).toBeFocused()
    await opener.click()
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
    await expect(opener).toBeFocused()
  })
}

test('root honors saved language; explicit routes stay explicit', async ({ page, context, baseURL }) => {
  await context.addCookies([{ name: 'binzomh_locale', value: 'ar', url: baseURL! }])
  await page.goto('./?ref=local-test#main-content')
  await expect(page).toHaveURL(new RegExp(`${basePath}ar\\?ref=local-test#main-content$`))
  await visit(page, 'en/about')
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr')
})

test('language switcher preserves the page and brand, then saves the root preference', async ({ page }) => {
  await visit(page, 'en/contact?brand=zoa')
  await page.locator('.app-header .language-switcher__link').click()
  await expect(page).toHaveURL(new RegExp(`${basePath}ar/contact\\?brand=zoa$`))
  await expect(page.locator('#contact-brand')).toHaveValue('zoa')
  await page.goto('./')
  await expect(page).toHaveURL(new RegExp(`${basePath}ar/?$`))
})

test('static root uses browser language and has no-JS language links', async ({ browser, baseURL }) => {
  test.skip(!staticMode, 'Static landing only')
  const arabic = await browser.newContext({ locale: 'ar-SA' })
  const page = await arabic.newPage()
  await page.goto(baseURL!)
  await expect(page).toHaveURL(`${baseURL}ar`)
  await arabic.close()
  const noJs = await browser.newContext({ javaScriptEnabled: false })
  const fallback = await noJs.newPage()
  await fallback.goto(baseURL!)
  await expect(fallback.getByRole('link', { name: 'العربية' })).toHaveAttribute('href', `${basePath}ar`)
  await fallback.getByRole('link', { name: 'العربية' }).click()
  await expect(fallback.locator('h1')).toBeVisible()
  await noJs.close()
})

test('marquee pause, visibility and live reduced-motion preference stop animation', async ({ page }) => {
  await visit(page, 'en')
  const section = page.locator('.network')
  const track = section.locator('.network__logos-marquee')
  const button = section.getByRole('button', { name: 'Pause animation' })
  await button.scrollIntoViewIfNeeded()
  await expect(track).toHaveCSS('animation-play-state', 'running')
  await button.click()
  await expect(track).toHaveCSS('animation-play-state', 'paused')
  await section.getByRole('button', { name: 'Resume animation' }).click()
  await expect(track).toHaveCSS('animation-play-state', 'running')
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(track).toHaveCSS('animation-play-state', 'paused')
  await button.scrollIntoViewIfNeeded()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(track).toHaveCSS('animation-play-state', 'paused')
  await expect(button).toHaveCount(0)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(track).toHaveCSS('animation-play-state', 'running')
})

test('mobile capability playback can be paused and follows reduced motion', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile capability autoplay only')
  await visit(page, 'en')
  const section = page.locator('.capabilities')
  const button = section.getByRole('button', { name: 'Pause animation' })
  await button.scrollIntoViewIfNeeded()
  await button.click()
  const caption = section.locator('.capabilities__visual-caption')
  const initial = await caption.textContent()
  await page.clock.install()
  await page.clock.fastForward(4000)
  await expect(caption).toHaveText(initial!)
  await section.getByRole('button', { name: 'Resume animation' }).click()
  await page.clock.fastForward(4000)
  await expect(caption).not.toHaveText(initial!)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(button).toHaveCount(0)
  const reduced = await caption.textContent()
  await page.clock.fastForward(8000)
  await expect(caption).toHaveText(reduced!)
})

test('team autoplay responds when reduced motion changes after hydration', async ({ page }) => {
  await page.clock.install()
  await visit(page, 'en/about')
  const track = page.locator('.team__track')
  const current = page.locator('.team__thumb[aria-current="true"]')
  const pause = page.getByRole('button', { name: /pause.*rotation|pause.*autoplay|pause.*carousel/i })
  await expect(pause).toHaveCount(1)
  const initial = await current.getAttribute('aria-label')
  await page.clock.fastForward(6000)
  await expect(current).toHaveAttribute('aria-label', initial!)
  await track.scrollIntoViewIfNeeded()
  await page.mouse.move(0, 0)
  await expect(track).toBeInViewport()
  await page.clock.fastForward(6000)
  await expect(current).not.toHaveAttribute('aria-label', initial!)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(pause).toHaveCount(0)
  const reduced = await current.getAttribute('aria-label')
  await page.clock.fastForward(12000)
  await expect(current).toHaveAttribute('aria-label', reduced!)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await expect(pause).toHaveCount(1)
})

test('contact rejects false successes, preserves input and clears only after acceptance', async ({ page }) => {
  test.skip(staticMode, 'SSR uses a local mock endpoint; deployed static contact stays disabled')
  await visit(page, 'en/contact?brand=zoa')
  await page.locator('#contact-name').fill('Local QA')
  await page.locator('#contact-email').fill('qa@example.test')
  await page.locator('#contact-company').fill('Local QA Co.')
  await page.locator('#contact-mobile').fill('+966 50 000 0000')
  await page.locator('#contact-message').fill('Local browser test — never sent to a provider.')
  const responses = [
    { body: '{}', contentType: 'application/json' },
    { body: '[]', contentType: 'application/json' },
    { body: '{"status":"error"}', contentType: 'application/json' },
    { body: '{bad', contentType: 'application/json' },
    { body: '<html>OK</html>', contentType: 'text/html' },
    { body: '{"ok":false}', contentType: 'application/json' },
    { body: '{"ok":true}', contentType: 'application/json', status: 429 },
    { body: '{"ok":true}', contentType: 'application/json', status: 500 },
  ]
  let requests = 0
  for (const reply of responses) {
    await page.route('**/_contact-test', async (route) => {
      requests++
      expect(route.request().postData()).toContain('zoa')
      await route.fulfill(reply)
    })
    await page.locator('button[type="submit"]').click()
    await expect(page.locator('.contact-form__status--failed')).toBeVisible()
    await expect(page.locator('#contact-name')).toHaveValue('Local QA')
    await expect(page.locator('#contact-brand')).toHaveValue('zoa')
    await expect(page.locator('#contact-message')).not.toHaveValue('')
    await page.unroute('**/_contact-test')
  }
  expect(requests).toBe(responses.length)
  await page.route('**/_contact-test', route => route.fulfill({ json: { ok: true } }))
  await page.locator('button[type="submit"]').click()
  await expect(page.locator('.contact-form__status--sent')).toContainText('received')
  await expect(page.locator('#contact-name')).toHaveValue('')
  await expect(page.locator('#contact-brand')).toHaveValue('')
  await expect(page.locator('#contact-message')).toHaveValue('')
})

test('contact validation and pending request prevent duplicate submissions', async ({ page }) => {
  test.skip(staticMode, 'Local mock endpoint only')
  await visit(page, 'en/contact')
  let count = 0
  let release: () => void = () => {}
  const gate = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/_contact-test', async (route) => {
    count++
    await gate
    await route.fulfill({ json: { ok: true } })
  })
  const send = page.locator('button[type="submit"]')
  await send.click()
  expect(count).toBe(0)
  await page.locator('#contact-name').fill('Local QA')
  await page.locator('#contact-email').fill('qa@example.test')
  // The company and a dialable mobile number are required; the message is
  // optional: without them nothing is sent, with them an empty message
  // still sends.
  await send.click()
  expect(count).toBe(0)
  expect(await page.locator('#contact-company').evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true)
  expect(await page.locator('#contact-mobile').evaluate(el => (el as HTMLInputElement).validity.valueMissing)).toBe(true)
  expect(await page.locator('#contact-message').evaluate(el => (el as HTMLTextAreaElement).checkValidity())).toBe(true)
  await page.locator('#contact-company').fill('Local QA Co.')
  await page.locator('#contact-mobile').fill('call me')
  await send.click()
  expect(count).toBe(0)
  expect(await page.locator('#contact-mobile').evaluate(el => (el as HTMLInputElement).validity.customError)).toBe(true)
  await page.locator('#contact-mobile').fill('+966 50 000 0000')
  await send.click()
  await expect(send).toBeDisabled()
  await expect(page.locator('#contact-name')).toHaveAttribute('readonly', '')
  await page.locator('form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })))
  expect(count).toBe(1)
  release()
  await expect(page.locator('.contact-form__status--sent')).toBeVisible()
})

test('contact timeout and network failure preserve the enquiry for retry', async ({ page }) => {
  test.skip(staticMode, 'Local mock endpoint only')
  await visit(page, 'en/contact')
  await page.locator('#contact-name').fill('Local QA')
  await page.locator('#contact-email').fill('qa@example.test')
  await page.locator('#contact-company').fill('Local QA Co.')
  await page.locator('#contact-mobile').fill('+966 50 000 0000')
  await page.locator('#contact-message').fill('Keep this enquiry')
  await page.route('**/_contact-test', route => route.abort('failed'))
  await page.locator('button[type="submit"]').click()
  await expect(page.locator('.contact-form__status--failed')).toBeVisible()
  await expect(page.locator('#contact-message')).toHaveValue('Keep this enquiry')
  await page.unroute('**/_contact-test')
  await page.clock.install()
  await page.route('**/_contact-test', () => {})
  await page.locator('button[type="submit"]').click()
  await expect(page.locator('button[type="submit"]')).toBeDisabled()
  await page.clock.fastForward(16000)
  await expect(page.locator('.contact-form__status--failed')).toBeVisible()
  await expect(page.locator('#contact-message')).toHaveValue('Keep this enquiry')
  await expect(page.locator('button[type="submit"]')).toBeEnabled()
})
