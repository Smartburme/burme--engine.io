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

/**
 * Load knowledge markdown files into single string (cache)
 */
async function loadKnowledge() {
  if (knowledgeCache) return knowledgeCache;

  try {
    const contents = await Promise.all(
      knowledgeFiles.map(async (file) => {
        const filePath = path.resolve(file);
        return await fs.readFile(filePath, 'utf-8');
      })
    );
    knowledgeCache = contents.join('\n\n');
    console.info('Knowledge base loaded.');
    return knowledgeCache;
  } catch (error) {
    console.error('Failed to load knowledge files:', error);
    knowledgeCache = '';
    return knowledgeCache;
  }
}

/**
 * Load all answer modules, merge as one object (cache)
 */
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
    console.info('Answers loaded.');
    return answersCache;
  } catch (error) {
    console.error('Failed to load answer modules:', error);
    answersCache = {};
    return answersCache;
  }
}

/**
 * Generate answer from knowledge base by keyword search (simple)
 */
function generateFromKnowledge(question, knowledgeText) {
  const lowerQuestion = question.toLowerCase();
  const paragraphs = knowledgeText.split(/\n{2,}/);

  for (const para of paragraphs) {
    if (para.toLowerCase().includes(lowerQuestion)) {
      return para.trim();
    }
  }

  return null;
}

/**
 * Standard API response format
 */
function apiResponse({ status = 'success', message = '', data = null }) {
  return { status, message, data };
}

app.post('/api/query', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string' || question.trim() === '') {
      return res
        .status(400)
        .json(apiResponse({ status: 'error', message: 'Invalid or empty question parameter.' }));
    }

    const trimmedQuestion = question.trim();

    // Load caches
    const knowledgeText = await loadKnowledge();
    const answers = await loadAllAnswers();

    // "generate" keyword detected → use knowledge base generate logic
    if (trimmedQuestion.toLowerCase().includes('generate')) {
      const generatedAnswer = generateFromKnowledge(trimmedQuestion, knowledgeText);
      if (generatedAnswer) {
        return res.json(
          apiResponse({
            status: 'success',
            message: 'Generated answer from knowledge base',
            data: { answer: generatedAnswer },
          })
        );
      } else {
        return res.json(
          apiResponse({
            status: 'fail',
            message: 'Could not generate an answer from knowledge base',
            data: null,
          })
        );
      }
    }

    // Try exact match answer modules
    const answer = answers[trimmedQuestion] ?? null;

    if (answer) {
      return res.json(
        apiResponse({
          status: 'success',
          message: 'Answer found in predefined answers',
          data: { answer },
        })
      );
    }

    // Fallback no answer found
    return res.json(
      apiResponse({
        status: 'fail',
        message: 'No answer found for the given question',
        data: null,
      })
    );
  } catch (error) {
    console.error('API error:', error);
    return res
      .status(500)
      .json(
        apiResponse({
          status: 'error',
          message: 'Internal server error',
          data: null,
        })
      );
  }
});

app.listen(PORT, () => {
  console.log(`Burme Engine server is running on http://localhost:${PORT}`);
});
