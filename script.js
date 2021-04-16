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

const insertLoading = () => {
  // const items = document.querySelector('.container');
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerHTML = 'loading...';
  document.body.appendChild(span);
};

const removeLoading = () => {
  document.querySelector('.loading').remove();
};

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

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const appendProducts = async () => {
  insertLoading();
  const resultsMercado = await verifiedFetch();
  removeLoading();
  const sectionItems = document.querySelector('.items');
  resultsMercado.forEach((result) => {
    const productItemElement = createProductItemElement(result);
    sectionItems.appendChild(productItemElement);
  });
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const updateCartTotal = async () => {
  const cartItems = document.querySelectorAll('.cart__item');
  const totalPrice = document.querySelector('.total-price');
  let sum = 0;
  cartItems.forEach((cartItem) => {
    const extractedPrice = cartItem.innerText.split('$');
    sum += Number(extractedPrice[1]);
  });
  totalPrice.innerHTML = sum;
};

// function cartItemClickListener({ target }) {
  async function cartItemClickListener(event) {
  const ol = event.target.parentElement;
  // event.target.classList.add('xablau');
  /* const totalPrice = await getTotalPrice();
  const newPrice = totalPrice - extractPrice(event.target);
  await setTotalPrice(newPrice); */
  event.target.remove();
  // return event.target.parentNode.removeChild(event.target);
  // const ul = document.querySelector('.cart__items');
  // const itemToBeRemoved = document.querySelector('.delete');
  updateCartTotal();
  localStorage.myShoppingCart = ol.innerHTML;
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getId = async (id) => {
  insertLoading();
  const productFound = await fetchProduct(id);
  removeLoading();
  const cartItems = document.querySelector('.cart__items');
  const cartItem = createCartItemElement(productFound);
  cartItems.appendChild(cartItem);
  updateCartTotal();
  /* const totalPrice = await getTotalPrice();
  const newPrice = totalPrice + extractPrice(cartItem);
  await setTotalPrice(newPrice); */

  localStorage.myShoppingCart = cartItems.innerHTML;
};

const addShoppingCart = async () => {
  // await appendProducts();
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    // const id = button.parentElement.firstElementChild.innerHTML;
    button.addEventListener('click', () => {
      const id = getSkuFromProductItem(button.parentElement);
      getId(id);
    });
  });
};

const loadShoppingCart = async () => {
  const cartItems = document.querySelector('.cart__items');
  if (localStorage.myShoppingCart) {
    cartItems.innerHTML = localStorage.myShoppingCart;
    const carts = document.querySelectorAll('.cart__item');
    carts.forEach((cart) => {
      cart.addEventListener('click', cartItemClickListener);
    });
  }
};

const emptyCart = async () => {
  const btnEmptyCart = document.querySelector('.empty-cart');
  const cartItems = document.getElementsByClassName('cart__items')[0];
  btnEmptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.myShoppingCart = '';
    /* while (document.querySelector('.cart__item')) {
      document.querySelector('.cart__item').remove();
    } */
  });
  // const cartItems = document.querySelector('.cart__items');
  /* var elemento = document.getElementById("topo");
  (cartItems.firstChild) {
    cartItems.removeChild(cartItems.firstChild);
  } */
};

window.onload = async function onload() { 
  // insertLoading();
  await appendProducts();
  await loadShoppingCart();
  await addShoppingCart();
  await emptyCart();
};