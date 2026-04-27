import { useState, useRef } from 'react';
import { buildPrompt } from '../lib/prompt';
import { fmtShort, lessonLabel } from '../lib/state';
import { SUBJECTS, DIRECTION_DIALS, QUESTION_FORMATS, DEFAULT_DIRECTION, DEFAULT_FORMATS } from '../lib/constants';

export default function Generator({ S, go, startLesson, setGeneratorMode, setBaseLessonId }) {
  const { learnerId, generatorMode, generatorBaseLessonId } = S.ui;
  const learner = S.learners.find(l => l.id === learnerId);
  const lessons = S.lessons
    .filter(l => l.learner_id === learnerId)
    .sort((a, b) => b.created_at - a.created_at);
  const baseLesson = S.lessons.find(l => l.id === generatorBaseLessonId);

  const [genDir, setGenDir] = useState(baseLesson?.after_direction || { ...DEFAULT_DIRECTION });
  const [genFmts, setGenFmts] = useState(baseLesson?.after_formats || [...DEFAULT_FORMATS]);
  const [promptText, setPromptText] = useState('');
  const [promptReady, setPromptReady] = useState(false);
  const subjectRef = useRef(null);
  const themeRef = useRef(null);

  const [prefillSubject, setPrefillSubject] = useState(baseLesson?.subject || '');
  const [prefillTheme, setPrefillTheme] = useState(baseLesson?.theme || '');

  const handlePickLesson = (id) => {
    const lesson = S.lessons.find(l => l.id === id);
    setBaseLessonId(id);
    setGenDir(lesson?.after_direction ? { ...lesson.after_direction } : { ...DEFAULT_DIRECTION });
    setGenFmts(lesson?.after_formats ? [...lesson.after_formats] : [...DEFAULT_FORMATS]);
    setPrefillSubject(lesson?.subject || '');
    setPrefillTheme(lesson?.theme || '');
  };

  const handleGenerate = () => {
    const contextEl = document.getElementById('gen-context');
    const notesEl = document.getElementById('gen-notes');
    const prompt = buildPrompt({
      name: learner?.name || 'the learner',
      mode: generatorMode,
      subject: subjectRef.current?.value || '',
      theme: themeRef.current?.value || '',
      context: contextEl?.value || '',
      teacherNotes: notesEl?.value || '',
      baseLesson,
      direction: genDir,
      formats: genFmts,
    });
    setPromptText(prompt);
    setPromptReady(true);
    setTimeout(() => document.getElementById('prompt-ready-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleCopy = () => {
    const ta = document.getElementById('prompt-textarea');
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(0, ta.value.length);
    const ok = document.execCommand('copy');
    if (ok) {
      const btn = document.getElementById('copy-btn');
      if (btn) {
        btn.textContent = '✓';
        btn.style.background = 'var(--teal)';
        setTimeout(() => { btn.textContent = '📋'; btn.style.background = 'rgba(255,255,255,0.12)'; }, 2000);
      }
    }
  };

  const handleStartLesson = () => {
    startLesson(subjectRef.current?.value || '', themeRef.current?.value || '');
  };

  return (
    <div className="generator-wrap">
      <div className="generator-hero">
        <h2>Lesson Generator</h2>
        <p className="muted">Choose how to create the next lesson for {learner?.name}</p>
      </div>

      {/* Mode: Fresh start */}
      <div className={`mode-card ${generatorMode === 'fresh' ? 'selected' : ''}`}
        onClick={() => { setGeneratorMode('fresh'); setGenDir({ ...DEFAULT_DIRECTION }); setGenFmts([...DEFAULT_FORMATS]); }}>
        <div className="mode-card-title">🌱 Fresh start — new topic</div>
        <div className="mode-card-sub">Create a first lesson on a brand new subject and theme</div>
      </div>

      {/* Mode: Continue */}
      {lessons.length > 0 && (
        <div className={`mode-card ${generatorMode === 'continue' ? 'selected' : ''}`}
          onClick={() => setGeneratorMode('continue')}>
          <div className="mode-card-title">↩ Generate new prompt based on a previous lesson</div>
          <div className="mode-card-sub">Pick a lesson — the AI will analyse it and build the next one</div>
          {generatorMode === 'continue' && (
            <div className="lesson-pick" onClick={e => e.stopPropagation()}>
              {lessons.map((l, i) => (
                <div key={l.id}
                  className={`lesson-pick-item ${generatorBaseLessonId === l.id ? 'selected' : ''}`}
                  onClick={() => handlePickLesson(l.id)}>
                  <span>Lesson {lessons.length - i} — {lessonLabel(l)}</span>
                  <span className="small muted">{fmtShort(l.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fields — shown once mode selected */}
      {generatorMode && (
        <>
          {/* Subject, theme, context */}
          <div className="card" style={{ marginTop: 16, marginBottom: 16 }}>
            <div className="fw-500" style={{ marginBottom: 16 }}>
              {generatorMode === 'fresh' ? 'Lesson details' : 'Lesson details (optional — leave blank to carry from previous)'}
            </div>
            <div className="grid-2" style={{ marginBottom: generatorMode === 'fresh' ? 16 : 0 }}>
              <div>
                <label>Subject</label>
                <select ref={subjectRef} key={prefillSubject} defaultValue={prefillSubject}>
                  {SUBJECTS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label>Theme / topic</label>
                <input type="text" ref={themeRef} key={prefillTheme} defaultValue={prefillTheme} placeholder="e.g. Macbeth, Fractions…" />
              </div>
            </div>
            {generatorMode === 'fresh' && (
              <div>
                <label>Learner context <span className="muted">(optional)</span></label>
                <textarea id="gen-context" style={{ minHeight: 80 }}
                  placeholder={`e.g. ${learner?.name} is 14, Year 9. Gets frustrated if things feel too hard…`} />
              </div>
            )}
          </div>

          {/* Direction dials */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="fw-500" style={{ marginBottom: 4 }}>Next lesson direction</div>
            <p className="small muted" style={{ marginBottom: 16 }}>Tell the AI what to adjust.</p>
            {DIRECTION_DIALS.map(d => {
              const val = genDir[d.key] ?? 50;
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
                    onChange={e => setGenDir(g => ({ ...g, [d.key]: parseInt(e.target.value) }))} />
                  <div className="dial-ends">
                    <span className="dial-end">{d.low}</span>
                    <span className="dial-end">{d.high}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Question formats */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="fw-500" style={{ marginBottom: 8 }}>Question formats</div>
            <div className="fmt-grid">
              {QUESTION_FORMATS.map(f => {
                const on = genFmts.includes(f.key);
                return (
                  <label key={f.key} className={`fmt-label ${on ? 'on' : ''}`}>
                    <input type="checkbox" checked={on}
                      style={{ width: 13, height: 13, marginTop: 2, flexShrink: 0, accentColor: 'var(--blue)', cursor: 'pointer' }}
                      onChange={e => {
                        const fmts = e.target.checked
                          ? [...genFmts.filter(k => k !== f.key), f.key]
                          : genFmts.filter(k => k !== f.key);
                        setGenFmts(fmts);
                      }} />
                    <div>
                      <div className="fmt-label-text">{f.label}</div>
                      <div className="fmt-label-sub">{f.example}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Teacher notes */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="fw-500" style={{ marginBottom: 8 }}>
              Teacher notes <span className="muted small">(optional)</span>
            </div>
            <textarea id="gen-notes" style={{ minHeight: 80 }}
              placeholder="Anything else you want the AI to know…" />
          </div>

          {/* Generate button */}
          <div style={{ textAlign: 'center' }}>
            <button className="btn btn-primary btn-xl" onClick={handleGenerate}>
              Generate prompt
            </button>
          </div>

          {/* Prompt ready */}
          {promptReady && (
            <div className="prompt-ready" id="prompt-ready-section" style={{ marginTop: 24 }}>
              <div className="fw-500" style={{ fontSize: 17, marginBottom: 16 }}>Your prompt is ready</div>

              {/* Step 1: Copy */}
              <div className="prompt-step" style={{ marginBottom: 20 }}>
                <div className="prompt-step-num">1</div>
                <div style={{ flex: 1 }}>
                  <div className="fw-500" style={{ marginBottom: 8 }}>Copy the prompt</div>
                  <div style={{ position: 'relative' }}>
                    <textarea id="prompt-textarea" readOnly value={promptText}
                      style={{ width: '100%', minHeight: 160, fontSize: 12, lineHeight: 1.6, background: 'var(--ink)', color: '#e0e0e0', border: 'none', borderRadius: 'var(--radius-sm)', padding: '14px 60px 14px 14px', resize: 'none', outline: 'none' }} />
                    <button id="copy-btn" onClick={handleCopy} title="Copy prompt"
                      style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.12)', color: 'white', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      📋
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Open AI */}
              <div className="prompt-step" style={{ marginBottom: 20 }}>
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

              {/* Step 3: Paste warning */}
              <div className="prompt-step" style={{ marginBottom: 20 }}>
                <div className="prompt-step-num">3</div>
                <div className="small" style={{ color: 'var(--ink-mid)', lineHeight: 1.7 }}>
                  <strong style={{ color: 'var(--ink)' }}>Before pasting:</strong> if you see old text in the AI input box,{' '}
                  <strong style={{ color: 'var(--rose)' }}>delete it first</strong> — the AI remembers previous sessions.<br /><br />
                  Click the input box and press <strong>Ctrl+V</strong> to paste, then Send.
                </div>
              </div>

              {/* Step 4: Come back */}
              <div className="prompt-step" style={{ marginBottom: 24 }}>
                <div className="prompt-step-num">4</div>
                <div className="small" style={{ color: 'var(--ink-mid)' }}>
                  <strong style={{ color: 'var(--ink)' }}>Come back here</strong> and click &quot;Start new lesson&quot; to paste the lesson in and begin with {learner?.name}.
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <button className="btn btn-primary btn-lg" onClick={handleStartLesson}>
                  Start new lesson →
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
