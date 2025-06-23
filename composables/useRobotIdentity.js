import { sha256 } from 'js-sha256'
import { sha256  as sha256Hash } from '@noble/hashes/sha256'
import { getPublicKey } from 'nostr-tools';

export const useRobotIdentity = async () => {

  const { genBase62Token, hexToBase91 } = useToken()
  const token = genBase62Token(32)
  const tokenBase91 = hexToBase91(sha256(token))

  const nostrSecKey = new Uint8Array(sha256Hash(token))
  const nostrPubKey = getPublicKey(nostrSecKey)

  const { genKey } = useOpenPGP()
  const { publicKeyArmored, encryptedPrivateKeyArmored } = await genKey(token)

  const authorization = [
    `Token ${tokenBase91}`,
    `| Public ${publicKeyArmored.replace(/\r?\n/g, "\\")}`,
    `| Private ${encryptedPrivateKeyArmored.replace(/\r?\n/g, "\\")}`,
    `| Nostr ${nostrPubKey}`,
  ].join(' ')

  const response = await $fetch('/api/robosats/identity', {
    method: 'POST',
    body: { authorization },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return {
    token,
    tokenBase91,
    nostrPubKey,
    publicKeyArmored,
    encryptedPrivateKeyArmored,
    authorization,
  }
}

