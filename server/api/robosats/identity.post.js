import { SocksProxyAgent } from 'socks-proxy-agent'
import got from 'got'

export default defineEventHandler(async (event) => {
  const { authorization } = await readBody(event)

  console.log(authorization);


  const agent = new SocksProxyAgent('socks5h://127.0.0.1:9050')

  try {
    const response = await got('http://mmhaqzuirth5rx7gl24d4773lknltjhik57k7ahec5iefktezv4b3uid.onion/api/robot/', {
      headers: {
        Authorization: authorization
      },
      agent: {
        http: agent
      },
      timeout: { request: 15000 },
      responseType: 'json'
    })

    return response.body
  } catch (error) {
    console.error('RoboSats API error:', error.response?.body || error.message)
    throw createError({
      statusCode: 502,
      statusMessage: 'RoboSats API error',
      data: error.response?.body || error.message
    })
  }
})
