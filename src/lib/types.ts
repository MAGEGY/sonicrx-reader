export interface Medicine {
  id: number
  prescriptionId: number
  name: string
  dosage: string
  frequency: string
  duration: string
  confidence: number
  corrected: boolean
  timestamp: number
}

export interface Prescription {
  id: number
  rawText: string
  processedDate: number
  doctorName: string
  patientName: string
  notes: string
}

export interface Correction {
  original: string
  correctedText: string
}

export interface DrugInfo {
  name: string
  genericName: string
  description: string
  usage: string
  dosageInfo: string
  sideEffects: string[]
  precautions: string[]
  contraindications: string[]
  interactions: string[]
}
