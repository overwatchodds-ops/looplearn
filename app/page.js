'use client';
import { useState } from 'react';
import { useAppState } from '../lib/useAppState';
import { initials, lessonLabel } from '../lib/state';
import Dashboard from '../components/Dashboard';
import LearnerPage from '../components/LearnerPage';
import Generator from '../components/Generator';
import Lesson from '../components/Lesson';
import AfterLesson from '../components/AfterLesson';

export default function App() {
  const app = useAppState();
  const [addLearnerVisible, setAddLearnerVisible] = useState(false);
  const [newLearnerName, setNewLearnerName] = useState('');

  if (!app.loaded || !app.S) return <div style={{ minHeight: '100vh', background: 'var(--paper)' }} />;

  const { S, go } = app;
  const { screen, learnerId, lessonId } = S.ui;
  const currentLearner = S.learners.find(l => l.id === learnerId);
  const currentLesson = S.lessons.find(l => l.id === lessonId);

  const handleAddLearner = () => {
    if (!newLearnerName.trim()) return;
    app.addLearner(newLearnerName.trim());
    setNewLearnerName('');
    setAddLearnerVisible(false);
  };

  const topbarTitle = {
    dashboard: 'Dashboard',
    learner: currentLearner?.name || 'Learner',
    generator: `Lesson Generator — ${currentLearner?.name || ''}`,
    lesson: currentLesson ? lessonLabel(currentLesson) : 'Lesson',
    after: `After lesson — ${currentLesson ? lessonLabel(currentLesson) : ''}`,
  }[screen] || '';

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-logo">
          <h1>LoopLearn</h1>
          <span>Learning loop system</span>
        </div>
        <div className="sidebar-section">
          <div className="sidebar-label">Learners</div>
          {S.learners.map(l => (
            <div key={l.id}
              className={`learner-btn ${learnerId === l.id && screen !== 'dashboard' ? 'active' : ''}`}
              onClick={() => go('learner', { learnerId: l.id, lessonId: null, generatorMode: null, generatorBaseLessonId: null })}>
              <div className="learner-avatar">{initials(l.name)}</div>
              <span>{l.name}</span>
            </div>
          ))}
          <div className="add-learner-wrap">
            {!addLearnerVisible ? (
              <button className="add-learner-btn" onClick={() => setAddLearnerVisible(true)}>+ Add learner</button>
            ) : (
              <div className="add-learner-input-wrap">
                <input autoFocus type="text" value={newLearnerName} placeholder="Name, then press Enter…"
                  onChange={e => setNewLearnerName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddLearner();
                    if (e.key === 'Escape') { setAddLearnerVisible(false); setNewLearnerName(''); }
                  }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="main">
        <div className="topbar">
          <div className="topbar-title">{topbarTitle}</div>
          <div className="topbar-actions">
            {screen === 'learner' && (
              <button className="btn btn-primary btn-sm"
                onClick={() => go('generator', { learnerId, lessonId: null, generatorMode: null, generatorBaseLessonId: null })}>
                + New lesson
              </button>
            )}
            {screen === 'generator' && (
              <button className="btn btn-sm" onClick={() => go('learner', { learnerId })}>← Back</button>
            )}
            {screen === 'lesson' && (
              <button className="btn btn-sm" onClick={() => go('learner', { learnerId: currentLesson?.learner_id })}>← Exit lesson</button>
            )}
            {screen === 'after' && (
              <button className="btn btn-primary btn-sm" onClick={() => go('learner', { learnerId: currentLesson?.learner_id })}>Complete &amp; exit</button>
            )}
          </div>
        </div>

        <div className="content fade-in">
          {screen === 'dashboard' && <Dashboard S={S} go={go} />}
          {screen === 'learner' && <LearnerPage S={S} go={go} />}
          {screen === 'generator' && <Generator S={S} go={go} startLesson={app.startLesson} setGeneratorMode={app.setGeneratorMode} setBaseLessonId={app.setBaseLessonId} />}
          {screen === 'lesson' && <Lesson S={S} go={go} autosave={app.autosave} />}
          {screen === 'after' && <AfterLesson S={S} go={go} addComment={app.addComment} deleteComment={app.deleteComment} updateAfterDial={app.updateAfterDial} updateAfterFmt={app.updateAfterFmt} />}
        </div>
      </div>
    </div>
  );
}
