import assert from 'node:assert/strict'
import test from 'node:test'
import { dialable, validateEmail, validatePhone, validateRequired, validateSocialUrl } from '../shared/utils/contact-validation.ts'

test('phone numbers accept display formatting and reject what cannot be dialled', () => {
  for (const ok of ['+966 50 006 4807', '0500064807', '+966-50-006-4807', '(011) 123 4567']) assert.equal(validatePhone(ok), null, ok)
  assert.equal(validatePhone('  '), 'required')
  for (const bad of ['1234567', '+9665000648071234', 'call us', '+966 50 00x 4807', '++966500064807']) assert.equal(validatePhone(bad), 'phone', bad)
  assert.equal(dialable('+966 50 006 4807'), '+966500064807')
})

test('email and required text fields', () => {
  assert.equal(validateEmail('info@binzomah.net'), null)
  assert.equal(validateEmail(''), 'required')
  for (const bad of ['info@', 'info binzomah.net', 'info@binzomah', 'a@b.c']) assert.equal(validateEmail(bad), 'email', bad)
  assert.equal(validateRequired('Riyadh'), null)
  assert.equal(validateRequired('   '), 'required')
})

test('social links must be https on the platform\'s own domain; empty hides the platform', () => {
  assert.equal(validateSocialUrl('linkedin', ''), null)
  assert.equal(validateSocialUrl('linkedin', 'https://www.linkedin.com/company/binzomah'), null)
  assert.equal(validateSocialUrl('x', 'https://twitter.com/binzomah'), null)
  assert.equal(validateSocialUrl('x', 'https://x.com/binzomah'), null)
  assert.equal(validateSocialUrl('instagram', 'http://instagram.com/binzomah'), 'url')
  assert.equal(validateSocialUrl('instagram', 'instagram.com/binzomah'), 'url')
  assert.equal(validateSocialUrl('instagram', 'javascript:alert(1)'), 'url')
  assert.equal(validateSocialUrl('facebook', 'https://user:pass@facebook.com/x'), 'url')
  assert.equal(validateSocialUrl('facebook', 'https://facebook.com.evil.example/binzomah'), 'host')
  assert.equal(validateSocialUrl('youtube', 'https://notyoutube.com/binzomah'), 'host')
})
