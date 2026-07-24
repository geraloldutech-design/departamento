import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Gemini Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Health API
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', system: 'EMRICH GESTOR 2.0', timestamp: new Date().toISOString() });
});

// Gemini AI Assistant Endpoint
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { prompt, context, taskType } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'Chave GEMINI_API_KEY não configurada no servidor. Por favor configure nas definições do sistema.' 
      });
    }

    const ai = getGeminiClient();

    const systemInstruction = `
Você é o "Assistente IA EMRICH", o consultor inteligente de gestão operacional e inteligência da Empresa Municipal do Rio Chiveve (EMRICH) na Beira, Moçambique.
A sua missão é analisar dados de actividades operacionais, sectores (Jardinagem, Limpeza, Canalização, Electricidade, Segurança, Carpintaria, Construção, Serralharia), materiais em stock, viaturas, ferramentas e ocorrências.

Ao responder:
- Seja extremamente profissional, objetivo, estratégico e fundamentado em boas práticas de gestão municipal e engenharia de manutenção.
- Utilize português formal e corporativo (pt-MZ).
- Forneça resumos executivos, identificação clara de riscos/atrasos, priorização lógica de acções e recomendações práticas para a Direcção.
- Responda em formato markdown limpo e bem estruturado.
`;

    const userPrompt = `
Contexto dos dados operacionais da EMRICH:
${JSON.stringify(context || {}, null, 2)}

Tipo de Análise Solicitada: ${taskType || 'Análise Geral'}

Pergunta / Instrução do Utilizador:
${prompt}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2
      }
    });

    return res.json({
      text: response.text || 'Sem resposta do assistente.',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Error in /api/gemini/assistant:', error);
    return res.status(500).json({ 
      error: error.message || 'Erro ao processar consulta de Inteligência Artificial.' 
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EMRICH GESTOR 2.0 Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
