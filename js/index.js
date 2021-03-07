// Carousel containers, slides and buttons
const carouselList = document.querySelector('.carousel__slide-list');
const slides = Array.from(carouselList.children)
const btnNav = document.querySelector('.carousel__nav')
const navBtns = Array.from(btnNav.children);
const cartItems = document.getElementById('shop-cart--items');
// Carousel slides size
const slideSize = slides[0].getBoundingClientRect().width;

// API endpoints
const homePageURL = 'https://5d76bf96515d1a0014085cf9.mockapi.io/product';


// CAROUSEL SCRIPT
// Sets slides positions from left
slides.forEach((slide, index) => {
  slide.style.left = slideSize*index + 'px';
})

// Moves from current to target slide
const moveToSlide = (currentSlide, targetSlide) => {
  // Gets position of target slide and moves the
  // List to that amount from initial position
  const moveAmount = targetSlide.style.left
  carouselList.style.transform = 'translateX(-' + moveAmount + ')'

  currentSlide.classList.remove('current-slide')
  targetSlide.classList.add('current-slide')
}

// Changes target button to current 
const moveToBtn = (currentBtn, targetBtn) => {
  currentBtn.classList.remove('current-btn');
  targetBtn.classList.add('current-btn');
} 

// Listens for click on Carousel Navigation buttons
btnNav.addEventListener('click', e => {
  // Return if not a button
  const targetBtn = e.target.closest("button")
  if(!targetBtn) return;

  // Get current&target slides and buttons
  const currentSlide = carouselList.querySelector('.current-slide')
  const currentBtn = btnNav.querySelector('.current-btn')
  const targetIndex = navBtns.findIndex(dot => dot === targetBtn) 
  const targetSlide = slides[targetIndex]
  
  // Move the slide, change the active button
  moveToSlide(currentSlide, targetSlide)
  moveToBtn(currentBtn, targetBtn)
})

// Slides the Carousel every 3sec
setInterval(() => {
  const currentSlide = carouselList.querySelector('.current-slide')
  const currentIndex = slides.findIndex(slide => slide === currentSlide)

  // Get current and target slides, and move slides
  const targetIndex = (currentIndex+1)%4
  const targetSlide = slides[targetIndex]
  moveToSlide(currentSlide, targetSlide)
  
  // Get current and target Buttons, change the buttons
  const currentBtn = navBtns[currentIndex]
  const targetBtn = navBtns[targetIndex]
  moveToBtn(currentBtn, targetBtn)

}, 3000)

// Updates the Cart
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


// FOR HOME PAGE PRODUCTS DISPLAY
let xhr = new XMLHttpRequest();
xhr.open('GET', homePageURL, true);

xhr.onreadystatechange = function() {
  if (this.readyState === 4 && this.status === 200) {
    // Clothes and accessories containers
    let clothesCards = document.getElementsByClassName('clothes__card');
    let accessoriesCards = document.getElementsByClassName('accessories__card');

    const response = JSON.parse(this.response);
    // Note index to manipulate next element
    let clothesIndex = 0;
    let accessoryIndex = 0;

    response.forEach(function(item, index) {
      let card;
      // Check if item is accessory
      if (item.isAccessory) {
        card = accessoriesCards[accessoryIndex++];
      } else {
        card = clothesCards[clothesIndex++];
      }

      // Change style of the card from response
      card.style.display = 'grid';
      card.href = `details.html?id=${item.id}`
      card.children[0].style.backgroundImage = `url("${item.preview}")`
      card.querySelector('.name').innerText = item.name;
      card.querySelector('.brand').innerText = item.brand;
      card.querySelector('.price').innerText = "Rs: "+item.price;
    })
  }
}
xhr.send()