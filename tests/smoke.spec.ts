import { test, expect } from '@playwright/test'

test.describe('public smoke', () => {
  test('home page renders', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/IMORA|voltekno/i)
    await expect(page.locator('body')).toContainText(/Ürün|Products/i)
  })

  test('products page renders product grid', async ({ page }) => {
    await page.goto('/products')
    await expect(page.getByRole('main').first()).toBeVisible()
    await expect(page.locator('a[href^="/products/"]').first()).toBeVisible()
  })

  test('faq page renders', async ({ page }) => {
    await page.goto('/faq')
    await expect(page.locator('h1')).toContainText(/Sık Sorulan|FAQ/i)
  })
})

test.describe('admin guard smoke', () => {
  test('admin root redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/admin\/auth/)
  })

  test('admin auth page is reachable', async ({ page }) => {
    await page.goto('/admin/auth')
    await expect(page.locator('body')).toContainText(/Admin|Giriş|Login/i)
  })
})
