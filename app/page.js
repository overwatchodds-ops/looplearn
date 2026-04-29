'use client';
import { useState } from 'react';

export default function Landing() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSubmitted(true);
    setSubmitting(false);
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#faf9f6', color: '#1a1a2e', minHeight: '100vh' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-title { font-family: 'DM Serif Display', serif; font-size: clamp(36px, 6vw, 68px); line-height: 1.1; color: #1a1a2e; }
        .section-title { font-family: 'DM Serif Display', serif; font-size: clamp(24px, 4vw, 36px); color: #1a1a2e; }
        .cta-btn { display: inline-block; background: #1a1a2e; color: white; padding: 16px 36px; border-radius: 10px; font-size: 16px; font-weight: 600; text-decoration: none; transition: opacity 0.15s; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; }
        .cta-btn:hover { opacity: 0.85; }
        .cta-btn-outline { display: inline-block; background: transparent; color: #1a1a2e; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; text-decoration: none; border: 1.5px solid rgba(26,26,46,0.25); transition: all 0.15s; }
        .cta-btn-outline:hover { border-color: #1a1a2e; background: rgba(26,26,46,0.04); }
        .step-num { font-family: 'DM Serif Display', serif; font-size: 48px; color: #c9a84c; line-height: 1; margin-bottom: 12px; }
        .tag { display: inline-block; background: rgba(201,168,76,0.15); color: #8a6f20; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 24px; }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hero-grid { flex-direction: column !important; }
          .hero-visual { display: none !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .audience-grid { grid-template-columns: 1fr !important; }
          .footer-grid { flex-direction: column !important; gap: 12px !important; text-align: center; }
          .cta-group { flex-direction: column !important; }
          .email-form { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(26,26,46,0.08)', background: '#faf9f6' }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22 }}>LoopLearn</div>
        <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="/about" style={{ color: '#7b7b9a', fontSize: 14, textDecoration: 'none' }}>About</a>
          <a href="/privacy" style={{ color: '#7b7b9a', fontSize: 14, textDecoration: 'none' }}>Privacy</a>
          <a href="/app" className="cta-btn" style={{ padding: '10px 22px', fontSize: 14 }}>Open app →</a>
        </div>
        <a href="/app" className="cta-btn" style={{ padding: '10px 22px', fontSize: 14, display: 'none' }} id="nav-mobile-cta">Open app →</a>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(52px, 8vw, 100px) 40px clamp(48px, 6vw, 80px)' }}>
        <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', gap: 64 }}>
          <div style={{ flex: 1 }}>
            <div className="tag">Free · No account needed</div>
            <h1 className="hero-title" style={{ marginBottom: 24 }}>
              Every lesson,<br />
              <em>built for that child.</em>
            </h1>
            <p style={{ fontSize: 18, color: '#5a5a7a', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
              LoopLearn helps parents, teachers, and therapists create personalised AI lessons that adapt to each learner — session by session, response by response. Built by a parent who knows that one-size lessons don't fit every child.
            </p>
            <div className="cta-group" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <a href="/app" className="cta-btn">Start teaching →</a>
              <a href="#how" className="cta-btn-outline">See how it works</a>
            </div>
            <p style={{ fontSize: 13, color: '#9b9bb5' }}>
              🔒 All data stays on your device. Nothing stored on our servers.
            </p>
          </div>

          {/* Hero visual */}
          <div className="hero-visual" style={{ flex: '0 0 300px' }}>
            <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 28, boxShadow: '0 24px 60px rgba(26,26,46,0.2)' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 20 }}>Today's lesson — Mia</div>
              {[['Subject', 'Mathematics'], ['Topic', 'Fractions'], ['Direction', '↑ More challenge']].map(([label, value]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>{label}</div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 14px', color: 'white', fontSize: 14 }}>{value}</div>
                </div>
              ))}
              <div style={{ marginTop: 20, background: '#c9a84c', borderRadius: 8, padding: '12px 16px', color: '#1a1a2e', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
                Generate lesson prompt →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: 'white', padding: 'clamp(48px, 7vw, 90px) 40px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>How it works</h2>
            <p style={{ color: '#7b7b9a', fontSize: 16 }}>Four steps. No account. No setup.</p>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              ['1', 'Generate', 'Fill in the subject, topic, and a few notes about your learner. LoopLearn builds a smart prompt.'],
              ['2', 'Teach', 'Paste the prompt into ChatGPT, Gemini, or Claude. Copy the lesson back into LoopLearn.'],
              ['3', 'Observe', 'Your learner types their answers. You add observations and set the direction for next time.'],
              ['4', 'Repeat', 'Generate the next lesson. The AI uses everything it knows to make it better every time.'],
            ].map(([n, title, desc]) => (
              <div key={n}>
                <div className="step-num">{n}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{title}</div>
                <div style={{ color: '#7b7b9a', fontSize: 14, lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: 'clamp(48px, 7vw, 90px) 40px', background: '#faf9f6' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Built for one-on-one learning</h2>
            <p style={{ color: '#7b7b9a', fontSize: 16 }}>Whether you're a parent, tutor, or specialist — LoopLearn works for you.</p>
          </div>
          <div className="audience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            {[
              ['👨‍👩‍👧', 'Parents', 'Teach your child at home with lessons that adapt to exactly where they are — no teaching degree required.'],
              ['📚', 'Tutors & teachers', 'Create personalised sessions in minutes. Let the AI handle the structure while you focus on your learner.'],
              ['🩺', 'Therapists & specialists', 'Perfect for speech therapists, learning support specialists, and anyone working one-on-one with a child.'],
              ['🌟', 'Neurodiverse learners', 'Built by a parent of two boys on the autism spectrum. LoopLearn is designed to adapt to each child\'s pace, style, and strengths — not the other way around.'],
            ].map(([emoji, title, desc]) => (
              <div key={title} style={{ background: 'white', borderRadius: 14, padding: 28, border: '1px solid rgba(26,26,46,0.08)' }}>
                <div style={{ fontSize: 32, marginBottom: 14 }}>{emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 17, marginBottom: 8 }}>{title}</div>
                <div style={{ color: '#7b7b9a', fontSize: 14, lineHeight: 1.7 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Email */}
      <section style={{ background: '#1a1a2e', padding: 'clamp(48px, 7vw, 90px) 40px' }}>
        <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 4vw, 42px)', color: 'white', marginBottom: 16, lineHeight: 1.2 }}>
            Ready to try it?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, marginBottom: 36, lineHeight: 1.7 }}>
            Free to use, nothing to install. Open it now and create your first lesson in minutes.
          </p>
          <a href="/app" className="cta-btn" style={{ background: '#c9a84c', color: '#1a1a2e', marginBottom: 40, display: 'inline-block' }}>
            Open LoopLearn free →
          </a>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 14 }}>Stay in the loop — get notified about updates</p>
            {submitted ? (
              <p style={{ color: '#c9a84c', fontWeight: 500 }}>✓ Thanks! We'll be in touch.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="email-form" style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.07)', color: 'white', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', minWidth: 0 }}
                  />
                  <button type="submit" disabled={submitting} className="cta-btn" style={{ padding: '12px 20px', fontSize: 14, whiteSpace: 'nowrap' }}>
                    {submitting ? '…' : 'Notify me'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '28px 40px', borderTop: '1px solid rgba(26,26,46,0.08)', background: '#faf9f6' }}>
        <div className="footer-grid" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 16 }}>LoopLearn</div>
          <div style={{ fontSize: 13, color: '#9b9bb5' }}>© 2026 ClickSeed Pty Ltd · ABN 87 656 256 567</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['About', 'Privacy', 'Terms'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} style={{ color: '#9b9bb5', fontSize: 13, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
