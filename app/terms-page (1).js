export const metadata = { title: 'Terms of Use — LoopLearn' };

const s = {
  page: { minHeight: '100vh', background: 'var(--paper)', padding: '60px 24px' },
  wrap: { maxWidth: 640, margin: '0 auto' },
  back: { fontSize: 13, color: 'var(--ink-light)', textDecoration: 'none', display: 'inline-block', marginBottom: 32 },
  h1:   { fontFamily: "'DM Serif Display', serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8 },
  meta: { fontSize: 13, color: 'var(--ink-light)', marginBottom: 40 },
  h2:   { fontFamily: "'DM Serif Display', serif", fontSize: 18, color: 'var(--ink)', margin: '32px 0 8px' },
  p:    { fontSize: 15, color: 'var(--ink-mid)', lineHeight: 1.7, marginBottom: 12 },
  hr:   { border: 'none', borderTop: '1px solid var(--border)', margin: '40px 0' },
};

export default function TermsPage() {
  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <a href="/" style={s.back}>← Back to LoopLearn</a>

        <h1 style={s.h1}>Terms of Use</h1>
        <p style={s.meta}>Last updated: April 2026 · LoopLearn by ClickSeed Pty Ltd (ABN 87 656 256 567)</p>

        <h2 style={s.h2}>1. Acceptance</h2>
        <p style={s.p}>By using LoopLearn you agree to these terms. If you do not agree, please do not use the app.</p>

        <h2 style={s.h2}>2. What LoopLearn does</h2>
        <p style={s.p}>LoopLearn is a free browser-based tool that helps teachers generate adaptive lesson prompts for use with AI assistants such as ChatGPT, Gemini, or Claude. All data is stored locally in your browser — nothing is sent to our servers.</p>

        <h2 style={s.h2}>3. Your data</h2>
        <p style={s.p}>All learner records, lesson content, and observations are stored exclusively in your browser's localStorage. We have no access to this data. Clearing your browser storage will permanently delete it.</p>
        <p style={s.p}>Do not enter sensitive personal information about learners beyond what is needed for lesson planning.</p>

        <h2 style={s.h2}>4. Third-party AI services</h2>
        <p style={s.p}>LoopLearn generates prompts that you copy into third-party AI services. Your use of those services is governed by their own terms and privacy policies. We are not responsible for the content those services produce.</p>

        <h2 style={s.h2}>5. Acceptable use</h2>
        <p style={s.p}>LoopLearn is intended for educational use by teachers and tutors. You must not use it for any unlawful purpose or in any way that could harm a learner.</p>

        <h2 style={s.h2}>6. No warranties</h2>
        <p style={s.p}>LoopLearn is provided as-is, free of charge, without warranty of any kind. We do not guarantee uninterrupted availability or that the app will meet your specific requirements.</p>

        <h2 style={s.h2}>7. Limitation of liability</h2>
        <p style={s.p}>To the maximum extent permitted by law, ClickSeed Pty Ltd is not liable for any loss or damage arising from your use of LoopLearn.</p>

        <h2 style={s.h2}>8. Changes</h2>
        <p style={s.p}>We may update these terms from time to time. Continued use of LoopLearn after changes are posted constitutes acceptance of the updated terms.</p>

        <h2 style={s.h2}>9. Contact</h2>
        <p style={s.p}>Questions? Email us at <a href="mailto:chris@clickseed.com.au" style={{ color: 'var(--teal)' }}>chris@clickseed.com.au</a></p>

        <hr style={s.hr} />
        <p style={{ ...s.p, fontSize: 13 }}>ClickSeed Pty Ltd · ABN 87 656 256 567 · Sydney, Australia</p>
      </div>
    </div>
  );
}
