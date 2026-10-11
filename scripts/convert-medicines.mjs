// Converts MediConnect's Egyptian medicines database (6,522 entries from
// tarshouby.xlsx) into a compact JSON bundle for sonicrx-web.
// Run: node scripts/convert-medicines.mjs
import { readFileSync, writeFileSync } from 'fs'

const src = readFileSync(
  new URL('../../MediConnect/constants/medicinesDatabase.ts', import.meta.url),
  'utf8',
)

// Extract the array literal between "export const MEDICINES_DATABASE" and its closing "];"
const start = src.indexOf('MEDICINES_DATABASE')
const arrStart = src.indexOf('[', start)
const arrEnd = src.indexOf('];', arrStart)
const literal = src.slice(arrStart, arrEnd + 1)

// Evaluate the object literals safely: they are plain JSON-ish TS objects.
// Convert TS to JSON by quoting unquoted keys is unnecessary — keys are quoted already.
// But values may contain unescaped content; use a Function eval on the array literal.
const medicines = new Function(`return ${literal}`)()

function clean(s) {
  return String(s ?? '')
    .replace(/^[,\s]+/, '')
    .replace(/\s*,\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim()
}

const out = medicines
  .map((m) => ({
    name: clean(m.name),
    generic: clean(m.genericName),
    trade: clean(m.tradeName),
    strength: clean(m.strength),
    form: clean(m.dosageForm),
    product: clean(m.fullProductName),
    maker: clean(m.manufacturer),
  }))
  .filter((m) => m.name.length > 1)

writeFileSync(
  new URL('../public/egypt-drugs.json', import.meta.url),
  JSON.stringify(out),
)
console.log(`Wrote ${out.length} medicines to public/egypt-drugs.json`)
