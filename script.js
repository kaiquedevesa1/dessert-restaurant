const cartItems = [];
function handleClick(e) {
  const btnAdd = e.currentTarget;

  if (btnAdd.classList.contains("click")) return;

  btnAdd.classList.add("click");

  const item = {
    id: btnAdd.dataset.id,
    name: btnAdd.dataset.name || "Item",
    quantity: 1,
  };

  cartItems.push(item);
  updateCartDisplay();

  btnAdd.innerHTML = `
    <div class='add-item'>
        <div class='container-decrement'>
            <img class='decrement' src='./image/icon-decrement-quantity.svg'/>
        </div>
        <div class='quantity'>1</div>
        <div class='container-increment increment'>
            <img class="increment" src="./image/icon-increment-quantity.svg" /> 
        </div>  
    </div>`;

  const decrementBtn = btnAdd.querySelector(".container-decrement");
  const incrementBtn = btnAdd.querySelector(".container-increment");
  const quantityDisplay = btnAdd.querySelector(".quantity");

  decrementBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    let currentValue = parseInt(quantityDisplay.textContent);

    if (currentValue > 1) {
      quantityDisplay.textContent = currentValue - 1;
      const cartItem = cartItems.find((i) => i.id === item.id);
      if (cartItem) cartItem.quantity--;
    } else {
      cartItems.splice(cartItems.indexOf(item), 1);
      btnAdd.classList.remove("click");
      btnAdd.innerHTML = `
        <button class="btn-add">
          <img src="./image/icon-add-to-cart.svg" alt="add cart" />
          <span class="add-cart">Add Cart</span>
        </button>
      `;

      btnAdd.querySelector(".btn-add").addEventListener("click", handleClick);
    }

    updateCartDisplay();
  });

  incrementBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    let currentValue = parseInt(quantityDisplay.textContent);
    quantityDisplay.textContent = currentValue + 1;

    const cartItem = cartItems.find((i) => i.id === item.id);
    if (cartItem) cartItem.quantity++;

    updateCartDisplay();
  });
}

function updateCartDisplay() {
  const cartContainer = document.querySelector(".container-payment");

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="container-cart-empty">
        <h2 class="title-empty">Your Cart(0)</h2>
      </div>
      <img src="../image/illustration-empty-cart.svg" alt="" />
      <p class="cart-empty">Your added items will appear here</p>
    `;
  } else {
    cartContainer.innerHTML = `
      <div class="cart-items">
        <h2>Your Cart (${cartItems.length})</h2>
        <ul>
          ${cartItems
            .map(
              (item) => `
            <li>
              ${item.name} - Quantity: ${item.quantity}
            </li>`
            )
            .join("")}
        </ul>
      </div>
    `;
  }
}

document.querySelectorAll(".container-btn").forEach((btn) => {
  btn.addEventListener("click", handleClick);
});
