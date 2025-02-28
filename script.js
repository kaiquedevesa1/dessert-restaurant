const cartItems = [];

function handleClick(e) {
  const btnAdd = e.currentTarget;

  if (btnAdd.classList.contains("click")) return;

  btnAdd.classList.add("click");

  const itemId = btnAdd.dataset.id;
  const itemName = btnAdd.dataset.name;

  if (!itemId || !itemName) {
    const card = btnAdd.closest(".card");
    if (card) {
      btnAdd.dataset.id = itemId || Math.random().toString(36).substr(2, 9);
      btnAdd.dataset.name =
        itemName || card.querySelector(".content strong").textContent.trim();
    }
  }

  let cartItem = cartItems.find((i) => i.id === btnAdd.dataset.id);

  if (cartItem) {
    cartItem.quantity++;
  } else {
    cartItem = {
      id: btnAdd.dataset.id,
      name: btnAdd.dataset.name,
      quantity: 1,
    };
    cartItems.push(cartItem);
  }

  updateCartDisplay();

  btnAdd.innerHTML = `
    <div class='add-item'>
        <div class='container-decrement'>
            <img class='decrement' src='./image/icon-decrement-quantity.svg'/>
        </div>
        <div class='quantity'>${cartItem.quantity}</div>
        <div class='container-increment'>
            <img class="increment" src="./image/icon-increment-quantity.svg" /> 
        </div>  
    </div>`;

  const decrementBtn = btnAdd.querySelector(".container-decrement");
  const incrementBtn = btnAdd.querySelector(".container-increment");
  const quantityDisplay = btnAdd.querySelector(".quantity");

  decrementBtn.replaceWith(decrementBtn.cloneNode(true));
  incrementBtn.replaceWith(incrementBtn.cloneNode(true));

  const newDecrementBtn = btnAdd.querySelector(".container-decrement");
  const newIncrementBtn = btnAdd.querySelector(".container-increment");

  newDecrementBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
      quantityDisplay.textContent = cartItem.quantity;
    } else {
      const index = cartItems.findIndex((i) => i.id === cartItem.id);
      if (index !== -1) {
        cartItems.splice(index, 1);
      }

      updateCartDisplay();
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

  newIncrementBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    cartItem.quantity++;
    quantityDisplay.textContent = cartItem.quantity;
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
        <h2>Your Cart (${cartItems.reduce(
          (total, item) => total + item.quantity,
          0
        )})</h2>
        <ul class='food'>
          ${cartItems
            .map(
              (item) =>
                `
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
  btn.dataset.name = btn
    .closest(".card")
    .querySelector(".content strong")
    .textContent.trim();

  btn.addEventListener("click", handleClick);
});
