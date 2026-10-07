import type { Correction, Medicine } from './types'
import { getCorrections } from './storage'

// Ported from SonicRxReader MedicineRecognizer.kt
const COMMON_MEDICINE_NAMES = new Set([
  'aspirin', 'ibuprofen', 'paracetamol', 'acetaminophen', 'amoxicillin',
  'metformin', 'amlodipine', 'lisinopril', 'omeprazole', 'simvastatin',
  'levothyroxine', 'atorvastatin', 'metoprolol', 'losartan', 'albuterol',
  'gabapentin', 'hydrochlorothiazide', 'sertraline', 'montelukast', 'furosemide',
])

const DOSAGE_PATTERN = /(\d+\.?\d*)\s*(mg|g|ml|mcg|iu)/i
const FREQUENCY_PATTERN = /(once|twice|thrice|\d+\s*times?)\s*(daily|a\s*day|per\s*day)/i
const DURATION_PATTERN = /(\d+)\s*(day|days|week|weeks|month|months)/i

function extractMedicineName(line: string, corrections: Correction[]): string {
  const words = line.split(/[\s,.-]+/)

  for (const word of words) {
    const cleanWord = word.trim().toLowerCase()
    if (cleanWord.length > 3 && COMMON_MEDICINE_NAMES.has(cleanWord)) {
      return word.trim()
    }
    const correction = corrections.find((c) => c.original === cleanWord)
    if (correction) {
      return correction.correctedText
    }
  }

  for (const word of words) {
    if (word.length > 4 && /[a-z]/i.test(word)) {
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '')
      if (cleanWord.length > 4) {
        return cleanWord
      }
    }
  }

  return ''
}

function calculateConfidence(name: string, dosage: string, frequency: string): number {
  let confidence = 0
  if (COMMON_MEDICINE_NAMES.has(name.toLowerCase())) {
    confidence += 0.5
  } else if (name.length > 4) {
    confidence += 0.3
  }
  if (dosage) confidence += 0.2
  if (frequency) confidence += 0.15
  if (name.length > 3 && /[a-z]/i.test(name)) {
    confidence += 0.15
  }
  return Math.min(Math.max(confidence, 0), 1)
}

export function recognizeMedicines(text: string, prescriptionId: number): Medicine[] {
  const corrections = getCorrections()
  const medicines: Medicine[] = []

  for (const line of text.split('\n')) {
    const name = extractMedicineName(line, corrections)
    if (name) {
      const dosage = DOSAGE_PATTERN.exec(line)?.[0] ?? ''
      const frequency = FREQUENCY_PATTERN.exec(line)?.[0] ?? ''
      const duration = DURATION_PATTERN.exec(line)?.[0] ?? ''
      medicines.push({
        id: Date.now() + medicines.length,
        prescriptionId,
        name,
        dosage,
        frequency,
        duration,
        confidence: calculateConfidence(name, dosage, frequency),
        corrected: false,
        timestamp: Date.now(),
      })
    }
  }

  return medicines
}
