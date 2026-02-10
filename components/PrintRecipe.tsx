
import React, { useEffect, useRef } from 'react';
import { Consultation } from '../types';
import { DOCTOR_INFO } from '../constants';

interface PrintRecipeProps {
  data: Consultation;
}

const PrintRecipe: React.FC<PrintRecipeProps> = ({ data }) => {
  return (
    <div className="hidden print:block w-full max-w-[8.5in] mx-auto bg-white p-0 text-slate-900">
      {/* Header */}
      <header className="flex items-center space-x-6 border-b-2 border-slate-800 pb-4">
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fwa.me%2F52${DOCTOR_INFO.phones[0]}`} 
          alt="WhatsApp QR" 
          className="w-20 h-20"
        />
        <div className="flex-1">
          <h1 className="font-serif-header text-3xl font-bold leading-tight">{DOCTOR_INFO.name}</h1>
          <h2 className="font-serif-header text-xl font-bold text-slate-700">{DOCTOR_INFO.specialty}</h2>
          <p className="text-xs text-slate-500 uppercase tracking-wide mt-1">{DOCTOR_INFO.credentials}</p>
        </div>
      </header>

      {/* Patient Data Box */}
      <section className="mt-6 border-b border-slate-200 pb-4">
        <div className="grid grid-cols-12 gap-y-2 text-sm">
          <div className="col-span-8">
            <span className="font-bold">PACIENTE:</span> <span className="uppercase">{data.patient.name || '---'}</span>
          </div>
          <div className="col-span-4 text-right">
            <span className="font-bold">FECHA:</span> <span>{data.date}</span>
          </div>
          
          <div className="col-span-4">
            <span className="font-bold">CELULAR:</span> <span>{data.patient.phone || '---'}</span>
          </div>
          <div className="col-span-4">
            <span className="font-bold">F. NAC:</span> <span>{data.patient.dob || '---'}</span>
          </div>
          <div className="col-span-4 text-right">
            <span className="font-bold">EDAD:</span> <span>{data.patient.age} años</span>
          </div>

          <div className="col-span-12 mt-2 bg-slate-50 p-2 rounded flex justify-between items-center text-xs">
            <span><strong>TA:</strong> {data.patient.ta_sis}/{data.patient.ta_dia} mmHg</span>
            <span><strong>FC:</strong> {data.patient.fc} lpm</span>
            <span><strong>T°:</strong> {data.patient.temp} °C</span>
            <span><strong>GLUCOSA:</strong> {data.patient.glucose} mg/dL</span>
            <span><strong>IMC:</strong> {data.patient.imc} {data.patient.imc_class}</span>
          </div>
        </div>
      </section>

      {/* Diagnoses */}
      {data.diagnoses && (
        <section className="mt-6">
          <h3 className="font-serif-header font-bold text-lg border-b border-slate-300 mb-2">Diagnósticos</h3>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{data.diagnoses}</p>
        </section>
      )}

      {/* Treatment */}
      <section className="mt-6 flex-grow min-h-[4in]">
        <h3 className="font-serif-header font-bold text-lg border-b border-slate-300 mb-3">Tratamiento</h3>
        <ol className="space-y-4">
          {data.meds.map((med, idx) => (
            <li key={idx} className="flex flex-col">
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-base">{idx + 1}. {med.name}</span>
                {med.trade && <span className="italic text-slate-600 text-sm">({med.trade})</span>}
              </div>
              <div className="ml-5 text-sm leading-relaxed text-slate-800">
                {[med.quantity, med.frequency, med.duration, med.instructions].filter(Boolean).join(' • ')}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Indications / Exams */}
      {data.exams && (
        <section className="mt-6">
          <h3 className="font-serif-header font-bold text-lg border-b border-slate-300 mb-2">Indicaciones y Exámenes</h3>
          <p className="text-sm whitespace-pre-wrap italic">{data.exams}</p>
        </section>
      )}

      {/* Footer / Signature Area */}
      <footer className="mt-auto pt-10 pb-4">
        <div className="flex flex-col items-center">
          <div className="w-64 border-t border-slate-800 mb-2"></div>
          <p className="font-bold text-center">{DOCTOR_INFO.name}</p>
          {data.apptDate && (
            <p className="mt-4 text-blue-800 font-bold text-sm">
              PRÓXIMA CITA: {data.apptDate} {data.apptTime && `a las ${data.apptTime}`}
            </p>
          )}
        </div>

        <div className="mt-10 flex justify-between items-end border-t-2 border-slate-800 pt-4">
          <div className="text-[10px] text-slate-500 max-w-xs">
            <p>{DOCTOR_INFO.address}</p>
            <p>Tels: {DOCTOR_INFO.phones.join(' / ')}</p>
          </div>
          <div className="flex items-center space-x-4">
             <div className="flex flex-col items-center text-[10px] text-slate-600">
               <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https%3A%2F%2Fsignos-vitales-reporte.netlify.app%2F" alt="Vitals QR" className="w-14 h-14" />
               <span>REGISTRA TUS SIGNOS</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold">FOLIO: {data.folio}</span>
                <div className="bg-slate-100 px-2 py-1 text-xs font-mono border border-slate-300">
                  |||| || ||| || ||
                </div>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PrintRecipe;
