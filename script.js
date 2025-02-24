function handleClick(e) {
  const btnAdd = e.currentTarget;

  // Se já tiver a classe "click", não faz nada
  if (btnAdd.classList.contains("click")) return;

  // Adiciona a classe "click" ao botão atual
  btnAdd.classList.add("click");

  // Limpa o botão e adiciona o contador
  btnAdd.innerHTML = `
    <div class='add-item'>
        <div class='container-decrement'>
            <img class='decrement' src='./image/icon-decrement-quantity.svg'/>
        </div>
        <div class='quantity'>1</div>
        <div class='container-increment'>
            <img class="increment" src="./image/icon-increment-quantity.svg" /> 
        </div>  
    </div>`;

  const decrementBtn = btnAdd.querySelector(".container-decrement");
  const incrementBtn = btnAdd.querySelector(".container-increment");
  const quantityDisplay = btnAdd.querySelector(".quantity");

  decrementBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita ativar o clique do botão principal

    let currentValue = parseInt(quantityDisplay.textContent);

    if (currentValue > 1) {
      quantityDisplay.textContent = currentValue - 1;
    } else {
      // 🔹 Se chegar a 0, volta ao estado inicial
      btnAdd.classList.remove("click");
      btnAdd.innerHTML = `
        <button class="btn-add">
          <img src="./image/icon-add-to-cart.svg" alt="add cart" />
          <span class="add-cart">Add Cart</span>
        </button>
      `;

      // 🔹 Reanexa o evento ao botão recriado
      btnAdd.querySelector(".btn-add").addEventListener("click", handleClick);
    }
  });

  incrementBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Evita ativar o clique do botão principal
    let currentValue = parseInt(quantityDisplay.textContent);
    quantityDisplay.textContent = currentValue + 1;
  });
}

// Seleciona todos os botões e adiciona o evento de clique
document.querySelectorAll(".container-btn").forEach((btn) => {
  btn.addEventListener("click", handleClick);
});
