/**
 * Privacy Policy page
 * Accessible at /privacy
 */

export const metadata = {
  title: 'Privacy Policy — LoopLearn',
  description: 'LoopLearn privacy policy — your data stays on your device.',
};

const LAST_UPDATED = '27 April 2026';

export default function Privacy() {
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
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--ink-light)', fontSize: 14, marginBottom: 48 }}>
          Last updated: {LAST_UPDATED}
        </p>

        {[
          {
            title: 'The short version',
            body: `LoopLearn does not collect, store, transmit, or share any personal data.
Everything you enter into LoopLearn — learner names, lesson content, observations —
stays entirely on your device in your browser's local storage.
We have no servers that receive your data. We have no database. We cannot see anything you do in the app.`,
          },
          {
            title: 'What data is stored',
            body: `LoopLearn stores the following data locally in your browser using localStorage:
• Learner names you create
• Lesson content you paste in
• Learner responses typed into lessons
• Observation comments you add
• Direction dial settings

This data never leaves your device. It is not sent to LoopLearn, ClickSeed Pty Ltd, or any third party.`,
          },
          {
            title: 'AI services',
            body: `When you use LoopLearn, you copy a prompt and paste it into a third-party AI service such as ChatGPT (OpenAI), Gemini (Google), or Claude (Anthropic). LoopLearn does not send data to these services directly — you do this manually by copying and pasting.

Please review the privacy policies of whichever AI service you choose to use:
• ChatGPT: openai.com/policies/privacy-policy
• Gemini: policies.google.com/privacy
• Claude: anthropic.com/privacy`,
          },
          {
            title: 'Cookies and tracking',
            body: `LoopLearn does not use cookies. LoopLearn does not use analytics, tracking pixels, or any third-party monitoring tools. We do not know how many people use LoopLearn or what they do with it.`,
          },
          {
            title: 'Children\'s privacy',
            body: `LoopLearn is designed to be used by parents and teachers with learners of all ages. Because no data is collected or transmitted, there is no personal data of children stored on any server. Learner names and lesson responses exist only on the device being used.`,
          },
          {
            title: 'Data deletion',
            body: `To delete all LoopLearn data, clear your browser's local storage for looplearn-jet.vercel.app. In Chrome: Settings → Privacy and security → Site settings → View permissions and data stored across sites → search for looplearn → Delete.

Alternatively, clearing all browser data will remove LoopLearn data along with everything else.`,
          },
          {
            title: 'Contact',
            body: `If you have any questions about this privacy policy, please contact:

Chris Wong
ClickSeed Pty Ltd (ABN 87 656 256 567)
chris@clickseed.com.au`,
          },
        ].map(({ title, body }) => (
          <section key={title} style={{ marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 22,
              marginBottom: 12,
            }}>
              {title}
            </h2>
            <p style={{
              lineHeight: 1.9,
              color: 'var(--ink-mid)',
              whiteSpace: 'pre-line',
              fontSize: 15,
            }}>
              {body}
            </p>
          </section>
        ))}

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
