const table = document.getElementById("table");

const getData = async () => {
  return await fetch("../data.json").then((res) => {
    return res.json();
  });
};

const putData = async () => {
  const dataJson = Array.from(await getData());
  let html = "";
  dataJson.forEach((person) => {
    let row = "";
    const {
      name: { firstName, lastName },
      about,
      eyeColor,
    } = person;

    const personDataArr = [firstName, lastName, about, eyeColor];
    personDataArr.forEach((el, index) => {
      if (index === 2) {
        row += '<div class="cell about">' + el + "</div>";
        return;
      }
      row += '<div class="cell">' + el + "</div>";
    });
    html += `<li class="row">` + row + "</li>";
  });
  html = `
  <li class="header-row">
    <div class="table-header">First name</div>
    <div class="table-header">Last name</div>
    <div class="table-header">About</div>
    <div class="table-header">Eye color</div>
  </li>
    ${html}
  `;
  table.innerHTML = html;
};

table.addEventListener("click", (e) => {
  const row = e.target.closest("li");
  if (!row) return;
  if (!table.contains(row)) return;
});

putData();
