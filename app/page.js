'use client';
import { useState } from 'react';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'LoopLearn',
  url: 'https://looplearn-jet.vercel.app',
  description:
    'LoopLearn helps parents, tutors and therapists build personalised AI-powered lessons for neurodiverse children, including autistic learners and kids with ADHD.',
  applicationCategory: 'EducationApplication',
  operatingSystem: 'All',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  author: {
    '@type': 'Organization',
    name: 'ClickSeed Pty Ltd',
    url: 'https://looplearn-jet.vercel.app',
  },
  audience: {
    '@type': 'Audience',
    audienceType: 'Parents, tutors, therapists supporting neurodiverse learners',
  },
};

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
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#F7F8FA', color: '#1D2333', minHeight: '100vh' }}>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Lora:ital,wght@0,400;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .hero-title { font-family: 'Lora', serif; font-size: clamp(36px, 5.5vw, 62px); line-height: 1.15; color: #1D2333; }
        .section-title { font-family: 'Lora', serif; font-size: clamp(22px, 3.5vw, 34px); color: #1D2333; }
        .cta-btn { display: inline-block; background: #2A9D8F; color: white; padding: 16px 36px; border-radius: 8px; font-size: 15px; font-weight: 600; text-decoration: none; transition: background 0.15s; cursor: pointer; border: none; font-family: 'Inter', sans-serif; letter-spacing: 0.01em; }
        .cta-btn:hover { background: #238b7e; }
        .cta-btn-outline { display: inline-block; background: transparent; color: #2C3E6B; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 500; text-decoration: none; border: 1.5px solid #2C3E6B; transition: all 0.15s; }
        .cta-btn-outline:hover { background: #2C3E6B; color: white; }
        .step-num { font-family: 'Lora', serif; font-size: 44px; color: #2A9D8F; line-height: 1; margin-bottom: 12px; font-weight: 600; }
        .tag { display: inline-block; background: rgba(42,157,143,0.1); color: #1a7a6e; padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 24px; border: 1px solid rgba(42,157,143,0.2); }
        .card { background: white; border-radius: 12px; padding: 28px; border: 1px solid #E8EAF0; transition: box-shadow 0.15s; }
        .card:hover { box-shadow: 0 4px 20px rgba(44,62,107,0.08); }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .hero-grid { flex-direction: column !important; }
          .hero-visual { display: none !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .audience-grid { grid-template-columns: 1fr !important; }
          .footer-grid { flex-direction: column !important; gap: 12px !important; text-align: center; }
          .cta-group { flex-direction: column !important; align-items: flex-start !important; }
          .email-form { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .steps-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: '18px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8EAF0', background: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: '#2A9D8F', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 12, height: 12, border: '2px solid white', borderRadius: '50%' }} />
          </div>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 20, color: '#2C3E6B', fontWeight: 600 }}>LoopLearn</div>
        </div>
        <div className="nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <a href="/about" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>About</a>
          <a href="/privacy" style={{ color: '#6B7280', fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>Privacy</a>
          <a href="/app" className="cta-btn" style={{ padding: '9px 20px', fontSize: 14 }}>Open app →</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: 'clamp(52px, 8vw, 100px) 40px clamp(48px, 6vw, 80px)' }}>
        <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
          <div style={{ flex: 1 }}>
            <div className="tag">Free · No account needed</div>
            <h1 className="hero-title" style={{ marginBottom: 24 }}>
              Every lesson,<br />
              <em style={{ color: '#2C3E6B' }}>built for that child.</em>
            </h1>
            <p style={{ fontSize: 17, color: '#4B5563', lineHeight: 1.85, marginBottom: 36, maxWidth: 480, fontWeight: 400 }}>
              LoopLearn helps parents, teachers, and therapists create personalised AI lessons that adapt to each learner — session by session, response by response. Built by a parent who knows that one-size lessons don't fit every child.
            </p>
            <div className="cta-group" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
              <a href="/app" className="cta-btn">Start teaching →</a>
              <a href="#how" className="cta-btn-outline">See how it works</a>
            </div>
            <p style={{ fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: '#2A9D8F' }}>✓</span> All data stays on your device. Nothing stored on our servers.
            </p>
          </div>

          {/* Hero visual */}
          <div className="hero-visual" style={{ flex: '0 0 300px' }}>
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E8EAF0', boxShadow: '0 8px 40px rgba(44,62,107,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0F1F5' }}>
                <div style={{ width: 8, height: 8, background: '#2A9D8F', borderRadius: '50%' }} />
                <div style={{ fontFamily: "'Lora', serif", color: '#6B7280', fontSize: 13 }}>Today's lesson — Mia</div>
              </div>
              {[['Subject', 'Mathematics'], ['Topic', 'Fractions'], ['Direction', '↑ More challenge']].map(([label, value]) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4, fontWeight: 600 }}>{label}</div>
                  <div style={{ background: '#F7F8FA', borderRadius: 6, padding: '10px 14px', color: '#1D2333', fontSize: 14, border: '1px solid #E8EAF0' }}>{value}</div>
                </div>
              ))}
              <div style={{ marginTop: 16, background: '#2A9D8F', borderRadius: 8, padding: '12px 16px', color: 'white', fontWeight: 600, fontSize: 14, textAlign: 'center', cursor: 'pointer' }}>
                Generate lesson prompt →
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ background: 'white', padding: 'clamp(48px, 7vw, 90px) 40px', borderTop: '1px solid #E8EAF0', borderBottom: '1px solid #E8EAF0' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>How it works</h2>
            <p style={{ color: '#6B7280', fontSize: 16 }}>Four steps. No account. No setup.</p>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {[
              ['1', 'Generate', 'Fill in the subject, topic, and a few notes about your learner. LoopLearn builds a smart prompt.'],
              ['2', 'Teach', 'Paste the prompt into ChatGPT, Gemini, or Claude. Copy the lesson back into LoopLearn.'],
              ['3', 'Observe', 'Your learner types their answers. You add observations and set the direction for next time.'],
              ['4', 'Repeat', 'Generate the next lesson. The AI uses everything it knows to make it better every time.'],
            ].map(([n, title, desc]) => (
              <div key={n} style={{ paddingTop: 8, borderTop: '2px solid #2A9D8F' }}>
                <div className="step-num">{n}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#1D2333' }}>{title}</div>
                <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section style={{ padding: 'clamp(48px, 7vw, 90px) 40px', background: '#F7F8FA' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 className="section-title" style={{ marginBottom: 12 }}>Built for one-on-one learning</h2>
            <p style={{ color: '#6B7280', fontSize: 16 }}>Whether you're a parent, tutor, or specialist — LoopLearn works for you.</p>
          </div>
          <div className="audience-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
            {[
              ['👨‍👩‍👧', 'Parents', 'Teach your child at home with lessons that adapt to exactly where they are — no teaching degree required.'],
              ['📚', 'Tutors & teachers', 'Create personalised sessions in minutes. Let the AI handle the structure while you focus on your learner.'],
              ['🩺', 'Therapists & specialists', 'Perfect for speech therapists, learning support specialists, and anyone working one-on-one with a child.'],
              ['🌟', 'Neurodiverse learners', "Built by a parent of two boys on the autism spectrum. LoopLearn is designed to adapt to each child's pace, style, and strengths — not the other way around."],
            ].map(([emoji, title, desc]) => (
              <div key={title} className="card">
                <div style={{ fontSize: 28, marginBottom: 14 }}>{emoji}</div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8, color: '#2C3E6B' }}>{title}</div>
                <div style={{ color: '#6B7280', fontSize: 14, lineHeight: 1.75 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA + Email */}
      <section style={{ background: '#2C3E6B', padding: 'clamp(48px, 7vw, 90px) 40px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Lora', serif", fontSize: 'clamp(26px, 4vw, 40px)', color: 'white', marginBottom: 16, lineHeight: 1.25 }}>
            Ready to try it?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, marginBottom: 36, lineHeight: 1.75 }}>
            Free to use, nothing to install. Open it now and create your first lesson in minutes.
          </p>
          <a href="/app" className="cta-btn" style={{ marginBottom: 40, display: 'inline-block', background: '#2A9D8F' }}>
            Open LoopLearn free →
          </a>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 14 }}>Stay in the loop — get notified about updates</p>
            {submitted ? (
              <p style={{ color: '#2A9D8F', fontWeight: 500 }}>✓ Thanks! We'll be in touch.</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="email-form" style={{ display: 'flex', gap: 8, maxWidth: 400, margin: '0 auto' }}>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{ flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 14, fontFamily: "'Inter', sans-serif", outline: 'none', minWidth: 0 }}
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
      <footer style={{ padding: '28px 40px', borderTop: '1px solid #E8EAF0', background: 'white' }}>
        <div className="footer-grid" style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: '#2C3E6B', fontWeight: 600 }}>LoopLearn</div>
          <div style={{ fontSize: 13, color: '#9CA3AF' }}>© 2026 ClickSeed Pty Ltd · ABN 87 656 256 567</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['About', 'Privacy', 'Terms'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} style={{ color: '#9CA3AF', fontSize: 13, textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
