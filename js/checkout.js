const cartItems = document.getElementById("shop-cart--items");
const totalItems = document.getElementById("total-items");
const checkoutInfoBox = document.getElementById("checkout-info");
const totalAmount = document.getElementById("total-amount");
const orderBtn = document.getElementById("place-order");
const itemURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/product/";
const orderURL = "https://5d76bf96515d1a0014085cf9.mockapi.io/order"

// Updates the cart in the header
function updateCart() {
  if (localStorage.getItem("shopHourCart")) {
    let cart = JSON.parse(localStorage.getItem("shopHourCart"));
    let quantity = 0;

    Object.keys(cart).forEach(function (key) {
      quantity = quantity + cart[key];
    });
    cartItems.innerText = quantity;
  } else {
    cartItems.innerText = "0";
  }
}
updateCart();

// Set and get order id 
let orderId;
if(!(localStorage.getItem("shopHourOrderId"))) {
  localStorage.setItem("shopHourOrderId", "100");
}
orderId = JSON.parse(localStorage.getItem("shopHourOrderId"))
localStorage.setItem("shopHourOrderId", (orderId+1).toString())

// Create new obj to POST on Create order API
let postApiObject = {
  id: orderId,
  name:"ShopHour User",
  avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/suprb/128.jpg",
  createdAt: new Date(),
  amount: 0
};
// Empty total product object
let products = {};

// Get ids of each cart item and get info
if (localStorage.getItem("shopHourCart")) {
  let cart = JSON.parse(localStorage.getItem("shopHourCart"));
  let itemCount = 0;
  let amountCount = 0;
  let productIndex = 0;

  Object.keys(cart).forEach(function (id) {
    // Get item info and update total, individual amount
    // and update item count
    let xhr = new XMLHttpRequest();
    xhr.open("GET", itemURL + "" + id, true);

    xhr.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const response = JSON.parse(this.response);

        // Get details of item
        let quantity = cart[id];
        let name = response.name;
        let preview = response.preview;
        let isAccessory = response.isAccessory;
        let brand = response.brand;
        let price = response.price;

        // Update DOM with relevant information
        let infoDiv = document.createElement("div");
        let itemImage = document.createElement("img");
        itemImage.src = preview
        let descriptionDiv = document.createElement("div");
        descriptionDiv.classList.add("checkout__box--description");
        let name$h3 = document.createElement("h3");
        name$h3.innerText = name;
        let quantity$p = document.createElement("p");
        quantity$p.innerText = "x" + quantity;
        let amount$p = document.createElement("p");
        amount$p.innerText = "Amount: Rs " + (quantity * price);

        descriptionDiv.appendChild(name$h3);
        descriptionDiv.appendChild(quantity$p);
        descriptionDiv.appendChild(amount$p);

        infoDiv.appendChild(itemImage);
        infoDiv.appendChild(descriptionDiv);
        
        //Append all elements to container
        checkoutInfoBox.appendChild(infoDiv);

        itemCount++;
        amountCount = amountCount+(quantity*price)
        postApiObject.amount = amountCount;

        totalItems.innerText = itemCount;
        totalAmount.innerText = amountCount;
        // Update Product object to POST later
        products[productIndex++] = {
          id: id,
          brand: brand,
          name: name,
          price: price,
          preview: preview,
          isAccessory: isAccessory
        }
      }
    };
    xhr.send();
  });

} else {
  // Display No items in cart
  document.getElementById("no-cart-items").style.display = "flex";
  document.getElementById("cart-has-items").style.display = "none";

}

// API objict for creating order
postApiObject.products = products;

// Send order to create order API
orderBtn.addEventListener("click", function() {

  let xhr = new XMLHttpRequest();
  xhr.open("POST", orderURL, true);

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      
      // Update cart and redirect to confirmation page
      localStorage.removeItem("shopHourCart")
      window.location.href = "confirmation.html";
    }
  }

 xhr.send(JSON.stringify(postApiObject));

 // Update cart and redirect to confirmation page
 localStorage.removeItem("shopHourCart")
 window.location.href = "confirmation.html";
})
