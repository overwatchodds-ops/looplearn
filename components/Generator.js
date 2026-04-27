/**
 * Generator
 * 
 * Orchestrates the lesson generation flow:
 * 1. GeneratorSetup — user fills in details and clicks Generate
 * 2. PromptReady — user copies prompt, opens AI, comes back
 * 
 * Holds promptText and promptReady state here since they
 * span both child components.
 */

import { useState } from 'react';
import { buildPrompt } from '../lib/prompt';
import GeneratorSetup from './GeneratorSetup';
import PromptReady from './PromptReady';

export default function Generator({
  S,
  go,
  startLesson,
  setGeneratorMode,
  setBaseLessonId,
}) {
  const { learnerId, generatorMode, generatorBaseLessonId } = S.ui;

  const learner = S.learners.find(l => l.id === learnerId) || null;

  // All lessons for this learner, newest first
  const lessons = S.lessons
    .filter(l => l.learner_id === learnerId)
    .sort((a, b) => b.created_at - a.created_at);

  const [promptText, setPromptText] = useState('');
  const [promptReady, setPromptReady] = useState(false);
  const [lastConfig, setLastConfig] = useState(null); // for start lesson

  const handleGenerate = (config) => {
    const prompt = buildPrompt({
      name: learner?.name || 'the learner',
      ...config,
    });
    setLastConfig(config);
    setPromptText(prompt);
    setPromptReady(true);
    // Scroll to prompt after short delay to allow render
    setTimeout(() => {
      document.getElementById('prompt-ready-section')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleStartLesson = () => {
    startLesson(lastConfig?.subject || '', lastConfig?.theme || '');
  };

  return (
    <div>
      <GeneratorSetup
        learner={learner}
        lessons={lessons}
        generatorMode={generatorMode}
        generatorBaseLessonId={generatorBaseLessonId}
        onSelectMode={setGeneratorMode}
        onPickLesson={setBaseLessonId}
        onGenerate={handleGenerate}
      />

      {promptReady && (
        <div id="prompt-ready-section">
          <PromptReady
            promptText={promptText}
            learnerName={learner?.name || 'the learner'}
            onStartLesson={handleStartLesson}
          />
        </div>
      )}
    </div>
  );
}
