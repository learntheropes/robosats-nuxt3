import * as openpgp from 'openpgp'
import { createHash, randomBytes } from 'crypto'
import { Base16, Base91 } from 'base-ex'
import { getPublicKey } from 'nostr-tools'

const b16 = new Base16()
const b91 = new Base91()

export const useRobotIdentity = async () => {
  // Step 1: Generate token
  const rawToken = randomBytes(32)
  const token = rawToken.toString('hex') // 64-char hex string

  // Step 2: Derive base91 token from SHA256(token string)
  const sha256Hex = createHash('sha256').update(token).digest('hex') // hex string
  const tokenBase91 = b91.encode(b16.decode(sha256Hex))

  // Step 3: Generate Nostr pubkey from SHA256(token string)
  const nostrSecKey = createHash('sha256').update(token).digest() // Buffer
  const nostrPubKey = getPublicKey(nostrSecKey)

  // Step 4: Generate PGP keypair
  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'Robot', email: 'robot@example.com' }],
    passphrase: token,
    format: 'armored'
  })

  // Step 5: Escape newlines for header safety
  const escapeHeaderContent = str =>
    str.replace(/\r?\n/g, '\\n').replace(/[\x00-\x1F\x7F]/g, '')

  const armoredPublic = escapeHeaderContent(publicKey)
  const armoredPrivate = escapeHeaderContent(privateKey)

  // Step 6: Build Authorization header
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
