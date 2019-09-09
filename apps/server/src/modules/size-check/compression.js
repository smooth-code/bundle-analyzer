import gzip from 'gzip-size'
import brotli from 'brotli-size'

export function getCompressedSize(data, compression = 'gzip') {
  switch (compression) {
    case 'gzip':
      return gzip.sync(data)
    case 'brotli':
      return brotli.sync(data)
    case 'none':
    default:
      return Buffer.byteLength(data)
  }
}
