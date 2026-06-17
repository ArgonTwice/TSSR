// server.js — backend Claude API pour /api/auto-summarize
// Déployer sur Railway / Render / Vercel (pas GitHub Pages)
// npm install express @anthropic-ai/sdk cors

const express   = require('express');
const cors      = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app    = express();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

app.use(cors({ origin: process.env.FRONTEND_URL || 'https://argontwice.github.io' }));
app.use(express.json({ limit: '1mb' }));

app.post('/api/auto-summarize', async (req, res) => {
  const { content, sourceCount } = req.body;
  if (!content) return res.status(400).json({ error: 'content requis' });

  try {
    const msg = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 800,
      messages: [{
        role: 'user',
        content: `Tu es un expert pédagogique TSSR. Voici les notes et fichiers que ${sourceCount || '?'} collègue(s) ont importés pour ce cours.\n\nGénère un résumé collectif qui :\n1. Synthétise les points clés (5-8 bullets)\n2. Identifie les concepts importants\n3. Reste factuel et concis\n\nDONNÉES :\n${content}`,
      }],
    });

    const summary = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    res.json({ summary });
  } catch (err) {
    console.error('Claude API error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Backend TSSR sur :${PORT}`));
