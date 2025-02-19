const btnAdd = document.querySelectorAll(".container-btn");
let count = 0;

function handleButtonClick(button) {
  button.classList.add("click");
  count++;
  console.log(count);
}

btnAdd.forEach((button) => {
  button.addEventListener("click", function () {
    handleButtonClick(button);
  });

  button.classList.remove("click");
});
