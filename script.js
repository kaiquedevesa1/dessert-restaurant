let cartItems = [];

function handleClick(e) {
  const btnAdd = e.currentTarget;

  if (btnAdd.classList.contains("click")) return;

  btnAdd.classList.add("click");

  const card = btnAdd.closest(".card");
  if (card) {
    const fixedId = card.dataset.id || Math.random().toString(36).substr(2, 9);
    card.dataset.id = fixedId;
    btnAdd.dataset.id = fixedId;
    btnAdd.dataset.name = card
      .querySelector(".content strong")
      .textContent.trim();
    const itemPrice = parseFloat(
      card.querySelector(".value").textContent.replace("$", "")
    );
    btnAdd.dataset.price = itemPrice;
  }

  let cartItem = cartItems.find((i) => i.id === btnAdd.dataset.id);

  if (!cartItem) {
    cartItem = {
      id: btnAdd.dataset.id,
      name: btnAdd.dataset.name,
      quantity: 1,
      price: parseFloat(btnAdd.dataset.price),
    };
    cartItems.push(cartItem);
  } else {
    cartItem.quantity = 1;
  }

  updateCartDisplay();
  updateButton(btnAdd, cartItem);
}

function updateButton(btnAdd, cartItem) {
  btnAdd.classList.add("click");

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

  decrementBtn.replaceWith(decrementBtn.cloneNode(true));
  incrementBtn.replaceWith(incrementBtn.cloneNode(true));

  const newDecrementBtn = btnAdd.querySelector(".container-decrement");
  const newIncrementBtn = btnAdd.querySelector(".container-increment");

  newDecrementBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    } else {
      removeItem(cartItem.id);
      return;
    }
    updateCartDisplay();
    updateButton(btnAdd, cartItem);
  });

  newIncrementBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    cartItem.quantity++;
    updateCartDisplay();
    updateButton(btnAdd, cartItem);
  });
}

function removeItem(id) {
  cartItems = cartItems.filter((item) => item.id !== id);

  updateCartDisplay();

  const btnAdd = document.querySelector(`.container-btn[data-id="${id}"]`);
  if (btnAdd) {
    btnAdd.classList.remove("click");
    btnAdd.removeAttribute("data-id");
    btnAdd.removeAttribute("data-name");
    btnAdd.removeAttribute("data-price");

    btnAdd.innerHTML = `
      <button class="btn-add">
        <img src="./image/icon-add-to-cart.svg" alt="add cart" />
        <span class="add-cart">Add Cart</span>
      </button>
    `;

    btnAdd.querySelector(".btn-add").addEventListener("click", handleClick);
  }
}

function updateCartDisplay() {
  const cartContainer = document.querySelector(".container-payment");

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `<h2 class="title-empty">Your Cart(0)</h2>
     <div class="cart-empty">
          <img src="/image/illustration-empty-cart.svg" alt="" />
          <p>Your added items will appear here</p>
        </div>`;
  } else {
    const totalOrder = cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );

    cartContainer.innerHTML = `
      <div class="container-payment-cart">
        <div class="cart-items-quantity">
          <h2>Your Cart (${cartItems.reduce(
            (total, item) => total + item.quantity,
            0
          )})</h2>
        </div>
        <ul class='food'>
          ${cartItems
            .map(
              (item) => `
                <div class="container-cart" data-id="${item.id}">
                  <li class="cart-item">
                    ${item.name}  
                    <div class="price-quantity">
                      <span class="payment-quantity"> ${item.quantity} x </span>
                      <span class="price">$${item.price.toFixed(2)}  $${(
                item.quantity * item.price
              ).toFixed(2)}</span>
                    </div>
                  </li>
                  <div class="button-remove" onclick="removeItem('${
                    item.id
                  }')"> 
                    <img src ="./image/icon-remove-item.svg" class ="remove-item"> 
                  </div> 
                </div>`
            )
            .join("")}
        </ul>
        <div class="total">
          <p class="order">Order Total:</p>
          <p class="total-price">$${totalOrder.toFixed(2)}</p>
        </div>
      </div>
      <div class="carbon">
        <img src="/image/icon-carbon-neutral.svg">
        <p>This is a <span>carbon-neutral</span> delivery</p>
      </div>
      <div class="confirm-order">
        <button>Confirm Order</button>
      </div>
    `;

    document
      .querySelector(".confirm-order button")
      ?.addEventListener("click", confirmOrder);
  }
}

function confirmOrder() {
  if (cartItems.length === 0) {
    alert(
      "Seu carrinho está vazio! Adicione itens antes de confirmar o pedido."
    );
    return;
  }

  const modal = document.getElementById("modalConfirmation");
  modal.style.display = "flex";

  const closeModalButton = document.getElementById("closeModal");

  closeModalButton.replaceWith(closeModalButton.cloneNode(true));

  document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";

    cartItems = [];
    updateCartDisplay();

    document.querySelectorAll(".container-btn").forEach((btn) => {
      btn.classList.remove("click");
      btn.removeAttribute("data-id");
      btn.removeAttribute("data-name");
      btn.removeAttribute("data-price");

      btn.innerHTML = `
        <button class="btn-add">
          <img src="./image/icon-add-to-cart.svg" alt="add cart" />
          <span class="add-cart">Add Cart</span>
        </button>
      `;

      btn.querySelector(".btn-add").addEventListener("click", handleClick);
    });
  });
}

document.querySelectorAll(".container-btn").forEach((btn) => {
  btn.dataset.name = btn
    .closest(".card")
    .querySelector(".content strong")
    .textContent.trim();
  btn.addEventListener("click", handleClick);
});
