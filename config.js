import { readFileSync } from 'fs'

let key, cert

//if (process.env.NODE_ENV === 'development') {
key = readFileSync('./dev/server.key')
cert = readFileSync('./dev/server.cert')
//}

export const DB = process.env.DB || './dev/dev'
export const PORT = process.env.PORT || '3000'
export const SECRET = process.env.SECRET || 'devsecret'
export const PRIVATEKEY = process.env.PRIVATEKEY || key
export const CERTIFICATE = process.env.CERTIFICATE || cert
