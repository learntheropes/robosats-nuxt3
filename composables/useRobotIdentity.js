import * as openpgp from 'openpgp'
import { createHash, randomBytes } from 'crypto'
import baseX from 'base-x'

const base91 = baseX("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;=?@[]^_`{|}~"
)

export const useRobotIdentity = async () => {
  const rawToken = randomBytes(32)
  const token = rawToken.toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest()
  const tokenBase91 = base91.encode(tokenHash)
  const nostrPubKey = createHash('sha256').update(rawToken).digest('hex')

  console.log('tokenBase91', tokenBase91, 'length', tokenBase91.length)
  console.log('tokenHash.length', tokenHash.length) // MUST be 32
  console.log('tokenHash instanceof Buffer', tokenHash instanceof Buffer) // true
  console.log('tokenBase91.length', tokenBase91.length) // 39 or 40

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'Robot', email: 'robot@example.com' }],
    passphrase: token,
    format: 'armored'
  })

  function escapeHeaderContent(str) {
  return str.replace(/\r?\n/g, '\\n').replace(/[\x00-\x1F\x7F]/g, '')
}

  const armoredPublic = escapeHeaderContent(publicKey)
  const armoredPrivate = escapeHeaderContent(privateKey)

  const authorization = [
    `Token ${tokenBase91}`,
    `^| Public ${armoredPublic}`,
    `^| Private ${armoredPrivate}`,
    `^| Nostr ${nostrPubKey}`
  ].join(' ')

  console.log('authorization:', authorization)

  return {
    token,
    tokenBase91,
    nostrPubKey,
    armoredPublic,
    armoredPrivate,
    authorization
  }
}
