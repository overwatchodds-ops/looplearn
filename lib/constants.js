export const SUBJECTS = ['', 'English', 'Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'Social Studies', 'Art', 'Music', 'Physical Education',
  'Languages', 'Computing', 'Life Skills', 'Communication', 'Other / Custom'
].map(s => ({ key: s, label: s || 'Select subject…' }));

export const DIRECTION_DIALS = [
  { key: 'difficulty', label: 'Difficulty',    low: 'Simplify',           veryLow:  'Significantly simplify — much easier concepts and vocabulary',       high: 'Increase difficulty',       veryHigh: 'Significantly increase difficulty — push hard with complex concepts and challenging questions' },
  { key: 'repetition', label: 'Repetition',    low: 'Less repetition',    veryLow:  'Minimal repetition — introduce new material, avoid revisiting',       high: 'More repetition',           veryHigh: 'Heavy repetition — revisit and drill key concepts multiple times across the lesson' },
  { key: 'scope',      label: 'Topic scope',   low: 'Narrow focus',       veryLow:  'Very narrow focus — one concept only, go deep not wide',              high: 'Broaden to new aspects',    veryHigh: 'Significantly broaden — introduce several new related aspects and connections' },
  { key: 'examples',   label: 'Examples',      low: 'Fewer examples',     veryLow:  'Minimal examples — lean on explanation and questions instead',         high: 'More examples',             veryHigh: 'Many examples — illustrate every concept with multiple worked examples' },
  { key: 'length',     label: 'Lesson length', low: 'Shorten lesson',     veryLow:  'Very short lesson — 3 to 4 questions maximum',                        high: 'Extend lesson',             veryHigh: 'Long lesson — comprehensive coverage with many questions across all formats' },
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
