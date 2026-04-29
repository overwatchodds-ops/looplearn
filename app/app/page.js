/**
 * About page
 * Accessible at /about
 */

export const metadata = {
  title: 'About — LoopLearn',
  description: 'LoopLearn is a free adaptive learning tool built by Chris Wong at ClickSeed Pty Ltd.',
};

export default function About() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--paper)',
      fontFamily: 'DM Sans, sans-serif',
      color: 'var(--ink)',
    }}>

      {/* Header */}
      <div style={{
        background: 'var(--ink)',
        padding: '24px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 22,
          color: 'white',
          textDecoration: 'none',
        }}>
          LoopLearn
        </a>
        <div style={{ display: 'flex', gap: 24 }}>
          <a href="/about" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>About</a>
          <a href="/privacy" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, textDecoration: 'none' }}>Privacy</a>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 36px' }}>

        <h1 style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 40,
          marginBottom: 12,
          lineHeight: 1.2,
        }}>
          About LoopLearn
        </h1>
        <p style={{ color: 'var(--ink-light)', fontSize: 18, marginBottom: 48 }}>
          Adaptive learning, continuously improving.
        </p>

        {/* What is it */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, marginBottom: 16 }}>
            What is LoopLearn?
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
            LoopLearn is a free tool that helps parents and teachers create personalised,
            adaptive lessons using AI. It works with ChatGPT, Gemini, or Claude to generate
            structured lessons tailored to each learner — then uses the learner&apos;s responses
            to continuously improve every subsequent lesson.
          </p>
          <p style={{ lineHeight: 1.8 }}>
            The idea is simple: the more lessons a learner completes, the better the AI
            understands them — their strengths, gaps, pace, and engagement style. Every
            lesson builds on the last.
          </p>
        </section>

        {/* How it works */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, marginBottom: 16 }}>
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['Generate', 'Fill in the subject, theme, and any context about your learner. LoopLearn builds a prompt and you paste it into your AI of choice.'],
              ['Teach', 'The AI generates a structured lesson. Paste it back into LoopLearn and your learner types their answers directly on screen.'],
              ['Observe', 'After the lesson, add your observations and set the direction for next time — difficulty, pacing, question formats.'],
              ['Repeat', 'Generate the next lesson prompt. The AI analyses the responses and builds a better, more targeted lesson every time.'],
            ].map(([title, desc], i) => (
              <div key={i} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'var(--ink)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  flexShrink: 0,
                  fontSize: 14,
                }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: 'var(--ink-mid)', lineHeight: 1.7, fontSize: 14 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who built it */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, marginBottom: 16 }}>
            Who built it
          </h2>
          <p style={{ lineHeight: 1.8, marginBottom: 16 }}>
            LoopLearn was built by <strong>Chris Wong</strong>, a CPA and technology builder
            based in Sydney, Australia. Chris builds practical tools that solve real problems —
            LoopLearn grew out of a simple question: what if every child could have a lesson
            that adapts to exactly where they are right now?
          </p>
          <p style={{ lineHeight: 1.8, marginBottom: 24 }}>
            LoopLearn is a product of{' '}
            <strong>ClickSeed Pty Ltd</strong> (ABN 87 656 256 567).
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href="https://www.linkedin.com/in/chriswongcpa"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: '#0077B5',
                color: 'white',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Connect on LinkedIn ↗
            </a>
            <a
              href="mailto:chris@clickseed.com.au"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'var(--cream)',
                color: 'var(--ink)',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                border: '1px solid var(--border)',
              }}
            >
              Get in touch
            </a>
          </div>
        </section>

        {/* Free forever */}
        <section style={{
          background: 'var(--cream)',
          borderRadius: 12,
          padding: '32px 36px',
          marginBottom: 48,
        }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, marginBottom: 12 }}>
            Free, always
          </h2>
          <p style={{ lineHeight: 1.8, color: 'var(--ink-mid)' }}>
            LoopLearn is free to use. Your data stays on your device — we don&apos;t store,
            collect, or share anything. No account required. No ads. No tracking.
            Just open it and start teaching.
          </p>
        </section>

        {/* Back link */}
        <a href="/" style={{
          color: 'var(--ink-light)',
          fontSize: 14,
          textDecoration: 'none',
        }}>
          ← Back to LoopLearn
        </a>

      </div>
    </div>
  );
}

