<<<<<<< HEAD
const cartItems = [];

// Função para lidar com o clique no botão "Adicionar ao Carrinho"
function handleClick(e) {
  const btnAdd = e.currentTarget;

  // Verifica se o botão já foi clicado
  if (btnAdd.classList.contains("click")) return;

  // Adiciona a classe 'click' ao container-btn
  const containerBtn = btnAdd.closest(".container-btn");
  if (containerBtn) {
    containerBtn.classList.add("click");
  }

  btnAdd.classList.add("click");

  const card = btnAdd.closest(".card");
  if (!card) return;

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

  // Verifica se o item já está no carrinho
  let cartItem = cartItems.find((i) => i.id === fixedId);

  if (!cartItem) {
    // Se não estiver, adiciona ao carrinho
    cartItem = {
      id: fixedId,
      name: btnAdd.dataset.name,
      quantity: 1,
      price: itemPrice,
    };
    cartItems.push(cartItem);
  } else {
    // Se já estiver, apenas incrementa a quantidade
    cartItem.quantity++;
  }

  updateCartDisplay();
  updateButton(btnAdd, cartItem);
}

// Função para atualizar o botão após adicionar um item
function updateButton(btn, cartItem) {
  // Muda o fundo do botão
  btn.classList.add("click");

  // Adiciona os botões de incremento e decremento
  btn.innerHTML = `
    <div class='add-item'>
        <div class='container-decrement'>
            <img class='decrement' src='./image/icon-decrement-quantity.svg'/>
        </div>
        <div class='quantity'>${cartItem.quantity}</div>
        <div class='container-increment'>
            <img class='increment' src='./image/icon-increment-quantity.svg'/> 
        </div>  
    </div>`;

  // Adiciona eventos de clique para os botões de incremento e decremento
  const decrementButton = btn.querySelector(".container-decrement");
  const incrementButton = btn.querySelector(".container-increment");

  decrementButton.onclick = () => modifyQuantity(cartItem, btn, -1);
  incrementButton.onclick = () => modifyQuantity(cartItem, btn, 1);
}

// Função para modificar a quantidade de um item no carrinho
function modifyQuantity(cartItem, btn, change) {
  cartItem.quantity += change;

  if (cartItem.quantity <= 0) {
    removeItem(cartItem.id);
  } else {
    btn.querySelector(".quantity").textContent = cartItem.quantity;
    updateCartDisplay();
  }
}

// Função para remover um item do carrinho
function removeItem(itemId) {
  const index = cartItems.findIndex((item) => item.id === itemId);

  if (index !== -1) {
    cartItems.splice(index, 1);
    updateCartDisplay();

    const btnAdd = document.querySelector(
      `.container-btn[data-id='${itemId}']`
    );
    if (btnAdd) {
      btnAdd.classList.remove("click");
      btnAdd.removeAttribute("data-id");
      btnAdd.removeAttribute("data-name");
      btnAdd.removeAttribute("data-price");

      // Resetar o botão para o estado inicial
      btnAdd.innerHTML = `
        <button class="btn-add">
            <img src="./image/icon-add-to-cart.svg" alt="add cart" />
            <span class="add-cart">Add Cart</span>
        </button>
      `;
      btnAdd.querySelector(".btn-add").addEventListener("click", handleClick);
    }

    // Se o carrinho estiver vazio, também pode ser necessário resetar o estado do botão
    if (cartItems.length === 0) {
      resetButtonStates();
    }
  }
}

// Função para atualizar a exibição do carrinho
function updateCartDisplay() {
  const cartContainer = document.querySelector(".container-payment");
  if (!cartContainer) return;

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="container-cart-empty ">
        <h2 class="title-empty">Your Cart(0)</h2>
      </div>
      <div class="cart-empty">
        <img src="./image/illustration-empty-cart.svg" alt="" />
        <p>Your added items will appear here</p>
      </div>`;
    return;
  }

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
          <div class="container-cart">
            <li class="cart-item">
              <img src="./image/${item.id}.jpg" class="food-image" alt="${
              item.name
            }" onerror="this.onerror=null; this.src='./image/default.jpg';">
              ${item.name}  
              <div class="price-quantity">
                <span class="payment-quantity"> ${item.quantity} x </span>
                <span class="price">$${item.price.toFixed(2)}  $${(
              item.quantity * item.price
            ).toFixed(2)}</span>
              </div>
            </li>
            <div class="button-remove" onclick="removeItem('${item.id}')"> 
              <img src="./image/icon-remove-item.svg" class="remove-item"> 
            </div>
          </div>`
          )
          .join("")}
      </ul>
      <div class="total">
        <p class="order">Order Total:</p>
        <p class="total-price">$${totalOrder.toFixed(2)}</p>
      </div>
      <div class="confirm-order">
        <button onclick="confirmOrder()">Confirm Order</button>
      </div>
    </div>`;
}

// Função para confirmar o pedido
function confirmOrder() {
  if (cartItems.length === 0) {
    alert("Your cart is empty! Add items before confirming the order.");
    return;
  }

  const modal = document.getElementById("orderModal");
  const orderItemsList = document.getElementById("orderItems");
  const totalPriceElement = document.getElementById("totalPrice");

  orderItemsList.innerHTML = "";

  cartItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <img src="./image/${item.id}.jpg" class="order-img" alt="${
      item.name
    }" onerror="this.onerror=null; this.src='./image/default.jpg';">
      <div>
        <p><strong>${item.name}</strong></p>
        <p>${item.quantity} x $${item.price.toFixed(2)}</p>
      </div>
      <p><strong>$${(item.quantity * item.price).toFixed(2)}</strong></p>
    `;
    orderItemsList.appendChild(listItem);
  });

  totalPriceElement.textContent = `$${cartItems
    .reduce((total, item) => total + item.quantity * item.price, 0)
    .toFixed(2)}`;
  modal.style.display = "flex";

  // Limpa o carrinho após confirmar o pedido
  cartItems.length = 0;
  updateCartDisplay();
}

// Adiciona o evento de clique ao botão "New Order"
document.getElementById("newOrderBtn").addEventListener("click", () => {
  // Limpa o localStorage
  localStorage.clear();

  // Limpa o carrinho
  cartItems.length = 0;

  // Atualiza a exibição do carrinho
  updateCartDisplay();

  // Reinicia o container do botão
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

  // Oculta o modal de confirmação
  const modal = document.getElementById("orderModal");
  if (modal) {
    modal.style.display = "none"; // Oculta o modal
  }
});

// Função para resetar o estado dos botões
function resetButtonStates() {
  document.querySelectorAll(".container-btn").forEach((btn) => {
    btn.classList.remove("click");
    btn.removeAttribute("data-id");
    btn.removeAttribute("data-name");
    btn.removeAttribute("data-price ");

    btn.innerHTML = `
      <button class="btn-add">
          <img src="./image/icon-add-to-cart.svg" alt="add cart" />
          <span class="add-cart">Add Cart</span>
      </button>
    `;
    btn.querySelector(".btn-add").addEventListener("click", handleClick);
  });
}

// Adiciona o evento de clique aos botões de adicionar ao carrinho
document.querySelectorAll(".container-btn").forEach((btn) => {
  btn.querySelector(".btn-add").addEventListener("click", handleClick);
});
=======
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

    // Pega o preço do produto
    const itemPrice = parseFloat(
      card.querySelector(".value").textContent.replace("$", "")
    );
    btnAdd.dataset.price = itemPrice; // Salva o preço no botão
  }

  let cartItem = cartItems.find((i) => i.id === btnAdd.dataset.id);

  if (!cartItem) {
    cartItem = {
      id: btnAdd.dataset.id,
      name: btnAdd.dataset.name,
      quantity: 1,
      price: parseFloat(btnAdd.dataset.price), // Adiciona o preço
    };
    cartItems.push(cartItem);
  } else {
    cartItem.quantity = 1;
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
        updateCartDisplay();
      }

      updateCartDisplay();
      btnAdd.classList.remove("click");
      btnAdd.removeAttribute("data-id");
      btnAdd.removeAttribute("data-name");

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
      <div class="cart-empty">
        <img src="./image/illustration-empty-cart.svg" alt="" />
        <p>Your added items will appear here</p>
      </div>
    `;
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
      (item) =>
        `
      <div class="container-cart">
         <li class="cart-item">
          ${item.name}  
          
          <div class="price-quantity">
          <span class="payment-quantity"> ${item.quantity} x </span>
          
          <span class="price">$${item.price.toFixed(2)}  $${(
          item.quantity * item.price
        ).toFixed(2)}</span>
          </div>
        </li>
         <div class="button-remove" onclick="removeItem()" > 
            <img src ="./image/icon-remove-item.svg" class ="remove-item"> 
         </div> 

      </div>
     
        
        `
    )
    .join("")}
    
    
      </ul>

        <div class="total">
              <p class="order">Order Total:</p>
              <p class="total-price">$${totalOrder.toFixed(2)}</p>
        </div>
      </div>



      <div class= "carbon">
        <img src="/image/icon-carbon-neutral.svg"
        <p>This is a <span>carbon-neutral</span> delivery</p>
      </div>


      <div class="confirm-order">
        <button>Confirm Order </div>
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
>>>>>>> 158149af8141b42efa39662288470f331994f480
