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

export default function FamilyPage() {
  const [family, setFamily] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const data = getData();
    if (data?.family) {
      setFamily(data.family);
    }
  }, []);

  function createFamily() {
    const newFamily = {
      id: Date.now().toString(),
      name: name || "My Family",
    };

    const data = {
      family: newFamily,
      children: [],
    };

    saveData(data);
    setFamily(newFamily);
  }

  if (family) {
    return (
      <div>
        <h2>Family: {family.name}</h2>

        <p>Next step: go to children system</p>

        <a href="/people">
          <button style={{ padding: 10 }}>Manage People</button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <h2>Create Family</h2>

      <input
        placeholder="Family name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: 8, marginRight: 10 }}
      />

      <button onClick={createFamily} style={{ padding: 10 }}>
        Create
      </button>
    </div>
  );
}
