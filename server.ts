import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Server-side Gemini initialization
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hospital: 'CareOne Multispecialty Hospital',
    system: 'CareOS Hospital Intelligence',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Gemini-backed Orchestration Reasoning & Analysis
app.post('/api/ai/orchestrate', async (req, res) => {
  try {
    const { prompt, patientId, hospitalContext, previousContext } = req.body;
    if (!ai) {
      return res.status(200).json({
        fallback: true,
        message: 'No server-side GEMINI_API_KEY configured. Using deterministic orchestrator.',
      });
    }

    const systemInstruction = `You are the CareOS Hospital Intelligence Orchestrator at CareOne Multispecialty Hospital (Visakhapatnam, Andhra Pradesh, 300 beds).
You coordinate specialized agents (Journey, Doctor, Nursing, Laboratory, Radiology, Pharmacy, Billing, Insurance, Bed, Admission, Discharge, Bottleneck, Resource, Operations, Finance).
You receive real synthetic hospital data. Keep hospital state and workflow strictly grounded in the provided context. Never invent patients, bills, or medical facts.
Provide an executive, clinical-grade operational synthesis:
1. Executive summary of the situation
2. Root-cause correlation across departments
3. Recommended administrative next steps (with approval options)
4. Confidence level and verification status.`;

    const userMessage = `Request: "${prompt}"
Context:
- Patient ID: ${patientId || 'None'}
- Previous conversation context: ${previousContext || 'None'}
- Hospital Operational State: ${JSON.stringify(hospitalContext || {})}

Analyze the situation and provide structured insight for the hospital administrator.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userMessage,
      config: {
        systemInstruction,
        temperature: 0.2,
      },
    });

    return res.json({
      fallback: false,
      text: response.text,
      modelUsed: 'gemini-3.8-flash',
    });
  } catch (error: any) {
    console.error('Gemini Orchestration error:', error);
    return res.status(200).json({
      fallback: true,
      error: error?.message || 'Error executing AI model',
    });
  }
});

// Gemini-backed Audio Transcription (gemini-3.5-transcribe)
app.post('/api/ai/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType } = req.body;
    if (!ai || !audioData) {
      return res.status(200).json({
        fallback: true,
        message: 'Gemini transcription unavailable or audio empty.',
      });
    }

    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          {
            text: 'Transcribe this voice audio accurately. This is a command or inquiry from a hospital administrator to CareOS.',
          },
        ],
      },
    });

    return res.json({
      transcript: response.text?.trim() || '',
      modelUsed: 'gemini-3.5-transcribe',
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return res.status(200).json({
      fallback: true,
      error: error?.message || 'Transcription failed',
    });
  }
});

// Setup Vite middlewares in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareOS Command Center server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
