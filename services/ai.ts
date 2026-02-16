import { GoogleGenAI } from "@google/genai";
import { Sale } from "../types";

export const aiService = {
  analyzeSales: async (sales: Sale[]) => {
    try {
      // Verifica se a API KEY existe no ambiente
      const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
      
      if (!apiKey) {
        console.warn("AI Service: API_KEY não encontrada.");
        return "A análise automática requer uma chave de API configurada.";
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const salesSummary = sales.map(s => ({
        projeto: s.project,
        valor: s.saleValue,
        cargo: s.role,
        data: s.saleDate,
        status: s.commissionEntries.every(e => e.status === 'cancelled') ? 'Cancelado' : 'Ativo'
      }));

      const prompt = `Analise estes dados de vendas de multipropriedade imobiliária e forneça 3 insights estratégicos curtos e diretos (máximo 2 parágrafos por insight). 
      Dados: ${JSON.stringify(salesSummary)}
      
      Foque em:
      1. Performance de projetos (qual vende mais e é mais lucrativo).
      2. Produtividade por cargo (FTB vs Liner vs Closer).
      3. Risco de cancelamento e saúde financeira.
      
      Responda em Português do Brasil com tom profissional e executivo. Use Markdown para formatação.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      return response.text;
    } catch (error) {
      console.error("Erro na análise de IA:", error);
      return "Não foi possível gerar a análise no momento. Tente novamente mais tarde.";
    }
  }
};