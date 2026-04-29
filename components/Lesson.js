/**
 * Lesson
 * 
 * The main lesson screen where learning happens.
 * Two states:
 *   - Empty: shows paste instructions
 *   - Has content: shows lesson text for learner to work through
 * 
 * Editable fields: subject, theme (saved via updateLesson on blur)
 * Lesson content: autosaved on every keystroke (debounced 500ms)
 * Paste: reads clipboard, strips copy markers if present
 */

import { useState } from 'react';
import { cleanPaste } from '../lib/prompt';
import { SUBJECTS, COPY_START, COPY_END } from '../lib/constants';

export default function Lesson({ S, go, autosave, updateLesson }) {
  const { lessonId } = S.ui;
  const lesson = S.lessons.find(l => l.id === lessonId);
  const learner = S.learners.find(l => l.id === lesson?.learner_id);

  const [saveStatus, setSaveStatus] = useState(''); // 'saving' | 'saved' | 'pasted' | ''

  // Guard — should not happen but handles edge cases cleanly
  if (!lesson) return (
    <div className="empty">
      <p>Lesson not found.</p>
    </div>
  );

  const hasContent = !!(lesson.content?.trim());
  const learnerName = learner?.name || 'the learner';

  const handleContentChange = (e) => {
    autosave(lessonId, 'content', e.target.value);
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 600);
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) {
        alert('Nothing on clipboard — copy the lesson from your AI first.');
        return;
      }
      const cleaned = cleanPaste(text, COPY_START, COPY_END);
      // Update the textarea visually
      const ta = document.getElementById('lesson-textarea');
      if (ta) ta.value = cleaned;
      // Save
      autosave(lessonId, 'content', cleaned);
      setSaveStatus('pasted');
      setTimeout(() => setSaveStatus(''), 2500);
    } catch {
      // Clipboard API blocked — ask user to paste manually
      alert('Paste manually: click inside the lesson box below, then press Ctrl+V.');
      document.getElementById('lesson-textarea')?.focus();
    }
  };

  const saveStatusText = {
    saving: 'Saving…',
    saved: 'Saved ✓',
    pasted: 'Lesson pasted ✓',
  }[saveStatus] || `${learnerName} can type answers below`;

  return (
    <div style={{ maxWidth: 800 }}>

      {/* Editable subject and theme */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="grid-2">
          <div>
            <label>Subject</label>
            <select
              defaultValue={lesson.subject || ''}
              onChange={e => updateLesson(lessonId, { subject: e.target.value })}
            >
              {SUBJECTS.map(s => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Theme / topic</label>
            <input
              type="text"
              defaultValue={lesson.theme || ''}
              placeholder="e.g. Macbeth, Fractions…"
              onBlur={e => updateLesson(lessonId, { theme: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Empty state — paste instructions */}
      {!hasContent && (
        <div style={{
          background: 'var(--blue-light)',
          border: '1px solid rgba(58,110,168,0.2)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          marginBottom: 20,
        }}>
          <div className="fw-500" style={{ color: 'var(--blue)', marginBottom: 8 }}>
            Paste the lesson from your AI
          </div>
          <p className="small" style={{ color: 'var(--ink-mid)', marginBottom: 16, lineHeight: 1.7 }}>
            1. In your AI, click the <strong>copy button</strong> on the lesson<br />
            2. Click <strong>&ldquo;Paste lesson&rdquo;</strong> below —
            LoopLearn will extract just the lesson content automatically<br />
            3. {learnerName} reads through and types their answers directly into the text
          </p>
          <button className="btn btn-primary" onClick={handlePaste}>
            📋 Paste lesson
          </button>
        </div>
      )}

      {/* Has content — status bar */}
      {hasContent && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <button className="btn btn-sm" onClick={handlePaste}>
            📋 Paste updated lesson
          </button>
          <span className="small muted">{saveStatusText}</span>
        </div>
      )}

      {/* Lesson textarea */}
      <div className="card" style={{ marginBottom: 16 }}>
        <textarea
          id="lesson-textarea"
          key={lessonId}
          defaultValue={lesson.content || ''}
          style={{
            minHeight: 600,
            fontSize: 14,
            lineHeight: 1.9,
            resize: 'none',
            width: '100%',
          }}
          placeholder="Lesson will appear here after pasting…"
          onChange={handleContentChange}
        />
      </div>

      {/* Finish button — only shown when there is content */}
      {hasContent && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => go('after', { lessonId })}
          >
            Finish lesson &amp; add observations →
          </button>
        </div>
      )}
    </div>
  );
}
