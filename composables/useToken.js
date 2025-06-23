import { Base16, Base91 } from 'base-ex'

const useToken = () => {
  const genBase62Token = (length) =>
    window
      .btoa(
        Array.from(window.crypto.getRandomValues(new Uint8Array(length * 2)))
          .map((b) => String.fromCharCode(b))
          .join('')
      )
      .replace(/[+/]/g, '')
      .substring(0, length)

  const hexToBase91 = (hex) => {
    const b16 = new Base16()
    const b91 = new Base91()
    return b91.encode(b16.decode(hex))
  }

  return {
    genBase62Token,
    hexToBase91,
  }
}

export default useToken
