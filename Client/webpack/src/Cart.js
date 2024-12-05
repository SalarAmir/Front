import {BackgroundCommunication} from './BackgroundCommunication.js';

export class Cart{
    constructor(){
        console.log('Cart constructor');
        this.items = [];
    }

    async addItem(product, price, imageUrl, prodUrl){
        const existingItem = this.items.find(item => item.product === product);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push({ product, price, imageUrl, quantity: 1 });
        }

        try{
            await BackgroundCommunication.sendMessage('addToCart', { product, price, imageUrl, quantity:existingItem?.quantity || 1, prodUrl} );
            // this.updateUI();
        }
        catch(error){
            console.error('Error adding item to cart:', error);
        }
    }

    async removeItem(productName){
        this.items = this.items.filter(item => item.product !== productName);

        try{
            await BackgroundCommunication.sendMessage('removeFromCart', { productName });
            // this.updateUI();
        }
        catch(error){
            console.error('Error removing item from cart:', error);
        }
    }

    async getItems(){
        try{
            const response = await BackgroundCommunication.sendMessage('getCart', {});
            console.log('Cart items:', response.items);
            this.items = response.items;
            // this.updateUI();
            return response.items;
        }
        catch(error){
            console.error('Error getting cart:', error);
        }
    }

    async submitOrder(consigneeInfo, shippingInfo, deliveryMode){
        try{
            const response = await BackgroundCommunication.sendMessage('submitOrder', {consigneeInfo, shippingInfo, deliveryMode});
            console.log('Order submitted:', response);
            this.items = [];
            // this.updateUI();
        }
        catch(error){
            console.error('Error submitting order:', error);
        }
    }
}