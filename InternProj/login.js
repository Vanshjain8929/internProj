// Password toggle functionality
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleIcon.textContent = '👁️';
    }
}

// Show/hide messages
function showMessage(type, message) {
    const errorMsg = document.getElementById('errorMessage');
    const successMsg = document.getElementById('successMessage');

    // Hide both messages first
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    if (type === 'error') {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
    } else if (type === 'success') {
        successMsg.textContent = message;
        successMsg.style.display = 'block';
    }
}

// Show loading state
function showLoading(show) {
    const btn = document.getElementById('loginBtn');
    const btnText = document.getElementById('btnText');
    const spinner = document.getElementById('loadingSpinner');

    if (show) {
        btn.disabled = true;
        btnText.style.opacity = '0';
        spinner.style.display = 'block';
    } else {
        btn.disabled = false;
        btnText.style.opacity = '1';
        spinner.style.display = 'none';
    }
}

// Forgot password functionality
function showForgotPassword() {
    alert('Forgot Password functionality would redirect to password reset page.\n\nFor demo purposes, please contact your system administrator.');
}

// Form validation
function validateForm(username, password) {
    if (!username.trim()) {
        showMessage('error', 'Please enter your username or email.');
        return false;
    }

    if (!password.trim()) {
        showMessage('error', 'Please enter your password.');
        return false;
    }

    if (password.length < 6) {
        showMessage('error', 'Password must be at least 6 characters long.');
        return false;
    }

    return true;
}

// Handle form submission
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Clear previous messages
    showMessage('', '');

    // Validate form
    if (!validateForm(username, password)) {
        return;
    }

    // Show loading state
    showLoading(true);

    // Simulate API call
    setTimeout(() => {
        showLoading(false);

        // Demo credentials (in real application, this would be handled by backend)
        if (username === 'admin' && password === 'password123') {
            showMessage('success', 'Login successful! Redirecting...');

            if (rememberMe) {
                localStorage.setItem('rememberedUser', username);
            }

            setTimeout(() => {
                const params = new URLSearchParams(window.location.search);
                const redirectPage = params.get("redirect") || "index.html";
                window.location.href = redirectPage;
                            }, 2000);
        } else {
            showMessage('error', 'Invalid username or password. Please try again.');
        }
    }, 1500); // <- You were missing this closing
});


// Check for remembered user on page load
window.addEventListener('load', function () {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
        document.getElementById('username').value = rememberedUser;
        document.getElementById('rememberMe').checked = true;
    }
});

// Add input animation effects
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', function () {
        this.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function () {
        this.parentElement.style.transform = 'translateY(0)';
    });
});