import * as openpgp from 'openpgp'
import { sha256 } from '@noble/hashes/sha256'
import { Base16, Base91 } from 'base-ex'

function escapeHeaderContent(str) {
  return str.replace(/\r?\n/g, '\\n').replace(/[\x00-\x1F\x7F]/g, '')
}

function genBase62Token(length = 32) {
  return window
    .btoa(
      Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
        .map((b) => String.fromCharCode(b))
        .join('')
    )
    .replace(/[+/]/g, '')
    .substring(0, length)
}

function hexToBase91FromHashBytes(hashBytes) {
  const b16 = new Base16()
  const b91 = new Base91()
  const hex = Buffer.from(hashBytes).toString('hex')
  return b91.encode(b16.decode(hex))
}

export const useRobotIdentity = async () => {
  console.log('Generating Robot Identity...')

  const token = genBase62Token(32)
  console.log('Generated token:', token)

  const tokenHashBytes = sha256(new TextEncoder().encode(token))
  const tokenBase91 = hexToBase91FromHashBytes(tokenHashBytes)

  console.log('tokenBase91', tokenBase91, 'length', tokenBase91.length)

  const nostrPubKey = Buffer.from(tokenHashBytes).toString('hex')

  const { privateKey, publicKey } = await openpgp.generateKey({
    type: 'rsa',
    rsaBits: 2048,
    userIDs: [{ name: 'Robot', email: 'robot@example.com' }],
    passphrase: token,
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

  console.log('Authorization Header:', authorization)

  const response = await $fetch('/api/robosats/identity', {
    method: 'POST',
    body: { authorization },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  console.log('RoboSats Identity Response:', response)

  return {
    token,
    tokenBase91,
    nostrPubKey,
    armoredPublic,
    armoredPrivate,
    authorization,
  }
}

