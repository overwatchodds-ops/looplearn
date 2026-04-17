"use client";

import { useState, useEffect } from "react";
import PromptGenerator from "@/components/PromptGenerator";

const STORAGE_KEY = "looplearn_data";

function getData() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function SessionPage({ params }) {
  const sessionId = params.id;

  const [data, setData] = useState(null);
  const [session, setSession] = useState(null);

  const [content, setContent] = useState("");
  const [responses, setResponses] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const d = getData();
    if (!d) return;

    const s = d.sessions.find((x) => x.id === sessionId);

    setData(d);
    setSession(s);

    if (s) {
      setContent(s.content || "");
      setResponses(s.responses || "");
    }
  }, [sessionId]);

  function saveSession() {
    const updatedSessions = data.sessions.map((s) =>
      s.id === sessionId
        ? { ...s, content, responses }
        : s
    );

    const updated = {
      ...data,
      sessions: updatedSessions,
    };

    saveData(updated);
    setData(updated);
  }

  function addComment() {
    const updatedSessions = data.sessions.map((s) =>
      s.id === sessionId
        ? {
            ...s,
            comments: [
              ...(s.comments || []),
              {
                id: Date.now().toString(),
                text: comment,
                createdAt: new Date().toISOString(),
              },
            ],
          }
        : s
    );

    const updated = {
      ...data,
      sessions: updatedSessions,
    };

    saveData(updated);
    setData(updated);
    setComment("");
  }

  if (!session) return <div>Session not found</div>;

  return (
    <div>
      <h2>{session.title}</h2>

      {/* SESSION CONTENT */}
      <div style={{ marginTop: 20 }}>
        <h3>Session Notes</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          style={{ width: "100%" }}
        />
      </div>

      {/* RESPONSES */}
      <div style={{ marginTop: 20 }}>
        <h3>Child Responses</h3>
        <textarea
          value={responses}
          onChange={(e) => setResponses(e.target.value)}
          rows={4}
          style={{ width: "100%" }}
        />
      </div>

      <button onClick={saveSession} style={{ padding: 10, marginTop: 10 }}>
        Save Session
      </button>

      {/* COMMENTS */}
      <div style={{ marginTop: 30 }}>
        <h3>Comments</h3>

        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add observation..."
          style={{ padding: 8, width: "70%" }}
        />

        <button onClick={addComment} style={{ padding: 8, marginLeft: 10 }}>
          Add
        </button>

        <div style={{ marginTop: 10 }}>
          {(session.comments || []).map((c) => (
            <div key={c.id} style={{ padding: 5, borderBottom: "1px solid #eee" }}>
              {c.text}
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 PROMPT GENERATOR (CORE LOOPLEARN FEATURE) */}
      <PromptGenerator session={session} />
    </div>
  );
}
