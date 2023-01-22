const table = document.getElementById("table");
const changeForm = document.getElementById("change-row-form");
const saveButton = changeForm.querySelectorAll(".change-row-button")[0];
const cancelButton = changeForm.querySelectorAll(".change-row-button")[1];
const tableHeaders = table.querySelectorAll(".table-header");
const fields = changeForm.querySelectorAll(".change-row-field");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
let jsonData = [];
let currentRow = null;
let currentRowIndex = null;
let page = 1;

const getData = async () => {
  //получаем данные из локального файла data.json
  if (jsonData.length !== 0) return jsonData;
  jsonData = await fetch("../data.json").then((res) => {
    return res.json();
  });
  return jsonData;
};

const getOnePageData = async (page) => {
  const data = await getData();
  return data.slice((page - 1) * 9, page * 9);
};

const clearOldData = () => {
  const rows = table.querySelectorAll(".row");
  rows.forEach((row) => row.remove());
};

const putData = async (page) => {
  clearOldData();
  const dataJson = Array.from(await getOnePageData(page));
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
const visualForm = (row) => {
  const rowFields = row.querySelectorAll("div");
  fields.forEach(
    (field, index) => (field.value = rowFields[index].textContent)
  );
  changeForm.classList.remove("hidden");
};

const changeDataInArr = (values) => {
  const indexInArr = currentRowIndex + 10 * (page - 1) - 1;
  jsonData[indexInArr].name.firstName = values[0];
  jsonData[indexInArr].name.lastName = values[1];
  jsonData[indexInArr].about = values[2];
  jsonData[indexInArr].eyeColor = values[3];
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
  changeDataInArr(values);
};
table.addEventListener("click", (e) => {
  const row = e.target.closest("li");
  if (!row) return;
  if (!table.contains(row) || row.classList.contains("header-row")) return;
  //////////////////////
  currentRow = row;
  currentRowIndex = Array.from(currentRow.parentNode.children).indexOf(
    currentRow
  );
  visualForm(row);
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

const rezetSort = () => {
  tableHeaders.forEach((header) => {
    header.classList.remove("sorted");
    header.classList.add("unsorted");
  });
};

prevButton.addEventListener("click", (e) => {
  page--;
  putData(page);
  if (page <= 1) {
    prevButton.classList.add("hidden");
    return;
  }
  cancelButton.click();
  rezetSort();
});

nextButton.addEventListener("click", (e) => {
  page++;
  putData(page);
  if (page >= jsonData.length / 9) {
    nextButton.classList.add("hidden");
  }
  if (prevButton.classList.contains("hidden")) {
    prevButton.classList.remove("hidden");
  }
  cancelButton.click();
  rezetSort();
});

const getSortColumn = (column, columnId) => {
  let flag = 1;
  if (!tableHeaders[columnId].classList.contains("sorted")) flag = -1;
  let sortedFields = Array.from(column).sort((rowA, rowB) =>
    rowA.textContent.toLowerCase() > rowB.textContent.toLowerCase()
      ? flag
      : -1 * flag
  );
  const sortedRows = [];
  sortedFields.forEach((field) => {
    sortedRows.push(field.parentNode);
  });
  table.append(...sortedRows);
};

putData(page);

tableHeaders.forEach((header, index) => {
  header.addEventListener("click", (e) => {
    let sortColumn;
    let columnId;
    tableHeaders.forEach((header, removeIndex) => {
      if (index === removeIndex) return;
      header.classList.add("unsorted");
      header.classList.remove("sorted");
    });
    tableHeaders[index].classList.remove("unsorted");
    switch (index) {
      case 0:
        sortColumn = table.getElementsByClassName("first-name");
        tableHeaders[0].classList.toggle("sorted");
        columnId = 0;
        break;
      case 1:
        sortColumn = table.getElementsByClassName("last-name");
        tableHeaders[1].classList.toggle("sorted");
        columnId = 1;
        break;
      case 2:
        sortColumn = table.getElementsByClassName("about");
        tableHeaders[2].classList.toggle("sorted");
        columnId = 2;
        break;
      case 3:
        sortColumn = table.getElementsByClassName("eye");
        tableHeaders[3].classList.toggle("sorted");
        columnId = 3;
        break;
      default:
        break;
    }

    getSortColumn(sortColumn, columnId);
  });
});
