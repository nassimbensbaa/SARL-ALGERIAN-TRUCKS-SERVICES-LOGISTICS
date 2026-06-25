javascript
const API_URL = "/api/employees.js";
const DELETE_PASSWORD = "1234";

// =========================
// EMPLOYEES
// =========================

async function loadEmployees() {
  try {
    const res = await fetch(
      `${API_URL}?action=getEmployees`
    );

    const data = await res.json();

    if (!data.ok) {
      console.error(data.error);
      return;
    }

    renderEmployees(data.employees || []);
    fillEmployeesSelect(data.employees || []);

  } catch (err) {
    console.error(err);
  }
}

async function addEmployee(number, name, position) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "addEmployee",
      employeeNumber: number,
      employeeName: name,
      employeePosition: position
    })
  });

  return await res.json();
}

async function deleteEmployee(row) {

  const pwd = prompt(
    "Entrer le mot de passe"
  );

  if (pwd !== DELETE_PASSWORD) {
    alert("Mot de passe incorrect");
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "deleteEmployee",
      row
    })
  });

  const data = await res.json();

  if (data.ok) {
    loadEmployees();
  }
}

// =========================
// ADVANCES
// =========================

async function loadAdvances() {

  try {

    const res = await fetch(
      `${API_URL}?action=getAdvances`
    );

    const data = await res.json();

    if (!data.ok) {
      console.error(data.error);
      return;
    }

    renderAdvances(data.advances || []);
    updateTotal(data.advances || []);

  } catch (err) {
    console.error(err);
  }
}

async function addAdvance(
  date,
  name,
  amount,
  type,
  details
) {

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "addAdvance",
      date,
      name,
      amount,
      type,
      details
    })
  });

  return await res.json();
}

async function deleteAdvance(row) {

  const pwd = prompt(
    "Entrer le mot de passe"
  );

  if (pwd !== DELETE_PASSWORD) {
    alert("Mot de passe incorrect");
    return;
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      action: "deleteAdvance",
      row
    })
  });

  const data = await res.json();

  if (data.ok) {
    loadAdvances();
  }
}

// =========================
// TOTAL
// =========================

function updateTotal(items) {

  let total = 0;

  items.forEach(item => {
    total += Number(item.amount || 0);
  });

  const totalElement =
    document.getElementById("total-advances");

  if (totalElement) {

    totalElement.textContent =
      total.toLocaleString(
        "fr-FR",
        {
          minimumFractionDigits: 2
        }
      ) + " DZD";
  }
}

// =========================
// SEARCH
// =========================

function searchAdvances() {

  const value =
    document
      .getElementById("search-main")
      .value
      .toLowerCase();

  const rows =
    document.querySelectorAll(
      "#advances-table tbody tr"
    );

  rows.forEach(row => {

    const txt =
      row.textContent.toLowerCase();

    row.style.display =
      txt.includes(value)
        ? ""
        : "none";
  });
}

// =========================
// PRINT
// =========================

function printAdvances() {
  window.print();
}

// =========================
// INIT
// =========================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    loadEmployees();
    loadAdvances();
  }
);
