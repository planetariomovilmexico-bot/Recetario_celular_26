
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DOCTOR_INFO, MOCK_MEDS, MOCK_CIE10, MOCK_EXAMS } from './constants';
import { Medication, Patient, Consultation } from './types';
import PasswordGate from './components/PasswordGate';
import Autocomplete from './components/Autocomplete';
import PrintRecipe from './components/PrintRecipe';
import { suggestDiagnosis } from './services/geminiService';
import { 
  Stethoscope, 
  User, 
  Phone, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  Printer, 
  Save, 
  MessageSquare, 
  Zap,
  Activity,
  Heart
} from 'lucide-react';

const App: React.FC = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [data, setData] = useState<Consultation>({
    folio: `REC-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.random().toString(36).substring(7).toUpperCase()}`,
    date: new Intl.DateTimeFormat('es-MX', { weekday:'short', day:'2-digit', month:'short', year:'numeric'}).format(new Date()).replace(/\./g, ''),
    patient: {
      name: '',
      phone: '',
      dob: '',
      age: '',
      ta_sis: '',
      ta_dia: '',
      fc: '',
      temp: '',
      glucose: '',
      weight: '',
      height: '',
      imc: '',
      imc_class: ''
    },
    subjetivo: '',
    diagnoses: '',
    meds: [{ name: '', trade: '', quantity: '', frequency: '', duration: '', instructions: '' }],
    exams: '',
    apptDate: '',
    apptTime: '',
    apptNotes: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // BMI Calculation
  useEffect(() => {
    const w = parseFloat(data.patient.weight);
    const h = parseFloat(data.patient.height);
    if (w > 0 && h > 0) {
      const heightInMeters = h > 3 ? h / 100 : h;
      const bmi = w / (heightInMeters * heightInMeters);
      let classification = '';
      if (bmi < 18.5) classification = '(Bajo peso)';
      else if (bmi <= 24.9) classification = '(Peso normal)';
      else if (bmi <= 29.9) classification = '(Sobrepeso)';
      else classification = '(Obesidad)';

      setData(prev => ({
        ...prev,
        patient: { ...prev.patient, imc: bmi.toFixed(1), imc_class: classification }
      }));
    }
  }, [data.patient.weight, data.patient.height]);

  // Age calculation from DOB
  useEffect(() => {
    if (data.patient.dob) {
      const birthDate = new Date(data.patient.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
      setData(prev => ({ ...prev, patient: { ...prev.patient, age: age.toString() } }));
    }
  }, [data.patient.dob]);

  const updatePatient = (field: keyof Patient, val: string) => {
    setData(prev => ({ ...prev, patient: { ...prev.patient, [field]: val } }));
  };

  const addMed = () => {
    setData(prev => ({
      ...prev,
      meds: [...prev.meds, { name: '', trade: '', quantity: '', frequency: '', duration: '', instructions: '' }]
    }));
  };

  const removeMed = (index: number) => {
    setData(prev => ({
      ...prev,
      meds: prev.meds.filter((_, i) => i !== index)
    }));
  };

  const updateMed = (index: number, field: keyof Medication, val: string) => {
    const newMeds = [...data.meds];
    newMeds[index] = { ...newMeds[index], [field]: val };
    setData(prev => ({ ...prev, meds: newMeds }));
  };

  const handleAISuggestions = async () => {
    if (!data.subjetivo) return alert("Escribe algunas notas en 'Subjetivo' primero.");
    setIsAnalyzing(true);
    const suggestions = await suggestDiagnosis(data.subjetivo);
    if (suggestions.length > 0) {
      const currentDx = data.diagnoses ? data.diagnoses + '\n' : '';
      setData(prev => ({ ...prev, diagnoses: currentDx + suggestions.join('\n') }));
    }
    setIsAnalyzing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    const firstName = data.patient.name.split(' ')[0];
    const medsText = data.meds.map(m => `• *${m.name}* ${m.trade ? `(${m.trade})`:''} - ${m.quantity} / ${m.frequency}`).join('\n');
    const msg = `Hola *${firstName}*, Dr. Morales le envía su resumen clínico:\n\n*Tratamiento:*\n${medsText}\n\n*Folio:* ${data.folio}\n*Próxima Cita:* ${data.apptDate || 'Pendiente'}`;
    const url = `https://wa.me/52${data.patient.phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  if (isLocked) return <PasswordGate onUnlock={() => setIsLocked(false)} />;

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8">
      {/* Screen Only UI */}
      <div className="w-full max-w-4xl space-y-8 no-print pb-24">
        {/* Header */}
        <header className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-200">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold text-slate-800 font-serif-header">{DOCTOR_INFO.name}</h1>
            <p className="text-blue-600 font-semibold">{DOCTOR_INFO.specialty}</p>
            <p className="text-xs text-slate-400 mt-1">{DOCTOR_INFO.credentials}</p>
          </div>
          <div className="md:ml-auto bg-slate-50 px-4 py-2 rounded-xl text-xs font-mono text-slate-500 border border-slate-200">
            {data.folio}
          </div>
        </header>

        {/* Patient Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800">Datos del Paciente</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nombre Completo</label>
              <input 
                value={data.patient.name} 
                onChange={e => updatePatient('name', e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Teléfono</label>
              <input 
                value={data.patient.phone} 
                onChange={e => updatePatient('phone', e.target.value)}
                placeholder="10 dígitos"
                maxLength={10}
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">F. Nacimiento</label>
              <input 
                type="date"
                value={data.patient.dob} 
                onChange={e => updatePatient('dob', e.target.value)}
                className="w-full bg-slate-50 border-none rounded-xl p-3 focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
             {/* Signos Vitales */}
             {[
               { label: 'TA Sis', field: 'ta_sis', unit: 'mmHg', icon: Activity },
               { label: 'TA Dia', field: 'ta_dia', unit: 'mmHg', icon: Activity },
               { label: 'FC', field: 'fc', unit: 'lpm', icon: Heart },
               { label: 'Temp', field: 'temp', unit: '°C', icon: Zap },
               { label: 'Glucosa', field: 'glucose', unit: 'mg/dL', icon: Zap },
               { label: 'Peso', field: 'weight', unit: 'kg', icon: User },
               { label: 'Altura', field: 'height', unit: 'm', icon: User },
             ].map((v, i) => (
               <div key={i} className="space-y-1">
                 <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center space-x-1">
                   <v.icon className="w-3 h-3" />
                   <span>{v.label}</span>
                 </label>
                 <div className="relative">
                   <input 
                    value={data.patient[v.field as keyof Patient]} 
                    onChange={e => updatePatient(v.field as keyof Patient, e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-lg p-2 pr-10 text-sm font-bold"
                   />
                   <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-medium">{v.unit}</span>
                 </div>
               </div>
             ))}
             <div className="space-y-1 bg-blue-50 p-2 rounded-xl">
               <label className="text-[10px] font-bold text-blue-400 uppercase">IMC</label>
               <div className="font-black text-blue-700 text-lg">{data.patient.imc || '0.0'}</div>
               <div className="text-[10px] text-blue-600 font-medium leading-tight">{data.patient.imc_class}</div>
             </div>
          </div>
        </section>

        {/* Subjetivo Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-bold text-slate-800">S: Subjetivo (Notas)</h2>
            </div>
            <button 
              onClick={handleAISuggestions}
              disabled={isAnalyzing}
              className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-xs font-bold hover:bg-purple-200 transition-all flex items-center space-x-1 disabled:opacity-50"
            >
              <Zap className="w-3 h-3" />
              <span>{isAnalyzing ? 'Analizando...' : 'Sugerir Dx con IA'}</span>
            </button>
          </div>
          <textarea 
            value={data.subjetivo}
            onChange={e => setData(prev => ({ ...prev, subjetivo: e.target.value }))}
            placeholder="Motivo de consulta, síntomas actuales, antecedentes..."
            className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-purple-500"
          />
        </section>

        {/* Diagnosis Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-bold text-slate-800">Diagnósticos (CIE-10)</h2>
          </div>
          <Autocomplete 
            options={MOCK_CIE10}
            value=""
            onChange={() => {}}
            onSelect={(val) => {
              const current = data.diagnoses ? data.diagnoses + '\n' : '';
              setData(prev => ({ ...prev, diagnoses: current + val }));
            }}
            placeholder="Buscar en catálogo CIE-10..."
            className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm mb-4"
          />
          <textarea 
            value={data.diagnoses}
            onChange={e => setData(prev => ({ ...prev, diagnoses: e.target.value }))}
            placeholder="Diagnósticos finales..."
            className="w-full h-20 bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-500"
          />
        </section>

        {/* Treatment Section */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-bold text-slate-800">Tratamiento</h2>
            </div>
            <button 
              onClick={addMed}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center space-x-1"
            >
              <Plus className="w-3 h-3" />
              <span>Añadir Fármaco</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.meds.map((med, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-4 space-y-4 relative group">
                <button 
                  onClick={() => removeMed(idx)}
                  className="absolute -top-2 -right-2 bg-red-100 text-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre Genérico</label>
                    <Autocomplete 
                      options={MOCK_MEDS.map(m => m.name)}
                      value={med.name}
                      onChange={(v) => updateMed(idx, 'name', v)}
                      onSelect={(v) => {
                        const m = MOCK_MEDS.find(item => item.name === v);
                        if (m) {
                          updateMed(idx, 'name', m.name);
                          if (m.commercial) updateMed(idx, 'trade', m.commercial);
                          if (m.quantity) updateMed(idx, 'quantity', m.quantity);
                          if (m.frequency) updateMed(idx, 'frequency', m.frequency);
                          if (m.duration) updateMed(idx, 'duration', m.duration);
                          if (m.instructions) updateMed(idx, 'instructions', m.instructions);
                        }
                      }}
                      className="w-full bg-white border-none rounded-lg p-2 text-sm font-bold"
                      placeholder="Ej. Paracetamol 500 mg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nombre Comercial (Opcional)</label>
                    <input 
                      value={med.trade} 
                      onChange={e => updateMed(idx, 'trade', e.target.value)}
                      className="w-full bg-white border-none rounded-lg p-2 text-sm"
                      placeholder="Ej. Tempra"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { l: 'Cantidad', f: 'quantity', p: '1 tableta' },
                    { l: 'Frecuencia', f: 'frequency', p: 'cada 8 h' },
                    { l: 'Duración', f: 'duration', p: '3 días' },
                    { l: 'Instrucciones', f: 'instructions', p: 'Después de comida' },
                  ].map((field, fi) => (
                    <div key={fi} className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">{field.l}</label>
                      <input 
                        value={med[field.f as keyof Medication]} 
                        onChange={e => updateMed(idx, field.f as keyof Medication, e.target.value)}
                        className="w-full bg-white border-none rounded-lg p-2 text-[11px] font-medium"
                        placeholder={field.p}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Exams & Appointments Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <span>Exámenes / Indicaciones</span>
              </h2>
              <Autocomplete 
                options={MOCK_EXAMS}
                value=""
                onChange={() => {}}
                onSelect={(val) => {
                  const current = data.exams ? data.exams + '\n' : '';
                  setData(prev => ({ ...prev, exams: current + val }));
                }}
                placeholder="Buscar estudios comunes..."
                className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm mb-4"
              />
              <textarea 
                value={data.exams}
                onChange={e => setData(prev => ({ ...prev, exams: e.target.value }))}
                className="w-full h-32 bg-slate-50 border-none rounded-2xl p-4 text-sm"
              />
           </div>
           <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-orange-500" />
                <span>Próxima Cita</span>
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={data.apptDate} onChange={e => setData(prev => ({ ...prev, apptDate: e.target.value }))} className="bg-slate-50 border-none rounded-xl p-3 text-sm" />
                  <input type="time" value={data.apptTime} onChange={e => setData(prev => ({ ...prev, apptTime: e.target.value }))} className="bg-slate-50 border-none rounded-xl p-3 text-sm" />
                </div>
                <textarea 
                  value={data.apptNotes}
                  onChange={e => setData(prev => ({ ...prev, apptNotes: e.target.value }))}
                  placeholder="Recordatorio para la cita..."
                  className="w-full h-24 bg-slate-50 border-none rounded-2xl p-4 text-sm"
                />
              </div>
           </div>
        </section>
      </div>

      {/* Persistent Call-to-Action / FAB Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md rounded-2xl p-2 shadow-2xl border border-slate-200 flex items-center space-x-2 z-50 no-print">
        <button 
          onClick={() => {
            alert("Receta guardada localmente.");
            localStorage.setItem('last_consultation', JSON.stringify(data));
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-all font-bold text-sm"
        >
          <Save className="w-4 h-4" />
          <span className="hidden md:inline">Guardar</span>
        </button>
        <button 
          onClick={handlePrint}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold text-sm shadow-lg shadow-blue-200"
        >
          <Printer className="w-4 h-4" />
          <span className="hidden md:inline">Imprimir</span>
        </button>
        <div className="w-px h-6 bg-slate-200"></div>
        <button 
          onClick={handleWhatsApp}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold text-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden md:inline">WhatsApp</span>
        </button>
      </div>

      {/* Print View */}
      <PrintRecipe data={data} />
    </div>
  );
};

export default App;
