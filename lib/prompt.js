import { DIRECTION_DIALS, QUESTION_FORMATS, DEFAULT_DIRECTION, DEFAULT_FORMATS, COPY_START, COPY_END } from './constants';

export function buildPrompt({ name, mode, subject, theme, context, baseLesson, direction, formats, teacherNotes }) {
  const fmtLines = QUESTION_FORMATS
    .filter(f => (formats || DEFAULT_FORMATS).includes(f.key))
    .map(f => `• ${f.label}`).join('\n');

  const dialLines = DIRECTION_DIALS.map(d => {
    const v = (direction || DEFAULT_DIRECTION)[d.key] ?? 50;
    let signal;
    if (v <= 20)       signal = `${d.veryLow  || 'Much ' + d.low.toLowerCase()}`;
    else if (v <= 35)  signal = `${d.low}`;
    else if (v < 65)   signal = 'Keep same';
    else if (v <= 80)  signal = `${d.high}`;
    else               signal = `${d.veryHigh || 'Much ' + d.high.toLowerCase()}`;
    return `• ${d.label}: ${signal}`;
  }).join('\n');

  const signals = `SIGNALS:
${dialLines}
• Question formats: ${(formats || DEFAULT_FORMATS).map(k => QUESTION_FORMATS.find(f => f.key === k)?.label || k).join(', ')}${teacherNotes ? `\n• Teacher notes: ${teacherNotes}` : ''}`;

  const instruction = `You are a teacher. Use all the information below to create a new lesson for ${name}.
The output must be the lesson ONLY — nothing else. No analysis, no commentary, no delivery notes, no instructions. Just the lesson between the markers.
If a concept benefits from a visual (e.g. a triangle, number line, table, or diagram), use simple ASCII/text-based art to illustrate it. Do not reference external images.
Write any tables or grids as plain text — do not use markdown code fences or backticks around them.

${COPY_START}
[lesson content here — questions and ${name} writes here: spaces]
${COPY_END}`;

  const responseSpace = `   ${name} writes here: (leave a blank line — no underscores or lines, this is digital not print)`;

  if (mode === 'fresh') {
    return `${instruction}

LEARNER: ${name}
SUBJECT: ${subject || 'Not specified'}
THEME: ${theme || 'Not specified'}
${context ? `LEARNER CONTEXT:\n${context}\n` : ''}
This is the first lesson — start from the beginning. Keep it simple and confidence-building.
COLD START: max 2-3 concepts, heavy scaffolding, at least 1 guaranteed success question early.

${signals}

After every question include:
${responseSpace}`;
  }

  const comments = (baseLesson?.comments || []).map(c => `• [${c.type}] ${c.text}`).join('\n') || 'None';

  return `${instruction}

LEARNER: ${name}
SUBJECT: ${subject || baseLesson?.subject || 'Not specified'}
THEME: ${theme || baseLesson?.theme || 'Not specified'}

PREVIOUS LESSON & ${name.toUpperCase()}'S RESPONSES:
────────────────────────────────────────
${baseLesson?.content || 'No content recorded'}
────────────────────────────────────────

${signals}
• Observation comments:
${comments}

After every question include:
${responseSpace}`;
}

export function cleanPaste(text, COPY_START, COPY_END) {
  const start = text.indexOf(COPY_START);
  const end = text.indexOf(COPY_END);
  let content = (start !== -1 && end !== -1)
    ? text.slice(start + COPY_START.length, end).trim()
    : text;
  // Strip markdown code fences (``` with optional language tag)
  content = content.replace(/^```[a-z]*\n?/gm, '').replace(/^```$/gm, '');
  return content.trim();
}
