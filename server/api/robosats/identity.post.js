import { SocksProxyAgent } from 'socks-proxy-agent'
import got from 'got'

export default defineEventHandler(async (event) => {
  const { authorization } = await readBody(event)

  try {
    const response = await got('http://mmhaqzuirth5rx7gl24d4773lknltjhik57k7ahec5iefktezv4b3uid.onion/api/robot/', {
      headers: {
        Authorization: authorization
      },
      agent: {
        http: new SocksProxyAgent('socks5h://127.0.0.1:9050')
      },
      timeout: { request: 15000 },
      responseType: 'json'
    })

    return response.body
  } catch (error) {
    console.error('RoboSats identity API error:', error.response?.body || error.message)
    throw createError({
      statusCode: 502,
      statusMessage: 'RoboSats identity API error',
      data: error.response?.body || error.message
    })
  }
})
