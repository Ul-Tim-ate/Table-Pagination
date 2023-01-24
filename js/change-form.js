export class ChangeForm {
  constructor(form) {
    // получаем саму форму
    this.form = form;
    // извлекаем все инпуты
    this.fields = form.querySelectorAll(".change-row-field");
  }
  visualForm = (row) => {
    // вставляем в инпуты значение строки, по которой тыкнули
    const rowFields = row.querySelectorAll("div");
    this.fields.forEach(
      (field, index) => (field.value = rowFields[index].textContent)
    );
    // отображаем форму
    this.form.classList.remove("hidden");
  };
  clearForm = () => {
    // очищаем все инпуты
    this.fields.forEach((field) => {
      field.value = "";
    });
  };
  submitChangeForm = (e) => {
    // извлекаем значения инпутов
    const fields = e.target.querySelectorAll(".change-row-field");
    const values = [];
    fields.forEach((field) => {
      values.push(field.value);
    });
    // возвращаем их в одном массиве
    return values;
  };
  hideForm = () => {
    // прячем форму
    this.form.classList.add("hidden");
  };
}
