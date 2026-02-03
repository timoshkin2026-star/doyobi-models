// Загрузка моделей из базы данных
function loadModelsFromDatabase() {
    // Проверяем что функция getAllModels доступна
    if (typeof getAllModels !== 'function') {
        console.error('getAllModels не определена! database.js не загружен?');
        return [];
    }
    
    const models = getAllModels();
    console.log('Загружено моделей из базы:', models.length);
    console.log('Модели:', models);
    
    return models.map(user => ({
        id: user.id,
        name: user.name || 'Без имени',
        age: user.age || 25,
        category: user.category || 'Fashion',
        price: user.price || 5000,
        district: 'center',
        rating: user.rating || 0,
        reviews: Math.floor((user.followers || 0) / 20),
        shoots: user.posts || 0,
        status: user.isOnline ? 'online' : 'offline',
        image: user.avatar || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop'
    }));
}

// Перезагрузка моделей (вызывается после регистрации)
function reloadModels() {
    modelsData = loadModelsFromDatabase();
    filteredModels = [...modelsData];
    console.log('Перезагружено моделей:', modelsData.length);
    renderModels();
    updateResultsCount();
}

// Данные моделей (старый код - заменяем на загрузку из базы)
let modelsData = loadModelsFromDatabase();
console.log('modelsData после загрузки:', modelsData.length);
console.log('modelsData:', modelsData);

// Если база пуста, используем старые данные
if (modelsData.length === 0) {
    modelsData = [
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
        reviews: 67,
        shoots: 34,
        status: "online",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop"
    }
    ];
}

let filteredModels = [...modelsData];
let currentPage = 1;
const modelsPerPage = 8;
let favorites = [];
let notificationQueue = [];

// Загрузка избранного текущего пользователя
function loadUserFavorites() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        favorites = [];
        return;
    }
    
    const userData = JSON.parse(currentUser);
    const allFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Если favorites - массив чисел (старый формат), конвертируем
    if (allFavorites.length > 0 && typeof allFavorites[0] === 'number') {
        // Мигрируем старый формат к новому
        const newFavorites = allFavorites.map(id => ({
            userId: userData.id,
            modelId: id
        }));
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        favorites = allFavorites;
    } else {
        // Фильтруем избранное текущего пользователя
        favorites = allFavorites
            .filter(fav => fav.userId === userData.id)
            .map(fav => fav.modelId);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, начинаем инициализацию');
    
    // Перезагружаем модели при каждой загрузке страницы
    reloadModels();
    loadUserFavorites();
    setupEventListeners();
    checkOnlineModels();
    
    console.log('Инициализация завершена');
    
    // Проверяем онлайн статус каждые 30 секунд
    setInterval(checkOnlineModels, 30000);
});

// Отрисовка моделей
function renderModels() {
    const grid = document.getElementById('modelsGrid');
    const startIndex = (currentPage - 1) * modelsPerPage;
    const endIndex = startIndex + modelsPerPage;
    const modelsToShow = filteredModels.slice(startIndex, endIndex);

    grid.innerHTML = modelsToShow.map((model, index) => {
        // Определяем бейджи
        const isNew = index < 2; // Первые 2 модели - новинки
        const isTop = model.rating >= 4.9; // Топ модели с рейтингом 4.9+
        const isVerified = model.rating >= 4.8; // Верифицированные с рейтингом 4.8+
        const views = Math.floor(Math.random() * 5000) + 1000; // Случайное количество просмотров
        const isFavorite = favorites.includes(model.id);
        
        return `
        <div class="model-card" onclick="openModelProfile(${model.id})">
            <div class="model-image">
                <img src="${model.image}" alt="${model.name}">
                <div class="model-badges">
                    ${isNew ? '<span class="badge-new">🔥 Новинка</span>' : ''}
                    ${isTop ? '<span class="badge-top">⭐ Топ</span>' : ''}
                </div>
                <div class="model-status status-${model.status}">
                    ${model.status === 'online' ? 'Онлайн' : 'Оффлайн'}
                </div>
            </div>
            <div class="model-info">
                <div class="model-name">
                    ${model.name}
                    ${isVerified ? '<span style="color: #0095f6; font-size: 16px;">✓</span>' : ''}
                </div>
                <div class="model-age">${model.age} лет</div>
                <div class="model-category">${getCategoryName(model.category)}</div>
                
                <div class="model-views">${views.toLocaleString()} просмотров</div>
                
                <div class="model-stats">
                    <div class="stat">
                        <span class="stat-value">${model.rating}</span>
                        <span class="stat-label">Рейтинг</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${model.reviews}</span>
                        <span class="stat-label">Отзывы</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${model.shoots}</span>
                        <span class="stat-label">Съемки</span>
                    </div>
                </div>
                
                <div class="model-price">${(model.price || 0).toLocaleString()} ₽/час</div>
                
                <div class="model-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); contactModel(${model.id})">
                        Связаться
                    </button>
                    <button class="btn btn-outline btn-small favorite-btn ${isFavorite ? 'active' : ''}" 
                            onclick="event.stopPropagation(); toggleFavorite(${model.id})" 
                            data-tooltip="Добавить в избранное">
                        ${isFavorite ? '♥' : '♡'}
                    </button>
                    <button class="btn btn-outline btn-small" 
                            onclick="event.stopPropagation(); showQuickPreview(${model.id})" 
                            data-tooltip="Быстрый просмотр">
                        👁
                    </button>
                </div>
            </div>
        </div>
    `;
    }).join('');

    updateResultsCount();
}

// Получение названия категории
function getCategoryName(category) {
    const categories = {
        'fashion': 'Fashion',
        'photo': 'Фотомодель',
        'runway': 'Подиум',
        'commercial': 'Коммерческая',
        'fitness': 'Фитнес'
    };
    return categories[category] || category;
}

// Обновление счетчика результатов
function updateResultsCount() {
    document.getElementById('resultsCount').textContent = filteredModels.length;
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Применение фильтров
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    
    // Сброс фильтров
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // Сортировка
    document.getElementById('sortBy').addEventListener('change', sortModels);
    
    // Поиск в реальном времени
    const searchInput = document.querySelector('input[placeholder*="Поиск"]');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Слайдеры
    setupRangeSliders();
}

// Настройка слайдеров
function setupRangeSliders() {
    // Возраст
    const ageMin = document.getElementById('ageMin');
    const ageMax = document.getElementById('ageMax');
    const ageValue = document.getElementById('ageValue');
    
    ageMin.addEventListener('input', () => {
        if (parseInt(ageMin.value) > parseInt(ageMax.value)) {
            ageMin.value = ageMax.value;
        }
        ageValue.textContent = `${ageMin.value} - ${ageMax.value}`;
    });
    
    ageMax.addEventListener('input', () => {
        if (parseInt(ageMax.value) < parseInt(ageMin.value)) {
            ageMax.value = ageMin.value;
        }
        ageValue.textContent = `${ageMin.value} - ${ageMax.value}`;
    });
    
    // Рост
    const heightMin = document.getElementById('heightMin');
    const heightMax = document.getElementById('heightMax');
    const heightValue = document.getElementById('heightValue');
    
    heightMin.addEventListener('input', () => {
        if (parseInt(heightMin.value) > parseInt(heightMax.value)) {
            heightMin.value = heightMax.value;
        }
        heightValue.textContent = `${heightMin.value} - ${heightMax.value}`;
    });
    
    heightMax.addEventListener('input', () => {
        if (parseInt(heightMax.value) < parseInt(heightMin.value)) {
            heightMax.value = heightMin.value;
        }
        heightValue.textContent = `${heightMin.value} - ${heightMax.value}`;
    });
    
    // Грудь
    const breastMin = document.getElementById('breastMin');
    const breastMax = document.getElementById('breastMax');
    const breastValue = document.getElementById('breastValue');
    
    breastMin.addEventListener('input', () => {
        if (parseInt(breastMin.value) > parseInt(breastMax.value)) {
            breastMin.value = breastMax.value;
        }
        breastValue.textContent = `${breastMin.value} - ${breastMax.value}`;
    });
    
    breastMax.addEventListener('input', () => {
        if (parseInt(breastMax.value) < parseInt(breastMin.value)) {
            breastMax.value = breastMin.value;
        }
        breastValue.textContent = `${breastMin.value} - ${breastMax.value}`;
    });
    
    // Цена
    const priceMin = document.getElementById('priceMin');
    const priceMax = document.getElementById('priceMax');
    const priceValue = document.getElementById('priceValue');
    
    priceMin.addEventListener('input', () => {
        if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
            priceMin.value = priceMax.value;
        }
        priceValue.textContent = `${parseInt(priceMin.value).toLocaleString()} - ${parseInt(priceMax.value).toLocaleString()}`;
    });
    
    priceMax.addEventListener('input', () => {
        if (parseInt(priceMax.value) < parseInt(priceMin.value)) {
            priceMax.value = priceMin.value;
        }
        priceValue.textContent = `${parseInt(priceMin.value).toLocaleString()} - ${parseInt(priceMax.value).toLocaleString()}`;
    });
}

// Применение фильтров
function applyFilters() {
    const category = document.getElementById('category').value;
    const priceMin = parseInt(document.getElementById('priceMin').value) || 0;
    const priceMax = parseInt(document.getElementById('priceMax').value) || Infinity;
    const ageMin = parseInt(document.getElementById('ageMin').value) || 0;
    const ageMax = parseInt(document.getElementById('ageMax').value) || Infinity;
    const district = document.getElementById('district').value;

    filteredModels = modelsData.filter(model => {
        return (!category || model.category.toLowerCase() === category) &&
               (model.price >= priceMin && model.price <= priceMax) &&
               (model.age >= ageMin && model.age <= ageMax) &&
               (!district || model.district === district);
    });

    currentPage = 1;
    renderModels();
}

// Сброс фильтров
function clearFilters() {
    document.getElementById('category').value = '';
    document.getElementById('city').value = '';
    document.getElementById('district').value = '';
    document.getElementById('metro').value = '';
    
    document.getElementById('ageMin').value = 18;
    document.getElementById('ageMax').value = 80;
    document.getElementById('ageValue').textContent = '18 - 80';
    
    document.getElementById('heightMin').value = 140;
    document.getElementById('heightMax').value = 200;
    document.getElementById('heightValue').textContent = '140 - 200';
    
    document.getElementById('breastMin').value = 1;
    document.getElementById('breastMax').value = 12;
    document.getElementById('breastValue').textContent = '1 - 12';
    
    document.getElementById('priceMin').value = 1000;
    document.getElementById('priceMax').value = 20000;
    document.getElementById('priceValue').textContent = '1000 - 20000';
    
    filteredModels = [...modelsData];
    currentPage = 1;
    renderModels();
}

// Сортировка
function sortModels() {
    const sortBy = document.getElementById('sortBy').value;
    
    filteredModels.sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'price':
                return a.price - b.price;
            case 'age':
                return a.age - b.age;
            case 'new':
                return b.id - a.id;
            default:
                return 0;
        }
    });
    
    renderModels();
}

// Поиск
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const clearBtn = document.getElementById('clearSearch');
    
    // Показываем/скрываем кнопку очистки
    if (query.length > 0) {
        clearBtn.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
    }
    
    filteredModels = modelsData.filter(model => 
        model.name.toLowerCase().includes(query) ||
        getCategoryName(model.category).toLowerCase().includes(query)
    );
    
    currentPage = 1;
    renderModels();
}

// Очистка поиска
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('clearSearch').style.display = 'none';
    filteredModels = [...modelsData];
    currentPage = 1;
    renderModels();
}

// Переключение фильтров
function toggleFilters() {
    const filtersPanel = document.getElementById('filtersPanel');
    filtersPanel.classList.toggle('filters-hidden');
}

// Избранное
function toggleFavorite(modelId) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showNotification('Войдите в аккаунт', 'Для добавления в избранное необходимо войти');
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }
    
    const userData = JSON.parse(currentUser);
    let allFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    // Проверяем, есть ли уже в избранном
    const favoriteIndex = allFavorites.findIndex(fav => 
        fav.userId === userData.id && fav.modelId === modelId
    );
    
    if (favoriteIndex > -1) {
        // Удаляем из избранного
        allFavorites.splice(favoriteIndex, 1);
        favorites = favorites.filter(id => id !== modelId);
        showNotification('Удалено из избранного', 'Модель удалена из вашего списка избранного');
    } else {
        // Добавляем в избранное
        allFavorites.push({
            userId: userData.id,
            modelId: modelId,
            addedAt: new Date().toISOString()
        });
        favorites.push(modelId);
        const model = modelsData.find(m => m.id === modelId);
        showNotification('Добавлено в избранное', `${model.name} добавлена в избранное`);
    }
    
    localStorage.setItem('favorites', JSON.stringify(allFavorites));
    renderModels();
}

// Быстрый просмотр
function showQuickPreview(modelId) {
    const model = modelsData.find(m => m.id === modelId);
    if (!model) return;
    
    // Создаем overlay
    const overlay = document.createElement('div');
    overlay.className = 'quick-preview-overlay';
    overlay.id = 'quickPreviewOverlay';
    
    // Создаем preview
    const preview = document.createElement('div');
    preview.className = 'quick-preview';
    preview.id = 'quickPreview';
    preview.innerHTML = `
        <div class="quick-preview-header">
            <img src="${model.image}" alt="${model.name}">
            <button class="quick-preview-close" onclick="closeQuickPreview()">✕</button>
        </div>
        <div class="quick-preview-body">
            <div class="quick-preview-title">${model.name}, ${model.age} лет</div>
            <div class="model-category">${getCategoryName(model.category)}</div>
            
            <div class="quick-preview-stats">
                <div class="stat">
                    <span class="stat-value">${model.rating}</span>
                    <span class="stat-label">Рейтинг</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${model.reviews}</span>
                    <span class="stat-label">Отзывы</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${model.shoots}</span>
                    <span class="stat-label">Съемки</span>
                </div>
            </div>
            
            <div class="quick-preview-price">${model.price.toLocaleString()} ₽/час</div>
            
            <div class="quick-preview-actions">
                <button class="btn btn-primary" onclick="openModelProfile(${model.id})">
                    Открыть профиль
                </button>
                <button class="btn btn-outline" onclick="toggleFavorite(${model.id}); closeQuickPreview();">
                    ${favorites.includes(model.id) ? '♥ В избранном' : '♡ В избранное'}
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(preview);
    
    // Анимация появления
    setTimeout(() => {
        overlay.classList.add('active');
        preview.classList.add('active');
    }, 10);
    
    // Закрытие по клику на overlay
    overlay.addEventListener('click', closeQuickPreview);
}

function closeQuickPreview() {
    const overlay = document.getElementById('quickPreviewOverlay');
    const preview = document.getElementById('quickPreview');
    
    if (overlay && preview) {
        overlay.classList.remove('active');
        preview.classList.remove('active');
        
        setTimeout(() => {
            overlay.remove();
            preview.remove();
        }, 300);
    }
}

// Уведомления
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification-badge';
    notification.innerHTML = `
        <button class="notification-close" onclick="this.parentElement.remove()">✕</button>
        <div class="notification-badge-header">
            <span>🔔</span>
            <span>${title}</span>
        </div>
        <div class="notification-badge-body">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Проверка онлайн моделей
function checkOnlineModels() {
    const previousOnline = JSON.parse(localStorage.getItem('onlineModels')) || [];
    const currentOnline = modelsData.filter(m => m.status === 'online').map(m => m.id);
    
    // Находим новых онлайн моделей
    const newOnline = currentOnline.filter(id => !previousOnline.includes(id));
    
    // Показываем уведомления для избранных моделей
    newOnline.forEach(id => {
        if (favorites.includes(id)) {
            const model = modelsData.find(m => m.id === id);
            showNotification('Модель онлайн', `${model.name} сейчас онлайн!`);
        }
    });
    
    localStorage.setItem('onlineModels', JSON.stringify(currentOnline));
}

// Открытие профиля модели
function openModelProfile(modelId) {
    const model = modelsData.find(m => m.id === modelId);
    if (model) {
        // Сохраняем в историю просмотров
        saveToHistory(model);
        
        // Проверяем, это свой профиль или чужой
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            const userData = JSON.parse(currentUser);
            if (userData.id === modelId) {
                // Это свой профиль - открываем user-profile.html
                window.location.href = 'user-profile.html';
                return;
            }
        }
        
        // Чужой профиль - открываем profile.html с ID
        window.location.href = `profile.html?id=${model.id}`;
    }
}

// Сохранение в историю просмотров
function saveToHistory(model) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return; // Не сохраняем историю для неавторизованных
    
    const userData = JSON.parse(currentUser);
    let history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    
    // Удаляем дубликаты (если модель уже была в истории этого пользователя)
    history = history.filter(item => !(item.id === model.id && item.userId === userData.id));
    
    // Добавляем в начало списка с временной меткой и userId
    history.unshift({
        userId: userData.id,
        id: model.id,
        name: model.name,
        age: model.age,
        category: model.category,
        price: model.price,
        rating: model.rating,
        reviews: model.reviews,
        image: model.image,
        status: model.status,
        viewedAt: new Date().toISOString()
    });
    
    // Ограничиваем историю 50 записями на пользователя
    const userHistory = history.filter(item => item.userId === userData.id);
    const otherHistory = history.filter(item => item.userId !== userData.id);
    
    if (userHistory.length > 50) {
        history = [...userHistory.slice(0, 50), ...otherHistory];
    }
    
    localStorage.setItem('viewHistory', JSON.stringify(history));
}

// Показ модального окна профиля
function showModelModal(model) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 0;
        border-radius: 20px;
        width: 600px;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <div style="position: relative;">
            <img src="${model.image}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 20px 20px 0 0;">
            <button onclick="document.body.removeChild(this.closest('.modal'))" 
                    style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.5); color: white; border: none; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px;">×</button>
        </div>
        <div style="padding: 30px;">
            <h2 style="margin-bottom: 10px; color: #2d3748;">${model.name}, ${model.age} лет</h2>
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; margin-bottom: 20px; font-size: 14px; font-weight: 600;">
                ${getCategoryName(model.category)}
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 25px; text-align: center;">
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: #667eea;">${model.rating}</div>
                    <div style="color: #718096; font-size: 14px;">Рейтинг</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: #667eea;">${model.reviews}</div>
                    <div style="color: #718096; font-size: 14px;">Отзывы</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: 700; color: #667eea;">${model.shoots}</div>
                    <div style="color: #718096; font-size: 14px;">Съемки</div>
                </div>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
                <div style="font-size: 28px; font-weight: 700; color: #667eea;">${model.price.toLocaleString()} ₽/час</div>
            </div>
            
            <div style="display: flex; gap: 15px;">
                <button onclick="contactModel(${model.id})" 
                        style="flex: 1; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    Связаться
                </button>
                <button onclick="addToFavorites(${model.id})" 
                        style="padding: 15px 20px; background: #e2e8f0; color: #4a5568; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; font-size: 16px;">
                    ♡ В избранное
                </button>
            </div>
        </div>
    `;
    
    modal.className = 'modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Связаться с моделью
function contactModel(modelId) {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser || JSON.parse(currentUser).isGuest) {
        showNotification('Требуется авторизация', 'Войдите или зарегистрируйтесь, чтобы связаться с моделью');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
        return;
    }
    
    const model = modelsData.find(m => m.id === modelId);
    localStorage.setItem('selectedModel', JSON.stringify(model));
    window.location.href = 'messages.html';
}

// Добавить в избранное (старая функция для совместимости)
function addToFavorites(modelId) {
    toggleFavorite(modelId);
}

// Анимация при загрузке
window.addEventListener('load', function() {
    const cards = document.querySelectorAll('.model-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Добавляем кнопку "Наверх"
    createScrollToTopButton();
    
    // Добавляем эффект тени для хедера при скролле
    handleHeaderScroll();
});

// Создание кнопки "Наверх"
function createScrollToTopButton() {
    const button = document.createElement('button');
    button.className = 'scroll-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'Наверх');
    document.body.appendChild(button);
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    });
    
    // Плавный скролл наверх
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Эффект тени для хедера при скролле
function handleHeaderScroll() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}


// Показать топ донатеров
function showTopDonors() {
    const topDonors = [
        { name: 'Александр П.', amount: 125000, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', badge: '👑' },
        { name: 'Дмитрий К.', amount: 98000, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', badge: '💎' },
        { name: 'Михаил С.', amount: 76000, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', badge: '⭐' },
        { name: 'Игорь В.', amount: 54000, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', badge: '🏆' },
        { name: 'Андрей М.', amount: 42000, avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop', badge: '🎖️' }
    ];
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 20px;
        width: 500px;
        max-width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    `;
    
    modalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="font-size: 28px; font-weight: 800; color: #2d3748; margin-bottom: 10px;">👑 Топ донатеров</h2>
            <p style="color: #718096;">Самые щедрые клиенты платформы</p>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
            ${topDonors.map((donor, index) => `
                <div style="display: flex; align-items: center; gap: 15px; padding: 15px; background: ${index === 0 ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 179, 71, 0.2))' : '#f7fafc'}; border-radius: 15px; transition: transform 0.3s ease;" onmouseover="this.style.transform='translateX(5px)'" onmouseout="this.style.transform='translateX(0)'">
                    <div style="font-size: 24px; font-weight: 700; color: #667eea; min-width: 30px;">${index + 1}</div>
                    <img src="${donor.avatar}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 3px solid ${index === 0 ? '#ffd700' : '#e2e8f0'};">
                    <div style="flex: 1;">
                        <div style="font-weight: 700; color: #2d3748; margin-bottom: 3px;">
                            ${donor.badge} ${donor.name}
                        </div>
                        <div style="font-size: 13px; color: #718096;">Отправлено донатов</div>
                    </div>
                    <div style="font-size: 18px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                        ${donor.amount.toLocaleString()} ₽
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; text-align: center; color: white;">
            <div style="font-size: 14px; margin-bottom: 10px;">Хотите попасть в топ?</div>
            <div style="font-size: 20px; font-weight: 700;">Отправляйте донаты и получайте привилегии!</div>
        </div>
        
        <button onclick="this.closest('.top-donors-modal').remove()" style="margin-top: 20px; width: 100%; padding: 15px; background: #e2e8f0; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: background 0.3s ease;" onmouseover="this.style.background='#cbd5e0'" onmouseout="this.style.background='#e2e8f0'">
            Закрыть
        </button>
    `;
    
    modal.className = 'top-donors-modal';
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Показать баннер топ донатеров для авторизованных пользователей
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.isLoggedIn && !userData.isGuest) {
            const banner = document.getElementById('topDonorsBanner');
            if (banner) {
                banner.style.display = 'block';
            }
        }
    }
});
