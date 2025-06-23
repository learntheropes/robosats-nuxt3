// composables/useRobotIdentity.js

import * as openpgp from 'openpgp'
import { sha256 } from '@noble/hashes/sha256'
import { randomBytes } from '@noble/hashes/utils'
import { Base16, Base91 } from 'base-ex'

function hexToBase91(hex) {
  const b16 = new Base16()
  const b91 = new Base91()
  return b91.encode(b16.decode(hex))
}

function escapeHeaderContent(str) {
  return str
    .replace(/\r?\n/g, '\\n')
    .replace(/[\x00-\x1F\x7F]/g, '')
}

export const useRobotIdentity = async () => {
  console.log('Generating Robot Identity...')

  const rawTokenBytes = randomBytes(32)
  const rawTokenHex = Array.from(rawTokenBytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  // ✅ HASH THE HEX STRING, NOT THE BYTES
  const tokenSha256 = sha256(new TextEncoder().encode(rawTokenHex))
  const tokenSha256Hex = Array.from(tokenSha256)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const tokenBase91 = hexToBase91(tokenSha256Hex)

  console.log('tokenBase91:', tokenBase91, 'length:', tokenBase91.length)

  const nostrPubKey = Array.from(sha256(new TextEncoder().encode(rawTokenHex)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'Robot', email: 'robot@example.com' }],
    passphrase: rawTokenHex,
    format: 'armored',
  })

  const armoredPublic = escapeHeaderContent(publicKey)
  const armoredPrivate = escapeHeaderContent(privateKey)

  const authorization = [
    `Token ${tokenBase91}`,
    `^| Public ${armoredPublic}`,
    `^| Private ${armoredPrivate}`,
    `^| Nostr ${nostrPubKey}`,
  ].join(' ')

  console.log('AUTHORIZATION HEADER:', authorization)

  const response = await $fetch('/api/robosats/identity', {
    method: 'POST',
    body: { authorization },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  console.log('RoboSats Identity Response:', response)

  return {
    token: rawTokenHex,
    tokenBase91,
    nostrPubKey,
    armoredPublic,
    armoredPrivate,
    authorization,
  }
}
