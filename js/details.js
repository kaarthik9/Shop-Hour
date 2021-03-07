// Get the URL params for product id
const url_string = window.location.href
const url = new URL(url_string);
const id = url.searchParams.get("id");

// API for product details
const itemURL = 'https://5d76bf96515d1a0014085cf9.mockapi.io/product/'+id+'/'

//Get relevent DOM elements
const mainImg = document.getElementsByClassName('details__imgs-main')
const previewImgs = document.getElementsByClassName('details__imgs-previews')
const productName = document.getElementById('product-name');
const brand = document.getElementById('product-brand');
const price = document.getElementById('product-price');
const description = document.getElementById('product-description');
const addToCart = document.getElementById('cart-btn');
const cartItems = document.getElementById('shop-cart--items');


let xhr = new XMLHttpRequest();
xhr.open('GET', itemURL, true);
// Calls API, gets and sets Main and preview Images
xhr.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    const response = JSON.parse(this.response);

    mainImg[0].children[0].src = response.preview;
    response.photos.forEach((photo, index) => {
      let preview = document.createElement('img');
      if (index === 0) {
        preview.classList.add('active');
      }
      preview.src = photo;
      previewImgs[0].appendChild(preview);
    })
    
    // Update DOM Elements     
    productName.innerText = response.name;
    brand.innerText = response.brand;
    price.innerText = response.price;
    description.innerText = response.description;
  }
}
xhr.send()

// Displays preview Images
previewImgs[0].addEventListener('click', function(e) {
  if(e.target.tagName === 'IMG') {
    previewImgs[0].querySelector('.active').classList.remove('active');
    e.target.classList.add('active');

    mainImg[0].children[0].src = e.target.src
  }
})

//Updates and displays cart items
function updateCart() {
  if(localStorage.getItem('shopHourCart')) {
    let cart = JSON.parse(localStorage.getItem('shopHourCart'));
    let quantity = 0;

    Object.keys(cart).forEach(function(key) {
      quantity = quantity + cart[key];
    })
    cartItems.innerText = quantity;
  } else {
    cartItems.innerText = '0';
  }
}
updateCart();

// Adds to cart
addToCart.addEventListener('click', function() {
  let cart;
  if(!(localStorage.getItem('shopHourCart'))) {
    cart = {};
  } else {
    cart = JSON.parse(localStorage.getItem('shopHourCart'));
  }

  cart[id] = cart[id] ? cart[id]+1 : 1;

  localStorage.setItem('shopHourCart', JSON.stringify(cart));
  updateCart();
})
