// This file is used to handle the popup.html page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;
        try{
            const resp = await chrome.runtime.sendMessage({ action: 'login', email, password});
            console.log('Login resp:', resp);
            if(resp && resp.data.success === true){
                alert('Login successful!');
                // console.log('login response:', Object.keys());
                chrome.storage.local.set({ isLoggedIn: true });
                chrome.storage.local.set({ user: resp.data.data });
                
            }
            else{
                alert('Login failed: ' + (resp ? resp.error : 'Unknown error'));
            }
        }
        catch(error){
            console.error('Error logging in:', error);
            alert('Error logging in: ' + error.message);
        }
    });

    passwordToggle.addEventListener('click', function() {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            passwordToggle.textContent = '🔒';
        } else {
            passwordInput.type = 'password';
            passwordToggle.textContent = '👁️';
        }
    });
});
