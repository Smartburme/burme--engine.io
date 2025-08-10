import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static('public'));

// List of answer files relative to project root
const answerFiles = [
  './answer/hello-ans.js',
  './answer/sad-ans.js',
  './answer/happy-ans.js',
];

let combinedAnswers = null;

/**
 * Dynamic import and combine all answer modules into one object
 */
async function loadAllAnswers() {
  if (combinedAnswers) return combinedAnswers;

  combinedAnswers = {};

  for (const file of answerFiles) {
    const modulePath = path.resolve(file);
    const module = await import(modulePath);
    Object.assign(combinedAnswers, module.default);
  }

  return combinedAnswers;
}

app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Invalid question' });
    }

    const answers = await loadAllAnswers();
    const answer = answers[question] ?? null;

    return res.json({ answer });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Burme Engine server running at http://localhost:${PORT}`);
});
