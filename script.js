const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function verifiedFetch() {
  return fetch(API_URL)
    .then((response) => response.json())
    .then((response) => (response.results));
}

const fetchProduct = async (idItem) => 
  fetch(`https://api.mercadolibre.com/items/${idItem}`)
    .then((response) => response.json())
    .then((response) => (response));

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__id', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const appendProducts = async () => {
  const resultsMercado = await verifiedFetch();
  const sectionItems = document.querySelector('.items');
  resultsMercado.forEach((result) => {
    const productItemElement = createProductItemElement(result);
    sectionItems.appendChild(productItemElement);
  });
};

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

// function cartItemClickListener(event) {
  function cartItemClickListener() {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getId = async (id) => {
  const productFound = await fetchProduct(id);
  const cartItems = document.querySelector('.cart__items');
  const cartItem = createCartItemElement(productFound);
  cartItems.appendChild(cartItem);
};

const addShoppingCart = async () => {
  // await appendProducts();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    const id = button.parentElement.firstElementChild.innerHTML;
    button.addEventListener('click', () => getId(id));
  });
};

window.onload = async function onload() { 
  await appendProducts();
  await addShoppingCart();
};