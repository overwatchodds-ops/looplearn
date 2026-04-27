import { useState, useEffect, useRef } from 'react';
import { loadState, saveState, uid, lessonLabel } from './state';
import { DEFAULT_DIRECTION, DEFAULT_FORMATS } from './constants';

export function useAppState() {
  const [S, setS] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    const s = loadState();
    ref.current = s;
    setS(s);
    setLoaded(true);
  }, []);

  // Core updater — always synchronous via ref
  const commit = (newS) => {
    ref.current = newS;
    setS({ ...newS });
    saveState(newS);
  };

  const go = (screen, opts = {}) => {
    const cur = ref.current;
    commit({ ...cur, ui: { ...cur.ui, screen, ...opts } });
  };

  const addLearner = (name) => {
    const cur = ref.current;
    const learner = { id: uid(), name: name.trim(), created_at: Date.now() };
    commit({
      ...cur,
      learners: [...cur.learners, learner],
      ui: { ...cur.ui, screen: 'learner', learnerId: learner.id, lessonId: null, generatorMode: null, generatorBaseLessonId: null }
    });
  };

  const startLesson = (subject, theme) => {
    const cur = ref.current;
    const lesson = {
      id: uid(),
      learner_id: cur.ui.learnerId,
      title: '',
      content: '',
      comments: [],
      subject: subject || '',
      theme: theme || '',
      after_direction: { ...DEFAULT_DIRECTION },
      after_formats: [...DEFAULT_FORMATS],
      created_at: Date.now(),
      updated_at: Date.now()
    };
    commit({
      ...cur,
      lessons: [...cur.lessons, lesson],
      ui: { ...cur.ui, screen: 'lesson', lessonId: lesson.id }
    });
  };

  const autosave = (lessonId, field, value) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId ? { ...l, [field]: value, updated_at: Date.now() } : l
    );
    const newS = { ...cur, lessons };
    ref.current = newS;
    setS({ ...newS });
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(newS), 500);
  };

  const addComment = (lessonId, text, type) => {
    const cur = ref.current;
    const comment = { id: uid(), text, type, created_at: Date.now() };
    const lessons = cur.lessons.map(l =>
      l.id === lessonId ? { ...l, comments: [...(l.comments || []), comment] } : l
    );
    commit({ ...cur, lessons });
  };

  const deleteComment = (lessonId, commentId) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId ? { ...l, comments: l.comments.filter(c => c.id !== commentId) } : l
    );
    commit({ ...cur, lessons });
  };

  const updateAfterDial = (lessonId, key, value) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId
        ? { ...l, after_direction: { ...(l.after_direction || DEFAULT_DIRECTION), [key]: parseInt(value) } }
        : l
    );
    commit({ ...cur, lessons });
  };

  const updateAfterFmt = (lessonId, key, checked) => {
    const cur = ref.current;
    const lesson = cur.lessons.find(l => l.id === lessonId);
    const current = lesson?.after_formats || [...DEFAULT_FORMATS];
    const fmts = checked ? [...current.filter(k => k !== key), key] : current.filter(k => k !== key);
    const lessons = cur.lessons.map(l => l.id === lessonId ? { ...l, after_formats: fmts } : l);
    commit({ ...cur, lessons });
  };

  const setGeneratorMode = (mode) => {
    const cur = ref.current;
    commit({ ...cur, ui: { ...cur.ui, generatorMode: mode, generatorBaseLessonId: null } });
  };

  const setBaseLessonId = (id) => {
    const cur = ref.current;
    commit({ ...cur, ui: { ...cur.ui, generatorBaseLessonId: id } });
  };

  return {
    S, loaded,
    go, commit,
    addLearner, startLesson,
    autosave,
    addComment, deleteComment,
    updateAfterDial, updateAfterFmt,
    setGeneratorMode, setBaseLessonId,
  };
}
