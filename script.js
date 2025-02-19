let count = 0;

function handleClick(e) {
  const btnAdd = document.querySelectorAll(".container-btn");

  btnAdd.forEach((add) => {
    add.classList.remove("click");
  });

  e.currentTarget.classList.add("click");

  let eClick = document.querySelectorAll("add-cart");

  eClick.innerHTML = `<div>${count}</div>`;
}

const btnAdd = document.querySelectorAll(".container-btn");

btnAdd.forEach((add) => {
  add.addEventListener("click", handleClick);
});
