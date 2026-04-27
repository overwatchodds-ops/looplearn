'use client';
import { useState, useEffect, useRef } from 'react';
import { loadState, saveState, defaultState, uid, fmt, fmtShort, initials, lessonLabel } from '../lib/state';
import { buildPrompt, cleanPaste } from '../lib/prompt';
import { SUBJECTS, DIRECTION_DIALS, QUESTION_FORMATS, COMMENT_TYPES, DEFAULT_DIRECTION, DEFAULT_FORMATS, COPY_START, COPY_END } from '../lib/constants';

export default function App() {
  const [S, setS] = useState(null);
  const [genState, setGenState] = useState({ direction: { ...DEFAULT_DIRECTION }, formats: [...DEFAULT_FORMATS] });
  const [commentType, setCommentType] = useState('observation');
  const [commentText, setCommentText] = useState('');
  const [addLearnerVisible, setAddLearnerVisible] = useState(false);
  const [newLearnerName, setNewLearnerName] = useState('');
  const [promptText, setPromptText] = useState('');
  const [promptReady, setPromptReady] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const saveTimer = useRef(null);
  const SRef = useRef(null);

  // Load state on mount
  useEffect(() => {
    const loaded = loadState();
    setS(loaded);
    SRef.current = loaded;
  }, []);

  // Keep SRef in sync
  useEffect(() => { 
    if (S) SRef.current = S; 
  }, [S]);

  if (!S) return null;

  // Persist state
  const update = (newS) => {
    setS(newS);
    saveState(newS);
  };

  const go = (screen, opts = {}) => {
    const newS = { ...S, ui: { ...S.ui, screen, ...opts } };
    setPromptReady(false);
    setPromptText('');
    update(newS);
  };

  // Helpers
  const getLearner = id => S.learners.find(l => l.id === id);
  const getLesson = id => S.lessons.find(l => l.id === id);
  const learnerLessons = lid => S.lessons.filter(l => l.learner_id === lid).sort((a, b) => b.created_at - a.created_at);

  const { screen, learnerId, lessonId, generatorMode, generatorBaseLessonId } = S.ui;
  const currentLearner = getLearner(learnerId);
  const currentLesson = getLesson(lessonId);
  const baseLesson = getLesson(generatorBaseLessonId);
  const lessons = learnerId ? learnerLessons(learnerId) : [];

  const autosave = (field, value) => {
    const current = SRef.current;
    if (!current.ui.lessonId) return;
    const lesson = current.lessons.find(l => l.id === current.ui.lessonId);
    if (!lesson) return;
    const updated = current.lessons.map(l => l.id === current.ui.lessonId ? { ...l, [field]: value, updated_at: Date.now() } : l);
    const newS = { ...current, lessons: updated };
    setS(newS);
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveState(newS);
      setSaveMsg('Saved');
      setTimeout(() => setSaveMsg(''), 1500);
    }, 400);
  };

  // Add learner
  const addLearner = () => {
    if (!newLearnerName.trim()) return;
    const learner = { id: uid(), name: newLearnerName.trim(), created_at: Date.now() };
    const newS = { ...S, learners: [...S.learners, learner] };
    update(newS);
    setNewLearnerName('');
    setAddLearnerVisible(false);
    go('learner', { learnerId: learner.id, generatorMode: null, generatorBaseLessonId: null });
  };

  // New lesson → go to generator
  const newLesson = () => {
    setGenState({ direction: { ...DEFAULT_DIRECTION }, formats: [...DEFAULT_FORMATS] });
    setPromptReady(false);
    go('generator', { learnerId, lessonId: null, generatorMode: null, generatorBaseLessonId: null });
  };

  // Generate prompt
  const generatePrompt = () => {
    const subjectEl = document.getElementById('gen-subject');
    const themeEl = document.getElementById('gen-theme');
    const contextEl = document.getElementById('gen-context');
    const notesEl = document.getElementById('gen-notes');
    const name = currentLearner?.name || 'the learner';

    const prompt = buildPrompt({
      name,
      mode: generatorMode,
      subject: subjectEl?.value || '',
      theme: themeEl?.value || '',
      context: contextEl?.value || '',
      teacherNotes: notesEl?.value || '',
      baseLesson,
      direction: genState.direction,
      formats: genState.formats,
    });

    setPromptText(prompt);
    setPromptReady(true);
    setTimeout(() => document.getElementById('prompt-ready-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // Copy prompt
  const copyPrompt = () => {
    const ta = document.getElementById('prompt-textarea');
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    if (ok) {
      const btn = document.getElementById('copy-btn');
      if (btn) { btn.textContent = '✓'; btn.style.background = 'var(--teal)'; }
      setTimeout(() => { if (btn) { btn.textContent = '📋'; btn.style.background = 'rgba(255,255,255,0.12)'; } }, 2000);
    }
  };

  // Start new lesson after generating
  const startLesson = () => {
    const subjectEl = document.getElementById('gen-subject');
    const themeEl = document.getElementById('gen-theme');
    const lesson = {
      id: uid(), learner_id: learnerId,
      title: '', content: '', comments: [],
      subject: subjectEl?.value || baseLesson?.subject || '',
      theme: themeEl?.value || baseLesson?.theme || '',
      after_direction: { ...DEFAULT_DIRECTION },
      after_formats: [...DEFAULT_FORMATS],
      created_at: Date.now(), updated_at: Date.now()
    };
    const newS = { ...S, lessons: [...S.lessons, lesson] };
    update(newS);
    go('lesson', { lessonId: lesson.id });
  };

  // Paste lesson
  const pasteLesson = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) { alert('Nothing on clipboard.'); return; }
      const cleaned = cleanPaste(text, COPY_START, COPY_END);
      autosave('content', cleaned);
      document.getElementById('lesson-textarea').value = cleaned;
    } catch (e) {
      alert('Click inside the lesson box and press Ctrl+V to paste manually.');
      document.getElementById('lesson-textarea')?.focus();
    }
  };

  // Add comment
  const addComment = () => {
    if (!commentText.trim() || !currentLesson) return;
    const comment = { id: uid(), text: commentText.trim(), type: commentType, created_at: Date.now() };
    const updated = S.lessons.map(l => l.id === lessonId ? { ...l, comments: [...(l.comments || []), comment] } : l);
    update({ ...S, lessons: updated });
    setCommentText('');
  };

  // Delete comment
  const deleteComment = (commentId) => {
    const updated = S.lessons.map(l => l.id === lessonId
      ? { ...l, comments: l.comments.filter(c => c.id !== commentId) }
      : l);
    update({ ...S, lessons: updated });
  };

  // After lesson dial
  const updateAfterDial = (key, value) => {
    const updated = S.lessons.map(l => l.id === lessonId
      ? { ...l, after_direction: { ...(l.after_direction || DEFAULT_DIRECTION), [key]: parseInt(value) } }
      : l);
    update({ ...S, lessons: updated });
  };

  // After lesson format
  const updateAfterFmt = (key, checked) => {
    const current = currentLesson?.after_formats || [...DEFAULT_FORMATS];
    const newFmts = checked ? [...current.filter(k => k !== key), key] : current.filter(k => k !== key);
    const updated = S.lessons.map(l => l.id === lessonId ? { ...l, after_formats: newFmts } : l);
    update({ ...S, lessons: updated });
  };

  // Pick base lesson
  const pickBaseLesson = (id) => {
    const lesson = getLesson(id);
    setGenState({
      direction: lesson?.after_direction ? { ...lesson.after_direction } : { ...DEFAULT_DIRECTION },
      formats: lesson?.after_formats ? [...lesson.after_formats] : [...DEFAULT_FORMATS]
    });
    // Pre-fill subject and theme
    setTimeout(() => {
      const subjectEl = document.getElementById('gen-subject');
      const themeEl = document.getElementById('gen-theme');
      if (subjectEl && lesson?.subject) subjectEl.value = lesson.subject;
      if (themeEl && lesson?.theme) themeEl.value = lesson.theme;
    }, 50);
    update({ ...S, ui: { ...S.ui, generatorBaseLessonId: id } });
  };

  const hasContent = !!(currentLesson?.content?.trim());

  // ─── RENDER ───
  return (
    <div className="app">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>LoopLearn</h1>
          <span>Learning loop system</span>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Learners</div>
          {S.learners.map(l => (
            <div key={l.id}
              className={`learner-btn ${learnerId === l.id && screen !== 'dashboard' ? 'active' : ''}`}
              onClick={() => { setGenState({ direction: { ...DEFAULT_DIRECTION }, formats: [...DEFAULT_FORMATS] }); go('learner', { learnerId: l.id, lessonId: null, generatorMode: null, generatorBaseLessonId: null }); }}>
              <div className="learner-avatar">{initials(l.name)}</div>
              <span>{l.name}</span>
            </div>
          ))}
          <div className="add-learner-wrap">
            {!addLearnerVisible
              ? <button className="add-learner-btn" onClick={() => setAddLearnerVisible(true)}>+ Add learner</button>
              : <div className="add-learner-input-wrap">
                  <input autoFocus type="text" value={newLearnerName} placeholder="Name, then press Enter…"
                    onChange={e => setNewLearnerName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addLearner(); if (e.key === 'Escape') { setAddLearnerVisible(false); setNewLearnerName(''); } }} />
                </div>
            }
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            {screen === 'dashboard' && 'Dashboard'}
            {screen === 'learner' && currentLearner?.name}
            {screen === 'generator' && `Lesson Generator — ${currentLearner?.name || ''}`}
            {screen === 'lesson' && (currentLesson ? lessonLabel(currentLesson) : 'Lesson')}
            {screen === 'after' && `After lesson — ${currentLesson ? lessonLabel(currentLesson) : ''}`}
          </div>
          <div className="topbar-actions">
            {screen === 'learner' && (
              <button className="btn btn-primary btn-sm" onClick={newLesson}>+ New lesson</button>
            )}
            {screen === 'generator' && (
              <button className="btn btn-sm" onClick={() => go('learner', { learnerId })}>← Back</button>
            )}
            {screen === 'lesson' && (<>
              <span style={{ fontSize: 12, color: 'var(--ink-light)', marginRight: 4 }}>{saveMsg}</span>
              <button className="btn btn-sm" onClick={() => go('learner', { learnerId: currentLesson?.learner_id })}>← Exit lesson</button>
            </>)}
            {screen === 'after' && (
              <button className="btn btn-primary btn-sm" onClick={() => go('learner', { learnerId: currentLesson?.learner_id })}>Complete &amp; exit</button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="content fade-in">

          {/* ── DASHBOARD ── */}
          {screen === 'dashboard' && (
            <div style={{ maxWidth: 900 }}>
              <p className="muted" style={{ marginBottom: 20 }}>Welcome to LoopLearn.</p>
              <div className="grid-3" style={{ marginBottom: 20 }}>
                <div className="stat-card"><div className="stat-value">{S.learners.length}</div><div className="stat-label">Learners</div></div>
                <div className="stat-card"><div className="stat-value">{S.lessons.length}</div><div className="stat-label">Lessons</div></div>
                <div className="stat-card"><div className="stat-value">{S.lessons.length ? fmtShort(Math.max(...S.lessons.map(l => l.updated_at))) : '—'}</div><div className="stat-label">Last activity</div></div>
              </div>
              {S.learners.length === 0
                ? <div className="card"><div className="empty"><div className="icon">◎</div><h3>Add your first learner</h3><p>Use "+ Add learner" in the sidebar</p></div></div>
                : <div className="grid-2">
                    <div className="card">
                      <div className="fw-500" style={{ marginBottom: 16 }}>Learners</div>
                      {S.learners.map(l => {
                        const ls = learnerLessons(l.id);
                        return (
                          <div key={l.id} className="lesson-card" onClick={() => go('learner', { learnerId: l.id })}>
                            <div className="flex-center gap-12">
                              <div className="learner-avatar" style={{ width: 36, height: 36, fontSize: 13, background: 'var(--cream)', color: 'var(--ink)' }}>{initials(l.name)}</div>
                              <div><div className="fw-500">{l.name}</div><div className="small muted">{ls.length === 0 ? 'No lessons yet' : `${ls.length} lesson${ls.length !== 1 ? 's' : ''}`}</div></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="card">
                      <div className="fw-500" style={{ marginBottom: 16 }}>Recent lessons</div>
                      {[...S.lessons].sort((a, b) => b.updated_at - a.updated_at).slice(0, 5).map(l => {
                        const learner = getLearner(l.learner_id);
                        return (
                          <div key={l.id} className="lesson-card" onClick={() => go('lesson', { lessonId: l.id, learnerId: l.learner_id })}>
                            <div className="fw-500 small">{lessonLabel(l)}</div>
                            <div className="small muted">{learner?.name} · {fmtShort(l.updated_at)}</div>
                          </div>
                        );
                      })}
                      {S.lessons.length === 0 && <p className="small muted">No lessons yet</p>}
                    </div>
                  </div>
              }
            </div>
          )}

          {/* ── LEARNER PAGE ── */}
          {screen === 'learner' && currentLearner && (
            <div style={{ maxWidth: 700 }}>
              <div className="flex-center gap-12" style={{ marginBottom: 24 }}>
                <div className="learner-avatar" style={{ width: 48, height: 48, fontSize: 17, background: 'var(--cream)', color: 'var(--ink)' }}>{initials(currentLearner.name)}</div>
                <h2 className="serif" style={{ fontSize: 24 }}>{currentLearner.name}</h2>
              </div>
              {lessons.length === 0
                ? <div className="card"><div className="empty"><div className="icon">⟳</div><h3>No lessons yet</h3><p>Click "+ New lesson" to get started</p></div></div>
                : lessons.map((l, i) => {
                    const num = lessons.length - i;
                    const sub = [l.subject, l.theme].filter(Boolean).join(' — ');
                    return (
                      <div key={l.id} className="lesson-card" onClick={() => go(l.content ? 'lesson' : 'generator', { lessonId: l.id, learnerId })}>
                        <div className="flex-between">
                          <div>
                            <div className="flex-center gap-8" style={{ marginBottom: 4 }}>
                              <span style={{ background: 'var(--cream)', color: 'var(--ink-light)', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>Lesson {num}</span>
                              <div className="fw-500">{lessonLabel(l)}</div>
                            </div>
                            <div className="small muted">{fmt(l.created_at)}{sub ? ' · ' + sub : ''}</div>
                          </div>
                          <div className="small muted">{l.content ? `${(l.comments || []).length} comment${l.comments?.length !== 1 ? 's' : ''}` : <span style={{ color: 'var(--amber)' }}>No content yet</span>}</div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          )}

          {/* ── LESSON GENERATOR ── */}
          {screen === 'generator' && (
            <div className="generator-wrap">
              <div className="generator-hero">
                <h2>Lesson Generator</h2>
                <p className="muted">Choose how to create the next lesson for {currentLearner?.name}</p>
              </div>

              {/* Mode selection */}
              <div className={`mode-card ${generatorMode === 'fresh' ? 'selected' : ''}`}
                onClick={() => { setGenState({ direction: { ...DEFAULT_DIRECTION }, formats: [...DEFAULT_FORMATS] }); update({ ...S, ui: { ...S.ui, generatorMode: 'fresh', generatorBaseLessonId: null } }); }}>
                <div className="mode-card-title">🌱 Fresh start — new topic</div>
                <div className="mode-card-sub">Create a first lesson on a brand new subject and theme</div>
              </div>

              {lessons.length > 0 && (
                <div className={`mode-card ${generatorMode === 'continue' ? 'selected' : ''}`}
                  onClick={() => update({ ...S, ui: { ...S.ui, generatorMode: 'continue' } })}>
                  <div className="mode-card-title">↩ Generate new prompt based on a previous lesson</div>
                  <div className="mode-card-sub">Pick a lesson — the AI will analyse it and build the next one</div>
                  {generatorMode === 'continue' && (
                    <div className="lesson-pick">
                      {lessons.map((l, i) => {
                        const num = lessons.length - i;
                        return (
                          <div key={l.id}
                            className={`lesson-pick-item ${generatorBaseLessonId === l.id ? 'selected' : ''}`}
                            onClick={e => { e.stopPropagation(); pickBaseLesson(l.id); }}>
                            <span>Lesson {num} — {lessonLabel(l)}</span>
                            <span className="small muted">{fmtShort(l.created_at)}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Fields */}
              {generatorMode && (
                <>
                  <div className="card" style={{ marginTop: 16, marginBottom: 16 }}>
                    <div className="fw-500" style={{ marginBottom: 16 }}>
                      {generatorMode === 'fresh' ? 'Lesson details' : 'Lesson details (optional — leave blank to carry from previous)'}
                    </div>
                    <div className="grid-2" style={{ marginBottom: generatorMode === 'fresh' ? 16 : 0 }}>
                      <div>
                        <label>Subject</label>
                        <select id="gen-subject" defaultValue={baseLesson?.subject || ''}>
                          {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label>Theme / topic</label>
                        <input type="text" id="gen-theme" defaultValue={baseLesson?.theme || ''} placeholder="e.g. Macbeth, Fractions…" />
                      </div>
                    </div>
                    {generatorMode === 'fresh' && (
                      <div>
                        <label>Learner context <span className="muted">(optional — age, level, anything useful)</span></label>
                        <textarea id="gen-context" style={{ minHeight: 80 }} placeholder={`e.g. ${currentLearner?.name} is 14, Year 9. Gets frustrated if things feel too hard…`} />
                      </div>
                    )}
                  </div>

                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="fw-500" style={{ marginBottom: 4 }}>Next lesson direction</div>
                    <p className="small muted" style={{ marginBottom: 16 }}>Tell the AI what to adjust.</p>
                    {DIRECTION_DIALS.map(d => {
                      const val = genState.direction[d.key] ?? 50;
                      const atCentre = val > 35 && val < 65;
                      const lbl = atCentre ? '' : (val <= 35 ? d.low : d.high);
                      const col = val <= 35 ? 'var(--rose)' : val >= 65 ? 'var(--teal)' : 'var(--ink-light)';
                      return (
                        <div key={d.key} className="dial-row">
                          <div className="dial-labels">
                            <span className="dial-name">{d.label}</span>
                            <span className="dial-value" style={{ color: col }}>{lbl}</span>
                          </div>
                          <input type="range" min="0" max="100" step="5" value={val} style={{ width: '100%' }}
                            onChange={e => setGenState(g => ({ ...g, direction: { ...g.direction, [d.key]: parseInt(e.target.value) } }))} />
                          <div className="dial-ends"><span className="dial-end">{d.low}</span><span className="dial-end">{d.high}</span></div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="card" style={{ marginBottom: 16 }}>
                    <div className="fw-500" style={{ marginBottom: 8 }}>Question formats</div>
                    <div className="fmt-grid">
                      {QUESTION_FORMATS.map(f => {
                        const on = genState.formats.includes(f.key);
                        return (
                          <label key={f.key} className={`fmt-label ${on ? 'on' : ''}`}>
                            <input type="checkbox" checked={on} style={{ width: 13, height: 13, marginTop: 2, flexShrink: 0, accentColor: 'var(--blue)', cursor: 'pointer' }}
                              onChange={e => setGenState(g => {
                                const fmts = e.target.checked ? [...g.formats.filter(k => k !== f.key), f.key] : g.formats.filter(k => k !== f.key);
                                return { ...g, formats: fmts };
                              })} />
                            <div><div className="fmt-label-text">{f.label}</div><div className="fmt-label-sub">{f.example}</div></div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="card" style={{ marginBottom: 24 }}>
                    <div className="fw-500" style={{ marginBottom: 8 }}>Teacher notes <span className="muted small">(optional)</span></div>
                    <textarea id="gen-notes" style={{ minHeight: 80 }} placeholder="Anything else you want the AI to know…" />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <button className="btn btn-primary btn-xl" onClick={generatePrompt}>Generate prompt</button>
                  </div>

                  {/* Prompt ready */}
                  {promptReady && (
                    <div className="prompt-ready" id="prompt-ready-section" style={{ marginTop: 24 }}>
                      <div className="fw-500" style={{ fontSize: 17, marginBottom: 12 }}>Your prompt is ready</div>

                      <div className="prompt-step" style={{ marginBottom: 16 }}>
                        <div className="prompt-step-num">1</div>
                        <div style={{ flex: 1 }}>
                          <div className="fw-500" style={{ marginBottom: 8 }}>Copy the prompt</div>
                          <div style={{ position: 'relative' }}>
                            <textarea id="prompt-textarea" readOnly value={promptText}
                              style={{ width: '100%', minHeight: 160, fontSize: 12, lineHeight: 1.6, background: 'var(--ink)', color: '#e0e0e0', border: 'none', borderRadius: 'var(--radius-sm)', padding: '14px 60px 14px 14px', resize: 'none', fontFamily: 'DM Sans, sans-serif', outline: 'none' }} />
                            <button id="copy-btn" onClick={copyPrompt} title="Copy prompt"
                              style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                              📋
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="prompt-step" style={{ marginBottom: 16 }}>
                        <div className="prompt-step-num">2</div>
                        <div>
                          <div className="fw-500" style={{ marginBottom: 8 }}>Open your AI — choose one:</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <a href="https://chatgpt.com" target="_blank" className="btn btn-primary btn-sm" rel="noreferrer">ChatGPT ↗</a>
                            <a href="https://gemini.google.com" target="_blank" className="btn btn-sm" rel="noreferrer">Gemini ↗</a>
                            <a href="https://claude.ai" target="_blank" className="btn btn-sm" rel="noreferrer">Claude ↗</a>
                          </div>
                        </div>
                      </div>

                      <div className="prompt-step" style={{ marginBottom: 16 }}>
                        <div className="prompt-step-num">3</div>
                        <div className="small" style={{ color: 'var(--ink-mid)', lineHeight: 1.7 }}>
                          <strong style={{ color: 'var(--ink)' }}>Important — before pasting:</strong> if you see old text in the AI input box, <strong style={{ color: 'var(--rose)' }}>delete it first</strong> — the AI remembers previous sessions.<br /><br />
                          Then click the input box and press <strong>Ctrl+V</strong> to paste, and Send.
                        </div>
                      </div>

                      <div className="prompt-step" style={{ marginBottom: 20 }}>
                        <div className="prompt-step-num">4</div>
                        <div className="small" style={{ color: 'var(--ink-mid)' }}>
                          <strong style={{ color: 'var(--ink)' }}>Come back here</strong> and click "Start new lesson" to paste the lesson in and begin with {currentLearner?.name}.
                        </div>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <button className="btn btn-primary btn-lg" onClick={startLesson}>Start new lesson →</button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── THE LESSON ── */}
          {screen === 'lesson' && currentLesson && (
            <div style={{ maxWidth: 800 }}>
              {!hasContent && (
                <div style={{ background: 'var(--blue-light)', border: '1px solid rgba(58,110,168,0.2)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 20 }}>
                  <div className="fw-500" style={{ color: 'var(--blue)', marginBottom: 8 }}>Paste the lesson from your AI</div>
                  <p className="small" style={{ color: 'var(--ink-mid)', marginBottom: 16, lineHeight: 1.7 }}>
                    1. In your AI, click the <strong>copy button</strong> on the lesson response<br />
                    2. Click <strong>"Paste lesson"</strong> below — LoopLearn extracts just the lesson automatically<br />
                    3. {currentLearner?.name} reads through and types answers directly into the text
                  </p>
                  <button className="btn btn-primary" onClick={pasteLesson}>📋 Paste lesson</button>
                </div>
              )}
              {hasContent && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                  <button className="btn btn-sm" onClick={pasteLesson}>📋 Paste updated lesson</button>
                  <span className="small muted">Lesson loaded — {currentLearner?.name} can type answers below</span>
                </div>
              )}

              <div className="card" style={{ marginBottom: 16 }}>
                <textarea id="lesson-textarea"
                  defaultValue={currentLesson.content || ''}
                  style={{ minHeight: 600, fontSize: 14, lineHeight: 1.9, resize: 'none', width: '100%' }}
                  placeholder="Lesson will appear here after pasting…"
                  onChange={e => autosave('content', e.target.value)} />
              </div>

              {hasContent && (
                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <button className="btn btn-primary btn-lg" onClick={() => go('after', { lessonId })}>
                    Finish lesson &amp; add observations →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── AFTER LESSON ── */}
          {screen === 'after' && currentLesson && (
            <div style={{ maxWidth: 680 }}>
              <p className="muted" style={{ marginBottom: 24 }}>Record what you observed. These signals will be used when you generate the next lesson.</p>

              <div className="card" style={{ marginBottom: 16 }}>
                <div className="fw-500" style={{ marginBottom: 8 }}>Observation comments</div>
                <p className="small muted" style={{ marginBottom: 16 }}>What did you notice?</p>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                    {COMMENT_TYPES.map(t => (
                      <span key={t.key} className={`chip ${t.key}${commentType === t.key ? ' selected' : ''}`}
                        onClick={() => setCommentType(t.key)}>{t.label}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input type="text" value={commentText} placeholder="Add observation and press Enter…" style={{ flex: 1 }}
                      onChange={e => setCommentText(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addComment(); }} />
                    <button className="btn btn-sm btn-primary" onClick={addComment}>Add</button>
                  </div>
                </div>
                {(currentLesson.comments || []).length === 0
                  ? <p className="small muted">No comments yet</p>
                  : (currentLesson.comments || []).map(c => (
                      <div key={c.id} className="comment-row">
                        <span className={`chip ${c.type}`} style={{ fontSize: 11, flexShrink: 0 }}>{c.type}</span>
                        <span className="small" style={{ flex: 1 }}>{c.text}</span>
                        <button className="del-btn" onClick={() => deleteComment(c.id)}>×</button>
                      </div>
                    ))}
              </div>

              <div className="card" style={{ marginBottom: 16 }}>
                <div className="fw-500" style={{ marginBottom: 4 }}>Direction for next lesson</div>
                <p className="small muted" style={{ marginBottom: 16 }}>Pre-loaded into the generator next time.</p>
                {DIRECTION_DIALS.map(d => {
                  const val = (currentLesson.after_direction || DEFAULT_DIRECTION)[d.key] ?? 50;
                  const atCentre = val > 35 && val < 65;
                  const lbl = atCentre ? '' : (val <= 35 ? d.low : d.high);
                  const col = val <= 35 ? 'var(--rose)' : val >= 65 ? 'var(--teal)' : 'var(--ink-light)';
                  return (
                    <div key={d.key} className="dial-row">
                      <div className="dial-labels">
                        <span className="dial-name">{d.label}</span>
                        <span className="dial-value" style={{ color: col }}>{lbl}</span>
                      </div>
                      <input type="range" min="0" max="100" step="5" value={val} style={{ width: '100%' }}
                        onChange={e => updateAfterDial(d.key, e.target.value)} />
                      <div className="dial-ends"><span className="dial-end">{d.low}</span><span className="dial-end">{d.high}</span></div>
                    </div>
                  );
                })}
              </div>

              <div className="card" style={{ marginBottom: 24 }}>
                <div className="fw-500" style={{ marginBottom: 8 }}>Question formats for next lesson</div>
                <div className="fmt-grid">
                  {QUESTION_FORMATS.map(f => {
                    const on = (currentLesson.after_formats || DEFAULT_FORMATS).includes(f.key);
                    return (
                      <label key={f.key} className={`fmt-label ${on ? 'on' : ''}`}>
                        <input type="checkbox" checked={on} style={{ width: 13, height: 13, marginTop: 2, flexShrink: 0, accentColor: 'var(--blue)', cursor: 'pointer' }}
                          onChange={e => updateAfterFmt(f.key, e.target.checked)} />
                        <div><div className="fmt-label-text">{f.label}</div><div className="fmt-label-sub">{f.example}</div></div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
