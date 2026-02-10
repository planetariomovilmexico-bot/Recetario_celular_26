
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestDiagnosis(subjetivo: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como asistente médico, analiza las siguientes notas subjetivas de un paciente y sugiere los 3 diagnósticos CIE-10 más probables. Devuelve solo un arreglo JSON con los nombres/códigos.\n\nNotas: ${subjetivo}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function summarizeConsultation(consultation: any) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Genera un resumen clínico breve y profesional de la siguiente consulta para que el doctor lo revise:\n${JSON.stringify(consultation)}`,
    });
    return response.text;
  } catch (error) {
    return "Error al generar resumen.";
  }
}
