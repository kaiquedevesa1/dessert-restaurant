function handleClick(e) {
  const btnAdd = e.currentTarget;

  btnAdd.classList.add("click");

  if (!btnAdd.querySelector(".add-item")) {
    btnAdd.innerHTML = "";

    btnAdd.insertAdjacentHTML(
      "beforeend",
      `
      <div class='add-item'>
          <div class='container-decrement'>
              <img class='decrement' src='./image/icon-decrement-quantity.svg'/>
          </div>
          <div class='quantity'>
              1
          </div>
          <div class='container-increment'>
              <img class="increment" src="./image/icon-increment-quantity.svg" /> 
          </div>  
      </div>`
    );

    const decrementBtn = btnAdd.querySelector(".decrement");
    const incrementBtn = btnAdd.querySelector(".increment");
    const quantityDisplay = btnAdd.querySelector(".quantity");

    decrementBtn.addEventListener("click", () => {
      let currentValue = parseInt(quantityDisplay.textContent);
      if (currentValue > 1) {
        quantityDisplay.textContent = currentValue - 1;
      }
    });

    incrementBtn.addEventListener("click", () => {
      let currentValue = parseInt(quantityDisplay.textContent);
      quantityDisplay.textContent = currentValue + 1;
    });
  }
}

const btnAdd = document.querySelectorAll(".container-btn");

btnAdd.forEach((add) => {
  add.addEventListener("click", handleClick);
});
