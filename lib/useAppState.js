/**
 * useAppState
 * 
 * Single source of truth for all app state.
 * Uses a ref to avoid stale closures in event handlers.
 * All mutations go through commit() or autosave().
 * 
 * State shape:
 *   learners: [{ id, name, created_at }]
 *   lessons:  [{ id, learner_id, subject, theme, title, content,
 *               comments, after_direction, after_formats,
 *               created_at, updated_at }]
 *   ui: { screen, learnerId, lessonId, generatorMode, generatorBaseLessonId }
 */

import { useState, useEffect, useRef } from 'react';
import { loadState, saveState, uid } from './state';
import { DEFAULT_DIRECTION, DEFAULT_FORMATS } from './constants';

export function useAppState() {
  const [S, setS] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef(null);       // always holds latest state — no stale closures
  const saveTimer = useRef(null); // debounce timer for autosave

  // Load from localStorage on mount
  useEffect(() => {
    const s = loadState();
    ref.current = s;
    setS(s);
    setLoaded(true);
  }, []);

  /**
   * commit — save state immediately to ref, React, and localStorage
   * Use for all mutations except lesson content typing
   */
  const commit = (newS) => {
    ref.current = newS;
    setS(newS);
    saveState(newS);
  };

  /**
   * go — navigate to a screen, optionally updating ui fields
   */
  const go = (screen, opts = {}) => {
    const cur = ref.current;
    commit({
      ...cur,
      ui: { ...cur.ui, screen, ...opts }
    });
  };

  /**
   * addLearner — create a new learner and navigate to their page
   */
  const addLearner = (name) => {
    const cur = ref.current;
    const learner = {
      id: uid(),
      name: name.trim(),
      created_at: Date.now()
    };
    commit({
      ...cur,
      learners: [...cur.learners, learner],
      ui: {
        ...cur.ui,
        screen: 'learner',
        learnerId: learner.id,
        lessonId: null,
        generatorMode: null,
        generatorBaseLessonId: null
      }
    });
  };

  /**
   * removeLearner — delete a learner and all their lessons
   */
  const removeLearner = (learnerId) => {
    const cur = ref.current;
    commit({
      ...cur,
      learners: cur.learners.filter(l => l.id !== learnerId),
      lessons: cur.lessons.filter(l => l.learner_id !== learnerId),
      ui: {
        ...cur.ui,
        screen: 'dashboard',
        learnerId: null,
        lessonId: null
      }
    });
  };

  /**
   * startLesson — create a new blank lesson and navigate to it
   */
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

  /**
   * updateLesson — update any fields on an existing lesson
   */
  const updateLesson = (lessonId, fields) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId
        ? { ...l, ...fields, updated_at: Date.now() }
        : l
    );
    commit({ ...cur, lessons });
  };

  /**
   * autosave — debounced save for lesson content typing
   * Updates ref and React immediately, saves to localStorage after 500ms
   */
  const autosave = (lessonId, field, value) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId
        ? { ...l, [field]: value, updated_at: Date.now() }
        : l
    );
    const newS = { ...cur, lessons };
    ref.current = newS;
    setS(newS);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState(ref.current); // use ref.current — gets latest at save time
    }, 500);
  };

  /**
   * addComment — add an observation comment to a lesson
   */
  const addComment = (lessonId, text, type) => {
    const cur = ref.current;
    const comment = { id: uid(), text, type, created_at: Date.now() };
    const lessons = cur.lessons.map(l =>
      l.id === lessonId
        ? { ...l, comments: [...(l.comments || []), comment] }
        : l
    );
    commit({ ...cur, lessons });
  };

  /**
   * deleteComment — remove a comment from a lesson
   */
  const deleteComment = (lessonId, commentId) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId
        ? { ...l, comments: (l.comments || []).filter(c => c.id !== commentId) }
        : l
    );
    commit({ ...cur, lessons });
  };

  /**
   * updateAfterDial — set a direction dial value on a completed lesson
   */
  const updateAfterDial = (lessonId, key, value) => {
    const cur = ref.current;
    const lessons = cur.lessons.map(l =>
      l.id === lessonId
        ? { ...l, after_direction: { ...(l.after_direction || DEFAULT_DIRECTION), [key]: parseInt(value) } }
        : l
    );
    commit({ ...cur, lessons });
  };

  /**
   * updateAfterFmt — toggle a question format on a completed lesson
   */
  const updateAfterFmt = (lessonId, key, checked) => {
    const cur = ref.current;
    const lesson = cur.lessons.find(l => l.id === lessonId);
    const existing = lesson?.after_formats || [...DEFAULT_FORMATS];
    const updated = checked
      ? [...existing.filter(k => k !== key), key]
      : existing.filter(k => k !== key);
    const lessons = cur.lessons.map(l =>
      l.id === lessonId ? { ...l, after_formats: updated } : l
    );
    commit({ ...cur, lessons });
  };

  /**
   * removeLesson — delete a single lesson and navigate back to the learner page
   */
  const removeLesson = (lessonId) => {
    const cur = ref.current;
    const lesson = cur.lessons.find(l => l.id === lessonId);
    commit({
      ...cur,
      lessons: cur.lessons.filter(l => l.id !== lessonId),
      ui: {
        ...cur.ui,
        screen: 'learner',
        learnerId: lesson?.learner_id || cur.ui.learnerId,
        lessonId: null
      }
    });
  };

  /**
   * renameLearner — update a learner's name
   */
  const renameLearner = (learnerId, name) => {
    const cur = ref.current;
    const learners = cur.learners.map(l =>
      l.id === learnerId ? { ...l, name: name.trim() } : l
    );
    commit({ ...cur, learners });
  };

  /**
   * setGeneratorMode — switch between fresh/continue in the generator
   */
  const setGeneratorMode = (mode) => {
    const cur = ref.current;
    commit({ ...cur, ui: { ...cur.ui, generatorMode: mode } });
  };

  /**
   * setBaseLessonId — pick which lesson to continue from
   */
  const setBaseLessonId = (id) => {
    const cur = ref.current;
    commit({ ...cur, ui: { ...cur.ui, generatorBaseLessonId: id } });
  };

  return {
    S,
    loaded,
    go,
    addLearner,
    removeLearner,
    startLesson,
    updateLesson,
    autosave,
    addComment,
    deleteComment,
    updateAfterDial,
    updateAfterFmt,
    setGeneratorMode,
    setBaseLessonId,
    removeLesson,
    renameLearner,
  };
}
