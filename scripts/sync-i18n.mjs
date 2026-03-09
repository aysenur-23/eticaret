import fs from 'node:fs'
import path from 'node:path'

const trPath = path.join(process.cwd(), 'messages', 'tr.json')
const enPath = path.join(process.cwd(), 'messages', 'en.json')

function flatten(obj, prefix = '', out = {}) {
  if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) {
    out[prefix] = obj
    return out
  }
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k
    flatten(v, key, out)
  }
  return out
}

function setByPath(obj, dotted, value) {
  const keys = dotted.split('.')
  let cur = obj
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (cur[k] == null || typeof cur[k] !== 'object' || Array.isArray(cur[k])) cur[k] = {}
    cur = cur[k]
  }
  cur[keys[keys.length - 1]] = value
}

const tr = JSON.parse(fs.readFileSync(trPath, 'utf8'))
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))

const trFlat = flatten(tr)
const enFlat = flatten(en)

let addedToEn = 0
let addedToTr = 0

for (const [key, value] of Object.entries(trFlat)) {
  if (!(key in enFlat)) {
    setByPath(en, key, typeof value === 'string' ? value : '')
    addedToEn++
  }
}

for (const [key, value] of Object.entries(enFlat)) {
  if (!(key in trFlat)) {
    setByPath(tr, key, typeof value === 'string' ? value : '')
    addedToTr++
  }
}

fs.writeFileSync(trPath, JSON.stringify(tr, null, 2) + '\n', 'utf8')
fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n', 'utf8')

console.log(`sync done: addedToEn=${addedToEn}, addedToTr=${addedToTr}`)
