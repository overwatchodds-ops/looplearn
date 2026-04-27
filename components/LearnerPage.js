import { fmt, initials, lessonLabel } from '../lib/state';

export default function LearnerPage({ S, go }) {
  const { learnerId } = S.ui;
  const learner = S.learners.find(l => l.id === learnerId);
  const lessons = S.lessons
    .filter(l => l.learner_id === learnerId)
    .sort((a, b) => b.created_at - a.created_at);

  if (!learner) return null;

  return (
    <div style={{ maxWidth: 700 }}>
      <div className="flex-center gap-12" style={{ marginBottom: 24 }}>
        <div className="learner-avatar"
          style={{ width: 48, height: 48, fontSize: 17, background: 'var(--cream)', color: 'var(--ink)' }}>
          {initials(learner.name)}
        </div>
        <h2 className="serif" style={{ fontSize: 24 }}>{learner.name}</h2>
      </div>

      {lessons.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="icon">⟳</div>
            <h3>No lessons yet</h3>
            <p>Click &quot;+ New lesson&quot; in the top right to get started</p>
          </div>
        </div>
      ) : lessons.map((l, i) => {
        const num = lessons.length - i;
        const sub = [l.subject, l.theme].filter(Boolean).join(' — ');
        const hasContent = !!(l.content?.trim());
        return (
          <div key={l.id} className="lesson-card"
            onClick={() => go(hasContent ? 'lesson' : 'generator', { lessonId: l.id, learnerId })}>
            <div className="flex-between">
              <div>
                <div className="flex-center gap-8" style={{ marginBottom: 4 }}>
                  <span style={{ background: 'var(--cream)', color: 'var(--ink-light)', fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
                    Lesson {num}
                  </span>
                  <div className="fw-500">{lessonLabel(l)}</div>
                </div>
                <div className="small muted">
                  {fmt(l.created_at)}{sub ? ' · ' + sub : ''}
                </div>
              </div>
              <div className="small muted">
                {hasContent
                  ? `${(l.comments || []).length} comment${l.comments?.length !== 1 ? 's' : ''}`
                  : <span style={{ color: 'var(--amber)' }}>No content yet</span>
                }
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
