/**
 * AfterLesson
 * 
 * Shown after the learner finishes a lesson.
 * Teacher records observations and sets direction for the next lesson.
 * 
 * Three sections:
 * 1. Observation comments — tagged notes (engagement, behaviour, etc.)
 * 2. Direction dials — how to adjust the next lesson
 * 3. Question formats — what types to use next time
 * 
 * All saved immediately via commit (no debounce needed here —
 * these are deliberate teacher inputs, not rapid typing).
 */

import { useState } from 'react';
import {
  DIRECTION_DIALS,
  QUESTION_FORMATS,
  COMMENT_TYPES,
  DEFAULT_DIRECTION,
  DEFAULT_FORMATS,
} from '../lib/constants';

export default function AfterLesson({
  S,
  addComment,
  deleteComment,
  updateAfterDial,
  updateAfterFmt,
}) {
  const { lessonId } = S.ui;
  const lesson = S.lessons.find(l => l.id === lessonId);

  const [selectedType, setSelectedType] = useState('observation');
  const [commentText, setCommentText] = useState('');

  if (!lesson) return (
    <div className="empty">
      <p>Lesson not found.</p>
    </div>
  );

  const comments = lesson.comments || [];
  const direction = lesson.after_direction || DEFAULT_DIRECTION;
  const formats = lesson.after_formats || DEFAULT_FORMATS;

  const handleAddComment = () => {
    const text = commentText.trim();
    if (!text) return;
    addComment(lessonId, text, selectedType);
    setCommentText('');
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <p className="muted" style={{ marginBottom: 24 }}>
        Record what you observed. These signals will be used when you generate the next lesson.
      </p>

      {/* ── Observation comments ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="fw-500" style={{ marginBottom: 8 }}>Observation comments</div>
        <p className="small muted" style={{ marginBottom: 16 }}>
          What did you notice during the lesson?
        </p>

        {/* Comment type chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {COMMENT_TYPES.map(t => (
            <span
              key={t.key}
              className={`chip ${t.key}${selectedType === t.key ? ' selected' : ''}`}
              onClick={() => setSelectedType(t.key)}
            >
              {t.label}
            </span>
          ))}
        </div>

        {/* Comment input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            type="text"
            value={commentText}
            placeholder="Add observation and press Enter…"
            style={{ flex: 1 }}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }}
          />
          <button className="btn btn-sm btn-primary" onClick={handleAddComment}>
            Add
          </button>
        </div>

        {/* Comments list */}
        {comments.length === 0 ? (
          <p className="small muted">No comments yet</p>
        ) : (
          comments.map(c => (
            <div key={c.id} className="comment-row">
              <span className={`chip ${c.type}`} style={{ fontSize: 11, flexShrink: 0 }}>
                {c.type}
              </span>
              <span className="small" style={{ flex: 1 }}>{c.text}</span>
              <button
                className="del-btn"
                onClick={() => deleteComment(lessonId, c.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Direction dials ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="fw-500" style={{ marginBottom: 4 }}>Direction for next lesson</div>
        <p className="small muted" style={{ marginBottom: 16 }}>
          These will be pre-loaded into the generator next time.
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
                onChange={e => updateAfterDial(lessonId, d.key, e.target.value)}
              />
              <div className="dial-ends">
                <span className="dial-end">{d.low}</span>
                <span className="dial-end">{d.high}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Question formats ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="fw-500" style={{ marginBottom: 8 }}>
          Question formats for next lesson
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
                  onChange={e => updateAfterFmt(lessonId, f.key, e.target.checked)}
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
    </div>
  );
}
