import colorWordToHexCode from "./colors.js";

export class ManageTable {
  constructor(table, tableHeaders, prevButton, nextButton) {
    this.jsonData = [];
    this.table = table;
    this.tableHeaders = tableHeaders;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    this.currentRowIndex = null;
    this.currentRow = null;
    this.page = 1;
  }
  setCurrentRow = (newRow) => {
    this.currentRow = newRow;
  };
  setCurrentRowIndex = (newRowIndex) => {
    this.currentRowIndex = newRowIndex;
  };
  updatePage = (page) => {
    this.rezetSort();
    this.fillTable(page);
  };
  getNextPage = () => {
    this.updatePage(++this.page);
    if (this.prevButton.classList.contains("hidden")) {
      this.prevButton.classList.remove("hidden");
    }
    if (this.page >= this.jsonData.length / 10) {
      this.nextButton.classList.add("hidden");
    }
  };
  getPrevPage = () => {
    this.updatePage(--this.page);
    if (this.page <= 1) {
      this.prevButton.classList.add("hidden");
      return;
    }
    if (this.nextButton.classList.contains("hidden")) {
      this.nextButton.classList.remove("hidden");
    }
  };
  getData = async () => {
    //получаем данные из локального файла data.json
    if (this.jsonData.length !== 0) return this.jsonData;
    this.jsonData = await fetch("../data.json").then((res) => {
      return res.json();
    });
    return this.jsonData;
  };
  getOnePageData = async (page) => {
    const data = await this.getData();
    return data.slice((page - 1) * 10, page * 10);
  };
  clearOldData = () => {
    const rows = this.table.querySelectorAll(".row");
    rows.forEach((row) => row.remove());
  };
  fillTable = async (page) => {
    this.clearOldData();
    const dataJson = Array.from(await this.getOnePageData(page));
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
        cell.classList.add("cell");
        switch (index) {
          case 0:
            cell.classList.add("first-name");
            cell.textContent = el;
            break;
          case 1:
            cell.classList.add("last-name");
            cell.textContent = el;
            break;
          case 2:
            cell.classList.add("about");
            cell.textContent = el;
            break;
          case 3:
            cell.classList.add("eye");
            cell.textContent = colorWordToHexCode(el);
            cell.style.color = el;
            cell.style.background = el;
            break;
          default:
            break;
        }
        row.appendChild(cell);
      });
      this.table.appendChild(row);
    });
  };
  changeDataInArr = (values) => {
    const indexInArr = this.currentRowIndex + 10 * (this.page - 1) - 1;
    this.jsonData[indexInArr].name.firstName = values[0];
    this.jsonData[indexInArr].name.lastName = values[1];
    this.jsonData[indexInArr].about = values[2];
    this.jsonData[indexInArr].eyeColor = values[3];
  };
  changeData = (values) => {
    const cells = this.currentRow.querySelectorAll("div");
    cells.forEach((cell, index) => {
      //если input пустой или только пробелы, то ячейку не изменяем
      if (!values[index].trim()) {
        return;
      }
      if (index === 3) {
        cell.style.color = values[index];
        cell.style.background = values[index];
      }
      cell.textContent = values[index];
    });
    this.changeDataInArr(values);
  };
  getSortColumn = (column, columnId) => {
    let flag = 1;
    if (!this.tableHeaders[columnId].classList.contains("sorted")) flag = -1;
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
  rezetSort = () => {
    this.tableHeaders.forEach((header) => {
      header.classList.remove("sorted");
      header.classList.add("unsorted");
    });
  };

  eventListenerForHeaders = (index) => {
    let sortColumn;
    let columnId;
    this.tableHeaders.forEach((header, removeIndex) => {
      if (index === removeIndex) return;
      header.classList.add("unsorted");
      header.classList.remove("sorted");
    });
    this.tableHeaders[index].classList.remove("unsorted");
    switch (index) {
      case 0:
        sortColumn = table.getElementsByClassName("first-name");
        this.tableHeaders[0].classList.toggle("sorted");
        columnId = 0;
        break;
      case 1:
        sortColumn = table.getElementsByClassName("last-name");
        this.tableHeaders[1].classList.toggle("sorted");
        columnId = 1;
        break;
      case 2:
        sortColumn = table.getElementsByClassName("about");
        this.tableHeaders[2].classList.toggle("sorted");
        columnId = 2;
        break;
      case 3:
        sortColumn = table.getElementsByClassName("eye");
        this.tableHeaders[3].classList.toggle("sorted");
        columnId = 3;
        break;
      default:
        break;
    }
    this.getSortColumn(sortColumn, columnId);
  };
}
