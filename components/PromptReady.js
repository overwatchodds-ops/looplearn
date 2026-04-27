/**
 * PromptReady
 * 
 * Shown after the prompt has been generated.
 * Displays the prompt text and guides the user through 4 steps:
 * 1. Copy the prompt
 * 2. Open their AI (ChatGPT / Gemini / Claude)
 * 3. Paste and send (with warning about old drafts)
 * 4. Come back and start a new lesson
 * 
 * Uses execCommand('copy') on the visible textarea — reliable on all browsers.
 * No clipboard API — avoids permission issues.
 */

import { useState } from 'react';

export default function PromptReady({ promptText, learnerName, onStartLesson }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const ta = document.getElementById('prompt-display');
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(0, ta.value.length);
    const success = document.execCommand('copy');
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="prompt-ready" style={{ marginTop: 24 }}>
      <div className="fw-500" style={{ fontSize: 17, marginBottom: 20 }}>
        Your prompt is ready
      </div>

      {/* Step 1 — Copy */}
      <div className="prompt-step" style={{ marginBottom: 24 }}>
        <div className="prompt-step-num">1</div>
        <div style={{ flex: 1 }}>
          <div className="fw-500" style={{ marginBottom: 10 }}>Copy the prompt</div>
          <div style={{ position: 'relative' }}>
            <textarea
              id="prompt-display"
              readOnly
              value={promptText}
              style={{
                width: '100%',
                minHeight: 160,
                fontSize: 12,
                lineHeight: 1.6,
                background: 'var(--ink)',
                color: '#e0e0e0',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 60px 14px 14px',
                resize: 'none',
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
            />
            <button
              onClick={handleCopy}
              title="Copy prompt"
              style={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                width: 40,
                height: 40,
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.25)',
                background: copied ? 'var(--teal)' : 'rgba(255,255,255,0.12)',
                color: 'white',
                cursor: 'pointer',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s',
              }}
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
          {copied && (
            <p className="small" style={{ color: 'var(--teal)', marginTop: 6 }}>
              Copied — ready to paste
            </p>
          )}
        </div>
      </div>

      {/* Step 2 — Open AI */}
      <div className="prompt-step" style={{ marginBottom: 24 }}>
        <div className="prompt-step-num">2</div>
        <div>
          <div className="fw-500" style={{ marginBottom: 10 }}>Open your AI</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <a href="https://chatgpt.com" target="_blank" rel="noreferrer"
              className="btn btn-primary btn-sm">
              ChatGPT ↗
            </a>
            <a href="https://gemini.google.com" target="_blank" rel="noreferrer"
              className="btn btn-sm">
              Gemini ↗
            </a>
            <a href="https://claude.ai" target="_blank" rel="noreferrer"
              className="btn btn-sm">
              Claude ↗
            </a>
          </div>
        </div>
      </div>

      {/* Step 3 — Paste warning */}
      <div className="prompt-step" style={{ marginBottom: 24 }}>
        <div className="prompt-step-num">3</div>
        <div className="small" style={{ color: 'var(--ink-mid)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--ink)' }}>Before pasting:</strong> if you see old
          text in the AI input box,{' '}
          <strong style={{ color: 'var(--rose)' }}>delete it first</strong> — the AI
          remembers previous sessions and will mix them up.<br /><br />
          Then click the input box and press <strong>Ctrl+V</strong> to paste, then Send.
        </div>
      </div>

      {/* Step 4 — Come back */}
      <div className="prompt-step" style={{ marginBottom: 28 }}>
        <div className="prompt-step-num">4</div>
        <div className="small" style={{ color: 'var(--ink-mid)', lineHeight: 1.8 }}>
          <strong style={{ color: 'var(--ink)' }}>Come back here</strong> once the AI
          has generated the lesson. Click the button below to create a new lesson and
          paste it in so {learnerName} can work through it.
        </div>
      </div>

      {/* Start lesson button */}
      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-primary btn-lg" onClick={onStartLesson}>
          Start new lesson →
        </button>
      </div>
    </div>
  );
}
