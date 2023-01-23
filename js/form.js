export class ChangeForm {
  constructor(form) {
    this.form = form;
    this.fields = form.querySelectorAll(".change-row-field");
  }
  visualForm = (row) => {
    const rowFields = row.querySelectorAll("div");
    this.fields.forEach(
      (field, index) => (field.value = rowFields[index].textContent)
    );
    this.form.classList.remove("hidden");
  };
  clearForm = () => {
    this.fields.forEach((field) => {
      field.value = "";
    });
  };
  submitChangeForm = (e) => {
    const fields = e.target.querySelectorAll(".change-row-field");
    const values = [];
    fields.forEach((field) => {
      values.push(field.value);
    });
    return values;
  };
  hideForm = () => {
    this.form.classList.add("hidden");
  };
}
