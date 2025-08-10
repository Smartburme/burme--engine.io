// server.js
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static('public'));

let knowledgeCache = null;

/**
 * Load and cache knowledge data from Markdown file
 */
async function loadKnowledge() {
  if (knowledgeCache) return knowledgeCache;

  const mdFilePath = path.resolve('./knowledge/sources.md');
  const mdContent = await fs.readFile(mdFilePath, 'utf-8');

  // TODO: Expand with real embedding or processing here
  knowledgeCache = { sources: mdContent };
  return knowledgeCache;
}

/**
 * Load static answers from answers.js dynamically
 */
async function loadAnswers() {
  const { default: answers } = await import('./answers.js');
  return answers;
}

app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Invalid question' });
    }

    await loadKnowledge(); // For future use or embedding cache

    const answers = await loadAnswers();
    const answer = answers[question] ?? null;

    return res.json({ answer });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Burme Engine server running at http://localhost:${PORT}`);
});
