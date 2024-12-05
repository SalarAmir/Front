import {Cart} from './Cart.js';

import toolbarHTML from '../static/toolbar.html';
import '../static/toolbar.css';
import cartHTML from '../static/cart.html';
import '../static/cart.css';
import customHTML from '../static/custom.html';
import '../static/custom.css';
import infoHTML from '../static/info.html';
import '../static/info.css';


import logo from '../KieboLogo.png';
// console.log("toolbar in UI.js",toolbarHTML);

export class UI{
    constructor(){
        this.cart = new Cart();
        this.cart.getItems();
        this.deliveryMode = 'Sea Freight';
    }

    //UI injectors:

    injectToolbar(){
        console.log('Injecting toolbar...');
        let toolbarDiv = document.getElementById('toolbar');
        if (toolbarDiv) {
            toolbarDiv.style.display = 'block';
            return;
        }
        toolbarDiv = document.createElement('div');
        toolbarDiv.id = 'toolbar';
        toolbarDiv.innerHTML = toolbarHTML;
        document.body.appendChild(toolbarDiv);

        const logoLoc = document.querySelector('.logo');
        if (logoLoc) {
        logoLoc.src = logo;
        } else {
        console.error("Logo element not found");
        }

        this.setupToolbarEventListeners();
    }

    injectCart(){
        let existingCart = document.getElementById('cart-container');
        if (existingCart) {
            existingCart.style.display = 'block';
        } else {
            const cartDiv = document.createElement('div');
            cartDiv.id = 'cart-container';
            cartDiv.innerHTML = cartHTML;
            document.body.appendChild(cartDiv);

            this.setupCartEventListeners();
        }
        this.updateCartItems();
    }
    
    injectCustomization(){
        const customizationDiv = document.createElement('div');
        customizationDiv.id = 'customization-container';
        customizationDiv.innerHTML = customHTML;
        document.getElementById('cart-container').style.display = 'none';
        document.body.appendChild(customizationDiv);

        const requestButton = document.getElementById('continue-button');
        if (requestButton) {
            requestButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.injectInfo();
            });
        }

        const deliveryModeSelect = document.getElementById('delivery-mode');
        if (deliveryModeSelect) {
            deliveryModeSelect.addEventListener('change', (event) => {
                this.deliveryMode = event.target.value;
                console.log('Delivery mode:', this.deliveryMode);
            });
        }
    }
    
    injectInfo(){
        const infoDiv = document.createElement('div');
        infoDiv.id = 'info';
        infoDiv.innerHTML = infoHTML;
        infoDiv.style.display = 'block';
        document.body.appendChild(infoDiv);
        document.getElementById('customization-container').style.display = 'none';

        const submitButton = document.querySelector('#info #submit-btn');
        if (submitButton) {
            submitButton.addEventListener('click', (event) => {
                event.preventDefault();
                // Add your logic to handle the form submission here
                event.preventDefault();
                this.handleFormSubmission();
                console.log('Form submitted');
            });
        }
    }

    //UI misc handlers:

    handleFormSubmission() {
        // Gather consignee information
        const consigneeInfo = {
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            mobileNumber: document.getElementById('mobile-number').value,
            emailAddress: document.getElementById('email-address').value
        };

        // Gather shipping information
        const shippingInfo = {
            addressLine1: document.getElementById('address-line-1').value,
            city: document.getElementById('city').value,
            stateRegion: document.getElementById('state-region').value,
            country: document.getElementById('country').value,
            postCode: document.getElementById('post-code').value
        };

        // Validate the form
        if (this.validateForm(consigneeInfo, shippingInfo)) {
            // Submit the order
            this.cart.submitOrder(consigneeInfo, shippingInfo, this.deliveryMode)
                .then(() => {
                    alert('Order submitted successfully!');
                    // Clear the cart and update UI
                    this.cart.items = [];
                    this.updateCartItems();
                    // Hide the info div and show the cart
                    document.getElementById('info').style.display = 'none';
                    this.injectCart();
                })
                .catch(error => {
                    console.error('Error submitting order:', error);
                    alert('There was an error submitting your order. Please try again.');
                });
        }
    }
    validateForm(consigneeInfo, shippingInfo) {
        // Check if all fields are filled
        for (let key in consigneeInfo) {
            if (!consigneeInfo[key]) {
                alert(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return false;
            }
        }
        for (let key in shippingInfo) {
            if (!shippingInfo[key]) {
                alert(`Please fill in the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(consigneeInfo.emailAddress)) {
            alert('Please enter a valid email address.');
            return false;
        }

        return true;
    }

    updateCartItems() {
        console.log('Updating cart items...');
        const cart = this.cart.items;
        console.log('Current cart items:', cart);
        const cartItemsContainer = document.querySelector('.cart');
        if (!cartItemsContainer) {
            console.error('Cart container not found');
            return;
        }

        // Remove existing cart items
        const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
        existingItems.forEach(item => item.remove());
        console.log('Removed existing cart items.');

        // Add new cart items
        cart.forEach(item => {
            console.log('Adding item to cart:', item);
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';

            // Check if the SKU item image div exists in the DOM
            const skuItemImageDiv = document.querySelector('.sku-item-image');
            const skuItemImageHtml = skuItemImageDiv ? 
                `<div class="sku-item-image" style="background: url('${skuItemImageDiv.style.backgroundImage}') center center / contain no-repeat; width: 36px; height: 36px; margin-right: 10px;"></div>` :
                '';
            itemElement.innerHTML = `
                ${skuItemImageHtml}
                <img class="product-image" src="${item.imageUrl || 'default-image.jpg'}" alt="Product Image">
                <div class="item-details">
                    <p class="product-name">${item.product || 'Unknown Product'}</p>
                    <button class="remove-item">✕</button>
                    <p class="product-variants">Variants: </p>
                    <p class="product-price">${item.price || 'N/A'}</p>
                    <input class="product-quantity" value="${item.quantity || 1}" min="1" type="number">
                    <label>Quantity</label>
                </div>
            `;
            console.log(skuItemImageHtml)

            const removeButton = itemElement.querySelector('.remove-item');
            if (removeButton) {
                removeButton.addEventListener('click', async () => {
                    console.log('Removing item from cart:', item.product);
                    await this.cart.removeItem(item.product);
                    this.updateCartItems();
                });
            }

            cartItemsContainer.insertBefore(itemElement, cartItemsContainer.querySelector('.total'));
        });
        
        this.updateTotalPrice(cart);
        console.log('Cart items updated.');
    }

    updateTotalPrice(cart){
        const totalElement = document.querySelector('.total');
        if (!totalElement) {
            console.error('Total element not found');
            return;
        }

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace(/[^\d.]/g, ''));
            return sum + (price * item.quantity);
        }, 0);

        totalElement.textContent = `TOTAL: ¥ ${total.toFixed(2)}`;
    }
    //event listeners:
    setupToolbarEventListeners() {
        const addToCartButton = document.getElementById('add-to-cart');
        const viewCartButton = document.getElementById('view-cart');
    
        if (addToCartButton) {
            addToCartButton.addEventListener('click', async () => {
                const pageProduct = this.getProductTitle();
                const pagePrice = this.getProductPrice();
                const imageUrl = this.getProductImage();
                const prodUrl = this.getProductURL();
                console.log('Add to cart clicked', pageProduct, pagePrice, imageUrl, prodUrl);
                // You'll need to implement addToCart in your Cart class
                await this.cart.addItem(pageProduct, pagePrice, imageUrl, prodUrl);
                // Cart.addToCart(pageProduct, pagePrice, imageUrl);
                // Cart.addItem(pageProduct, pagePrice, imageUrl);
            });
        }
    
        if (viewCartButton) {
            viewCartButton.addEventListener('click', (event) => {
                console.log('View cart clicked');
                event.preventDefault();
                document.getElementById('toolbar').style.display = 'none';
                this.injectCart();
            });
        }
    }

    setupCartEventListeners() {
        const closeButton = document.getElementById('close-cart');
        const orderButton = document.querySelector('.request-order');

        if (closeButton) {
            closeButton.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('toolbar').style.display = 'block';
                document.getElementById('cart-container').style.display = 'none';
                this.injectToolbar();    
            });
        }

        if (orderButton) {
            orderButton.addEventListener('click', (event) => {
                event.preventDefault();
                this.injectCustomization();
            });
        }
    }

    //Scrapers:
    getProductTitle(){
        const selectors = [
            '.ItemTitle--mainTitle--2OrrwrD.f-els-2',
            '.mainTitle--O1XCl8e2.f-els-2',
            ".mainTitle--O1XCl8e2 f-els-2",
            ".title-text",
            'h1.title',
            '#product-name',
            '[itemprop="name"]'
        ];
      
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                return element.textContent.trim();
            }
        }
    
        return 'Unknown Product';
    }

    getProductPrice(){
        const selectors = [
            '.SecurityPrice--text--3eB2Q7Q',
            '.text--Mdqy24Ex'
        ];
      
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
    
        return 'Unknown Price';
    }

    getProductImage() {
        const selectors = [
            '.mainPic--zxTtQs0P',
            '.product-image',
            '.image-container img',
            '.product-photo img',
            ".scale-img",
            ".scaled-img"
        ];
      
        for (let selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                if (element.src) {
                    return element.src;
                } else if (element.style.backgroundImage) {
                    // Extract the URL from the background-image style
                    const urlMatch = element.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/);
                    if (urlMatch && urlMatch[1]) {
                        return urlMatch[1];
                    }
                }
            }
        }
    
        return 'default-image-url.jpg';
    }

    getProductURL(){
        return window.location.href;
    }
}