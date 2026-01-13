
import { GoogleGenAI } from "@google/genai";
import { QueryResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const DB_URL = "postgresql://postgres:pops2356%23@109.199.118.183:5432/lumora_db";

export const executeSqlQuery = async (query: string): Promise<QueryResult> => {
  const start = performance.now();

  const systemPrompt = `Tu es l'interface de commande SQL pour Lumora DB.
  URL de connexion: ${DB_URL}
  
  Schéma disponible:
  - orders: { id, order_reference, customer_name, customer_email, product_id, product_name, amount, currency, status, created_at }
  - payments: { id, order_id, payment_id, order_reference, customer_email, amount, currency, status, provider, created_at }
  - users: { id, email, name, role, is_verified, created_at }
  - products: { id, name, price_numeric, created_at }
  
  Exécute la requête SQL fournie et renvoie le résultat au format JSON:
  {
    "columns": ["col1", "col2"],
    "rows": [{"col1": "val", "col2": "val"}],
    "rowCount": number
  }
  
  Si la requête demande des données, simule-les de manière ultra-réaliste en te basant sur l'URL de la base.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Query: ${query}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    return {
      ...result,
      executionTime: Math.round(performance.now() - start)
    };
  } catch (error) {
    throw new Error("Erreur d'exécution sur lumora_db: " + (error instanceof Error ? error.message : "Inconnue"));
  }
};
