
import React from 'react';

export const DOCTOR_INFO = {
  name: "Dr. Modesto Morales Hoyos",
  specialty: "Médico Internista",
  credentials: "Universidad Veracruzana | Céd. Prof. 1219623 | Céd. Esp. 3352905",
  address: "Emiliano Zapata 13, Col. Centro, Rafael Lucio, Veracruz, C.P. 91315",
  phones: ["2288370103", "2289546865"]
};

export const ACCESS_CODE = "831024";

export const MOCK_MEDS = [
  { name: "Paracetamol 500 mg", commercial: "Tempra", quantity: "1 tableta", frequency: "cada 8 h", duration: "3 días", instructions: "Después de alimentos" },
  { name: "Ibuprofeno 400 mg", quantity: "1 tableta", frequency: "cada 8 h", duration: "3 días", instructions: "Si persiste dolor o fiebre" },
  { name: "Amoxicilina 500 mg", quantity: "1 cápsula", frequency: "cada 8 h", duration: "7 días", instructions: "Completar tratamiento" },
  { name: "Losartán 50 mg", quantity: "1 tableta", frequency: "cada 24 h", duration: "30 días", instructions: "Control de TA" },
  { name: "Metformina 850 mg", quantity: "1 tableta", frequency: "cada 12 h", duration: "30 días", instructions: "Con alimentos" }
];

export const MOCK_CIE10 = [
  "I10 - Hipertensión esencial",
  "E11.9 - DM2 sin complicaciones",
  "J06 - Infección vías resp. sup.",
  "M54.5 - Lumbalgia",
  "K21.9 - Reflujo gastroesofágico"
];

export const MOCK_EXAMS = [
  "Biometría Hemática Completa (BH)",
  "Química Sanguínea (6)",
  "Examen General de Orina (EGO)",
  "Perfil de Lípidos",
  "Ultrasonido Abdominal"
];
