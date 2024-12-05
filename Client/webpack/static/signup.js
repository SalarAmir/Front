// Function to handle signup
console.log('signup.js loaded');

async function handleSignup(event) {
    console.log('Handling signup');
    event.preventDefault();

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    console.log(firstName);

    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }

    // Send signup request to background script
    try{
        const resp = await chrome.runtime.sendMessage({
            action: 'signup',
            email, 
            name: `${firstName} ${lastName}`, 
            password
        });
        console.log('Signup response:', resp);
        if(resp && resp.success){
            alert('Signup successful');
            window.close();
        }else{
            alert('Signup failed: ' + (resp ? resp.error : 'Unknown error'));
        }
    }
    catch(err){
        console.error('Error signing up:', err);
        alert('Error signing up: ' + err.message);
    }
    // chrome.runtime.sendMessage({
    //     action: 'signup',
    //     email: email,
    //     name: `${firstName} ${lastName}`,
    //     password: password
    // }, response => {
    //     if (response.success) {
    //         showMessage('Signup successful!', 'success');
    //         // Redirect to login page after a short delay
    //         setTimeout(() => {
    //             window.location.href = './login.html';
    //         }, 2000);
    //     } else {
    //         showMessage('Signup failed: ' + (response.error || 'Unknown error'), 'error');
    //     }
    // });
}

// Function to display messages to the user
function showMessage(message, type) {
    let messageElement = document.getElementById('message');
    if (!messageElement) {
        // Create the message element if it doesn't exist
        messageElement = document.createElement('div');
        messageElement.id = 'message';
        document.body.appendChild(messageElement);
    }
    messageElement.textContent = message;
    messageElement.className = type;
    messageElement.style.display = 'block';
}

// Toggle password visibility
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// Wait for the DOM to be fully loaded before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    // Correctly selecting the form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
        console.log('Signup form found');
    } else {
        console.error('Signup form not found');
    }

    // Attach toggle function to password visibility buttons
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    
    if (togglePassword) {
        togglePassword.addEventListener('click', () => togglePasswordVisibility('password'));
    }
    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', () => togglePasswordVisibility('confirm-password'));
    }
});
