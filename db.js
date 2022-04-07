import { DB } from './config.js'
import createSqlWasm from 'node-sql-wasm'

var { Database, Statement } = await createSqlWasm()

const db = await new Database({ dbfile: DB + '.db' })

// From here on, the SQL.js API can be used...
//db.query(`DROP TABLE IF EXISTS accounts`)

db.query(`
    CREATE TABLE IF NOT EXISTS accounts (
    email TEXT PRIMARY KEY,
    name TEXT)
  `)

//db.query(`CREATE UNIQUE INDEX IF NOT EXISTS id ON accounts (email)`)
//console.log(db.query(`SELECT email, name FROM accounts`))

export const insert = db.prepare(`
    INSERT INTO accounts
    VALUES ('email2','name2')
  `)
export const prep = db.prepare(`SELECT email FROM accounts`)

export function allEmails() {
  /* for (const email of db.exec(`SELECT email FROM accounts`)) {
    console.log('for', email)
  } */
  prep.bind()
  while (prep.step()) console.log('while', prep.get())
}
