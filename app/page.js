/**
 * App — root component
 * 
 * Responsibilities:
 * - Load and provide app state via useAppState
 * - Render the sidebar (learner list + add learner)
 * - Render the topbar (title + contextual actions)
 * - Route to the correct screen component
 * 
 * All business logic lives in useAppState.
 * All screen rendering lives in components/.
 * This file is wiring only.
 */

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
  const [newLearnerName, setNewLearnerName] = useState('');
  const [addingLearner, setAddingLearner] = useState(false);
  const [editingLearnerName, setEditingLearnerName] = useState(false);
  const [learnerNameVal, setLearnerNameVal] = useState('');

  // Show blank page while localStorage loads (avoids hydration mismatch)
  if (!app.loaded || !app.S) {
    return <div style={{ minHeight: '100vh', background: 'var(--paper)' }} />;
  }

  const { S, go } = app;
  const { screen, learnerId, lessonId } = S.ui;

  // Derived values used in topbar
  const currentLearner = S.learners.find(l => l.id === learnerId) || null;
  const currentLesson = S.lessons.find(l => l.id === lessonId) || null;

  // ── Sidebar handlers ──

  const handleAddLearner = () => {
    if (!newLearnerName.trim()) return;
    app.addLearner(newLearnerName.trim());
    setNewLearnerName('');
    setAddingLearner(false);
  };

  const handleRemoveLearner = () => {
    if (!currentLearner) return;
    const confirmed = window.confirm(
      `Remove ${currentLearner.name} and all their lessons? This cannot be undone.`
    );
    if (confirmed) app.removeLearner(learnerId);
  };

  // ── Topbar title per screen ──
  const titles = {
    dashboard: 'Dashboard',
    learner: currentLearner?.name || '',
    generator: `Lesson Generator — ${currentLearner?.name || ''}`,
    lesson: currentLearner?.name || 'Lesson',
    after: 'After lesson',
  };

  return (
    <div className="app">

      {/* ────────── Sidebar ────────── */}
      <div className="sidebar">

        {/* Logo — click to go to dashboard */}
        <div
          className="sidebar-logo"
          style={{ cursor: 'pointer' }}
          onClick={() => go('dashboard', { learnerId: null, lessonId: null })}
        >
          <h1>LoopLearn</h1>
          <span>Learning loop system</span>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-label">Learners</div>

          {/* Learner buttons */}
          {S.learners.map(l => (
            <div
              key={l.id}
              className={`learner-btn ${learnerId === l.id && screen !== 'dashboard' ? 'active' : ''}`}
              onClick={() => go('learner', {
                learnerId: l.id,
                lessonId: null,
                generatorMode: null,
                generatorBaseLessonId: null,
              })}
            >
              <div className="learner-avatar">{initials(l.name)}</div>
              <span>{l.name}</span>
            </div>
          ))}

          {/* Add learner */}
          <div className="add-learner-wrap">
            {!addingLearner ? (
              <button
                className="add-learner-btn"
                onClick={() => setAddingLearner(true)}
              >
                + Add learner
              </button>
            ) : (
              <div className="add-learner-input-wrap">
                <input
                  autoFocus
                  type="text"
                  value={newLearnerName}
                  placeholder="Name, then press Enter…"
                  onChange={e => setNewLearnerName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') handleAddLearner();
                    if (e.key === 'Escape') {
                      setAddingLearner(false);
                      setNewLearnerName('');
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Sidebar footer */}
        <div style={{
          marginTop: 'auto',
          padding: '16px 20px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginBottom: 10, lineHeight: 1.5 }}>
            🔒 All data stays on your device. Nothing is sent to any server.
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['About', 'Privacy', 'Terms'].map(label => (
              <a
                key={label}
                href={`/${label.toLowerCase()}`}
                style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, textDecoration: 'none' }}
                onMouseOver={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
                onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* ────────── Main ────────── */}
      <div className="main">

        {/* Topbar */}
        <div className="topbar">
          <div className="topbar-title">
            {screen === 'learner' && currentLearner ? (
              editingLearnerName ? (
                <input
                  autoFocus
                  type="text"
                  value={learnerNameVal}
                  onChange={e => setLearnerNameVal(e.target.value)}
                  onBlur={() => {
                    if (learnerNameVal.trim() && learnerNameVal.trim() !== currentLearner.name) {
                      app.renameLearner(learnerId, learnerNameVal.trim());
                    }
                    setEditingLearnerName(false);
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      if (learnerNameVal.trim() && learnerNameVal.trim() !== currentLearner.name) {
                        app.renameLearner(learnerId, learnerNameVal.trim());
                      }
                      setEditingLearnerName(false);
                    }
                    if (e.key === 'Escape') setEditingLearnerName(false);
                  }}
                  style={{
                    fontSize: 20,
                    fontFamily: "'DM Serif Display', serif",
                    border: 'none',
                    borderBottom: '2px solid var(--gold)',
                    background: 'transparent',
                    outline: 'none',
                    color: 'var(--ink)',
                    width: 200,
                  }}
                />
              ) : (
                <span
                  style={{ cursor: 'pointer' }}
                  title="Click to rename"
                  onClick={() => { setLearnerNameVal(currentLearner.name); setEditingLearnerName(true); }}
                >
                  {currentLearner.name} <span style={{ fontSize: 13, color: 'var(--ink-light)' }}>✎</span>
                </span>
              )
            ) : (
              titles[screen] || ''
            )}
          </div>
          <div className="topbar-actions">

            {screen === 'learner' && (
              <>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => go('generator', {
                    learnerId,
                    lessonId: null,
                    generatorMode: null,
                    generatorBaseLessonId: null,
                  })}
                >
                  + New lesson
                </button>
                <button
                  className="btn btn-sm"
                  style={{ color: 'var(--rose)', borderColor: 'var(--rose)' }}
                  onClick={handleRemoveLearner}
                >
                  Remove
                </button>
              </>
            )}

            {screen === 'generator' && (
              <button className="btn btn-sm" onClick={() => go('learner', { learnerId })}>
                ← Back
              </button>
            )}

            {screen === 'lesson' && (
              <button
                className="btn btn-sm"
                onClick={() => go('learner', { learnerId: currentLesson?.learner_id, lessonId: null })}
              >
                ← Exit lesson
              </button>
            )}

            {screen === 'after' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => go('generator', {
                    learnerId: currentLesson?.learner_id,
                    lessonId: null,
                    generatorMode: 'continue',
                    generatorBaseLessonId: lessonId,
                  })}
                >
                  Generate next lesson →
                </button>
                <button
                  className="btn btn-sm"
                  onClick={() => go('learner', { learnerId: currentLesson?.learner_id, lessonId: null })}
                >
                  Complete &amp; exit
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Screen content */}
        <div className="content fade-in">
          {screen === 'dashboard' && (
            <Dashboard S={S} go={go} />
          )}
          {screen === 'learner' && (
            <LearnerPage S={S} go={go} removeLesson={app.removeLesson} />
          )}
          {screen === 'generator' && (
            <Generator
              S={S}
              go={go}
              startLesson={app.startLesson}
              setGeneratorMode={app.setGeneratorMode}
              setBaseLessonId={app.setBaseLessonId}
            />
          )}
          {screen === 'lesson' && (
            <Lesson
              S={S}
              go={go}
              autosave={app.autosave}
              updateLesson={app.updateLesson}
            />
          )}
          {screen === 'after' && (
            <AfterLesson
              S={S}
              addComment={app.addComment}
              deleteComment={app.deleteComment}
              updateAfterDial={app.updateAfterDial}
              updateAfterFmt={app.updateAfterFmt}
            />
          )}
        </div>

      </div>
    </div>
  );
}
