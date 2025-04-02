const cartItems = [];

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
  }

  updateCartDisplay();
  updateButton(btnAdd, cartItem);
}

function updateButton(btnAdd, cartItem) {
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

  btnAdd
    .querySelector(".container-decrement")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      if (cartItem.quantity > 1) {
        cartItem.quantity--;
      } else {
        removeItem(cartItem.id);
      }
      updateCartDisplay();
    });

  btnAdd
    .querySelector(".container-increment")
    .addEventListener("click", (event) => {
      event.stopPropagation();
      cartItem.quantity++;
      updateCartDisplay();
    });
}

function removeItem(id) {
  const index = cartItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
    updateCartDisplay();
  }

  const btnAdd = document.querySelector(`.container-btn[data-id="${id}"]`);
  if (btnAdd) {
    btnAdd.classList.remove("click");
    btnAdd.removeAttribute("data-id");
    btnAdd.removeAttribute("data-name");
    if (cartItems.length === 0) {
      btnAdd.innerHTML = `
        <button class="btn-add">
          <img src="./image/icon-add-to-cart.svg" alt="add cart" />
          <span class="add-cart">Add Cart</span>
        </button>
      `;
      btnAdd.querySelector(".btn-add").addEventListener("click", handleClick);
    } else {
      btnAdd.innerHTML = `
        <div class='add-item'>
            <div class='container-decrement'>
                <img class='decrement' src='./image/icon-decrement-quantity.svg'/>
            </div>
            <div class='quantity'>${
              cartItems.find((item) => item.id === id).quantity
            }</div>
            <div class='container-increment'>
                <img class="increment" src="./image/icon-increment-quantity.svg" /> 
            </div>  
        </div>`;
    }
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
  }
}

document.querySelectorAll(".container-btn").forEach((btn) => {
  btn.dataset.name = btn
    .closest(".card")
    .querySelector(".content strong")
    .textContent.trim();
  btn.addEventListener("click", handleClick);
});
