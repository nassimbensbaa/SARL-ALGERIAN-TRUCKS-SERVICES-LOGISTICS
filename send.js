
const API_URL = "/api/employees";
const DELETE_PASSWORD = "1234";

let employees = [];
let tempAdvances = [];
let mainAdvances = [];

// =========================
// API
// =========================

async function api(action, data = {}) {

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action,
      ...data
    })
  });

  return await response.json();
}

// =========================
// LOAD DATA
// =========================

async function loadAll() {

  await loadEmployees();
  await loadTempAdvances();
  await loadMainAdvances();

}

async function loadEmployees() {

  const result =
    await api("getEmployees");

  if (!result.ok) return;

  employees = result.employees || [];

  renderEmployees();
  fillEmployeesSelect();

}

async function loadTempAdvances() {

  const result =
    await api("getTempAdvances");

  if (!result.ok) return;

  tempAdvances =
    result.advances || [];

  renderTempTable();

}

async function loadMainAdvances() {

  const result =
    await api("getAdvances");

  if (!result.ok) return;

  mainAdvances =
    result.advances || [];

  renderMainTable();
  updateMainTotal();

}

// =========================
// EMPLOYEES
// =========================

async function addEmployee(
  number,
  name,
  position
) {

  const result = await api(
    "addEmployee",
    {
      employeeNumber: number,
      employeeName: name,
      employeePosition: position
    }
  );

  if (result.ok) {
    loadEmployees();
  }

}

async function editEmployee(row) {

  const employee =
    employees.find(
      e => Number(e.row) === Number(row)
    );

  if (!employee) return;

  const name =
    prompt(
      "Nom et prénom",
      employee.name
    );

  if (name === null) return;

  const position =
    prompt(
      "Poste",
      employee.position
    );

  if (position === null) return;

  const result =
    await api(
      "editEmployee",
      {
        row,
        name,
        position
      }
    );

  if (result.ok) {
    loadEmployees();
  }

}

async function deleteEmployee(row) {

  const pwd =
    prompt(
      "Mot de passe ?"
    );

  if (pwd !== DELETE_PASSWORD) {
    alert("Incorrect");
    return;
  }

  const result =
    await api(
      "deleteEmployee",
      { row }
    );

  if (result.ok) {
    loadEmployees();
  }

}

// =========================
// TEMP ADVANCES
// =========================

async function addTempAdvance(
  date,
  name,
  amount,
  type,
  details
) {

  const result =
    await api(
      "addTempAdvance",
      {
        date,
        name,
        amount,
        type,
        details
      }
    );

  if (result.ok) {
    loadTempAdvances();
  }

}

async function deleteTempAdvance(row) {

  const pwd =
    prompt(
      "Mot de passe ?"
    );

  if (pwd !== DELETE_PASSWORD) {
    return;
  }

  const result =
    await api(
      "deleteTempAdvance",
      { row }
    );

  if (result.ok) {
    loadTempAdvances();
  }

}

// =========================
// TRANSFER
// =========================

async function transferToMain() {

  const pwd =
    prompt(
      "Entrer le mot de passe"
    );

  if (
    pwd !== DELETE_PASSWORD
  ) {
    alert("Incorrect");
    return;
  }

  const rows = [];

  document
    .querySelectorAll(
      ".temp-check:checked"
    )
    .forEach(c => {

      rows.push(
        Number(
          c.dataset.row
        )
      );

    });

  if (rows.length === 0) {

    alert(
      "Sélectionnez au moins une ligne"
    );

    return;
  }

  const result =
    await api(
      "transferToMain",
      { rows }
    );

  if (result.ok) {

    loadTempAdvances();
    loadMainAdvances();

  }

}

// =========================
// EMPLOYEE SELECTS
// =========================

function fillEmployeesSelect() {

  const select =
    document.getElementById(
      "advanceEmployee"
    );

  if (select) {

    select.innerHTML =
      '<option value="">Sélectionner un employé</option>';

    employees.forEach(emp => {

      select.innerHTML += `
      <option value="${emp.name}">
      ${emp.name}
      </option>`;

    });

  }

  const filter =
    document.getElementById(
      "employeeFilter"
    );

  if (filter) {

    filter.innerHTML =
      '<option value="">Tous les employés</option>';

    employees.forEach(emp => {

      filter.innerHTML += `
      <option value="${emp.name}">
      ${emp.name}
      </option>`;

    });

  }

}

// =========================
// RENDER EMPLOYEES
// =========================

function renderEmployees() {

  const tbody =
    document.querySelector(
      "#employees-table tbody"
    );

  if (!tbody) return;

  tbody.innerHTML = "";

  employees.forEach(emp => {

    tbody.innerHTML += `
      <tr>

        <td>${emp.number}</td>
        <td>${emp.name}</td>
        <td>${emp.position}</td>

        <td>

          <button
          onclick="editEmployee(${emp.row})">

          Modifier

          </button>

          <button
          onclick="deleteEmployee(${emp.row})">

          Supprimer

          </button>

        </td>

      </tr>
    `;

  });

}

// =========================
// TEMP TABLE
// =========================

function renderTempTable() {

  const tbody =
    document.querySelector(
      "#temp-table tbody"
    );

  if (!tbody) return;

  tbody.innerHTML = "";

  let total = 0;

  tempAdvances.forEach(item => {

    total +=
      Number(
        item.amount || 0
      );

    tbody.innerHTML += `
      <tr>

        <td>
          <input
          type="checkbox"
          class="temp-check"
          data-row="${item.row}">
        </td>

        <td>${item.date}</td>
        <td>${item.name}</td>
        <td>${item.amount}</td>
        <td>${item.type}</td>
        <td>${item.details}</td>

        <td>

          <button
          onclick="deleteTempAdvance(${item.row})">

          Supprimer

          </button>

        </td>

      </tr>
    `;

  });

  const totalEl =
    document.getElementById(
      "temp-total"
    );

  if (totalEl) {
    totalEl.textContent =
      total.toFixed(2);
  }

}

// =========================
// MAIN TABLE
// =========================

function renderMainTable() {

  const tbody =
    document.querySelector(
      "#main-table tbody"
    );

  if (!tbody) return;

  tbody.innerHTML = "";

  mainAdvances.forEach(item => {

    tbody.innerHTML += `
      <tr>

        <td>${item.date}</td>
        <td>${item.name}</td>
        <td>${item.amount}</td>
        <td>${item.type}</td>
        <td>${item.details}</td>

      </tr>
    `;

  });

}

// =========================
// TOTAL
// =========================

function updateMainTotal() {

  let total = 0;

  mainAdvances.forEach(item => {

    total +=
      Number(
        item.amount || 0
      );

  });

  const el =
    document.getElementById(
      "main-total"
    );

  if (el) {

    el.textContent =
      total.toFixed(2);

  }

}

// =========================
// FILTERS
// =========================

function filterMainTable() {

  const employee =
    document.getElementById(
      "employeeFilter"
    )?.value || "";

  const type =
    document.getElementById(
      "typeFilter"
    )?.value || "";

  document
    .querySelectorAll(
      "#main-table tbody tr"
    )
    .forEach(row => {

      const employeeCell =
        row.cells[1]?.textContent || "";

      const typeCell =
        row.cells[3]?.textContent || "";

      const show =

        (!employee ||
         employeeCell === employee)

        &&

        (!type ||
         typeCell === type);

      row.style.display =
        show ? "" : "none";

    });

}

// =========================
// INIT
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadAll();

    const dateInput =
      document.getElementById(
        "advanceDate"
      );

    if (dateInput) {

      dateInput.value =
        new Date()
        .toISOString()
        .split("T")[0];

    }

    document
      .getElementById(
        "employeeFilter"
      )
      ?.addEventListener(
        "change",
        filterMainTable
      );

    document
      .getElementById(
        "typeFilter"
      )
      ?.addEventListener(
        "change",
        filterMainTable
      );

  }
);
