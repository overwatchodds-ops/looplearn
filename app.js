const STORAGE_KEY = "looplearn_data";

function getData() {
  const d = localStorage.getItem(STORAGE_KEY);
  return d ? JSON.parse(d) : { family: null, children: [], sessions: [] };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let state = getData();

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

  state.children.push({
    id: Date.now().toString(),
    name
  });

  saveData(state);
  render();
};

window.openChild = function (id) {
  alert("Next step: session view for child " + id);
};

render();
