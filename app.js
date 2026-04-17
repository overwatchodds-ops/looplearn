const STORAGE_KEY = "looplearn_data";

function getData() {
  const d = localStorage.getItem(STORAGE_KEY);
  return d ? JSON.parse(d) : { family: null, children: [], sessions: [] };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let state = getData();
let currentChild = null;
let currentSession = null;

/* =========================
   MAIN RENDER
========================= */
function render() {
  const root = document.getElementById("app");

  if (!state.family) {
    root.innerHTML = `
      <h2>Create Family</h2>
      <input id="familyName" placeholder="Family name" />
      <button onclick="createFamily()">Create</button>
    `;
    return;
  }

  if (currentSession) {
    renderSession(root);
    return;
  }

  if (currentChild) {
    renderChild(root);
    return;
  }

  renderHome(root);
}

/* =========================
   HOME (FAMILY)
========================= */
function renderHome(root) {
  root.innerHTML = `
    <h2>Family: ${state.family.name}</h2>

    <h3>Add Child</h3>
    <input id="childName" placeholder="Child name" />
    <button onclick="addChild()">Add</button>

    <h3>Children</h3>
    ${state.children.map(c => `
      <div>
        <button onclick="openChild('${c.id}')">
          ${c.name}
        </button>
      </div>
    `).join("")}
  `;
}

/* =========================
   CHILD VIEW (SESSION LIST)
========================= */
function renderChild(root) {
  const sessions = state.sessions.filter(s => s.childId === currentChild.id);

  root.innerHTML = `
    <button onclick="backHome()">← Back</button>

    <h2>Child: ${currentChild.name}</h2>

    <h3>Create Session</h3>
    <button onclick="createSession()">+ New Session</button>

    <h3>Sessions</h3>
    ${sessions.map(s => `
      <div>
        <button onclick="openSession('${s.id}')">
          ${s.title || "Untitled Session"}
        </button>
      </div>
    `).join("")}
  `;
}

/* =========================
   SESSION VIEW (CORE SCREEN)
========================= */
function renderSession(root) {
  const session = state.sessions.find(s => s.id === currentSession.id);

  root.innerHTML = `
    <button onclick="backChild()">← Back</button>

    <h2>Session</h2>

    <input id="title" value="${session.title || ""}" placeholder="Session title" />

    <h3>Notes (Teacher)</h3>
    <textarea id="notes" rows="6">${session.notes || ""}</textarea>

    <h3>Child Response</h3>
    <textarea id="response" rows="4">${session.response || ""}</textarea>

    <h3>Observations</h3>
    <textarea id="obs" rows="3">${session.observations || ""}</textarea>

    <button onclick="saveSession()">Save Session</button>

    <hr/>

    <h3>AI Prompt Generator</h3>

    <button onclick="generatePrompt()">Generate Prompt</button>

    <textarea id="promptBox" rows="10" style="width:100%;"></textarea>

    <button onclick="copyPrompt()">Copy Prompt</button>
  `;
}

/* =========================
   NAVIGATION
========================= */
window.backHome = function () {
  currentChild = null;
  render();
};

window.backChild = function () {
  currentSession = null;
  render();
};

window.openChild = function (id) {
  currentChild = state.children.find(c => c.id === id);
  render();
};

window.openSession = function (id) {
  currentSession = state.sessions.find(s => s.id === id);
  render();
};

/* =========================
   CREATE ACTIONS
========================= */
window.createFamily = function () {
  const name = document.getElementById("familyName").value;

  state.family = {
    id: Date.now().toString(),
    name
  };

  saveData(state);
  render();
};

window.addChild = function () {
  const name = document.getElementById("childName").value;

  const child = {
    id: Date.now().toString(),
    name
  };

  state.children.push(child);
  saveData(state);
  render();
};

window.createSession = function () {
  const session = {
    id: Date.now().toString(),
    childId: currentChild.id,
    title: "New Session",
    notes: "",
    response: "",
    observations: ""
  };

  state.sessions.push(session);
  saveData(state);

  openSession(session.id);
};

/* =========================
   SAVE SESSION
========================= */
window.saveSession = function () {
  const s = state.sessions.find(x => x.id === currentSession.id);

  s.title = document.getElementById("title").value;
  s.notes = document.getElementById("notes").value;
  s.response = document.getElementById("response").value;
  s.observations = document.getElementById("obs").value;

  saveData(state);
  alert("Saved");
};

/* =========================
   PROMPT GENERATOR
========================= */
window.generatePrompt = function () {
  const s = state.sessions.find(x => x.id === currentSession.id);

  const prompt = `
You are an educational assistant.

SESSION NOTES:
${s.notes}

CHILD RESPONSE:
${s.response}

OBSERVATIONS:
${s.observations}

TASK:
Generate the next lesson. Adjust difficulty appropriately. Keep continuity.
  `.trim();

  document.getElementById("promptBox").value = prompt;
};

window.copyPrompt = function () {
  const text = document.getElementById("promptBox").value;
  navigator.clipboard.writeText(text);
  alert("Copied");
};

/* =========================
   INIT
========================= */
render();
