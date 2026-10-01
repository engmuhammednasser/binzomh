import assert from 'node:assert/strict'
import test from 'node:test'
import { isContactAccepted, sendContactEnquiry } from '../app/utils/contact-request.ts'

test('contact acceptance follows one explicit provider contract', () => {
  for (const body of [null, {}, [], { status: 'error' }, { ok: 'true' }, { success: true }, { ok: false }, { ok: true, errors: ['rejected'] }, { ok: true, success: false }]) {
    assert.equal(isContactAccepted(body, 'ok'), false, JSON.stringify(body))
  }
  assert.equal(isContactAccepted({ ok: true }, 'ok'), true)
  assert.equal(isContactAccepted({ ok: true, errors: [] }, 'ok'), true)
  assert.equal(isContactAccepted({ success: true }, 'success'), true)
  assert.equal(isContactAccepted({ ok: true }, 'unknown'), false)
})

test('contact transport rejects HTML, malformed JSON, provider rejection and HTTP errors', async () => {
  const data = new FormData()
  data.set('message', 'Local test')
  const responses = [
    new Response('<html>OK</html>', { headers: { 'content-type': 'text/html' } }),
    new Response('{broken', { headers: { 'content-type': 'application/json' } }),
    Response.json({}), Response.json([]), Response.json({ ok: false }),
    Response.json({ ok: true }, { status: 429 }),
  ]
  for (const response of responses) {
    await assert.rejects(sendContactEnquiry('/local-test', data, 'ok', new AbortController().signal, async () => response))
    assert.equal(data.get('message'), 'Local test')
  }
  await sendContactEnquiry('/local-test', data, 'ok', new AbortController().signal, async (_url, init) => {
    assert.equal(init.method, 'POST')
    assert.equal(init.body, data)
    return Response.json({ ok: true })
  })
})

test('contact transport propagates an aborted request', async () => {
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(sendContactEnquiry('/local-test', new FormData(), 'ok', controller.signal, async (_url, init) => {
    init.signal.throwIfAborted()
    return Response.json({ ok: true })
  }), { name: 'AbortError' })
})
