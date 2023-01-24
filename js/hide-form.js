export class HideForm {
  constructor(hideForm, tableHeaders) {
    this.hideForm = hideForm;
    this.selectForm = hideForm.getElementsByTagName("select")[0];
    this.tableHeaders = tableHeaders;
  }
  changeVisabillity = (header) => {
    // добавляем класс невидимости
    header.classList.toggle("invis");
  };

  doSubmit = (e) => {
    this.changeVisabillity(this.tableHeaders[this.selectForm.value]);
  };
}
