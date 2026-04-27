import { DIRECTION_DIALS, QUESTION_FORMATS, DEFAULT_DIRECTION, DEFAULT_FORMATS, COPY_START, COPY_END } from './constants';

export function buildPrompt({ name, mode, subject, theme, context, baseLesson, direction, formats, teacherNotes }) {
  const fmtLines = QUESTION_FORMATS
    .filter(f => (formats || DEFAULT_FORMATS).includes(f.key))
    .map(f => `• ${f.label}`).join('\n');

  const dialLines = DIRECTION_DIALS.map(d => {
    const v = (direction || DEFAULT_DIRECTION)[d.key] ?? 50;
    const atCentre = v > 35 && v < 65;
    return `• ${d.label}: ${atCentre ? 'Keep same' : v <= 35 ? d.low : d.high}`;
  }).join('\n');

  const signals = `SIGNALS:
${dialLines}
• Question formats: ${(formats || DEFAULT_FORMATS).map(k => QUESTION_FORMATS.find(f => f.key === k)?.label || k).join(', ')}${teacherNotes ? `\n• Teacher notes: ${teacherNotes}` : ''}`;

  const instruction = `You are a teacher. Use all the information below to create a new lesson for ${name}.
The output must be the lesson ONLY — nothing else. No analysis, no commentary, no delivery notes, no instructions. Just the lesson between the markers.

${COPY_START}
[lesson content here — questions and ${name} writes here: spaces]
${COPY_END}`;

  const responseSpace = `   ${name} writes here:`;

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
  if (start !== -1 && end !== -1) {
    return text.slice(start + COPY_START.length, end).trim();
  }
  return text;
}
