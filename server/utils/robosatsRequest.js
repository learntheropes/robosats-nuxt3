import got from 'got'
import { SocksProxyAgent } from 'socks-proxy-agent'

const { public: { robosatsCoordinatorUrl }} = useRuntimeConfig()


export const robosatsRequest = async ({ authorization, method = "GET", path, body }) => {

  const url = `${robosatsCoordinatorUrl}${path}`

  const headers = {
    Authorization: authorization,
    ...(method === 'POST' ? { 'Content-Type': 'application/json' } : {})
  }

  try {
    const response = await got(url, {
      method,
      headers,
      body: method === 'POST' && body ? JSON.stringify(body) : undefined,
      agent: { http: new SocksProxyAgent('socks5h://127.0.0.1:9050')},
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
}



