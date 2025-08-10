// server.js
import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());
app.use(express.static('public'));

// Knowledge Markdown ဖိုင်များ (relative path)
const knowledgeFiles = [
  './knowledge/text-knowledge.md',
  './knowledge/image-knowledge.md',
  './knowledge/coder-knowledge.md',
];

// Answers JS module ဖိုင်များ (relative path)
const answerFiles = [
  './answer/hello-ans.js',
  './answer/sad-ans.js',
  './answer/happy-ans.js',
];

let knowledgeCache = null;
let answersCache = null;

/**
 * Load and cache knowledge content from multiple markdown files
 * @returns {Promise<{sources: string}>}
 */
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
    knowledgeCache = { sources: contents.join('\n\n') };
    console.log('Knowledge base loaded.');
    return knowledgeCache;
  } catch (error) {
    console.error('Failed to load knowledge files:', error);
    knowledgeCache = { sources: '' };
    return knowledgeCache;
  }
}

/**
 * Dynamically import and merge answer modules into one object
 * @returns {Promise<Object>}
 */
async function loadAllAnswers() {
  if (answersCache) return answersCache;

  answersCache = {};

  try {
    for (const file of answerFiles) {
      const modulePath = path.resolve(file);
      const module = await import(modulePath);
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

app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res.status(400).json({ error: 'Invalid question parameter' });
    }

    // Load knowledge base (currently not used for searching, but ready for expansion)
    await loadKnowledge();

    // Load answers
    const answers = await loadAllAnswers();

    // Find answer for exact match question
    const answer = answers[question.trim()] ?? null;

    if (answer) {
      return res.json({ answer });
    } else {
      return res.json({ answer: 'Sorry, I do not have an answer for that question yet.' });
    }
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Burme Engine server is running on http://localhost:${PORT}`);
});
