const btnAdd = document.querySelectorAll(".btn-add");

btnAdd.forEach((button) => {
  button.addEventListener("click", function () {
    console.log("adicionei");
  });
});
