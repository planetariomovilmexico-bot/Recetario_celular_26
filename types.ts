
export interface Medication {
  name: string;
  trade: string;
  quantity: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Patient {
  name: string;
  phone: string;
  dob: string;
  age: string;
  ta_sis: string;
  ta_dia: string;
  fc: string;
  temp: string;
  glucose: string;
  weight: string;
  height: string;
  imc: string;
  imc_class: string;
}

export interface Consultation {
  folio: string;
  date: string;
  patient: Patient;
  subjetivo: string;
  diagnoses: string;
  meds: Medication[];
  exams: string;
  apptDate?: string;
  apptTime?: string;
  apptNotes?: string;
}

export interface CatalogItem {
  name: string;
  commercial?: string;
  quantity?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
}
