import type { Correction, Medicine, Prescription } from './types'

const KEYS = {
  prescriptions: 'sonicrx_prescriptions',
  medicines: 'sonicrx_medicines',
  corrections: 'sonicrx_corrections',
}

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '[]') as T[]
  } catch {
    return []
  }
}

function write<T>(key: string, value: T[]): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getPrescriptions = () => read<Prescription>(KEYS.prescriptions)
export const getMedicines = () => read<Medicine>(KEYS.medicines)
export const getCorrections = () => read<Correction>(KEYS.corrections)

export function savePrescription(prescription: Prescription, medicines: Medicine[]): number {
  const prescriptions = getPrescriptions()
  const id = prescriptions.reduce((max, p) => Math.max(max, p.id), 0) + 1
  prescriptions.push({ ...prescription, id })
  write(KEYS.prescriptions, prescriptions)

  const all = getMedicines()
  write(KEYS.medicines, [...all, ...medicines.map((m) => ({ ...m, prescriptionId: id }))])
  return id
}

export function deletePrescription(id: number): void {
  write(KEYS.prescriptions, getPrescriptions().filter((p) => p.id !== id))
  write(KEYS.medicines, getMedicines().filter((m) => m.prescriptionId !== id))
}

export function getMedicinesFor(prescriptionId: number): Medicine[] {
  return getMedicines().filter((m) => m.prescriptionId === prescriptionId)
}

export function addCorrection(original: string, correctedText: string): void {
  const corrections = getCorrections().filter((c) => c.original !== original.toLowerCase())
  corrections.push({ original: original.toLowerCase(), correctedText })
  write(KEYS.corrections, corrections)
}

export function markCorrected(medicineId: number): void {
  const medicines = getMedicines()
  const m = medicines.find((x) => x.id === medicineId)
  if (m) {
    m.corrected = true
    write(KEYS.medicines, medicines)
  }
}
