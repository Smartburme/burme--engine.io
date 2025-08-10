import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static('public'));

const knowledgeFiles = [
  './knowledge/text-knowledge.md',
  './knowledge/image-knowledge.md',
  './knowledge/coder-knowledge.md',
];

const answerFiles = [
  './answer/hello-ans.js',
  './answer/sad-ans.js',
  './answer/happy-ans.js',
];

let knowledgeCache = null;
let answersCache = null;

// Load knowledge markdown files into one big string
async function loadKnowledge() {
  if (knowledgeCache) return knowledgeCache;

  try {
    const contents = await Promise.all(
      knowledgeFiles.map(async (file) => {
        const filePath = path.resolve(file);
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
      })
    );
    knowledgeCache = contents.join('\n\n');
    console.log('Knowledge base loaded.');
    return knowledgeCache;
  } catch (error) {
    console.error('Failed to load knowledge files:', error);
    knowledgeCache = '';
    return knowledgeCache;
  }
}

// Load and merge answer modules
async function loadAllAnswers() {
  if (answersCache) return answersCache;

  answersCache = {};

  try {
    for (const file of answerFiles) {
      const modulePath = path.resolve(file);
      const module = await import(`file://${modulePath}`);
      if (module?.default && typeof module.default === 'object') {
        Object.assign(answersCache, module.default);
      }
    }
    console.log('Answers loaded.');
    return answersCache;
  } catch (error) {
    console.error('Failed to load answer modules:', error);
    answersCache = {};
    return answersCache;
  }
}

// Simple keyword search on knowledge base
function generateFromKnowledge(question, knowledgeText) {
  // Example: အကြောင်းအရာ knowledgeText ထဲမှာ question မှာ ပါတဲ့ keywords ရှာပြီး
  // မရှိရင် fallback ပြန်ပေးမယ်

  const lowerQuestion = question.toLowerCase();
  const foundSentences = [];

  // knowledgeText ကို အကြောင်းအရာအလိုက် စာပိုဒ်ခွဲပြီး ရှာဖွေမယ်
  const paragraphs = knowledgeText.split(/\n{2,}/);

  for (const para of paragraphs) {
    if (para.toLowerCase().includes(lowerQuestion)) {
      foundSentences.push(para.trim());
    }
  }

  if (foundSentences.length > 0) {
    // စာပိုဒ်တွေထဲက ပထမဆုံးကို ပြန်ပေးမယ်
    return foundSentences[0];
  }

  return null;
}

app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Invalid question parameter' });
    }

    // Load caches
    const knowledgeText = await loadKnowledge();
    const answers = await loadAllAnswers();

    const trimmedQuestion = question.trim();

    // "generate" keyword ပါရင် knowledge ကနေ generate logic သုံးမယ်
    if (trimmedQuestion.toLowerCase().includes('generate')) {
      const generatedAnswer = generateFromKnowledge(trimmedQuestion, knowledgeText);
      if (generatedAnswer) {
        return res.json({ answer: generatedAnswer });
      }
      return res.json({ answer: 'Sorry, I could not generate an answer from knowledge base.' });
    }

    // မဟုတ်ရင် answer modules မှာ ရှာမယ် (exact match)
    const answer = answers[trimmedQuestion] ?? null;

    if (answer) {
      return res.json({ answer });
    }

    // မတွေ့ရင် fallback
    return res.json({ answer: 'Sorry, I do not have an answer for that question yet.' });
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Burme Engine server is running on http://localhost:${PORT}`);
});
