"use client";

import { useState } from "react";

export default function PromptGenerator({ session }) {
  const [prompt, setPrompt] = useState("");

  function buildPrompt() {
    const content = session?.content || "";
    const responses = session?.responses || "";
    const comments = session?.comments || [];

    const commentText = comments.map(c => `- ${c.text}`).join("\n");

    const generated = `
You are a learning assistant helping a child continue their learning journey.

SESSION NOTES:
${content}

CHILD RESPONSES:
${responses}

OBSERVATIONS:
${commentText}

TASK:
Generate the next learning session. Keep difficulty appropriate. Reinforce understanding and build progression.
    `.trim();

    setPrompt(generated);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(prompt);
    alert("Prompt copied");
  }

  return (
    <div style={{ marginTop: 30, padding: 10, border: "1px solid #ddd" }}>
      <h3>AI Prompt Generator</h3>

      <button onClick={buildPrompt} style={{ padding: 10, marginRight: 10 }}>
        Generate Prompt
      </button>

      <button onClick={copyToClipboard} style={{ padding: 10 }}>
        Copy
      </button>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={10}
        style={{ width: "100%", marginTop: 10 }}
      />
    </div>
  );
}
