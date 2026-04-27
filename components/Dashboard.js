import { fmtShort, initials, lessonLabel } from '../lib/state';

export default function Dashboard({ S, go }) {
  const learnerLessons = (lid) =>
    S.lessons.filter(l => l.learner_id === lid).sort((a, b) => b.created_at - a.created_at);

  const recent = [...S.lessons].sort((a, b) => b.updated_at - a.updated_at).slice(0, 5);
  const lastActivity = S.lessons.length
    ? fmtShort(Math.max(...S.lessons.map(l => l.updated_at)))
    : '—';

  return (
    <div style={{ maxWidth: 900 }}>
      <p className="muted" style={{ marginBottom: 20 }}>Welcome to LoopLearn.</p>

      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-value">{S.learners.length}</div>
          <div className="stat-label">Learners</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{S.lessons.length}</div>
          <div className="stat-label">Lessons</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{lastActivity}</div>
          <div className="stat-label">Last activity</div>
        </div>
      </div>

      {S.learners.length === 0 ? (
        <div className="card">
          <div className="empty">
            <div className="icon">◎</div>
            <h3>Add your first learner</h3>
            <p>Use &quot;+ Add learner&quot; in the sidebar to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid-2">
          <div className="card">
            <div className="fw-500" style={{ marginBottom: 16 }}>Learners</div>
            {S.learners.map(l => {
              const ls = learnerLessons(l.id);
              return (
                <div key={l.id} className="lesson-card"
                  onClick={() => go('learner', { learnerId: l.id })}>
                  <div className="flex-center gap-12">
                    <div className="learner-avatar"
                      style={{ width: 36, height: 36, fontSize: 13, background: 'var(--cream)', color: 'var(--ink)' }}>
                      {initials(l.name)}
                    </div>
                    <div>
                      <div className="fw-500">{l.name}</div>
                      <div className="small muted">
                        {ls.length === 0 ? 'No lessons yet' : `${ls.length} lesson${ls.length !== 1 ? 's' : ''}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card">
            <div className="fw-500" style={{ marginBottom: 16 }}>Recent lessons</div>
            {recent.length === 0 ? (
              <p className="small muted">No lessons yet</p>
            ) : recent.map(l => {
              const learner = S.learners.find(lr => lr.id === l.learner_id);
              return (
                <div key={l.id} className="lesson-card"
                  onClick={() => go('lesson', { lessonId: l.id, learnerId: l.learner_id })}>
                  <div className="fw-500 small">{lessonLabel(l)}</div>
                  <div className="small muted">{learner?.name} · {fmtShort(l.updated_at)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
