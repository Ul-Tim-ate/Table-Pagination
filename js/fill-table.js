const table = document.getElementById("table");
const changeForm = document.getElementById("change-row-form");
const saveButton = changeForm.querySelectorAll(".change-row-button")[0];
const cancelButton = changeForm.querySelectorAll(".change-row-button")[1];
const tableHeaders = table.querySelectorAll(".table-header");
let currentRow = null;

const getData = async () => {
  //получаем данные из локального файла data.json
  return await fetch("../data.json").then((res) => {
    return res.json();
  });
};
const putData = async () => {
  const dataJson = Array.from(await getData());
  dataJson.forEach((person) => {
    const row = document.createElement("li");
    row.classList.add("row");
    const {
      name: { firstName, lastName },
      about,
      eyeColor,
    } = person; // деструктуризируем необходимые поля из объекта
    // кладём их в один массив, чтобы удобней работать
    const personDataArr = [firstName, lastName, about, eyeColor];
    // формируем html разметку страницы
    personDataArr.forEach((el, index) => {
      const cell = document.createElement("div");
      cell.textContent = el;
      cell.classList.add("cell");
      switch (index) {
        case 0:
          cell.classList.add("first-name");
          break;
        case 1:
          cell.classList.add("last-name");
          break;
        case 2:
          cell.classList.add("about");
          break;
        case 3:
          cell.classList.add("eye");
          break;
        default:
          break;
      }
      row.appendChild(cell);
    });
    table.appendChild(row);
  });
};
const visualForm = () => {
  changeForm.classList.remove("hidden");
};
const changeData = (values) => {
  const cells = currentRow.querySelectorAll("div");
  cells.forEach((cell, index) => {
    //если input пустой или только пробелы, то ячейку не изменяем
    if (!values[index].trim()) {
      return;
    }
    cell.textContent = values[index];
  });
};
table.addEventListener("click", (e) => {
  const row = e.target.closest("li");
  if (!row) return;
  if (!table.contains(row) || row.classList.contains("header-row")) return;
  currentRow = row;
  visualForm();
});
const clearForm = () => {
  const fields = changeForm.querySelectorAll(".change-row-field");
  fields.forEach((field) => {
    field.value = "";
  });
};
changeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = e.target.querySelectorAll(".change-row-field");
  const values = [];
  fields.forEach((field) => {
    values.push(field.value);
  });
  changeData(values); //передаем массив значений, которые собрали из inputs
  clearForm();
});
cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  changeForm.classList.add("hidden");
  clearForm();
});
saveButton.addEventListener("click", (e) => {
  changeForm.classList.add("hidden");
});

const getSortColumn = (column) => {
  let sortedFields = Array.from(column).sort((rowA, rowB) =>
    rowA.textContent > rowB.textContent ? 1 : -1
  );
  const sortedRows = [];
  sortedFields.forEach((field) => {
    sortedRows.push(field.parentNode);
  });
  table.append(...sortedRows);
};

putData();

tableHeaders.forEach((header, index) => {
  header.addEventListener("click", (e) => {
    let sortColumn;
    switch (index) {
      case 0:
        sortColumn = table.getElementsByClassName("first-name");
        break;
      case 1:
        sortColumn = table.getElementsByClassName("last-name");
        break;
      case 2:
        sortColumn = table.getElementsByClassName("about");
        break;
      case 3:
        sortColumn = table.getElementsByClassName("eye");
        break;
      default:
        break;
    }
    getSortColumn(sortColumn);
  });
});
