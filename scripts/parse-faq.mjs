import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const inputPath = join(__dirname, '../../uploads/faq-0.md'.replace('../../uploads', join(__dirname, '../../../.cursor/projects/c-Users-tyagi-Desktop-IIT-R-faq/uploads/faq-0.md')));

// Use the uploaded FAQ file
const faqPath = 'C:\\Users\\tyagi\\.cursor\\projects\\c-Users-tyagi-Desktop-IIT-R-faq\\uploads\\faq-0.md';
const content = readFileSync(faqPath, 'utf-8');

const lines = content.split('\n');
const startIdx = lines.findIndex((l) => l.includes('# Vicharanashala Internship — FAQ'));
const faqContent = lines.slice(startIdx >= 0 ? startIdx : 178).join('\n');

const categories = [];
let currentCategory = null;
let currentQuestion = null;

const categoryRegex = /^## (\d+)\\.?\s+(.+?)\s*§?\s*$/;
const questionRegex = /^(\d+\.\d+)\s+(.+?)\s*§?\s*$/;

const parts = faqContent.split('\n');

for (let i = 0; i < parts.length; i++) {
  const line = parts[i].trim();

  const catMatch = line.match(/^## (\d+)\\.?\s+(.+?)\s*§?\s*$/);
  if (catMatch) {
    if (currentQuestion && currentCategory) {
      currentCategory.questions.push(currentQuestion);
      currentQuestion = null;
    }
    if (currentCategory) categories.push(currentCategory);
    currentCategory = {
      id: catMatch[1],
      name: catMatch[2].replace(/\\/g, ''),
      slug: catMatch[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/\\/g, ''),
      questions: [],
    };
    continue;
  }

  const qMatch = line.match(/^(\d+\.\d+)\s+(.+?)\s*§?\s*$/);
  if (qMatch && currentCategory) {
    if (currentQuestion) {
      currentCategory.questions.push(currentQuestion);
    }
    currentQuestion = {
      id: `faq-${qMatch[1].replace('.', '-')}`,
      number: qMatch[1],
      question: qMatch[2].replace(/\\/g, ''),
      answer: '',
      categoryId: currentCategory.id,
      categoryName: currentCategory.name,
    };
    continue;
  }

  if (currentQuestion && line && line !== '---' && !line.startsWith('**Version:')) {
    const cleaned = line
      .replace(/\\\./g, '.')
      .replace(/\*\*/g, '')
      .replace(/^\*\s+/, '- ')
      .replace(/^-\s+\*\*/, '- **')
      .trim();
    if (cleaned) {
      currentQuestion.answer += (currentQuestion.answer ? '\n' : '') + cleaned;
    }
  }
}

if (currentQuestion && currentCategory) {
  currentCategory.questions.push(currentQuestion);
}
if (currentCategory) categories.push(currentCategory);

const allFaqs = categories.flatMap((c) => c.questions);
const output = {
  version: 'v24.4.0',
  lastUpdated: '2026-06-09',
  source: 'https://samagama.in/internship/faq',
  categories,
  faqs: allFaqs,
  totalCount: allFaqs.length,
};

const outPath = join(__dirname, '../src/data/faqs.json');
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Parsed ${allFaqs.length} FAQs across ${categories.length} categories`);
