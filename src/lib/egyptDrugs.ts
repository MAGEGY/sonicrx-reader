import type { Medicine } from './types'

export interface EgyptDrug {
  name: string
  generic: string
  trade: string
  strength: string
  form: string
  product: string
  maker: string
}

let cache: EgyptDrug[] | null = null

export async function loadEgyptDrugs(): Promise<number> {
  if (cache) return cache.length
  const base =
    typeof document !== 'undefined'
      ? new URL('egypt-drugs.json', document.baseURI).href
      : '/egypt-drugs.json'
  const res = await fetch(base)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  cache = (await res.json()) as EgyptDrug[]
  return cache.length
}

export function egyptDrugsCount(): number {
  return cache?.length ?? 0
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = 0; i <= a.length; i++) dp[i][0] = i
  for (let j = 0; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[a.length][b.length]
}

// Fuzzy lookup in the Egyptian drug registry: exact -> prefix -> substring ->
// word-level levenshtein. Returns the best match or null.
export function lookupEgyptianDrug(name: string): EgyptDrug | null {
  if (!cache || !name) return null
  const q = name.toLowerCase().trim()
  if (!q) return null

  let best: { drug: EgyptDrug; score: number } | null = null
  for (const drug of cache) {
    const nameL = drug.name.toLowerCase()
    const productL = drug.product.toLowerCase()
    let score = Number.MAX_SAFE_INTEGER

    if (nameL === q || productL === q) score = 0
    else if (nameL.startsWith(q) || productL.startsWith(q)) score = 1
    else if (nameL.includes(q) || productL.includes(q)) score = 2
    else {
      const words = `${nameL} ${productL}`.split(/\s+/)
      for (const w of words) {
        if (w.length < 4) continue
        const d = levenshtein(q, w)
        if (d <= 2) score = Math.min(score, 3 + d)
      }
    }

    if (score < Number.MAX_SAFE_INTEGER && (!best || score < best.score)) {
      best = { drug, score }
    }
  }
  return best?.drug ?? null
}

// Re-export for convenience in the scanner UI
export type { Medicine }
