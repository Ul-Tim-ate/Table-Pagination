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
  const row = e.target.closest("li");
  if (!row) return;
  if (!table.contains(row) || row.classList.contains("header-row")) return;
  manageTable.setCurrentRow(row);
  manageTable.setCurrentRowIndex(
    Array.from(row.parentNode.children).indexOf(row)
  );
  formChange.visualForm(row);
});
changeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const values = formChange.submitChangeForm(e);
  manageTable.changeData(values); //передаем массив, которые собрали из inputs
  formChange.clearForm();
});
cancelButton.addEventListener("click", (e) => {
  e.preventDefault();
  formChange.hideForm();
  formChange.clearForm();
});
saveButton.addEventListener("click", (e) => {
  formChange.hideForm();
});
prevButton.addEventListener("click", () => {
  manageTable.getPrevPage();
  cancelButton.click();
});
nextButton.addEventListener("click", () => {
  manageTable.getNextPage();
  cancelButton.click();
});

manageTable.fillTable(1);

tableHeaders.forEach((header, index) => {
  header.addEventListener("click", (e) => {
    manageTable.eventListenerForHeaders(index);
  });
});
