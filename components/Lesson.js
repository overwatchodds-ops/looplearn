import { useState } from 'react';
import { cleanPaste } from '../lib/prompt';
import { lessonLabel } from '../lib/state';
import { COPY_START, COPY_END } from '../lib/constants';

export default function Lesson({ S, go, autosave }) {
  const { lessonId } = S.ui;
  const lesson = S.lessons.find(l => l.id === lessonId);
  const learner = S.learners.find(l => l.id === lesson?.learner_id);
  const [saveMsg, setSaveMsg] = useState('');

  if (!lesson) return null;

  const hasContent = !!(lesson.content?.trim());
  const name = learner?.name || 'the learner';

  const handleChange = (e) => {
    autosave(lessonId, 'content', e.target.value);
    setSaveMsg('Saving…');
    setTimeout(() => setSaveMsg('Saved'), 600);
    setTimeout(() => setSaveMsg(''), 2000);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text.trim()) { alert('Nothing on clipboard — copy the lesson from your AI first.'); return; }
      const cleaned = cleanPaste(text, COPY_START, COPY_END);
      const ta = document.getElementById('lesson-textarea');
      if (ta) ta.value = cleaned;
      autosave(lessonId, 'content', cleaned);
      setSaveMsg('Lesson pasted ✓');
      setTimeout(() => setSaveMsg(''), 2000);
    } catch {
      alert('Click inside the lesson box below and press Ctrl+V to paste manually.');
      document.getElementById('lesson-textarea')?.focus();
    }
  };

  return (
    <div style={{ maxWidth: 800 }}>

      {/* Paste instruction banner */}
      {!hasContent && (
        <div style={{ background: 'var(--blue-light)', border: '1px solid rgba(58,110,168,0.2)', borderRadius: 'var(--radius)', padding: '20px 24px', marginBottom: 20 }}>
          <div className="fw-500" style={{ color: 'var(--blue)', marginBottom: 8 }}>
            Paste the lesson from your AI
          </div>
          <p className="small" style={{ color: 'var(--ink-mid)', marginBottom: 16, lineHeight: 1.7 }}>
            1. In your AI, click the <strong>copy button</strong> on the lesson response<br />
            2. Click <strong>&ldquo;Paste lesson&rdquo;</strong> below — LoopLearn extracts just the lesson automatically<br />
            3. {name} reads through and types answers directly into the text
          </p>
          <button className="btn btn-primary" onClick={handlePaste}>
            📋 Paste lesson
          </button>
        </div>
      )}

      {/* Paste updated button (when content exists) */}
      {hasContent && (
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
          <button className="btn btn-sm" onClick={handlePaste}>📋 Paste updated lesson</button>
          <span className="small muted">{saveMsg || `${name} can type answers below`}</span>
        </div>
      )}
      {!hasContent && saveMsg && (
        <p className="small" style={{ color: 'var(--teal)', marginBottom: 12 }}>{saveMsg}</p>
      )}

      {/* Lesson textarea */}
      <div className="card" style={{ marginBottom: 16 }}>
        <textarea
          id="lesson-textarea"
          key={lessonId}
          defaultValue={lesson.content || ''}
          style={{ minHeight: 600, fontSize: 14, lineHeight: 1.9, resize: 'none', width: '100%' }}
          placeholder="Lesson will appear here after pasting…"
          onChange={handleChange}
        />
      </div>

      {/* Finish button */}
      {hasContent && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button className="btn btn-primary btn-lg"
            onClick={() => go('after', { lessonId })}>
            Finish lesson &amp; add observations →
          </button>
        </div>
      )}
    </div>
  );
}
