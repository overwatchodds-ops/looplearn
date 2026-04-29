/**
 * GeneratorSetup
 * 
 * Handles the setup phase of lesson generation:
 * - Mode selection (fresh start / continue from previous)
 * - Lesson picker (when continuing)
 * - Subject, theme, learner context fields
 * - Direction dials
 * - Question formats
 * - Teacher notes
 * 
 * When the user clicks Generate, calls onGenerate(config) 
 * with everything needed to build the prompt.
 * All form values are controlled React state — no DOM queries.
 */

import { useState } from 'react';
import { lessonLabel, fmtShort } from '../lib/state';
import {
  SUBJECTS,
  DIRECTION_DIALS,
  QUESTION_FORMATS,
  DEFAULT_DIRECTION,
  DEFAULT_FORMATS
} from '../lib/constants';

export default function GeneratorSetup({
  learner,
  lessons,
  generatorMode,
  generatorBaseLessonId,
  onSelectMode,
  onPickLesson,
  onGenerate,
}) {
  // All form state lives here — controlled inputs, no DOM queries
  const [subject, setSubject] = useState('');
  const [theme, setTheme] = useState('');
  const [context, setContext] = useState('');
  const [notes, setNotes] = useState('');
  const [direction, setDirection] = useState({ ...DEFAULT_DIRECTION });
  const [formats, setFormats] = useState([...DEFAULT_FORMATS]);
  const [baseLesson, setBaseLesson] = useState(null); // stored directly — not derived from async prop

  // When a lesson is picked, pre-fill subject and theme from it
  const handlePickLesson = (id) => {
    const lesson = lessons.find(l => l.id === id);
    if (!lesson) return;
    setBaseLesson(lesson); // store full object — not dependent on async prop update
    onPickLesson(id);      // also update global state for UI highlighting
    setSubject(lesson.subject || '');
    setTheme(lesson.theme || '');
    setDirection(lesson.after_direction || { ...DEFAULT_DIRECTION });
    setFormats(lesson.after_formats || [...DEFAULT_FORMATS]);
  };

  const handleSelectMode = (mode) => {
    onSelectMode(mode);
    setBaseLesson(null);
    setSubject('');
    setTheme('');
    setContext('');
    setNotes('');
    setDirection({ ...DEFAULT_DIRECTION });
    setFormats([...DEFAULT_FORMATS]);
  };

  const handleToggleFormat = (key, checked) => {
    setFormats(prev =>
      checked
        ? [...prev.filter(k => k !== key), key]
        : prev.filter(k => k !== key)
    );
  };

  const handleGenerate = () => {
    onGenerate({
      mode: generatorMode,
      subject,
      theme,
      context,
      teacherNotes: notes,
      baseLesson,
      direction,
      formats,
    });
  };

  const canGenerate = generatorMode === 'fresh' ||
    (generatorMode === 'continue' && generatorBaseLessonId);

  return (
    <div className="generator-wrap">

      {/* Header */}
      <div className="generator-hero">
        <h2>Lesson Generator</h2>
        <p className="muted">
          Choose how to create the next lesson for {learner?.name}
        </p>
      </div>

      {/* Mode: Fresh start */}
      <div
        className={`mode-card ${generatorMode === 'fresh' ? 'selected' : ''}`}
        onClick={() => handleSelectMode('fresh')}
      >
        <div className="mode-card-title">🌱 Fresh start — new topic</div>
        <div className="mode-card-sub">
          Create a first lesson on a brand new subject and theme
        </div>
      </div>

      {/* Mode: Continue from previous lesson */}
      {lessons.length > 0 && (
        <div
          className={`mode-card ${generatorMode === 'continue' ? 'selected' : ''}`}
          onClick={() => handleSelectMode('continue')}
        >
          <div className="mode-card-title">
            ↩ Generate new prompt based on a previous lesson
          </div>
          <div className="mode-card-sub">
            Pick a lesson — the AI will analyse it and build the next one
          </div>

          {generatorMode === 'continue' && (
            <div className="lesson-pick" onClick={e => e.stopPropagation()}>
              {lessons.map((l, i) => (
                <div
                  key={l.id}
                  className={`lesson-pick-item ${generatorBaseLessonId === l.id ? 'selected' : ''}`}
                  onClick={() => handlePickLesson(l.id)}
                >
                  <span>Lesson {lessons.length - i} — {lessonLabel(l)}</span>
                  <span className="small muted">{fmtShort(l.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Fields — only shown once a mode is selected */}
      {generatorMode && (
        <>
          {/* Subject and theme */}
          <div className="card" style={{ marginTop: 16, marginBottom: 16 }}>
            <div className="fw-500" style={{ marginBottom: 16 }}>
              {generatorMode === 'fresh'
                ? 'Lesson details'
                : 'Lesson details (optional — leave blank to carry from previous)'}
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div>
                <label>Subject</label>
                <select value={subject} onChange={e => setSubject(e.target.value)}>
                  {SUBJECTS.map(s => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label>Theme / topic</label>
                <input
                  type="text"
                  value={theme}
                  placeholder="e.g. Macbeth, Fractions…"
                  onChange={e => setTheme(e.target.value)}
                />
              </div>
            </div>

            {/* Learner context — fresh start only */}
            {generatorMode === 'fresh' && (
              <div>
                <label>
                  Learner context{' '}
                  <span className="muted">(optional — the more you add, the better the lesson)</span>
                </label>
                <textarea
                  value={context}
                  style={{ minHeight: 100 }}
                  placeholder={`e.g. ${learner?.name} is 9 years old. Loves Minecraft and football. Gets frustrated quickly if things feel too hard. Responds well to humour and challenges. Struggles with long passages of text. Target: build confidence with fractions.`}
                  onChange={e => setContext(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Direction dials */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="fw-500" style={{ marginBottom: 4 }}>
              Next lesson direction
            </div>
            <p className="small muted" style={{ marginBottom: 16 }}>
              Tell the AI what to adjust.
            </p>
            {DIRECTION_DIALS.map(d => {
              const val = direction[d.key] ?? 50;
              const atCentre = val > 35 && val < 65;
              const label = atCentre ? '' : (val <= 35 ? d.low : d.high);
              const color = val <= 35
                ? 'var(--rose)'
                : val >= 65
                  ? 'var(--teal)'
                  : 'var(--ink-light)';
              return (
                <div key={d.key} className="dial-row">
                  <div className="dial-labels">
                    <span className="dial-name">{d.label}</span>
                    <span className="dial-value" style={{ color }}>{label}</span>
                  </div>
                  <input
                    type="range"
                    min="0" max="100" step="5"
                    value={val}
                    style={{ width: '100%' }}
                    onChange={e => setDirection(prev => ({
                      ...prev,
                      [d.key]: parseInt(e.target.value)
                    }))}
                  />
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
            <div className="fw-500" style={{ marginBottom: 8 }}>
              Question formats
            </div>
            <div className="fmt-grid">
              {QUESTION_FORMATS.map(f => {
                const checked = formats.includes(f.key);
                return (
                  <label key={f.key} className={`fmt-label ${checked ? 'on' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      style={{ width: 13, height: 13, marginTop: 2, flexShrink: 0, accentColor: 'var(--blue)', cursor: 'pointer' }}
                      onChange={e => handleToggleFormat(f.key, e.target.checked)}
                    />
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
              Teacher notes{' '}
              <span className="muted small">(optional)</span>
            </div>
            <textarea
              value={notes}
              style={{ minHeight: 80 }}
              placeholder="Anything else you want the AI to know…"
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          {/* Generate button */}
          <div style={{ textAlign: 'center' }}>
            <button
              className="btn btn-primary btn-xl"
              disabled={!canGenerate}
              onClick={handleGenerate}
            >
              Generate prompt
            </button>
            {generatorMode === 'continue' && !generatorBaseLessonId && (
              <p className="small muted" style={{ marginTop: 8 }}>
                Pick a lesson above first
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
