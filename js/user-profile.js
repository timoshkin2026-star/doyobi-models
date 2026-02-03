// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    setupTabs();
    loadBookings();
    loadSubscriptions();
    loadPremiumSubscriptions();
    loadFavorites();
    loadHistory();
    loadDonationStats();
    checkAuth();
});

// Проверка авторизации
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.isGuest) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Обновляем меню
    updateHeaderMenu(userData);
}

// Обновление меню в хедере
function updateHeaderMenu(userData) {
    const authButtons = document.getElementById('authButtons');
    
    // Показываем кнопку панели управления только для моделей
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn && userData.userType === 'model') {
        dashboardBtn.style.display = 'inline-block';
    }
    
    authButtons.style.visibility = 'visible';
    authButtons.innerHTML = `
        <div class="user-menu" onclick="toggleUserMenu()">
            <img src="${userData.avatar}" alt="Avatar" class="user-avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
            <span class="user-name" style="font-weight: 600; color: #2d3748; margin: 0 10px;">${userData.name}</span>
            <div class="dropdown-menu" id="dropdownMenu" style="position: absolute; top: 100%; right: 0; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 10px 0; min-width: 180px; display: none; z-index: 100;">
                <a href="user-profile.html" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Мой профиль</a>
                <a href="#" onclick="logout()" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Выйти</a>
            </div>
        </div>
    `;
    authButtons.style.position = 'relative';
}

// Переключение меню пользователя
function toggleUserMenu() {
    const dropdown = document.getElementById('dropdownMenu');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('dropdownMenu');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Выход
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    window.location.href = 'index.html';
}

// Загрузка данных пользователя
function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        console.log('No current user found');
        return;
    }
    
    const userData = JSON.parse(currentUser);
    console.log('User data:', userData);
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const fullUser = users.find(u => u.id === userData.id);
    
    if (!fullUser) {
        console.log('Full user not found');
        return;
    }
    
    console.log('Full user:', fullUser);
    
    // Обновляем аватар (используем аватар из userData или дефолтный)
    const avatarUrl = userData.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop';
    const avatarElement = document.getElementById('userAvatar');
    
    if (avatarElement) {
        avatarElement.src = avatarUrl;
        avatarElement.alt = userData.name;
        console.log('Avatar set to:', avatarUrl);
    } else {
        console.log('Avatar element not found');
    }
    
    // Обновляем имя
    const nameElement = document.getElementById('userName');
    if (nameElement) {
        nameElement.textContent = userData.name;
    }
    
    // Обновляем email
    const emailElement = document.getElementById('userEmail');
    if (emailElement) {
        emailElement.textContent = userData.email;
    }
    
    // Обновляем тип пользователя
    const userTypeBadge = document.getElementById('userTypeBadge');
    if (userTypeBadge) {
        const userTypes = {
            'client': 'Клиент',
            'model': 'Модель',
            'photographer': 'Фотограф'
        };
        userTypeBadge.textContent = userTypes[userData.userType] || 'Клиент';
    }
    
    // Обновляем дату регистрации
    if (fullUser.createdAt) {
        const createdDate = new Date(fullUser.createdAt);
        const memberElement = document.getElementById('memberSince');
        if (memberElement) {
            memberElement.textContent = createdDate.getFullYear();
        }
    } else {
        const memberElement = document.getElementById('memberSince');
        if (memberElement) {
            memberElement.textContent = new Date().getFullYear();
        }
    }
    
    // Загружаем настройки
    const firstNameInput = document.getElementById('settingsFirstName');
    const lastNameInput = document.getElementById('settingsLastName');
    const emailInput = document.getElementById('settingsEmail');
    const userTypeSelect = document.getElementById('settingsUserType');
    
    if (firstNameInput) firstNameInput.value = fullUser.firstName || '';
    if (lastNameInput) lastNameInput.value = fullUser.lastName || '';
    if (emailInput) emailInput.value = fullUser.email || '';
    if (userTypeSelect) userTypeSelect.value = fullUser.userType || 'client';
}

// Настройка табов
function setupTabs() {
    const tabs = document.querySelectorAll('.content-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

let currentBookingFilter = 'all';

// Загрузка бронирований
function loadBookings(filter = 'all') {
    currentBookingFilter = filter;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Фильтруем бронирования текущего пользователя
    bookings = bookings.filter(b => b.clientId === currentUser.id);
    
    // Применяем фильтр по статусу
    if (filter !== 'all') {
        bookings = bookings.filter(b => b.status === filter);
    }
    
    // Сортируем по дате (новые сверху)
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        bookingsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <h3>Нет бронирований</h3>
                <p>${filter === 'all' ? 'Забронируйте встречу с моделью, чтобы увидеть её здесь' : 'Нет бронирований с таким статусом'}</p>
                <a href="index.html" class="btn btn-primary">Найти модели</a>
            </div>
        `;
        return;
    }
    
    // Отображаем бронирования
    bookingsList.innerHTML = bookings.map(booking => {
        const dateObj = new Date(booking.date);
        const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
        
        const statusInfo = {
            'pending': { text: 'Ожидает подтверждения', color: '#f59e0b', icon: '⏳' },
            'confirmed': { text: 'Подтверждено', color: '#48bb78', icon: '✅' },
            'cancelled': { text: 'Отменено', color: '#e53e3e', icon: '❌' },
            'completed': { text: 'Завершено', color: '#718096', icon: '✓' }
        };
        
        const status = statusInfo[booking.status] || statusInfo['pending'];
        
        return `
            <div class="booking-item">
                <img src="${booking.modelImage}" alt="${booking.modelName}" class="booking-item-image">
                <div class="booking-item-info">
                    <h4>${booking.modelName}</h4>
                    <div class="booking-item-details">
                        <div class="booking-detail">
                            <span class="detail-icon">📅</span>
                            <span>${formattedDate}</span>
                        </div>
                        <div class="booking-detail">
                            <span class="detail-icon">🕐</span>
                            <span>${booking.time} (${booking.duration} ${booking.duration === 1 ? 'час' : booking.duration < 5 ? 'часа' : 'часов'})</span>
                        </div>
                        ${booking.comment ? `<div class="booking-detail"><span class="detail-icon">💬</span><span>${booking.comment}</span></div>` : ''}
                    </div>
                    <div class="booking-status" style="background: ${status.color}20; color: ${status.color}; padding: 6px 12px; border-radius: 20px; display: inline-flex; align-items: center; gap: 5px; font-size: 13px; font-weight: 600; margin-top: 10px;">
                        <span>${status.icon}</span>
                        <span>${status.text}</span>
                    </div>
                </div>
                <div class="booking-item-actions">
                    <span class="booking-item-price">${booking.price.toLocaleString()} ₽</span>
                    <a href="profile.html?id=${booking.modelId}" class="btn btn-primary btn-small">Открыть профиль</a>
                    ${booking.status === 'pending' ? `<button class="btn btn-outline btn-small" onclick="cancelBooking(${booking.id})" style="color: #e53e3e; border-color: #e53e3e;">Отменить</button>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

// Фильтрация бронирований
function filterBookings(filter) {
    // Обновляем активную кнопку
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    loadBookings(filter);
}

// Отмена бронирования
function cancelBooking(bookingId) {
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
        return;
    }
    
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = 'cancelled';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        showNotification('Бронирование отменено ❌', 'success');
        loadBookings(currentBookingFilter);
    }
}

// Загрузка подписок
function loadSubscriptions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    
    // Фильтруем только подписки текущего пользователя
    subscriptions = subscriptions.filter(sub => sub.userId === currentUser.id);
    
    const subscriptionsGrid = document.getElementById('subscriptionsGrid');
    
    if (subscriptions.length === 0) {
        subscriptionsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🔔</div>
                <h3>Нет подписок</h3>
                <p>Подпишитесь на модели, чтобы следить за их обновлениями</p>
                <a href="index.html" class="btn btn-primary">Найти модели</a>
            </div>
        `;
        return;
    }
    
    // Отображаем карточки подписок
    subscriptionsGrid.innerHTML = subscriptions.map(model => {
        const subscribedDate = new Date(model.subscribedAt);
        const daysAgo = Math.floor((new Date() - subscribedDate) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="subscription-card">
                <div class="subscription-card-image" style="position: relative;">
                    <img src="${model.image}" alt="${model.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 15px 15px 0 0;">
                    <div class="subscription-badge" style="position: absolute; top: 10px; right: 10px; background: #667eea; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        🔔 Подписка
                    </div>
                    <button class="unsubscribe-btn" onclick="unsubscribe(${model.id})" style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); border: none; padding: 8px 12px; border-radius: 20px; cursor: pointer; font-size: 12px; font-weight: 600; color: #e53e3e; transition: all 0.3s ease;">
                        Отписаться
                    </button>
                </div>
                <div class="subscription-card-content" style="padding: 20px;">
                    <h3 style="font-size: 20px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">${model.name}</h3>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px; color: #718096; font-size: 14px;">
                        <span>${model.category}</span>
                        <span>•</span>
                        <span>Подписка ${daysAgo === 0 ? 'сегодня' : daysAgo + ' дн. назад'}</span>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="profile.html?id=${model.id}" class="btn btn-primary" style="flex: 1; text-align: center; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; text-decoration: none; display: block;">
                            Открыть профиль
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Отписаться от модели
function unsubscribe(modelId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const model = subscriptions.find(sub => sub.id === modelId && sub.userId === currentUser.id);
    
    if (confirm(`Отписаться от ${model.name}?`)) {
        subscriptions = subscriptions.filter(sub => !(sub.id === modelId && sub.userId === currentUser.id));
        localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
        
        showNotification('Вы отписались 🔔', 'success');
        loadSubscriptions();
    }
}

// Загрузка Premium подписок
function loadPremiumSubscriptions() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let premiumSubscriptions = JSON.parse(localStorage.getItem('premiumSubscriptions') || '[]');
    
    // Фильтруем только Premium подписки текущего пользователя
    premiumSubscriptions = premiumSubscriptions.filter(sub => sub.userId === currentUser.id);
    
    const premiumGrid = document.getElementById('premiumGrid');
    
    if (premiumSubscriptions.length === 0) {
        premiumGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">👑</div>
                <h3>Нет Premium подписок</h3>
                <p>Приобретайте премиум-доступ для эксклюзивного контента</p>
                <a href="index.html" class="btn btn-primary">Найти модели</a>
            </div>
        `;
        return;
    }
    
    // Отображаем карточки Premium подписок
    premiumGrid.innerHTML = premiumSubscriptions.map(model => {
        const expiresAt = new Date(model.expiresAt);
        const now = new Date();
        const daysLeft = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
        const isExpired = expiresAt < now;
        
        const planNames = {
            'month': '1 месяц',
            '3months': '3 месяца',
            'year': '12 месяцев'
        };
        
        return `
            <div class="premium-subscription-card ${isExpired ? 'expired' : ''}">
                <div class="premium-card-image" style="position: relative;">
                    <img src="${model.image}" alt="${model.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 15px 15px 0 0;">
                    <div class="premium-badge" style="position: absolute; top: 10px; right: 10px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 8px 15px; border-radius: 20px; font-size: 13px; font-weight: 700; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);">
                        👑 Premium
                    </div>
                    ${isExpired ? '<div class="expired-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 18px;">Истекла</div>' : ''}
                </div>
                <div class="premium-card-content" style="padding: 20px;">
                    <h3 style="font-size: 20px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">${model.name}</h3>
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; color: #718096; font-size: 14px;">
                        <span>${model.category}</span>
                        <span>•</span>
                        <span>${planNames[model.planType]}</span>
                    </div>
                    <div style="background: ${isExpired ? '#fee2e2' : '#fef3c7'}; padding: 12px; border-radius: 10px; margin-bottom: 15px;">
                        <div style="font-size: 13px; color: ${isExpired ? '#991b1b' : '#92400e'}; font-weight: 600;">
                            ${isExpired ? '❌ Подписка истекла' : daysLeft <= 7 ? '⚠️ Осталось ' + daysLeft + ' дн.' : '✓ Активна до ' + expiresAt.toLocaleDateString('ru-RU')}
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <a href="profile.html?id=${model.id}" class="btn ${isExpired ? 'btn-outline' : 'btn-gradient'}" style="flex: 1; text-align: center; padding: 12px; border-radius: 10px; font-weight: 600; text-decoration: none; display: block;">
                            ${isExpired ? 'Продлить' : 'Открыть профиль'}
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Загрузка избранного
function loadFavorites() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let allFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Если favorites - массив чисел (старый формат), конвертируем
    if (allFavorites.length > 0 && typeof allFavorites[0] === 'number') {
        // Мигрируем старый формат к новому
        const newFavorites = allFavorites.map(id => ({
            userId: currentUser.id,
            modelId: id,
            addedAt: new Date().toISOString()
        }));
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        allFavorites = newFavorites;
    }
    
    // Фильтруем избранное текущего пользователя
    const userFavorites = allFavorites
        .filter(fav => fav.userId === currentUser.id)
        .map(fav => fav.modelId);
    
    const favoritesGrid = document.getElementById('favoritesGrid');
    
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h3>Нет избранных моделей</h3>
                <p>Добавляйте модели в избранное, чтобы быстро находить их</p>
                <a href="index.html" class="btn btn-primary">Найти модели</a>
            </div>
        `;
        return;
    }
    
    // Данные моделей (копия из app.js)
    const modelsData = [
        {
            id: 1,
            name: "Анастасия",
            age: 24,
            category: "Fashion",
            price: 8000,
            district: "center",
            rating: 4.9,
            reviews: 127,
            shoots: 89,
            status: "online",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop"
        },
        {
            id: 2,
            name: "Виктория",
            age: 22,
            category: "Photo",
            price: 6000,
            district: "north",
            rating: 4.8,
            reviews: 95,
            shoots: 67,
            status: "online",
            image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop"
        },
        {
            id: 3,
            name: "Елена",
            age: 26,
            category: "Runway",
            price: 12000,
            district: "center",
            rating: 5.0,
            reviews: 203,
            shoots: 156,
            status: "offline",
            image: "https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=600&fit=crop"
        },
        {
            id: 4,
            name: "Мария",
            age: 20,
            category: "Commercial",
            price: 5000,
            district: "south",
            rating: 4.7,
            reviews: 78,
            shoots: 45,
            status: "online",
            image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
        },
        {
            id: 5,
            name: "Дарья",
            age: 28,
            category: "Fitness",
            price: 7000,
            district: "west",
            rating: 4.9,
            reviews: 142,
            shoots: 98,
            status: "online",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop"
        },
        {
            id: 6,
            name: "Алиса",
            age: 23,
            category: "Fashion",
            price: 9000,
            district: "east",
            rating: 4.8,
            reviews: 156,
            shoots: 112,
            status: "offline",
            image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop"
        },
        {
            id: 7,
            name: "София",
            age: 25,
            category: "Photo",
            price: 6500,
            district: "center",
            rating: 4.9,
            reviews: 189,
            shoots: 134,
            status: "online",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop"
        },
        {
            id: 8,
            name: "Кристина",
            age: 21,
            category: "Commercial",
            price: 4500,
            district: "north",
            rating: 4.6,
            reviews: 64,
            shoots: 38,
            status: "offline",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop"
        }
    ];
    
    // Фильтруем модели по избранным ID
    const favoriteModels = modelsData.filter(model => userFavorites.includes(model.id));
    
    if (favoriteModels.length === 0) {
        favoritesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <h3>Нет избранных моделей</h3>
                <p>Добавляйте модели в избранное, чтобы быстро находить их</p>
                <a href="index.html" class="btn btn-primary">Найти модели</a>
            </div>
        `;
        return;
    }
    
    // Отображаем карточки избранных моделей
    favoritesGrid.innerHTML = favoriteModels.map(model => `
        <div class="favorite-card">
            <div class="favorite-card-image" style="position: relative;">
                <img src="${model.image}" alt="${model.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 15px 15px 0 0;">
                ${model.status === 'online' ? '<div class="online-badge" style="position: absolute; top: 10px; right: 10px; background: #48bb78; color: white; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">● Онлайн</div>' : ''}
                <button class="remove-favorite-btn" onclick="removeFavorite(${model.id})" style="position: absolute; top: 10px; left: 10px; background: rgba(255,255,255,0.9); border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; font-size: 18px; color: #e53e3e; transition: all 0.3s ease;">
                    ♥
                </button>
            </div>
            <div class="favorite-card-content" style="padding: 20px;">
                <h3 style="font-size: 20px; font-weight: 700; color: #2d3748; margin-bottom: 8px;">${model.name}</h3>
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 12px; color: #718096; font-size: 14px;">
                    <span>${model.age} лет</span>
                    <span>•</span>
                    <span>${model.category}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 15px;">
                    <span style="color: #f59e0b; font-size: 16px;">★</span>
                    <span style="font-weight: 600; color: #2d3748;">${model.rating}</span>
                    <span style="color: #a0aec0; font-size: 14px;">(${model.reviews} отзывов)</span>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <span style="font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${model.price.toLocaleString()} ₽</span>
                    <span style="color: #718096; font-size: 14px;">${model.shoots} съемок</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <a href="profile.html?id=${model.id}" class="btn btn-primary" style="flex: 1; text-align: center; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; text-decoration: none; display: block;">
                        Открыть профиль
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

// Удаление из избранного
function removeFavorite(modelId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let allFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    allFavorites = allFavorites.filter(fav => !(fav.userId === currentUser.id && fav.modelId === modelId));
    localStorage.setItem('favorites', JSON.stringify(allFavorites));
    
    showNotification('Удалено из избранного ❤️', 'success');
    loadFavorites();
}

// Загрузка истории просмотров
function loadHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    
    // Фильтруем только историю текущего пользователя
    history = history.filter(item => item.userId === currentUser.id);
    
    const historyList = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📜</div>
                <h3>История пуста</h3>
                <p>Здесь будут отображаться модели, которых вы просматривали</p>
                <a href="index.html" class="btn btn-primary">Найти модели</a>
            </div>
        `;
        return;
    }
    
    // Отображаем историю в виде списка
    historyList.innerHTML = history.map(model => {
        const viewedDate = new Date(model.viewedAt);
        const now = new Date();
        const diffMs = now - viewedDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        let timeAgo;
        if (diffMins < 1) {
            timeAgo = 'только что';
        } else if (diffMins < 60) {
            timeAgo = `${diffMins} мин. назад`;
        } else if (diffHours < 24) {
            timeAgo = `${diffHours} ч. назад`;
        } else if (diffDays === 1) {
            timeAgo = 'вчера';
        } else {
            timeAgo = `${diffDays} дн. назад`;
        }
        
        return `
            <div class="history-item">
                <img src="${model.image}" alt="${model.name}" class="history-item-image">
                <div class="history-item-info">
                    <h4>${model.name}</h4>
                    <div class="history-item-meta">
                        <span>${model.age} лет</span>
                        <span>•</span>
                        <span>${model.category}</span>
                        <span>•</span>
                        <span>★ ${model.rating}</span>
                    </div>
                    <div class="history-item-time">${timeAgo}</div>
                </div>
                <div class="history-item-actions">
                    <span class="history-item-price">${model.price.toLocaleString()} ₽</span>
                    <a href="profile.html?id=${model.id}" class="btn btn-primary btn-small">Открыть</a>
                    <button class="btn btn-outline btn-small" onclick="removeFromHistory(${model.id})">✕</button>
                </div>
            </div>
        `;
    }).join('');
}

// Удаление из истории
function removeFromHistory(modelId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    history = history.filter(item => !(item.id === modelId && item.userId === currentUser.id));
    localStorage.setItem('viewHistory', JSON.stringify(history));
    
    showNotification('Удалено из истории 📜', 'success');
    loadHistory();
}

// Очистка всей истории
function clearHistory() {
    if (confirm('Вы уверены, что хотите очистить всю историю просмотров?')) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        let history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
        // Удаляем только историю текущего пользователя
        history = history.filter(item => item.userId !== currentUser.id);
        localStorage.setItem('viewHistory', JSON.stringify(history));
        
        showNotification('История очищена 🗑️', 'success');
        loadHistory();
    }
}

// Загрузка статистики донатов
function loadDonationStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Получаем историю донатов текущего пользователя
    let donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    donationHistory = donationHistory.filter(item => item.userId === currentUser.id);
    
    // Считаем статистику из истории
    let totalDonates = 0;
    let totalGifts = 0;
    let totalMessages = 0;
    let donatesCount = 0;
    let giftsCount = 0;
    let messagesCount = 0;
    
    donationHistory.forEach(item => {
        if (item.type === 'donate') {
            totalDonates += item.amount;
            donatesCount++;
        } else if (item.type === 'gift') {
            totalGifts += item.amount;
            giftsCount++;
        } else if (item.type === 'message') {
            totalMessages += item.amount;
            messagesCount++;
        }
    });
    
    const totalCount = donatesCount + giftsCount + messagesCount;
    const totalSpent = totalDonates + totalGifts + totalMessages;
    
    // Обновляем статистику в шапке
    document.getElementById('donatesCount').textContent = totalCount;
    document.getElementById('giftsCount').textContent = giftsCount;
    document.getElementById('totalSpent').textContent = totalSpent.toLocaleString() + ' ₽';
    
    // Обновляем детальную статистику
    document.getElementById('totalDonates').textContent = totalDonates.toLocaleString() + ' ₽';
    document.getElementById('totalGifts').textContent = totalGifts.toLocaleString() + ' ₽';
    document.getElementById('totalMessages').textContent = totalMessages.toLocaleString() + ' ₽';
    
    // Загружаем историю транзакций
    loadDonationHistory();
}

// Загрузка истории донатов и подарков
function loadDonationHistory() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    let donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    
    // Фильтруем только транзакции текущего пользователя
    donationHistory = donationHistory.filter(item => item.userId === currentUser.id);
    
    const donationsList = document.getElementById('donationsList');
    
    if (donationHistory.length === 0) {
        donationsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💎</div>
                <h3>Нет транзакций</h3>
                <p>Здесь будет отображаться история ваших донатов и подарков</p>
            </div>
        `;
        return;
    }
    
    // Сортируем по дате (новые сверху)
    donationHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Отображаем историю
    donationsList.innerHTML = donationHistory.map(item => {
        const date = new Date(item.date);
        const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        
        const typeInfo = {
            'donate': { icon: '💰', text: 'Донат', color: '#667eea' },
            'gift': { icon: '🎁', text: 'Подарок', color: '#f59e0b' },
            'message': { icon: '✉️', text: 'Платное сообщение', color: '#764ba2' }
        };
        
        const type = typeInfo[item.type] || typeInfo['donate'];
        
        return `
            <div class="donation-item">
                <div class="donation-icon" style="background: ${type.color}20; color: ${type.color};">
                    ${type.icon}
                </div>
                <div class="donation-info">
                    <div class="donation-header">
                        <h4>${item.modelName}</h4>
                        <span class="donation-amount">${item.amount.toLocaleString()} ₽</span>
                    </div>
                    <div class="donation-details">
                        <span class="donation-type" style="color: ${type.color};">${type.text}</span>
                        ${item.giftName ? `<span>• ${item.giftName}</span>` : ''}
                        ${item.message ? `<span>• "${item.message}"</span>` : ''}
                    </div>
                    <div class="donation-date">${formattedDate} в ${formattedTime}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Редактирование профиля
function editProfile() {
    // Переключаемся на вкладку настроек
    document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    
    document.querySelector('[data-tab="settings"]').classList.add('active');
    document.getElementById('settings').classList.add('active');
}

// Сохранение настроек
function saveSettings() {
    const firstName = document.getElementById('settingsFirstName').value.trim();
    const lastName = document.getElementById('settingsLastName').value.trim();
    
    if (!firstName || !lastName) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return;
    
    // Обновляем данные пользователя
    users[userIndex].firstName = firstName;
    users[userIndex].lastName = lastName;
    
    localStorage.setItem('users', JSON.stringify(users));
    
    // Обновляем текущего пользователя
    currentUser.name = firstName + ' ' + lastName;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Обновляем отображение
    document.getElementById('userName').textContent = currentUser.name;
    
    showNotification('Настройки сохранены! ✅', 'success');
}

// Изменение пароля
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        showNotification('Заполните все поля', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showNotification('Новые пароли не совпадают', 'error');
        return;
    }
    
    if (newPassword.length < 8) {
        showNotification('Пароль должен содержать минимум 8 символов', 'error');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) return;
    
    if (user.password !== currentPassword) {
        showNotification('Неверный текущий пароль', 'error');
        return;
    }
    
    // Обновляем пароль
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Очищаем поля
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmNewPassword').value = '';
    
    showNotification('Пароль успешно изменен! 🔒', 'success');
}

// Изменение аватара
let tempAvatarDataUrl = null;

function changeAvatar() {
    document.getElementById('avatarInput').click();
}

// Обработка загрузки аватара
function handleAvatarUpload(event) {
    const file = event.target.files[0];
    
    if (!file) {
        return;
    }
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    // Проверка размера файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('Размер файла не должен превышать 5MB', 'error');
        return;
    }
    
    // Читаем файл как Data URL
    const reader = new FileReader();
    
    reader.onload = function(e) {
        tempAvatarDataUrl = e.target.result;
        
        // Показываем предпросмотр
        const previewImg = document.getElementById('avatarPreview');
        if (previewImg) {
            previewImg.src = tempAvatarDataUrl;
        }
        
        // Открываем модальное окно
        const modal = document.getElementById('avatarPreviewModal');
        if (modal) {
            modal.style.display = 'flex';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.background = 'rgba(0,0,0,0.8)';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '10000';
            document.body.style.overflow = 'hidden';
        }
    };
    
    reader.onerror = function() {
        showNotification('Ошибка при загрузке файла', 'error');
    };
    
    reader.readAsDataURL(file);
}

// Закрытие предпросмотра аватара
function closeAvatarPreview() {
    const modal = document.getElementById('avatarPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    tempAvatarDataUrl = null;
    
    // Очищаем input
    const input = document.getElementById('avatarInput');
    if (input) {
        input.value = '';
    }
}

// Подтверждение загрузки аватара
function confirmAvatarUpload() {
    if (!tempAvatarDataUrl) {
        return;
    }
    
    // Обновляем аватар на странице
    const avatarElement = document.getElementById('userAvatar');
    if (avatarElement) {
        avatarElement.src = tempAvatarDataUrl;
    }
    
    // Сохраняем в localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Обновляем аватар в массиве пользователей
        users[userIndex].avatar = tempAvatarDataUrl;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Обновляем текущего пользователя
        currentUser.avatar = tempAvatarDataUrl;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        showNotification('Аватар успешно обновлен! 📷', 'success');
    }
    
    // Закрываем модальное окно
    closeAvatarPreview();
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


// ========== ГАЛЕРЕЯ ПОСТОВ (Instagram style) ==========

// Загрузка постов пользователя
function loadUserPosts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let posts = JSON.parse(localStorage.getItem('userPosts_' + currentUser.id) || '[]');
    
    // Если постов нет, создаем тестовые посты
    if (posts.length === 0 && currentUser.userType === 'model') {
        posts = [
            {
                id: Date.now() + 1,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
                description: 'Новая фотосессия для модного журнала 📸✨',
                isPremium: false,
                likes: 234,
                comments: [],
                createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
                id: Date.now() + 2,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
                description: 'Behind the scenes 🎬',
                isPremium: false,
                likes: 189,
                comments: [],
                createdAt: new Date(Date.now() - 7200000).toISOString()
            },
            {
                id: Date.now() + 3,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
                description: 'Эксклюзивный контент для подписчиков 👑',
                isPremium: true,
                likes: 456,
                comments: [],
                createdAt: new Date(Date.now() - 10800000).toISOString()
            },
            {
                id: Date.now() + 4,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
                description: 'Летняя коллекция 2024 ☀️',
                isPremium: false,
                likes: 312,
                comments: [],
                createdAt: new Date(Date.now() - 14400000).toISOString()
            },
            {
                id: Date.now() + 5,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
                description: 'Вечерний образ 💫',
                isPremium: false,
                likes: 278,
                comments: [],
                createdAt: new Date(Date.now() - 18000000).toISOString()
            },
            {
                id: Date.now() + 6,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
                description: 'Premium фотосет 🔥',
                isPremium: true,
                likes: 523,
                comments: [],
                createdAt: new Date(Date.now() - 21600000).toISOString()
            },
            {
                id: Date.now() + 7,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
                description: 'Casual style 👗',
                isPremium: false,
                likes: 198,
                comments: [],
                createdAt: new Date(Date.now() - 25200000).toISOString()
            },
            {
                id: Date.now() + 8,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop',
                description: 'Природа и красота 🌿',
                isPremium: false,
                likes: 445,
                comments: [],
                createdAt: new Date(Date.now() - 28800000).toISOString()
            },
            {
                id: Date.now() + 9,
                userId: currentUser.id,
                type: 'image',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
                description: 'Студийная съемка 📷',
                isPremium: false,
                likes: 367,
                comments: [],
                createdAt: new Date(Date.now() - 32400000).toISOString()
            }
        ];
        localStorage.setItem('userPosts_' + currentUser.id, JSON.stringify(posts));
    }
    
    const postsGrid = document.getElementById('postsGrid');
    const videosGrid = document.getElementById('videosGrid');
    
    if (posts.length === 0) {
        postsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📷</div>
                <h3>Нет постов</h3>
                <p>Загрузите свои фото и видео, чтобы они отображались здесь</p>
                <button class="btn btn-primary" onclick="uploadPost()">Загрузить пост</button>
            </div>
        `;
        videosGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎥</div>
                <h3>Нет видео</h3>
                <p>Загрузите видео, чтобы они отображались здесь</p>
                <button class="btn btn-primary" onclick="uploadVideo()">Загрузить видео</button>
            </div>
        `;
        return;
    }
    
    // Разделяем на фото и видео
    const photos = posts.filter(p => p.type === 'image');
    const videos = posts.filter(p => p.type === 'video');
    
    // Отображаем фото
    if (photos.length > 0) {
        postsGrid.innerHTML = photos.map(post => `
            <div class="post-item" onclick="openPost(${post.id})">
                <img src="${post.url}" alt="Post">
                ${post.isPremium ? '<div class="premium-indicator">👑 Premium</div>' : ''}
                <div class="post-overlay">
                    <div class="post-stat">
                        <span class="post-stat-icon">❤️</span>
                        <span>${post.likes || 0}</span>
                    </div>
                    <div class="post-stat">
                        <span class="post-stat-icon">💬</span>
                        <span>${post.comments ? post.comments.length : 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        postsGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📷</div>
                <h3>Нет фото</h3>
                <p>Загрузите фото, чтобы они отображались здесь</p>
                <button class="btn btn-primary" onclick="uploadPost()">Загрузить фото</button>
            </div>
        `;
    }
    
    // Отображаем видео
    if (videos.length > 0) {
        videosGrid.innerHTML = videos.map(post => `
            <div class="video-item" onclick="openPost(${post.id})">
                <video src="${post.url}"></video>
                <div class="video-indicator">🎥 ${post.duration || '0:00'}</div>
                ${post.isPremium ? '<div class="premium-indicator">👑 Premium</div>' : ''}
                <div class="post-overlay">
                    <div class="post-stat">
                        <span class="post-stat-icon">❤️</span>
                        <span>${post.likes || 0}</span>
                    </div>
                    <div class="post-stat">
                        <span class="post-stat-icon">💬</span>
                        <span>${post.comments ? post.comments.length : 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        videosGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎥</div>
                <h3>Нет видео</h3>
                <p>Загрузите видео, чтобы они отображались здесь</p>
                <button class="btn btn-primary" onclick="uploadVideo()">Загрузить видео</button>
            </div>
        `;
    }
    
    // Обновляем счетчик постов
    document.getElementById('postsCount').textContent = posts.length;
    
    // Обновляем счетчик лайков
    const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    document.getElementById('likesCount').textContent = totalLikes;
}

// Открытие модального окна загрузки поста
function uploadPost() {
    document.getElementById('uploadPostModal').style.display = 'flex';
}

function uploadVideo() {
    uploadPost();
}

function closeUploadPostModal() {
    document.getElementById('uploadPostModal').style.display = 'none';
    document.getElementById('postFileInput').value = '';
    document.getElementById('postDescription').value = '';
    document.getElementById('postIsPremium').checked = false;
}

// Публикация поста
function publishPost() {
    const fileInput = document.getElementById('postFileInput');
    const description = document.getElementById('postDescription').value;
    const isPremium = document.getElementById('postIsPremium').checked;
    
    if (!fileInput.files || fileInput.files.length === 0) {
        alert('Выберите файл для загрузки');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('userPosts_' + currentUser.id) || '[]');
    
    // Обрабатываем каждый файл
    Array.from(fileInput.files).forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const post = {
                id: Date.now() + index,
                userId: currentUser.id,
                type: file.type.startsWith('video/') ? 'video' : 'image',
                url: e.target.result,
                description: description,
                isPremium: isPremium,
                likes: 0,
                comments: [],
                createdAt: new Date().toISOString()
            };
            
            posts.push(post);
            localStorage.setItem('userPosts_' + currentUser.id, JSON.stringify(posts));
            
            // Если это последний файл, обновляем галерею
            if (index === fileInput.files.length - 1) {
                loadUserPosts();
                closeUploadPostModal();
                showNotification('Пост опубликован!');
            }
        };
        
        reader.readAsDataURL(file);
    });
}

// Открытие поста в модальном окне
function openPost(postId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('userPosts_' + currentUser.id) || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'post-modal active';
    modal.innerHTML = `
        <div class="post-modal-content">
            <div class="post-modal-image">
                ${post.type === 'video' 
                    ? `<video src="${post.url}" controls autoplay></video>`
                    : `<img src="${post.url}" alt="Post">`
                }
            </div>
            <div class="post-modal-sidebar">
                <div class="post-modal-header">
                    <img src="${currentUser.avatar}" alt="Avatar" class="post-modal-avatar">
                    <div class="post-modal-user">
                        <div class="post-modal-username">${currentUser.name}</div>
                        <div class="post-modal-time">${formatDate(post.createdAt)}</div>
                    </div>
                    <button class="btn btn-outline btn-small" onclick="deletePost(${post.id})">🗑️</button>
                </div>
                <div class="post-modal-body">
                    <div class="post-modal-description">${post.description || ''}</div>
                    <div class="post-modal-comments" id="postComments">
                        ${post.comments && post.comments.length > 0 
                            ? post.comments.map(comment => `
                                <div class="post-comment">
                                    <img src="${comment.avatar}" alt="Avatar" class="comment-avatar">
                                    <div class="comment-content">
                                        <div class="comment-username">${comment.username}</div>
                                        <div class="comment-text">${comment.text}</div>
                                        <div class="comment-time">${formatDate(comment.createdAt)}</div>
                                    </div>
                                </div>
                            `).join('')
                            : '<p style="color: #a0aec0; text-align: center;">Нет комментариев</p>'
                        }
                    </div>
                </div>
                <div class="post-modal-footer">
                    <div class="post-modal-actions">
                        <button class="post-action-btn" onclick="toggleLikePost(${post.id})">
                            ${post.liked ? '❤️' : '🤍'}
                        </button>
                        <button class="post-action-btn">💬</button>
                        <button class="post-action-btn">📤</button>
                    </div>
                    <div class="post-likes">${post.likes || 0} лайков</div>
                </div>
            </div>
        </div>
        <button class="modal-close" onclick="closePostModal(this)">✕</button>
    `;
    
    document.body.appendChild(modal);
}

// Закрытие модального окна поста
function closePostModal(btn) {
    const modal = btn.closest('.post-modal');
    modal.remove();
}

// Удаление поста
function deletePost(postId) {
    if (!confirm('Удалить этот пост?')) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let posts = JSON.parse(localStorage.getItem('userPosts_' + currentUser.id) || '[]');
    
    posts = posts.filter(p => p.id !== postId);
    localStorage.setItem('userPosts_' + currentUser.id, JSON.stringify(posts));
    
    loadUserPosts();
    
    // Закрываем модальное окно
    const modal = document.querySelector('.post-modal');
    if (modal) modal.remove();
    
    showNotification('Пост удален');
}

// Лайк поста
function toggleLikePost(postId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const posts = JSON.parse(localStorage.getItem('userPosts_' + currentUser.id) || '[]');
    const post = posts.find(p => p.id === postId);
    
    if (!post) return;
    
    post.liked = !post.liked;
    post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
    
    localStorage.setItem('userPosts_' + currentUser.id, JSON.stringify(posts));
    
    // Обновляем UI
    const likeBtn = event.target;
    likeBtn.textContent = post.liked ? '❤️' : '🤍';
    
    const likesText = likeBtn.closest('.post-modal-footer').querySelector('.post-likes');
    likesText.textContent = `${post.likes} лайков`;
}

// Форматирование даты
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    
    return date.toLocaleDateString('ru-RU');
}

// Уведомления
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10001;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация галереи при загрузке
document.addEventListener('DOMContentLoaded', function() {
    loadUserPosts();
});
