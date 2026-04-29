/**
 * LearnerPage
 * 
 * Shows a learner's lesson history.
 * Each lesson card navigates to:
 *   - The lesson screen (if content exists)
 *   - The generator (if no content yet — lesson was started but not filled)
 * 
 * Lessons are numbered newest-first for display,
 * oldest-first in logic (Lesson 1 = first created).
 */

import { useState } from 'react';
import { fmt, initials, lessonLabel } from '../lib/state';

export default function LearnerPage({ S, go, removeLesson, renameLearner }) {
  const [confirmId, setConfirmId] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState('');
  const { learnerId } = S.ui;
  const learner = S.learners.find(l => l.id === learnerId);

  const startEdit = () => {
    setNameVal(learner.name);
    setEditingName(true);
  };

  const commitName = () => {
    if (nameVal.trim() && nameVal.trim() !== learner.name) {
      renameLearner(learnerId, nameVal.trim());
    }
    setEditingName(false);
  };

  // Sorted newest first for display
  const lessons = S.lessons
    .filter(l => l.learner_id === learnerId)
    .sort((a, b) => b.created_at - a.created_at);

  if (!learner) return null;

  return (
    <div style={{ maxWidth: 700 }}>

      {/* Learner header */}
      <div className="flex-center gap-12" style={{ marginBottom: 24 }}>
        <div
          className="learner-avatar"
          style={{ width: 48, height: 48, fontSize: 17, background: 'var(--cream)', color: 'var(--ink)' }}
        >
          {initials(learner.name)}
        </div>
        {editingName ? (
          <input
            autoFocus
            type="text"
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => {
              if (e.key === 'Enter') commitName();
              if (e.key === 'Escape') setEditingName(false);
            }}
            style={{
              fontSize: 24,
              fontFamily: "'DM Serif Display', serif",
              border: 'none',
              borderBottom: '2px solid var(--gold)',
              background: 'transparent',
              outline: 'none',
              color: 'var(--ink)',
              width: 220,
            }}
          />
        ) : (
          <h2
            className="serif"
            style={{ fontSize: 24, cursor: 'pointer' }}
            title="Click to rename"
            onClick={startEdit}
          >
            {learner.name} <span style={{ fontSize: 13, color: 'var(--ink-light)', fontFamily: 'DM Sans' }}>✎</span>
          </h2>
        )}
      </div>

      {/* Empty state */}
      {lessons.length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="icon">⟳</div>
            <h3>No lessons yet</h3>
            <p>Click &quot;+ New lesson&quot; in the top right to get started</p>
          </div>
        </div>
      )}

      {/* Lesson list */}
      {lessons.map((l, i) => {
        const lessonNumber = lessons.length - i; // Lesson 1 = oldest
        const hasContent = !!(l.content?.trim());
        const commentCount = (l.comments || []).length;

        return (
          <div
            key={l.id}
            className="lesson-card"
            onClick={() => {
              if (confirmId === l.id) return;
              go(
                hasContent ? 'lesson' : 'generator',
                { lessonId: l.id, learnerId }
              );
            }}
          >
            <div className="flex-between">
              <div>
                <div className="flex-center gap-8" style={{ marginBottom: 4 }}>
                  <span style={{
                    background: 'var(--cream)',
                    color: 'var(--ink-light)',
                    fontSize: 11,
                    padding: '2px 8px',
                    borderRadius: 20,
                    fontWeight: 500,
                  }}>
                    Lesson {lessonNumber}
                  </span>
                  <div className="fw-500">{lessonLabel(l)}</div>
                </div>
                <div className="small muted">{fmt(l.created_at)}</div>
              </div>
              <div className="flex-center gap-8">
                {hasContent && (
                  <button
                    className="btn-sm"
                    style={{ fontSize: 11, opacity: 0.6 }}
                    title="Go to observations"
                    onClick={(e) => {
                      e.stopPropagation();
                      go('after', { lessonId: l.id, learnerId });
                    }}
                  >
                    {commentCount > 0 ? `${commentCount} note${commentCount !== 1 ? 's' : ''}` : 'Observations'}
                  </button>
                )}
                {!hasContent && (
                  <span className="small" style={{ color: 'var(--amber)', marginRight: 4 }}>No content yet</span>
                )}
                {confirmId === l.id ? (
                  <>
                    <button
                      className="btn-sm"
                      style={{ background: 'var(--rose)', color: '#fff', border: 'none' }}
                      onClick={(e) => { e.stopPropagation(); removeLesson(l.id); }}
                    >
                      Delete
                    </button>
                    <button
                      className="btn-sm"
                      onClick={(e) => { e.stopPropagation(); setConfirmId(null); }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn-sm"
                    style={{ opacity: 0.4 }}
                    title="Delete lesson"
                    onClick={(e) => { e.stopPropagation(); setConfirmId(l.id); }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
