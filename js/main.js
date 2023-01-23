import { ChangeForm } from "./form.js";
import { ManageTable } from "./table.js";

const table = document.getElementById("table");
const changeForm = document.getElementById("change-row-form");
const saveButton = changeForm.querySelectorAll(".change-row-button")[0];
const cancelButton = changeForm.querySelectorAll(".change-row-button")[1];
const tableHeaders = table.querySelectorAll(".table-header");
const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");

const formChange = new ChangeForm(changeForm);
const manageTable = new ManageTable(
  table,
  tableHeaders,
  prevButton,
  nextButton
);

table.addEventListener("click", (e) => {
  // при клике на любую ячейку получаем её родительскую строку
  const row = e.target.closest("li");
  // проверяем наличие, и чтобы это не была строка с заголовками
  if (!row) return;
  if (!table.contains(row) || row.classList.contains("header-row")) return;
  //запоминаем в таблице по какой строке тыкнули, чтобы сохранить изменения
  manageTable.setCurrentRow(row);
  manageTable.setCurrentRowIndex(
    Array.from(row.parentNode.children).indexOf(row)
  );
  // показываем форму изменения строки
  formChange.visualForm(row);
});
changeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // получаем значения из формы изменения
  const values = formChange.submitChangeForm(e);
  // изменяем строку и отображаем
  manageTable.changeData(values);
  // очищаем форму
  formChange.clearForm();
});
cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  // при клике "cancel", скрываем и очищаем форму
  formChange.hideForm();
  formChange.clearForm();
});
saveButton.addEventListener("click", (e) => {
  // при клике "save" сработаем submit, а тут просто скрываем форму
  formChange.hideForm();
});
prevButton.addEventListener("click", () => {
  // получаем предыдущие 10 строк
  manageTable.getPrevPage();
  // закрываем форму изменения при переходе на другую страницу
  cancelButton.click();
});
nextButton.addEventListener("click", () => {
  // получаем следующие 10 строк
  manageTable.getNextPage();
  // закрываем форму изменения при переходе на другую страницу
  cancelButton.click();
});

//изначально заполняем первыми 10 строками
manageTable.fillTable(1);

// вешаем слушатели событий на заголовки таблицы для сортировки при клике
tableHeaders.forEach((header, index) => {
  header.addEventListener("click", (e) => {
    manageTable.eventListenerForHeaders(index);
  });
});
