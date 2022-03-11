

$(document).ready(function () {

    // set cart to 0 
    window.localStorage.clear();

    // Function to display products on the Home page 
    $.getJSON("https://captain-31.github.io/task/products.json", function (result) {

        let products = result.products;
        let output = '';

        for (let i = 0; i < 4; i++) {

            output += `<div class="product-card">
                        <img src="${products[i].variants[0].featured_image.src}" class="featured-image" alt="Image" />
                        <div class="d-flex justify-content-between">
                            <p class="product-title ms-2">${products[i].title}</p>
                            <span class="product-price me-2">$${products[i].variants[0].price}</span>
                        </div>
                        <div class="d-grid gap-2 ms-2 me-2">
                            <button
                                onclick="addToCart(${products[i].id}, ${products[i].variants[0].price})"
                                class="btn btn-outline-dark cart-btn"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                aria-controls="offcanvasRight"
                                data-id="${products[i].id}">
                                ADD TO CART
                            </button>
                            </div>
                        </div>`;

        }
        $('.product-container').html(output);
    });

});


// Add to cart functionality
function addToCart(id, price) {

    // Save ID to localstorage
    let cartItem = {
        "id": id,
        "qty": 1,
        "price": price
    };



    // Check if local storage has value
    let cartItems;
    if (localStorage.getItem('cartItems') === null) {

        cartItems = [];
        cartItems.push(cartItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateHTML(id);


    } else {

        cartItems = JSON.parse(localStorage.getItem('cartItems'));
        // check if the item exists
        let res = cartItems.some(function (x) {
            return x.id === id;
        });

        if (res) {
            // get index 
            objIndex = cartItems.findIndex((obj => obj.id == id));

            let qty = cartItems[objIndex].qty + 1;
            let output = '';
            // update array
            cartItems[objIndex].qty += 1;

            localStorage.setItem('cartItems', JSON.stringify(cartItems));

            $(`#${id} .cart-controller .total-qty`).html(qty);

            // update price 
            let price = $(`#${id} .total-price`).text();
            price = price * qty;
            $(`#${id} .total-price`).text(price.toFixed(2));


        } else {
            cartItems.push(cartItem);
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            updateHTML(id);
        }
    }
    updateTotalPrice();
    uptateTotalQty();
}


// Function to update content 
function updateHTML(id) {

    // get value from JSON
    $.getJSON("https://captain-31.github.io/task/products.json", function (result) {

        let res = result.products.find(x => x.id === id);

        let productData = {
            id: id,
            title: res.title,
            image: res.variants[0].featured_image.src,
            price: res.variants[0].price
        }

        let output = '';
        output += `<div class="row my-3 mx-2 item-details" id="${productData.id}">
                    <div class="col-3">
                        <img src="${productData.image}" width="100px" class="cart-draw-img"/>
                    </div>
                    <div class="col-6">
                        <p class="cart-name mb-1">${productData.title}</p>
                        <p class="cart-color">Color: Red</p>
                        <span class="cart-controller">
                            <a href="#" class="btn-operation increment" onclick="addOne(${productData.id})">+</a>
                            <span class="total-qty">1</span>
                            <a href="#" class="btn-operation decrement" onclick="minusOne(${productData.id})">-</a>
                        </span>
                    </div>
                    <div class="col-3 justify-content-end">
                        <p class="remove-block">
                            <a href="#" class="remove-item" onclick="removeItem(${productData.id})">
                                <img src="./assets/images/close-line.svg"/>
                            </a>
                        </p>
                        <p class="total-price mb-0 mt-4">${productData.price}</p>
                     </div>
                    </div>`;

        $('.offcanvas-body').prepend(output);
    });
}

// Increase the qty by 1
function addOne(id) {

    // update localstorage
    let data = JSON.parse(localStorage.getItem('cartItems'));
    let objIndex = data.findIndex((obj => obj.id == id));
    data[objIndex].qty += 1;
    localStorage.setItem('cartItems', JSON.stringify(data));

    // update HTML - total & single row
    updateTotalPrice();
    uptateTotalQty();

    updateQty(id);
    updatePrice(id);

}

// Decrease the qty by 1
function minusOne(id) {

    // update localstorage
    let data = JSON.parse(localStorage.getItem('cartItems'));
    let objIndex = data.findIndex((obj => obj.id == id));

    if (data[objIndex].qty == 1) {
        removeItem(id);
    } else {
        data[objIndex].qty -= 1;
        localStorage.setItem('cartItems', JSON.stringify(data));

        // update HTML - total & single row
        updateTotalPrice();
        uptateTotalQty();

        updateQty(id);
        updatePrice(id);
    }


}

// Remove product from cart
function removeItem(id) {

    // update localstorage 
    let data = JSON.parse(localStorage.getItem('cartItems'));

    data = data.filter(function (item) {
        return item.id != id;
    });
    localStorage.setItem('cartItems', JSON.stringify(data));
    console.log(data);

    // update html
    $(`#${id}`).hide();
    updateTotalPrice();
    uptateTotalQty();
}


// Function to update total price
function updateTotalPrice() {

    // get local storage item 
    const items = JSON.parse(localStorage.getItem('cartItems'));
    let totalPrice = 0;

    // calculate total 
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        totalPrice = totalPrice + (element.price * element.qty);
    }

    // update HTML
    $('.checkout-price').text(`$${totalPrice.toFixed(2)}`);
}

// Function to update total qty
function uptateTotalQty() {

    // get local storage item 
    const items = JSON.parse(localStorage.getItem('cartItems'));
    let totalQty = 0;

    // calculate total 
    for (let i = 0; i < items.length; i++) {
        const element = items[i];
        totalQty = totalQty + element.qty;
    }

    // Update HTML
    $('.cart-number').show();
    $('.item-count').show();
    $('.cart-number').text(totalQty);
    $('.item-count').text(`(${totalQty} items)`);
}

// function to update single item qty
function updateQty(id) {

    // get local storage item 
    const items = JSON.parse(localStorage.getItem('cartItems'));
    let objIndex = items.findIndex((obj => obj.id == id));
    let qty = items[objIndex].qty;
    $(`#${id} .total-qty`).text(qty);

}

// function to update single item price
function updatePrice(id) {

    // get local storage item 
    const items = JSON.parse(localStorage.getItem('cartItems'));
    let objIndex = items.findIndex((obj => obj.id == id));

    let price = items[objIndex].price * items[objIndex].qty;
    $(`#${id} .total-price`).text(`$${price}`);
}