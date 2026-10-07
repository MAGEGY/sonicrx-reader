import type { DrugInfo } from './types'

// Ported from SonicRxReader StubDrugInfoApi.kt (the Android app also uses stub data)
export function getDrugInfo(drugName: string): DrugInfo {
  return {
    name: drugName,
    genericName: `${drugName} (Generic)`,
    description: `This is a placeholder description for ${drugName}.`,
    usage: 'Used for treating various medical conditions. Consult your doctor for specific usage.',
    dosageInfo: 'Standard dosage: As prescribed by physician. Do not exceed recommended dosage.',
    sideEffects: ['Nausea', 'Dizziness', 'Headache', 'Drowsiness'],
    precautions: ['Take with food', 'Avoid alcohol', 'Do not drive if drowsy', 'Complete full course'],
    contraindications: [
      'Not for pregnant women without consultation',
      'Not recommended for children under 12',
      'Avoid if allergic to similar medications',
    ],
    interactions: [
      'May interact with blood thinners',
      'Consult doctor if taking other medications',
    ],
  }
}

export function checkInteractions(drugs: string[]): string[] {
  if (drugs.length > 1) {
    return [
      `Potential interaction detected between ${drugs[0]} and ${drugs[1]}`,
      'Consult your healthcare provider',
    ]
  }
  return []
}
