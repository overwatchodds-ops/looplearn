import { LS_KEY, DEFAULT_DIRECTION, DEFAULT_FORMATS } from './constants';

export const defaultState = () => ({
  learners: [],
  lessons: [],
  ui: {
    screen: 'dashboard',
    learnerId: null,
    lessonId: null,
    generatorMode: null,
    generatorBaseLessonId: null
  }
});

export function loadState() {
  if (typeof window === 'undefined') return defaultState();
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
    // Migrate from old keys
    const old = localStorage.getItem('ll_v2') || localStorage.getItem('ll_v1');
    if (old) {
      const d = JSON.parse(old);
      return {
        learners: d.children || d.learners || [],
        lessons: (d.lessons || d.sessions || []).map(l => ({
          ...l,
          learner_id: l.learner_id || l.child_id,
          comments: l.comments || [],
          after_direction: l.after_direction || l.next_direction || { ...DEFAULT_DIRECTION },
          after_formats: l.after_formats || l.question_formats || [...DEFAULT_FORMATS],
        })),
        ui: defaultState().ui
      };
    }
  } catch (e) {}
  return defaultState();
}

export function saveState(state) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}

// Helpers
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const fmt = ts => ts ? new Date(ts).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
export const fmtShort = ts => ts ? new Date(ts).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' }) : '';
export const initials = name => (name || '?').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
export const lessonLabel = l => l.title || (l.subject && l.theme ? `${l.subject} — ${l.theme}` : l.subject || 'Untitled lesson');
