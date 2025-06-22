import * as openpgp from 'openpgp'
import { createHash } from 'crypto'
import baseX from 'base-x'

const base91 = baseX("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,./:;=?@[]^_`{|}~")

function genRobotToken(length = 40) {
  const array = new Uint8Array(length * 2)
  crypto.getRandomValues(array)

  const base64 = btoa(String.fromCharCode(...array))
  const token = base64.replace(/[+/]/g, '').substring(0, length)

  return token
}

function escapeHeaderContent(str) {
  return str.replace(/\r?\n/g, '\\n').replace(/[\x00-\x1F\x7F]/g, '')
}

export const useRobotIdentity = async () => {
  const token = genRobotToken(40)
  const tokenHash = createHash('sha256').update(token).digest() // hash the token string
  const tokenBase91 = base91.encode(tokenHash) // final token used in Authorization header
  const nostrPubKey = createHash('sha256').update(token).digest('hex')

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'Robot', email: 'robot@example.com' }],
    passphrase: token,
    format: 'armored'
  })

  const armoredPublic = escapeHeaderContent(publicKey)
  const armoredPrivate = escapeHeaderContent(privateKey)

  const authorization = [
    `Token ${tokenBase91}`,
    `^| Public ${armoredPublic}`,
    `^| Private ${armoredPrivate}`,
    `^| Nostr ${nostrPubKey}`
  ].join(' ')

  return {
    token,
    tokenBase91,
    nostrPubKey,
    armoredPublic,
    armoredPrivate,
    authorization
  }
}
