/**
 * Dashboard
 * 
 * Entry point after opening the app.
 * Shows summary stats, all learners, and recent lessons.
 * Clicking a learner navigates to their lesson list.
 * Clicking a recent lesson navigates directly to that lesson.
 */

import { fmtShort, initials, lessonLabel } from '../lib/state';

export default function Dashboard({ S, go }) {
  // All lessons sorted newest first for recent list
  const recentLessons = [...S.lessons]
    .sort((a, b) => b.updated_at - a.updated_at)
    .slice(0, 5);

  const lastActivity = S.lessons.length > 0
    ? fmtShort(Math.max(...S.lessons.map(l => l.updated_at)))
    : '—';

  const lessonsForLearner = (learnerId) =>
    S.lessons.filter(l => l.learner_id === learnerId);

  return (
    <div style={{ maxWidth: 900 }}>
      <p className="muted" style={{ marginBottom: 20 }}>Welcome to LoopLearn.</p>

      {/* Summary stats */}
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

      {/* Empty state */}
      {S.learners.length === 0 && (
        <div className="card">
          <div className="empty">
            <div className="icon">◎</div>
            <h3>Add your first learner</h3>
            <p>Use &quot;+ Add learner&quot; in the sidebar to get started</p>
          </div>
        </div>
      )}

      {/* Learners + recent lessons */}
      {S.learners.length > 0 && (
        <div className="grid-2">

          {/* Learner list */}
          <div className="card">
            <div className="fw-500" style={{ marginBottom: 16 }}>Learners</div>
            {S.learners.map(l => {
              const count = lessonsForLearner(l.id).length;
              return (
                <div
                  key={l.id}
                  className="lesson-card"
                  onClick={() => go('learner', { learnerId: l.id })}
                >
                  <div className="flex-center gap-12">
                    <div
                      className="learner-avatar"
                      style={{ width: 36, height: 36, fontSize: 13, background: 'var(--cream)', color: 'var(--ink)' }}
                    >
                      {initials(l.name)}
                    </div>
                    <div>
                      <div className="fw-500">{l.name}</div>
                      <div className="small muted">
                        {count === 0
                          ? 'No lessons yet'
                          : `${count} lesson${count !== 1 ? 's' : ''}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent lessons */}
          <div className="card">
            <div className="fw-500" style={{ marginBottom: 16 }}>Recent lessons</div>
            {recentLessons.length === 0 ? (
              <p className="small muted">No lessons yet</p>
            ) : (
              recentLessons.map(l => {
                const learner = S.learners.find(lr => lr.id === l.learner_id);
                return (
                  <div
                    key={l.id}
                    className="lesson-card"
                    onClick={() => go('lesson', { lessonId: l.id, learnerId: l.learner_id })}
                  >
                    <div className="fw-500 small">{lessonLabel(l)}</div>
                    <div className="small muted">
                      {learner?.name} · {fmtShort(l.updated_at)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}
