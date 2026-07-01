
const API_URL = "/api/employees";
const DELETE_PASSWORD = "1234";

let employees = [];
let tempAdvances = [];
let mainAdvances = [];
// =========================
// TYPES FILTER
// =========================

function updateTypeFilter() {

  const employee =
    document.getElementById("employeeFilter");

  const type =
    document.getElementById("typeFilter");

  if (!employee || !type) return;

  const currentValue =
    type.value;

  type.innerHTML =
    '<option value="">Tous les types</option>';

  const list = [];

  mainAdvances.forEach(item => {

    if (
      employee.value === "" ||
      item.name === employee.value
    ) {

      if (
        item.type &&
        !list.includes(item.type)
      ) {

        list.push(item.type);

      }

    }

  });

  list.sort();

  list.forEach(t => {

    type.innerHTML +=
      `<option value="${t}">
        ${t}
      </option>`;

  });

  if (list.includes(currentValue)) {

    type.value = currentValue;

  }

}
async function loadMainAdvances() {

  const result =
    await api("getAdvances");

  if (!result.ok) return;

  mainAdvances =
    result.advances || [];

  renderMainTable();

  updateMainTotal();

  updateTypeFilter();

}
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

    const oldValue =
      filter.value;

    filter.innerHTML =
      '<option value="">Tous les employés</option>';

    employees.forEach(emp => {

      filter.innerHTML += `
        <option value="${emp.name}">
          ${emp.name}
        </option>`;

    });

    if (
      employees.some(
        e => e.name === oldValue
      )
    ) {
      filter.value = oldValue;
    }

    filter.onchange = function () {

      updateTypeFilter();

      filterMainTable();

    };

  }

  updateTypeFilter();

}
function filterMainTable() {

  const employee =
    document.getElementById(
      "employeeFilter"
    )?.value || "";

  const type =
    document.getElementById(
      "typeFilter"
    )?.value || "";

  const tbody =
    document.querySelector(
      "#main-table tbody"
    );

  if (!tbody) return;

  tbody.innerHTML = "";

  let total = 0;

  mainAdvances.forEach(item => {

    const show =

      (!employee ||
       item.name === employee)

      &&

      (!type ||
       item.type === type);

    if (!show) return;

    total += Number(item.amount || 0);

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

  const totalEl =
    document.getElementById(
      "main-total"
    );

  if (totalEl) {

    totalEl.textContent =
      total.toFixed(2);

  }

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

    const employeeFilter =
      document.getElementById(
        "employeeFilter"
      );

    const typeFilter =
      document.getElementById(
        "typeFilter"
      );

    if (employeeFilter) {

      employeeFilter.addEventListener(
        "change",
        () => {

          // تحديث قائمة الأنواع
          updateTypeFilter();

          // إعادة تصفية الجدول
          filterMainTable();

        }
      );

    }

    if (typeFilter) {

      typeFilter.addEventListener(
        "change",
        filterMainTable
      );

    }

  }
);
