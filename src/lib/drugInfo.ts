import type { DrugInfo } from './types'

// Real reference data for the common medicines the recognizer knows,
// plus a generic fallback for anything else. Educational use only.
const DRUG_DATABASE: Record<string, Omit<DrugInfo, 'name'>> = {
  paracetamol: {
    genericName: 'Paracetamol (Acetaminophen)',
    description: 'An analgesic and antipyretic used to relieve pain and reduce fever.',
    usage: 'Pain (headache, toothache, muscle pain) and fever.',
    dosageInfo: 'Adults: 500-1000 mg every 4-6 hours as needed. Max 4 g/day.',
    sideEffects: ['Rare at normal doses', 'Nausea', 'Rash (allergic reactions are uncommon)'],
    precautions: ['Do not exceed 4 g/day', 'Avoid combining with other paracetamol-containing products', 'Reduce dose with liver disease or regular alcohol use'],
    contraindications: ['Severe liver impairment', 'Known allergy to paracetamol'],
    interactions: ['Warfarin (may increase INR with regular use)', 'Alcohol increases liver damage risk'],
  },
  acetaminophen: {
    genericName: 'Acetaminophen (Paracetamol)',
    description: 'An analgesic and antipyretic used to relieve pain and reduce fever.',
    usage: 'Pain and fever.',
    dosageInfo: 'Adults: 500-1000 mg every 4-6 hours as needed. Max 4 g/day.',
    sideEffects: ['Rare at normal doses', 'Nausea', 'Rash'],
    precautions: ['Do not exceed 4 g/day', 'Check combination products for hidden acetaminophen'],
    contraindications: ['Severe liver impairment', 'Known allergy'],
    interactions: ['Warfarin', 'Alcohol'],
  },
  ibuprofen: {
    genericName: 'Ibuprofen',
    description: 'A non-steroidal anti-inflammatory drug (NSAID) for pain, inflammation and fever.',
    usage: 'Pain, inflammation, fever, menstrual cramps.',
    dosageInfo: 'Adults: 200-400 mg every 6-8 hours with food. Max 1200 mg/day OTC.',
    sideEffects: ['Stomach upset', 'Heartburn', 'Dizziness', 'Increased bleeding risk'],
    precautions: ['Take with food', 'Avoid in dehydration', 'Stop before surgery (bleeding risk)'],
    contraindications: ['Active peptic ulcer', 'Severe kidney or heart failure', 'Third trimester of pregnancy', 'Aspirin-sensitive asthma'],
    interactions: ['Blood thinners (warfarin, aspirin)', 'ACE inhibitors and diuretics (reduced kidney function)', 'Other NSAIDs'],
  },
  aspirin: {
    genericName: 'Acetylsalicylic Acid (Aspirin)',
    description: 'An NSAID used for pain, fever, and in low doses to prevent blood clots.',
    usage: 'Pain, fever; low dose (75-100 mg) for cardiovascular protection.',
    dosageInfo: 'Pain: 300-600 mg every 4-6 hours. Prevention: 75-100 mg once daily.',
    sideEffects: ['Stomach irritation', 'Heartburn', 'Increased bleeding', 'Ringing in ears (high doses)'],
    precautions: ['Take with food', 'Not for children with viral infections (Reye syndrome risk)'],
    contraindications: ['Active peptic ulcer', 'Bleeding disorders', 'Children under 16 with fever', 'Third trimester of pregnancy'],
    interactions: ['Warfarin and other anticoagulants', 'Ibuprofen (reduces aspirin heart protection)', 'Methotrexate'],
  },
  amoxicillin: {
    genericName: 'Amoxicillin',
    description: 'A penicillin-class antibiotic for bacterial infections.',
    usage: 'Respiratory, ear, dental, urinary and skin infections.',
    dosageInfo: 'Adults: 500 mg every 8 hours or 875 mg every 12 hours, as prescribed.',
    sideEffects: ['Diarrhea', 'Nausea', 'Rash', 'Thrush'],
    precautions: ['Complete the full course', 'Take at even intervals', 'Tell your doctor about penicillin allergy before starting'],
    contraindications: ['Penicillin allergy', 'History of amoxicillin-associated jaundice'],
    interactions: ['Methotrexate', 'Allopurinol (rash risk)', 'Reduces effectiveness of some oral contraceptives (rare)'],
  },
  metformin: {
    genericName: 'Metformin',
    description: 'A first-line medicine for type 2 diabetes that lowers glucose production in the liver.',
    usage: 'Type 2 diabetes, sometimes for prediabetes or PCOS.',
    dosageInfo: 'Usually 500-1000 mg with meals, once to twice daily, as prescribed.',
    sideEffects: ['Nausea', 'Diarrhea', 'Stomach upset', 'Metallic taste'],
    precautions: ['Take with food to reduce stomach upset', 'Stop before contrast imaging scans as advised', 'Monitor kidney function'],
    contraindications: ['Severe kidney impairment', 'Acute heart or liver failure', 'Diabetic ketoacidosis'],
    interactions: ['Contrast dyes (lactic acidosis risk)', 'Alcohol', 'Some diuretics and steroids'],
  },
  amlodipine: {
    genericName: 'Amlodipine',
    description: 'A calcium channel blocker that relaxes blood vessels to lower blood pressure.',
    usage: 'High blood pressure and angina (chest pain).',
    dosageInfo: 'Adults: 5-10 mg once daily.',
    sideEffects: ['Ankle swelling', 'Flushing', 'Headache', 'Dizziness'],
    precautions: ['Rise slowly from sitting', 'Report severe swelling', 'Do not stop suddenly without advice'],
    contraindications: ['Severe low blood pressure', 'Aortic stenosis (severe)', 'Known allergy'],
    interactions: ['Simvastatin (limit dose)', 'Grapefruit juice', 'Other blood pressure medicines'],
  },
  lisinopril: {
    genericName: 'Lisinopril',
    description: 'An ACE inhibitor that lowers blood pressure and protects the heart and kidneys.',
    usage: 'High blood pressure, heart failure, after heart attacks, diabetic kidney protection.',
    dosageInfo: 'Adults: 10-40 mg once daily, as prescribed.',
    sideEffects: ['Dry persistent cough', 'Dizziness', 'High potassium', 'Kidney changes'],
    precautions: ['Monitor kidney function and potassium', 'Rise slowly', 'Report swelling of face/lips immediately'],
    contraindications: ['Pregnancy', 'History of angioedema', 'Bilateral renal artery stenosis'],
    interactions: ['Potassium supplements and salt substitutes', 'NSAIDs (ibuprofen)', 'Lithium'],
  },
  omeprazole: {
    genericName: 'Omeprazole',
    description: 'A proton pump inhibitor that reduces stomach acid production.',
    usage: 'Heartburn, reflux (GERD), ulcers, H. pylori regimens.',
    dosageInfo: 'Adults: 20-40 mg once daily before breakfast, as prescribed.',
    sideEffects: ['Headache', 'Diarrhea or constipation', 'Nausea', 'Long-term: B12/magnesium deficiency'],
    precautions: ['Take 30-60 minutes before food', 'Use the lowest effective dose', 'Review long-term use with your doctor'],
    contraindications: ['Known allergy', 'Severe liver disease (dose adjustment)'],
    interactions: ['Clopidogrel (reduced effect)', 'Methotrexate', 'Some antifungals and HIV medicines'],
  },
  simvastatin: {
    genericName: 'Simvastatin',
    description: 'A statin that lowers LDL (bad) cholesterol to reduce cardiovascular risk.',
    usage: 'High cholesterol, prevention of heart attack and stroke.',
    dosageInfo: 'Adults: 10-40 mg once daily in the evening.',
    sideEffects: ['Muscle aches', 'Headache', 'Digestive upset', 'Rare: muscle damage'],
    precautions: ['Report unexplained muscle pain or weakness immediately', 'Avoid grapefruit juice', 'Liver function monitoring'],
    contraindications: ['Active liver disease', 'Pregnancy and breastfeeding'],
    interactions: ['Grapefruit juice', 'Amlodipine (limit simvastatin dose)', 'Some antibiotics and antifungals'],
  },
  atorvastatin: {
    genericName: 'Atorvastatin',
    description: 'A statin that lowers LDL (bad) cholesterol and triglycerides.',
    usage: 'High cholesterol, cardiovascular risk reduction.',
    dosageInfo: 'Adults: 10-80 mg once daily, any time of day.',
    sideEffects: ['Muscle aches', 'Headache', 'Digestive upset', 'Rare: muscle or liver injury'],
    precautions: ['Report unexplained muscle pain', 'Avoid large amounts of grapefruit juice', 'Liver function monitoring'],
    contraindications: ['Active liver disease', 'Pregnancy and breastfeeding'],
    interactions: ['Grapefruit juice', 'Some antibiotics (clarithromycin)', 'Cyclosporine'],
  },
  levothyroxine: {
    genericName: 'Levothyroxine',
    description: 'A synthetic thyroid hormone used to treat hypothyroidism.',
    usage: 'Underactive thyroid (hypothyroidism), thyroid cancer suppression.',
    dosageInfo: 'Once daily in the morning on an empty stomach, 30-60 minutes before breakfast.',
    sideEffects: ['Symptoms of too high a dose: palpitations, tremor, weight loss, insomnia'],
    precautions: ['Take at the same time daily', 'Separate from calcium, iron and antacids by 4 hours', 'Regular thyroid function tests'],
    contraindications: ['Untreated adrenal insufficiency', 'Acute heart problems (caution)'],
    interactions: ['Calcium and iron supplements', 'Antacids', 'Warfarin (effect increased)'],
  },
  metoprolol: {
    genericName: 'Metoprolol',
    description: 'A beta-blocker that slows the heart rate and lowers blood pressure.',
    usage: 'High blood pressure, angina, after heart attacks, some rhythm disorders.',
    dosageInfo: 'Adults: 25-100 mg once or twice daily (or long-acting once daily), as prescribed.',
    sideEffects: ['Fatigue', 'Slow heart rate', 'Cold hands and feet', 'Dizziness'],
    precautions: ['Do not stop suddenly — taper under medical advice', 'Monitor pulse', 'May mask low blood sugar symptoms in diabetics'],
    contraindications: ['Severe bradycardia (very slow pulse)', 'Severe asthma (caution)', 'Certain heart blocks'],
    interactions: ['Other blood pressure medicines', 'Verapamil/diltiazem', 'Some antidepressants'],
  },
  losartan: {
    genericName: 'Losartan',
    description: 'An angiotensin receptor blocker (ARB) that lowers blood pressure.',
    usage: 'High blood pressure, heart failure, diabetic kidney protection, stroke risk reduction.',
    dosageInfo: 'Adults: 25-100 mg once daily.',
    sideEffects: ['Dizziness', 'High potassium', 'Fatigue', 'Kidney changes'],
    precautions: ['Monitor potassium and kidney function', 'Rise slowly', 'Report swelling of face/lips immediately'],
    contraindications: ['Pregnancy', 'History of angioedema', 'Bilateral renal artery stenosis'],
    interactions: ['Potassium supplements', 'NSAIDs', 'Lithium'],
  },
  albuterol: {
    genericName: 'Albuterol (Salbutamol)',
    description: 'A fast-acting bronchodilator that opens the airways.',
    usage: 'Asthma attacks, exercise-induced bronchospasm, COPD.',
    dosageInfo: 'Inhaler: 2 puffs every 4-6 hours as needed, as prescribed.',
    sideEffects: ['Tremor', 'Fast heartbeat', 'Nervousness', 'Headache'],
    precautions: ['Rinse mouth after use of some devices', 'Track usage — needing it more often means asthma is uncontrolled', 'Seek urgent care if not relieved'],
    contraindications: ['Known allergy to albuterol', 'Caution with severe heart rhythm disorders'],
    interactions: ['Beta-blockers (may block effect)', 'Some diuretics (low potassium)', 'MAO inhibitors (caution)'],
  },
  gabapentin: {
    genericName: 'Gabapentin',
    description: 'A nerve-pain and seizure medicine.',
    usage: 'Nerve pain (neuropathy, sciatica), seizures, restless legs.',
    dosageInfo: 'Usually 300-1800 mg/day in divided doses, as prescribed; kidney dose adjustments apply.',
    sideEffects: ['Drowsiness', 'Dizziness', 'Unsteadiness', 'Swelling'],
    precautions: ['May impair driving until you know how it affects you', 'Do not stop suddenly — taper', 'Kidney dose adjustments'],
    contraindications: ['Known allergy', 'Caution in severe respiratory disease'],
    interactions: ['Opioids and sedatives (increased drowsiness, breathing risk)', 'Antacids (separate by 2 hours)'],
  },
  hydrochlorothiazide: {
    genericName: 'Hydrochlorothiazide',
    description: 'A thiazide diuretic ("water pill") that lowers blood pressure and removes excess fluid.',
    usage: 'High blood pressure, mild fluid retention.',
    dosageInfo: 'Adults: 12.5-25 mg once daily in the morning.',
    sideEffects: ['Frequent urination', 'Low potassium/sodium', 'Dizziness', 'Increased blood sugar and uric acid'],
    precautions: ['Take in the morning to avoid night urination', 'Periodic blood tests for salts and kidney function', 'Sun protection (photosensitivity)'],
    contraindications: ['Severe kidney failure', 'Anuria', 'Sulfa allergy (caution)', 'Gout (caution)'],
    interactions: ['Lithium', 'NSAIDs', 'Digoxin (potassium effects)'],
  },
  sertraline: {
    genericName: 'Sertraline',
    description: 'An SSRI antidepressant that raises serotonin levels in the brain.',
    usage: 'Depression, anxiety disorders, OCD, PTSD.',
    dosageInfo: 'Adults: usually 50-200 mg once daily, as prescribed.',
    sideEffects: ['Nausea', 'Insomnia or drowsiness', 'Sexual side effects', 'Dry mouth'],
    precautions: ['Take in the morning if it affects sleep', 'Do not stop suddenly — taper', 'Report worsening mood urgently'],
    contraindications: ['With MAO inhibitors', 'Known allergy', 'Caution in bipolar disorder'],
    interactions: ['MAO inhibitors', 'Blood thinners (bleeding risk)', 'Triptans (serotonin syndrome risk)'],
  },
  montelukast: {
    genericName: 'Montelukast',
    description: 'A leukotriene receptor antagonist for asthma and allergy prevention.',
    usage: 'Asthma prevention, allergic rhinitis, exercise-induced bronchospasm.',
    dosageInfo: 'Adults: 10 mg once daily in the evening.',
    sideEffects: ['Headache', 'Stomach pain', 'Rare: mood changes, sleep disturbances'],
    precautions: ['Report mood or behavior changes', 'Not for acute asthma attacks — keep the rescue inhaler'],
    contraindications: ['Known allergy to montelukast'],
    interactions: ['Few significant ones; phenobarbital may reduce levels'],
  },
  furosemide: {
    genericName: 'Furosemide',
    description: 'A loop diuretic ("water pill") that removes excess fluid.',
    usage: 'Fluid retention (edema) in heart, liver or kidney disease; high blood pressure.',
    dosageInfo: 'Adults: 20-80 mg per dose, as prescribed, usually in the morning.',
    sideEffects: ['Frequent urination', 'Dehydration', 'Low potassium/sodium', 'Dizziness'],
    precautions: ['Take in the morning', 'Blood tests for salts and kidney function', 'Rise slowly'],
    contraindications: ['Severe dehydration', 'Anuria', 'Severe electrolyte depletion'],
    interactions: ['Digoxin (toxicity risk with low potassium)', 'Lithium', 'Aminoglycoside antibiotics (ear/kidney risk)'],
  },
}

export function getDrugInfo(drugName: string): DrugInfo {
  const key = drugName.toLowerCase().trim()
  const known = DRUG_DATABASE[key]
  if (known) {
    return { name: drugName, ...known }
  }
  return {
    name: drugName,
    genericName: drugName,
    description: `${drugName} is not in the built-in reference. The details below are general guidance only.`,
    usage: 'As prescribed by your physician.',
    dosageInfo: 'As prescribed by your physician. Do not exceed the recommended dose.',
    sideEffects: ['Consult the package leaflet or your pharmacist'],
    precautions: ['Follow the prescription exactly', 'Ask your pharmacist about food and drink interactions'],
    contraindications: ['Known allergy to this medicine or similar ones'],
    interactions: ['Tell your doctor or pharmacist about all medicines you take'],
  }
}

export function checkInteractions(drugs: string[]): string[] {
  const warnings: string[] = []
  const known = drugs.map((d) => d.toLowerCase().trim())

  // Common clinically significant pairs
  const PAIRS: [string, string, string][] = [
    ['ibuprofen', 'aspirin', 'Ibuprofen can reduce aspirin\'s heart-protective effect and increases stomach bleeding risk'],
    ['ibuprofen', 'warfarin', 'Ibuprofen with blood thinners like warfarin increases bleeding risk'],
    ['aspirin', 'warfarin', 'Aspirin with warfarin significantly increases bleeding risk'],
    ['ibuprofen', 'lisinopril', 'Ibuprofen can reduce the blood-pressure effect of lisinopril and strain the kidneys'],
    ['ibuprofen', 'losartan', 'Ibuprofen can reduce the blood-pressure effect of losartan and strain the kidneys'],
    ['ibuprofen', 'furosemide', 'Ibuprofen can reduce furosemide\'s diuretic effect and strain the kidneys'],
    ['lisinopril', 'losartan', 'Combining two blood-pressure medicines of these classes needs medical supervision'],
    ['metformin', 'furosemide', 'This combination needs kidney monitoring'],
    ['sertraline', 'aspirin', 'Sertraline with aspirin increases bleeding risk'],
    ['gabapentin', 'sertraline', 'Combined drowsiness and dizziness is more likely'],
  ]

  for (const [a, b, message] of PAIRS) {
    if (known.includes(a) && known.includes(b)) {
      warnings.push(message)
    }
  }

  if (drugs.length > 1) {
    warnings.push('Multiple medicines detected — always confirm completeness and doses with your doctor or pharmacist')
  }
  return [...new Set(warnings)]
}
