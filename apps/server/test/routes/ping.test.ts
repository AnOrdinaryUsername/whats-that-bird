import * as assert from 'node:assert'
import { test } from 'node:test'
import { build } from '../helper.js'

test('/api/pong should respond with pong', async (t) => {
  const app = await build(t)

  const response = await app.inject({
    method: 'GET',
    url: '/api/ping'
  })

  assert.equal(response.statusCode, 200);
  assert.equal(response.payload, 'pong');
})
