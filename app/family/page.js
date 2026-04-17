"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

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
  const [data, setData] = useState(null);
  const [family, setFamily] = useState(null);
  const [children, setChildren] = useState([]);
  const [name, setName] = useState("");
  const [childName, setChildName] = useState("");

  useEffect(() => {
    const d = getData();
    if (d?.family) {
      setData(d);
      setFamily(d.family);
      setChildren(d.children || []);
    }
  }, []);

  function createFamily() {
    const newFamily = {
      id: Date.now().toString(),
      name: name || "My Family",
    };

    const newData = {
      family: newFamily,
      children: [],
      sessions: [],
    };

    saveData(newData);
    setData(newData);
    setFamily(newFamily);
    setChildren([]);
  }

  function addChild() {
    const newChild = {
      id: Date.now().toString(),
      name: childName,
    };

    const updated = {
      ...data,
      children: [...(data.children || []), newChild],
    };

    saveData(updated);
    setData(updated);
    setChildren(updated.children);
    setChildName("");
  }

  if (!family) {
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

  return (
    <div>
      <h2>Family: {family.name}</h2>

      {/* ADD CHILD */}
      <div style={{ marginTop: 20 }}>
        <h3>Add Child</h3>

        <input
          placeholder="Child name"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          style={{ padding: 8, marginRight: 10 }}
        />

        <button onClick={addChild} style={{ padding: 10 }}>
          Add
        </button>
      </div>

      {/* CHILD LIST */}
      <div style={{ marginTop: 30 }}>
        <h3>Children</h3>

        {children.length === 0 ? (
          <p>No children yet</p>
        ) : (
          children.map((c) => (
            <div key={c.id} style={{ marginTop: 10 }}>
              <Link href={`/child/${c.id}`}>
                <button style={{ padding: 10 }}>
                  {c.name}
                </button>
              </Link>
            </div>
          ))
        )}
      </div>

      {/* PEOPLE LINK (optional context) */}
      <div style={{ marginTop: 30 }}>
        <Link href="/people">
          <button style={{ padding: 10 }}>
            Manage People
          </button>
        </Link>
      </div>
    </div>
  );
}
