// Проверка URL параметров при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const register = urlParams.get('register');
    
    if (register === 'true') {
        switchToRegister();
    }
    
    // Проверка силы пароля
    const registerPassword = document.getElementById('registerPassword');
    if (registerPassword) {
        registerPassword.addEventListener('input', checkPasswordStrength);
    }
});

// Переключение на форму регистрации
function switchToRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

// Переключение на форму входа
function switchToLogin() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

// Обработка входа
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Проверяем существующих пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Успешный вход
        const userData = {
            id: user.id,
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            avatar: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
            userType: user.userType,
            isLoggedIn: true,
            isGuest: false
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        if (rememberMe) {
            localStorage.setItem('rememberUser', JSON.stringify(userData));
        }
        
        showNotification('Добро пожаловать, ' + userData.name + '! 🎉', 'success');
        
        // Перенаправление через 1 секунду
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

// Обработка регистрации
function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Валидация
    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('Пароль должен содержать минимум 8 символов', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showNotification('Необходимо согласиться с условиями использования', 'error');
        return;
    }
    
    // Проверяем, не существует ли уже пользователь с таким email
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }
    
    // Создаем нового пользователя
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        name: firstName + ' ' + lastName,
        email,
        password,
        userType,
        type: userType,
        avatar: userType === 'model' 
            ? `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&size=400&background=667eea&color=fff`
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&size=400&background=667eea&color=fff`,
        createdAt: new Date().toISOString(),
        // Дополнительные поля для моделей
        bio: userType === 'model' ? `Профессиональная модель 📸 | ${firstName} | Москва 🏙️` : '',
        verified: false,
        premium: false,
        followers: 0,
        following: 0,
        posts: 0,
        likes: 0,
        rating: userType === 'model' ? (Math.random() * 0.5 + 4.5).toFixed(1) : 0,
        price: userType === 'model' ? (Math.floor(Math.random() * 5) + 5) * 1000 : 0,
        category: userType === 'model' ? ['Fashion', 'Commercial', 'Fitness', 'Runway'][Math.floor(Math.random() * 4)] : '',
        age: 25,
        height: userType === 'model' ? Math.floor(Math.random() * 15) + 165 : 170,
        city: 'Москва',
        isOnline: true
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Автоматический вход после регистрации
    const userData = {
        id: newUser.id,
        name: firstName + ' ' + lastName,
        email: email,
        avatar: newUser.avatar,
        userType: userType,
        isLoggedIn: true,
        isGuest: false
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    
    showNotification('Регистрация успешна! Добро пожаловать! 🎉', 'success');
    
    // Перенаправление через 1 секунду
    setTimeout(() => {
        window.location.href = 'user-profile.html';
    }, 1000);
}

// Проверка силы пароля
function checkPasswordStrength() {
    const password = document.getElementById('registerPassword').value;
    const strengthBar = document.getElementById('passwordStrength');
    
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    strengthBar.className = 'password-strength';
    
    if (strength === 0 || strength === 1) {
        strengthBar.classList.add('weak');
    } else if (strength === 2 || strength === 3) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}

// Вход через Google
function loginWithGoogle() {
    showNotification('Вход через Google в разработке', 'info');
}

// Вход через VK
function loginWithVK() {
    showNotification('Вход через VK в разработке', 'info');
}

// Показ уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    
    const colors = {
        success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
        error: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
        info: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
