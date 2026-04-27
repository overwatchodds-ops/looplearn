export const SUBJECTS = ['', 'English', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Social Studies', 'Art', 'Music', 'Physical Education',
  'Languages', 'Computing', 'Life Skills', 'Communication', 'Other / Custom'
].map(s => ({ key: s, label: s || 'Select subject…' }));

export const DIRECTION_DIALS = [
  { key: 'difficulty', label: 'Difficulty',    low: 'Simplify',        high: 'Increase difficulty' },
  { key: 'repetition', label: 'Repetition',    low: 'Less repetition', high: 'More repetition' },
  { key: 'scope',      label: 'Topic scope',   low: 'Narrow focus',    high: 'Broaden to new aspects' },
  { key: 'examples',   label: 'Examples',      low: 'Fewer examples',  high: 'More examples' },
  { key: 'length',     label: 'Lesson length', low: 'Shorten lesson',  high: 'Extend lesson' },
];

export const QUESTION_FORMATS = [
  { key: 'short_answer',      label: 'Short answer',          example: '1–2 sentence response' },
  { key: 'multiple_choice',   label: 'Multiple choice',       example: 'A / B / C / D options' },
  { key: 'long_answer',       label: 'Long answer',           example: 'Extended written response' },
  { key: 'true_false',        label: 'True / False',          example: 'Statement to agree or disagree' },
  { key: 'fill_blank',        label: 'Fill in the blank',     example: 'Complete the sentence' },
  { key: 'matching',          label: 'Matching',              example: 'Match items in two columns' },
  { key: 'sequencing',        label: 'Sequencing / ordering', example: 'Put events in the right order' },
  { key: 'diagram_labelling', label: 'Diagram labelling',     example: 'Label parts of an image or chart' },
];

export const COMMENT_TYPES = [
  { key: 'engagement',    label: 'Engagement' },
  { key: 'behaviour',     label: 'Behaviour' },
  { key: 'emotion',       label: 'Emotion' },
  { key: 'reinforcement', label: 'Reinforcement' },
  { key: 'observation',   label: 'Observation' },
];

export const DEFAULT_DIRECTION = { difficulty: 50, repetition: 50, scope: 50, examples: 50, length: 50 };
export const DEFAULT_FORMATS = ['short_answer'];
export const COPY_START = '▼ ▼ ▼ COPY FROM HERE ▼ ▼ ▼';
export const COPY_END   = '▲ ▲ ▲ COPY ENDS HERE ▲ ▲ ▲';
export const LS_KEY = 'll_v3';
