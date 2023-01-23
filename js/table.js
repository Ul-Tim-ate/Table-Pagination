import colorWordToHexCode from "./colors.js";

export class ManageTable {
  constructor(table, tableHeaders, prevButton, nextButton) {
    // здесь храним все 50 записей
    this.jsonData = [];
    this.table = table;
    this.tableHeaders = tableHeaders;
    this.prevButton = prevButton;
    this.nextButton = nextButton;
    // здесь храним номер строки по которой тыкнули
    // чтобы внести измененные данные в jsonData
    // чтобы при перелистовании данные сохранялись
    this.currentRowIndex = null;
    // сама строка по которой тыкнули
    this.currentRow = null;
    // номер страницы, изначально 1
    this.page = 1;
  }
  setCurrentRow = (newRow) => {
    this.currentRow = newRow;
  };
  setCurrentRowIndex = (newRowIndex) => {
    this.currentRowIndex = newRowIndex;
  };
  updatePage = (page) => {
    // при перелистовании убираем сортировку на столбцах
    this.rezetSort();
    // заполняем таблицу новыми 10 строками
    this.fillTable(page);
  };
  getNextPage = () => {
    // увеличиваем page на 1 и обновляем таблицу
    this.updatePage(++this.page);
    // если кнопку "назад" скрыта, то есть было page =  1
    // то сейчас page = 2 значит кнопку можно отобразить
    if (this.prevButton.classList.contains("hidden")) {
      this.prevButton.classList.remove("hidden");
    }
    // прячем кнопку если больше записей дальше нет
    if (this.page >= this.jsonData.length / 10) {
      this.nextButton.classList.add("hidden");
    }
  };
  getPrevPage = () => {
    // уменьшаем страницу на 1 и обновляем таблицу
    this.updatePage(--this.page);
    // прячем кнопку если больше нет предыдущих записей
    if (this.page <= 1) {
      this.prevButton.classList.add("hidden");
      return;
    }
    // показываем кнопку "дальше" так как минимум есть следующая страница теперь
    if (this.nextButton.classList.contains("hidden")) {
      this.nextButton.classList.remove("hidden");
    }
  };
  getData = async () => {
    // если данные уже получили то возвращаем уже готовый объект
    if (this.jsonData.length !== 0) return this.jsonData;
    //получаем данные из локального файла data.json и вовращаем массив
    this.jsonData = await fetch("../data.json").then((res) => {
      return res.json();
    });
    return this.jsonData;
  };
  getOnePageData = async (page) => {
    // берем из массива нужные 10 записей
    const data = await this.getData();
    return data.slice((page - 1) * 10, page * 10);
  };
  clearOldData = () => {
    // очищаем старые 10 записей, чтобы туда вставить новые 10
    const rows = this.table.querySelectorAll(".row");
    rows.forEach((row) => row.remove());
  };
  fillTable = async (page) => {
    this.clearOldData(); // очищаем таблицу
    // получаем 10 записей
    const dataJson = Array.from(await this.getOnePageData(page));
    // формируем 10 строк и вставляем в таблицу
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
    // изменяем данные в массиве, чтобы при возвращении измененные данные сохранялись
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
      // для колонки eye color меняем также цвет текста и bg
      if (index === 3) {
        cell.style.color = values[index];
        cell.style.background = values[index];
      }
      // меняем текстовое значение
      cell.textContent = values[index];
    });
    this.changeDataInArr(values);
  };
  getSortColumn = (column, columnId) => {
    let flag = 1;
    // если колонка уже отсортирована, то значит её нужно отсортировать в обратном порядке
    if (!this.tableHeaders[columnId].classList.contains("sorted")) flag = -1;
    // сортируем
    let sortedFields = Array.from(column).sort((rowA, rowB) =>
      rowA.textContent.toLowerCase() > rowB.textContent.toLowerCase()
        ? flag
        : -1 * flag
    );
    const sortedRows = [];
    // формируем массив с новым порядком
    sortedFields.forEach((field) => {
      sortedRows.push(field.parentNode);
    });
    // заполняем таблицу отсортированными данными
    table.append(...sortedRows);
  };
  rezetSort = () => {
    // делаем снова не отсортированными заголовками
    this.tableHeaders.forEach((header) => {
      header.classList.remove("sorted");
      header.classList.add("unsorted");
    });
  };

  eventListenerForHeaders = (index) => {
    let sortColumn;
    // при клике на заголовок, убираем сортировку по другому заголовку
    this.tableHeaders.forEach((header, removeIndex) => {
      if (index === removeIndex) return;
      header.classList.add("unsorted");
      header.classList.remove("sorted");
    });
    this.tableHeaders[index].classList.remove("unsorted");
    this.tableHeaders[index].classList.toggle("sorted");
    // получаем массив ячеейк, чтобы отсортировать их
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
    // передаём в функцию сортировки
    this.getSortColumn(sortColumn, index);
  };
}
