"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "looplearn_data";

function getData() {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export default function ChildPage({ params }) {
  const childId = params.id;

  const [data, setData] = useState(null);
  const [child, setChild] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const d = getData();
    if (!d) return;

    const c = d.children.find((x) => x.id === childId);
    const s = d.sessions.filter((x) => x.childId === childId);

    setData(d);
    setChild(c);
    setSessions(s);
  }, [childId]);

  function createSession() {
    const newSession = {
      id: Date.now().toString(),
      childId,
      title: `Session ${sessions.length + 1}`,
      content: "",
      responses: "",
      comments: [],
      state: "draft",
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...data,
      sessions: [...data.sessions, newSession],
    };

    saveData(updated);
    setSessions([...sessions, newSession]);
  }

  if (!child) return <div>Child not found</div>;

  return (
    <div>
      <h2>Child: {child.name}</h2>

      <button onClick={createSession} style={{ padding: 10 }}>
        New Session
      </button>

      <h3 style={{ marginTop: 20 }}>Sessions</h3>

      {sessions.length === 0 ? (
        <p>No sessions yet</p>
      ) : (
        sessions.map((s) => (
          <div key={s.id} style={{ padding: 10, border: "1px solid #ddd", marginTop: 10 }}>
            <a href={`/session/${s.id}`}>
              <strong>{s.title}</strong>
            </a>
          </div>
        ))
      )}
    </div>
  );
}
