import { useState } from 'react';
import { lessonLabel } from '../lib/state';
import { DIRECTION_DIALS, QUESTION_FORMATS, COMMENT_TYPES, DEFAULT_DIRECTION, DEFAULT_FORMATS } from '../lib/constants';

export default function AfterLesson({ S, go, addComment, deleteComment, updateAfterDial, updateAfterFmt }) {
  const { lessonId } = S.ui;
  const lesson = S.lessons.find(l => l.id === lessonId);
  const learner = S.learners.find(l => l.id === lesson?.learner_id);
  const [commentType, setCommentType] = useState('observation');
  const [commentText, setCommentText] = useState('');

  if (!lesson) return null;

  const comments = lesson.comments || [];
  const dir = lesson.after_direction || DEFAULT_DIRECTION;
  const fmts = lesson.after_formats || DEFAULT_FORMATS;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment(lessonId, commentText.trim(), commentType);
    setCommentText('');
  };

  return (
    <div style={{ maxWidth: 680 }}>
      <p className="muted" style={{ marginBottom: 24 }}>
        Record what you observed. These signals will be used when you generate the next lesson.
      </p>

      {/* Observation comments */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="fw-500" style={{ marginBottom: 8 }}>Observation comments</div>
        <p className="small muted" style={{ marginBottom: 16 }}>What did you notice during the lesson?</p>

        {/* Type chips */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {COMMENT_TYPES.map(t => (
            <span key={t.key}
              className={`chip ${t.key}${commentType === t.key ? ' selected' : ''}`}
              onClick={() => setCommentType(t.key)}>
              {t.label}
            </span>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="text" value={commentText}
            placeholder="Add observation and press Enter…"
            style={{ flex: 1 }}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleAddComment(); }} />
          <button className="btn btn-sm btn-primary" onClick={handleAddComment}>Add</button>
        </div>

        {/* Comments list */}
        {comments.length === 0
          ? <p className="small muted">No comments yet</p>
          : comments.map(c => (
            <div key={c.id} className="comment-row">
              <span className={`chip ${c.type}`} style={{ fontSize: 11, flexShrink: 0 }}>{c.type}</span>
              <span className="small" style={{ flex: 1 }}>{c.text}</span>
              <button className="del-btn" onClick={() => deleteComment(lessonId, c.id)}>×</button>
            </div>
          ))
        }
      </div>

      {/* Direction dials */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="fw-500" style={{ marginBottom: 4 }}>Direction for next lesson</div>
        <p className="small muted" style={{ marginBottom: 16 }}>
          These will be pre-loaded into the generator next time.
        </p>
        {DIRECTION_DIALS.map(d => {
          const val = dir[d.key] ?? 50;
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
                onChange={e => updateAfterDial(lessonId, d.key, e.target.value)} />
              <div className="dial-ends">
                <span className="dial-end">{d.low}</span>
                <span className="dial-end">{d.high}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Question formats */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="fw-500" style={{ marginBottom: 8 }}>Question formats for next lesson</div>
        <div className="fmt-grid">
          {QUESTION_FORMATS.map(f => {
            const on = fmts.includes(f.key);
            return (
              <label key={f.key} className={`fmt-label ${on ? 'on' : ''}`}>
                <input type="checkbox" checked={on}
                  style={{ width: 13, height: 13, marginTop: 2, flexShrink: 0, accentColor: 'var(--blue)', cursor: 'pointer' }}
                  onChange={e => updateAfterFmt(lessonId, f.key, e.target.checked)} />
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
