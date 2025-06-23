import { sha256 } from 'js-sha256'
import { sha256  as sha256Hash } from '@noble/hashes/sha2'
import { getPublicKey } from '@noble/secp256k1';

export const useRobot = async () => {

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

  return {
    token,
    tokenBase91,
    nostrPubKey,
    publicKeyArmored,
    encryptedPrivateKeyArmored,
    authorization,
  }
}

