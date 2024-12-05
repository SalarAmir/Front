// Database name and version
/*

here lies background.js v0.1 ;-;
              -
          25-09-2024


console.log('Background script loaded.');
const dbName = 'ExtensionDB';
const dbVersion = 1;

let serverUrl = 'http://localhost:5000/api/v1';

function getLocalStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], function(result) {
      console.log(`${key}:`, result[key]);
      resolve(result[key]);
    });
  });
}

function setLocalStorage(key, value) {
  return new Promise((resolve) => {
    chrome.storage.local.set({[key]: value}, function() {
      console.log(`${key} set to:`, value);
      resolve();
    });
  });
}

const api = {
  serverUrl: 'http://localhost:5000/api/v1',
  //basefunctions:
  useGet: async (url) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const completeUrl = `${serverUrl}${url}`;

      const response = await fetch(completeUrl, {
        method: 'GET',
        headers: headers,
      });
      const data = await response.json();

      console.log(
        "GET",
        completeUrl,
        "Response:",
        data
      )

      return data;
    }catch(err){
      console.error(err);
    }
  },

  usePost: async (url, body) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
      };
      const completeUrl = `${serverUrl}${url}`;

      const response = await fetch(completeUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();

      console.log(
        "POST",
        completeUrl,
        "Response:",
        data
      )

      return data;
    }catch(err){
      console.error(err);
    }
  },

  //Cart operations
  cart: {
    get: async (userEmail) => {
      const url = `/cart?email=${encodeURIComponent(userEmail)}`;
      return api.useGet(url);
    },
    add: async (userEmail, item) => {
      const url = `/cart/add?email=${encodeURIComponent(userEmail)}`;
      return api.usePost(url, item);
    },
    remove: async (userEmail, productName) => {
      const url = `/cart/remove?email=${encodeURIComponent(userEmail)}`;
      return api.usePost(url, { productName });
      // return api.usePost(url);
    },
  },
}

// Handle signup
function handleSignup(request, sendResponse) {
  console.log('Signup request received:', request.email);
  
  fetch(`${serverUrl}/users/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: request.email,
      name: request.name,
      password: request.password
    }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Signup successful:', request.email);
      sendResponse({ success: true });
    } else {
      console.error('Signup failed:', data.error);
      sendResponse({ success: false, error: data.error });
    }
  })
  .catch(error => {
    console.error('Signup failed:', error);
    sendResponse({ success: false, error: error.toString() });
  });
}

// Handle login
async function handleLogin (request, sendResponse) {
  console.log('Login request received:', request.email);
  const response = await fetch(`${serverUrl}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: request.email,
      password: request.password
    }),
  })
  const data = await response.json();
  if (data.success) {
    const user = data.data.userData
    console.log('Login successful:', data);
    const userStore =  {
      email: user.email,
      name: user.name
    }
    await setLocalStorage('isLoggedIn', true);
    await setLocalStorage('user', userStore);

    await getLocalStorage('user');
    sendResponse({success: true, user: userStore});
    
    } else {
      console.log('Login failed:', data.error);
      sendResponse({success: false, error: data.error});
    }
}

// Handle add to cart
async function handleAddToCart(request, sendResponse) {
  console.log('Add to cart request received:', request.userEmail);
  
  const item = request.item;
  const userEmail = request.userEmail;
  try {
    const items = await api.cart.add(userEmail, item);
    console.log('Cart updated :', item);
    sendResponse({ success: true });
  }
  catch (error) {
    console.error('Error updating cart:', error);
    sendResponse({ success: false, error: error.toString() });
  }

}

// Handle remove from cart (new function)
async function handleRemoveFromCart(request, sendResponse) {
  console.log('Remove from cart request received:', request.userEmail, request.productName);
  try {
    const items = await api.cart.remove(request.userEmail, request.productName);
    console.log('Item removed from cart successfully', request.productName);
    sendResponse({ success: true });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    sendResponse({ success: false, error: error.toString() });
  }

}
// Handle get cart
async function handleGetCart(request, sendResponse) {
  try {
    const items = await api.cart.get(request.userEmail);
    console.log('Cart retrieved successfully', items);
    sendResponse({ success: true, items });
  } catch (error) {
    console.error('Error getting cart:', error);
  }
}
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  console.log('Message received:', request.action);

  switch (request.action) {
    case 'signup':
      handleSignup(request, sendResponse);
      break;
    case 'login':
      await handleLogin(request, sendResponse);
      break;
    case 'addToCart':
      await handleAddToCart(request, sendResponse);
      console.log('add to cart request received:', request.userEmail);
      break;
    case 'removeFromCart':
      handleRemoveFromCart(request, sendResponse);
      console.log('remove from cart request received:', request.userEmail);
      break;
    case 'getCart':
      handleGetCart(request, sendResponse);
      console.log('get cart request received:', request.userEmail);
      break;
    default:
      console.error('Unknown action:', request.action);
      sendResponse({ success: false, error: 'Unknown action' });
  }

  return true; // Indicates that the response is sent asynchronously
});

*/

class API {
	static serverUrl = 'https://keibo-client-server.vercel.app/api/v1';
	// static serverUrl = 'http://localhost:5000/api/v1';

	static async get(url) {
		try {
			const headers = {
				'Content-Type': 'application/json',
			};
			const completeUrl = `${API.serverUrl}${url}`;

			const response = await fetch(completeUrl, {
				method: 'GET',
				headers: headers,
			});
			const data = await response.json();

			if(!data.success){
				console.error("GET", completeUrl, "Error:", data.error);
				throw new Error(data.error);
			}

			console.log(
				"GET",
				completeUrl,
				"Response:",
				data
			)

			return data;
		} catch (err) {
			console.error(err);
		}
	}

	static async post(url, body) {
		try {
			const headers = {
				'Content-Type': 'application/json',
			};
			const completeUrl = `${API.serverUrl}${url}`;

			const response = await fetch(completeUrl, {
				method: 'POST',
				headers: headers,
				body: JSON.stringify(body),
			});
			const data = await response.json();

			console.log(
				"POST",
				completeUrl,
				"Response:",
				data
			)

			return data;
		} catch (err) {
			console.error(err);
		}
	}
}

class StorageService {
	static get(key) {
		return new Promise((resolve) => {
			chrome.storage.local.get([key], function (result) {
				console.log(`${key}:`, result[key]);
				resolve(result[key]);
			});
		});
	}

	static set(key, value) {
		return new Promise((resolve) => {
			chrome.storage.local.set({ [key]: value }, function () {
				console.log(`${key} set to:`, value);
				resolve();
			});
		});
	}
}

class UserService{
	static async signup(request){
		// const response = await API.post('/users/signup', { email, name, password });
		try{
			const response = await API.post('/user/signup', request)
			console.log('Signup response:', response);
			if(response.success){
				return { success: true, data:true };
			}
			else{
				return { success: false, error: response.error };
			}
		}
		catch(error){
			console.error('Error signing up:', error);
			return { success: false, error: error.message };
		}

	}

	static async login(request){
		try{
			const { email, password } = request;
		
			const response = await API.post('/user/login', { email, password });
			console.log('Login response:', response);
			if(response.success){
				const user = response.data.userData;
				const userStore = {
					id: user.id,
					email: user.email,
					name: user.name
				}
				await StorageService.set('isLoggedIn', true);
				await StorageService.set('user', userStore);
		
				await StorageService.get('user');
				// return { success: true, user: userStore };
				return {success: true, data:userStore};
			}
			else{
				return { success: false, error: response.error };
			}
		}
		catch(error){
			console.error('Error logging in:', error);
			return { success: false, error: error.message };
		}
	}
	static async checkLogin(){
		try{
			const isLoggedIn = await StorageService.get('isLoggedIn');
			return { success: true, data: isLoggedIn };
		}
		catch(error){
			console.error('Error checking login:', error);
			return { success: false, error: error.message };
		}
	}

  static async getLoggedInEmail(){
	try{
		const user = await StorageService.get('user');
		return {success: true, data: user.email};

	}
	catch(error){
		console.error('Error getting logged in email:', error);
		return { success: false, error: error.message };
	}
  }

  static async logout(){
	try{
		await StorageService.set('isLoggedIn', false);
		await StorageService.set('user', null);

	}
	catch(error){
		console.error('Error logging out:', error);
		return { success: false, error: error.message };
	}
  }
}

class CartService{
	static async get(){
		const user = await StorageService.get('user');
		console.log('User in get cart:', user);
		const userEmail = user.email;

		if(!userEmail){
			throw new Error('User not logged in');
		}

		const url = `/cart?email=${encodeURIComponent(userEmail)}`;
		const response = await API.get(url);
		return {success: true, items: response.data};


		// return API.get(url);
	}

	static async addToCart(request){
		const user = await StorageService.get('user');
		const userEmail = user.email;

		if(!userEmail){
			throw new Error('User not logged in');
		}


		const payload = {
			product: request.product,
			price: request.price,
			imageUrl: request.imageUrl,
			prodUrl:request.prodUrl
			// quantity: request.quantity
		}
		const url = `/cart/add?email=${encodeURIComponent(userEmail)}`;
		const response = await API.post(url, payload);
		return {success: true};
	}

	static async removeFromCart(request){
		const user = await StorageService.get('user');
		const userEmail = user.email;

		if(!userEmail){
			throw new Error('User not logged in');
		}

		const payload = {
			productName: request.productName
		}
		const url = `/cart/remove?email=${encodeURIComponent(userEmail)}`;
		const response = await API.post(url, payload);
		return {success: true};
	}

	static async submitOrder(request){
		const user = await StorageService.get('user');
		const userEmail = user.email;

		if(!userEmail){
			throw new Error('User not logged in');
		}

		const payload = {
			consignee_info: request.consigneeInfo,
			shipping_info: request.shippingInfo,
			delivery_mode: request.deliveryMode
		}
		const url = `/orders?email=${encodeURIComponent(userEmail)}`;
		const response = await API.post(url, payload);
		return {success: true};
	}
	
}

const actionToServiceMap = {
	'signup': UserService.signup,
	'login': UserService.login,
	'getLoggedInEmail': UserService.getLoggedInEmail,
	'checkLogin':UserService.checkLogin,
	'getCart': CartService.get,
	'addToCart': CartService.addToCart,
	'removeFromCart': CartService.removeFromCart,
	'submitOrder': CartService.submitOrder,
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  	console.log('Message received:', request.action);

	if(!actionToServiceMap[request.action]){
		console.error('Unknown action:', request.action);
		sendResponse({ success: false, error: 'Unknown action' });
		return true;
	}

	actionToServiceMap[request.action](request)
	.then(response => {
		sendResponse({ success: true, data: response });
	})
	.catch(error => {
		console.error('Error:', error);
		sendResponse({ success: false, error: error.toString() });
	});
  	return true;
	
});