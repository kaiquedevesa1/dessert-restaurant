function handleClick(e) {
  // Seleciona todos os botões
  const btnAdd = document.querySelectorAll(".container-btn");

  // Remove a classe “click” de todos

  // Adiciona a classe “click” ao botão atual
  e.currentTarget.classList.add("click");

  // Obtenha o contador atual do botão clicado ou inicialize em 0

  // Atualiza o HTML do botão com o novo contador
  e.currentTarget.innerHTML = `<div class='add-item'>
    <div class= 'container-decrement'>
        <img  class='decrement' src='./image/icon-decrement-quantity.svg'/>
    </div>
    <div>
      1
    </div>
    
    <div class='container-increment'>
      <img class="increment" src="./image/icon-increment-quantity.svg" />
       
      </div>
  <div/>`;
}

// Seleciona todos os botões e adiciona o evento de click
const btnAdd = document.querySelectorAll(".container-btn");

btnAdd.forEach((add) => {
  add.addEventListener("click", handleClick);
});
