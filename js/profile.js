// Загрузка профиля по ID из URL
let currentProfileUser = null;

function loadProfileFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');
    
    if (!userId) {
        // Если нет ID, показываем дефолтный профиль (первую модель)
        const models = getAllModels();
        if (models.length > 0) {
            currentProfileUser = models[0];
        } else {
            alert('Профиль не найден');
            window.location.href = 'index.html';
            return;
        }
    } else {
        currentProfileUser = getUserById(userId);
        
        if (!currentProfileUser) {
            alert('Профиль не найден');
            window.location.href = 'index.html';
            return;
        }
    }
    
    // Загружаем данные профиля
    loadProfileData(currentProfileUser);
}

function loadProfileData(user) {
    // Обновляем заголовок страницы
    document.title = `${user.name} - Дойоби`;
    
    // Устанавливаем данные профиля
    document.getElementById('profileAvatar').src = user.avatar;
    document.getElementById('profileName').textContent = user.name;
    
    // Статус онлайн
    const statusIndicator = document.querySelector('.status-indicator');
    if (statusIndicator) {
        statusIndicator.className = 'status-indicator ' + (user.isOnline ? 'online' : 'offline');
    }
    
    // Бейджи
    const badgesContainer = document.querySelector('.profile-badges');
    if (badgesContainer) {
        let badges = '';
        if (user.verified) badges += '<span class="badge verified">✓ Верифицирована</span>';
        if (user.premium) badges += '<span class="badge premium">👑 Premium</span>';
        badgesContainer.innerHTML = badges;
    }
    
    // Статистика
    document.querySelector('.profile-stats .stat:nth-child(1) .stat-number').textContent = user.posts || 0;
    document.querySelector('.profile-stats .stat:nth-child(2) .stat-number').textContent = formatNumber(user.followers || 0);
    document.querySelector('.profile-stats .stat:nth-child(3) .stat-number').textContent = user.rating ? user.rating.toFixed(1) : '0.0';
    
    // Описание
    const descriptionElement = document.querySelector('.profile-description p');
    if (descriptionElement) {
        descriptionElement.innerHTML = user.bio || '';
    }
    
    // Загружаем посты пользователя
    loadUserPostsForProfile(user.id);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'к';
    }
    return num.toString();
}

function loadUserPostsForProfile(userId) {
    const posts = getUserPosts(userId);
    const postsGrid = document.querySelector('.posts-grid');
    
    if (!postsGrid) return;
    
    if (posts.length === 0) {
        postsGrid.innerHTML = '<div class="empty-state"><p>Нет постов</p></div>';
        return;
    }
    
    postsGrid.innerHTML = posts.map(post => `
        <div class="post-card" onclick="openPhotoModal(${post.id}, ${userId})">
            <img src="${post.url}" alt="Post">
            ${post.isPremium ? '<div class="premium-badge">👑 Premium</div>' : ''}
            <div class="post-overlay">
                <div class="post-stats">
                    <span>❤️ ${post.likes || 0}</span>
                    <span>💬 ${post.comments ? post.comments.length : 0}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    loadProfileFromURL();
});

// Данные для профиля (старый код - оставляем для совместимости)
const profileData = {
    posts: [
        { 
            id: 1, 
            image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop', 
            likes: 234, 
            type: 'photo',
            description: 'Новая фотосессия для модного журнала 📸✨',
            comments: [
                { id: 1, author: 'Мария', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', text: 'Потрясающе! 😍', time: '1 час назад', likes: 5 },
                { id: 2, author: 'Алексей', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', text: 'Очень профессионально!', time: '2 часа назад', likes: 3 }
            ]
        },
        { 
            id: 2, 
            image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', 
            likes: 189, 
            type: 'photo',
            description: 'Съемка для рекламной кампании 🌟',
            comments: []
        },
        { 
            id: 3, 
            image: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=400&fit=crop', 
            likes: 312, 
            type: 'photo',
            description: 'Backstage с последней съемки 💫',
            comments: [
                { id: 1, author: 'Ольга', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', text: 'Красота! 💕', time: '30 минут назад', likes: 2 }
            ]
        },
        { 
            id: 4, 
            image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop', 
            likes: 156, 
            type: 'photo',
            description: 'Летняя коллекция 2024 ☀️',
            comments: []
        },
        { 
            id: 5, 
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', 
            likes: 278, 
            type: 'photo',
            description: 'Fashion Week Moscow 🎭',
            comments: []
        },
        { 
            id: 6, 
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop', 
            likes: 203, 
            type: 'photo',
            description: 'Вечерний образ ✨',
            comments: []
        },
        { 
            id: 7, 
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', 
            likes: 345, 
            type: 'photo',
            description: 'Новый проект 🎬',
            comments: []
        },
        { 
            id: 8, 
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', 
            likes: 167, 
            type: 'photo',
            description: 'Студийная съемка 📷',
            comments: []
        },
        { 
            id: 9, 
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop', 
            likes: 289, 
            type: 'photo',
            description: 'Портретная фотосессия 🌸',
            comments: []
        },
        { 
            id: 10, 
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', 
            likes: 198, 
            type: 'photo',
            description: 'Уличная мода 🏙️',
            comments: []
        },
        { 
            id: 11, 
            image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop', 
            likes: 234, 
            type: 'photo',
            description: 'Осенняя фотосессия 🍂',
            comments: []
        },
        { 
            id: 12, 
            image: 'https://images.unsplash.com/photo-1521119989659-a83eee488004?w=400&h=400&fit=crop', 
            likes: 156, 
            type: 'photo',
            description: 'Черно-белая классика 🖤',
            comments: []
        }
    ],
    videos: [
        { 
            id: 1, 
            thumbnail: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop', 
            duration: '0:45', 
            views: 1234,
            title: 'Fashion съемка для журнала',
            description: 'Закулисье съемки для модного журнала. Показываю процесс работы и финальные кадры 📸✨',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            likes: 456,
            comments: [
                { id: 1, author: 'Мария', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', text: 'Потрясающая работа! 😍', time: '1 час назад', likes: 8 },
                { id: 2, author: 'Алексей', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', text: 'Очень профессионально!', time: '2 часа назад', likes: 5 }
            ]
        },
        { 
            id: 2, 
            thumbnail: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop', 
            duration: '1:23', 
            views: 856,
            title: 'Backstage с фотосессии',
            description: 'Делюсь моментами со съемки. Было очень весело! 🎬',
            url: 'https://www.w3schools.com/html/movie.mp4',
            likes: 234,
            comments: [
                { id: 1, author: 'Ольга', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', text: 'Красиво! 💕', time: '30 минут назад', likes: 3 }
            ]
        },
        { 
            id: 3, 
            thumbnail: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=300&fit=crop', 
            duration: '2:15', 
            views: 2341,
            title: 'Подиумный показ',
            description: 'Выступление на Fashion Week Moscow 2024. Незабываемые эмоции! 🌟',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            likes: 789,
            comments: []
        },
        { 
            id: 4, 
            thumbnail: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=300&fit=crop', 
            duration: '0:58', 
            views: 678,
            title: 'Летняя коллекция 2024',
            description: 'Презентация новой летней коллекции ☀️',
            url: 'https://www.w3schools.com/html/movie.mp4',
            likes: 345,
            comments: [
                { id: 1, author: 'Дмитрий', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', text: 'Супер! 👍', time: '1 день назад', likes: 2 }
            ]
        },
        { 
            id: 5, 
            thumbnail: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop', 
            duration: '1:45', 
            views: 1567,
            title: 'Вечерний образ',
            description: 'Создание вечернего образа для фотосессии ✨',
            url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            likes: 567,
            comments: []
        },
        { 
            id: 6, 
            thumbnail: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=300&fit=crop', 
            duration: '3:12', 
            views: 3421,
            title: 'Fashion Week Moscow',
            description: 'Полное видео с Fashion Week Moscow. Все самые яркие моменты! 🎭',
            url: 'https://www.w3schools.com/html/movie.mp4',
            likes: 1234,
            comments: [
                { id: 1, author: 'Елена', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop', text: 'Браво! 👏', time: '3 часа назад', likes: 12 },
                { id: 2, author: 'Игорь', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop', text: 'Лучшее выступление!', time: '4 часа назад', likes: 9 }
            ]
        }
    ],
    reviews: [
        {
            id: 1,
            author: 'Александр Петров',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
            rating: 5,
            date: '15 января 2024',
            text: 'Отличная модель! Очень профессиональная, пунктуальная и приятная в общении. Съемка прошла на высшем уровне. Рекомендую всем!',
            photos: [
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&h=200&fit=crop'
            ],
            helpful: 24,
            verified: true
        },
        {
            id: 2,
            author: 'Мария Иванова',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            rating: 5,
            date: '10 января 2024',
            text: 'Работали над рекламной кампанией. Анастасия показала себя как настоящий профессионал. Все пожелания были учтены, результат превзошел ожидания!',
            photos: [],
            helpful: 18,
            verified: true
        },
        {
            id: 3,
            author: 'Дмитрий Соколов',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            rating: 5,
            date: '5 января 2024',
            text: 'Прекрасная модель с отличным портфолио. Легко находит общий язык, быстро схватывает идею съемки. Буду обращаться еще!',
            photos: [
                'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop'
            ],
            helpful: 15,
            verified: false
        },
        {
            id: 4,
            author: 'Елена Смирнова',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
            rating: 4,
            date: '28 декабря 2023',
            text: 'Хорошая работа, профессиональный подход. Единственное - немного задержалась на съемку, но в целом все отлично!',
            photos: [],
            helpful: 8,
            verified: true
        },
        {
            id: 5,
            author: 'Игорь Волков',
            avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
            rating: 5,
            date: '20 декабря 2023',
            text: 'Работали на Fashion Week. Анастасия - настоящая звезда! Профессионализм на высоте, отличное чувство стиля.',
            photos: [
                'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop',
                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop'
            ],
            helpful: 32,
            verified: true
        }
    ],
    premium: [
        { id: 1, locked: true },
        { id: 2, locked: true },
        { id: 3, locked: true },
        { id: 4, locked: true },
        { id: 5, locked: true },
        { id: 6, locked: true }
    ]
};

let currentImageIndex = 0;
let isSubscribed = false;
let isPremiumSubscribed = false;
let selectedRating = 0;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderMenu();
    loadModelData();
    setupTabs();
    renderPosts();
    renderVideos();
    renderReviews();
    renderPremium();
    setupModalNavigation();
    setupStarRating();
    setupReviewFilters();
});

// Обновление меню в хедере
function updateHeaderMenu() {
    const currentUser = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons');
    
    // Сначала делаем видимыми
    authButtons.style.visibility = 'visible';
    
    if (currentUser) {
        const userData = JSON.parse(currentUser);
        if (userData.isLoggedIn && !userData.isGuest) {
            // Пользователь авторизован - показываем профиль
            authButtons.innerHTML = `
                <div class="user-menu" onclick="toggleUserMenu()" style="display: flex; align-items: center; gap: 10px; cursor: pointer; position: relative;">
                    <img src="${userData.avatar}" alt="Avatar" class="user-avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
                    <span class="user-name" style="font-weight: 600; color: #2d3748;">${userData.name}</span>
                    <div class="dropdown-menu" id="dropdownMenu" style="position: absolute; top: 100%; right: 0; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 10px 0; min-width: 180px; display: none; z-index: 100; margin-top: 10px;">
                        <a href="user-profile.html" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Мой профиль</a>
                        <a href="#" onclick="logout()" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Выйти</a>
                    </div>
                </div>
            `;
        }
    }
}

// Переключение пользовательского меню
function toggleUserMenu() {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    const userMenu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('dropdownMenu');
    
    if (userMenu && dropdown && !userMenu.contains(e.target)) {
        dropdown.style.display = 'none';
    }
});

// Выход из аккаунта
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    location.reload();
}

// Загрузка данных модели
function loadModelData() {
    const modelData = localStorage.getItem('selectedModel');
    if (modelData) {
        const model = JSON.parse(modelData);
        
        // Обновляем информацию о модели
        document.getElementById('profileName').textContent = model.name;
        document.getElementById('profileAvatar').src = model.image;
        document.getElementById('profileAvatar').alt = model.name;
        
        // Обновляем заголовок страницы
        document.title = `${model.name} - Дойоби`;
        
        // Обновляем цену в кнопке подписки
        const priceSpan = document.querySelector('.btn-primary .price');
        if (priceSpan) {
            priceSpan.textContent = `${model.price.toLocaleString()} ₽/час`;
        }
    }
}

// Настройка табов
function setupTabs() {
    const tabs = document.querySelectorAll('.content-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Убираем активный класс у всех табов и секций
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Добавляем активный класс к выбранному табу и секции
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Отрисовка постов
function renderPosts() {
    const postsGrid = document.querySelector('.posts-grid');
    
    postsGrid.innerHTML = profileData.posts.map((post, index) => `
        <div class="post-item" onclick="openImageModal(${index})">
            <img src="${post.image}" alt="Пост ${post.id}">
            <div class="post-overlay">
                <span>❤️ ${post.likes}</span>
            </div>
        </div>
    `).join('');
}

// Отрисовка видео
function renderVideos() {
    const videosGrid = document.querySelector('.videos-grid');
    
    videosGrid.innerHTML = profileData.videos.map(video => `
        <div class="video-item" onclick="playVideo(${video.id})">
            <img src="${video.thumbnail}" alt="${video.title}">
            <button class="video-play-btn">▶</button>
            <div class="video-info">
                <span class="video-duration">${video.duration}</span>
                <span class="video-views">${video.views.toLocaleString()} просмотров</span>
            </div>
            <div class="video-overlay">
                <span>❤️ ${video.likes}</span>
                <span>💬 ${video.comments.length}</span>
            </div>
        </div>
    `).join('');
}

// Отрисовка отзывов
function renderReviews(filter = 'all') {
    const reviewsList = document.getElementById('reviewsList');
    let filteredReviews = profileData.reviews;
    
    if (filter !== 'all') {
        if (filter === 'verified') {
            filteredReviews = profileData.reviews.filter(r => r.photos.length > 0);
        } else {
            filteredReviews = profileData.reviews.filter(r => r.rating === parseInt(filter));
        }
    }
    
    reviewsList.innerHTML = filteredReviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <div class="review-user">
                    <img src="${review.avatar}" alt="${review.author}" class="review-avatar">
                    <div class="review-user-info">
                        <h4>
                            ${review.author}
                            ${review.verified ? '<span class="verified-badge">✓ Подтвержденная покупка</span>' : ''}
                        </h4>
                        <span class="review-date">${review.date}</span>
                    </div>
                </div>
                <div class="review-rating">
                    <span class="review-stars">${'⭐'.repeat(review.rating)}</span>
                    <span class="review-score">${review.rating}.0</span>
                </div>
            </div>
            
            <div class="review-text">${review.text}</div>
            
            ${review.photos.length > 0 ? `
                <div class="review-photos">
                    ${review.photos.map(photo => `
                        <img src="${photo}" alt="Фото отзыва" class="review-photo" onclick="openImageInModal('${photo}')">
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="review-actions">
                <button class="review-action-btn" onclick="markReviewHelpful(${review.id})">
                    👍 Полезно (${review.helpful})
                </button>
                <button class="review-action-btn">
                    💬 Ответить
                </button>
            </div>
        </div>
    `).join('');
}

// Отрисовка premium контента
function renderPremium() {
    const premiumGrid = document.querySelector('.premium-grid');
    
    premiumGrid.innerHTML = profileData.premium.map(item => `
        <div class="premium-item" onclick="unlockPremium(${item.id})">
            ${item.locked ? '🔒' : '👑'}
        </div>
    `).join('');
}

// Открытие модального окна с изображением
function openImageModal(index) {
    currentImageIndex = index;
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    const post = profileData.posts[index];
    
    // Устанавливаем изображение
    modalImage.src = post.image;
    
    // Устанавливаем информацию о посте
    const modelData = localStorage.getItem('selectedModel');
    if (modelData) {
        const model = JSON.parse(modelData);
        document.getElementById('modalUserAvatar').src = model.image;
        document.getElementById('modalUserName').textContent = model.name;
    }
    
    document.getElementById('modalPostTime').textContent = '2 часа назад';
    document.getElementById('modalPostDescription').textContent = post.description;
    document.getElementById('likeCount').textContent = post.likes;
    document.getElementById('commentCount').textContent = post.comments.length;
    
    // Проверяем, лайкнул ли пользователь этот пост
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    const likeBtn = document.getElementById('likeBtn');
    if (likedPosts.includes(post.id)) {
        likeBtn.classList.add('liked');
        likeBtn.querySelector('.action-icon').textContent = '❤️';
    } else {
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('.action-icon').textContent = '♡';
    }
    
    // Отображаем комментарии
    renderComments(post.comments);
    
    modal.classList.add('active');
    
    // Блокируем прокрутку страницы
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeModal() {
    const modal = document.getElementById('photoModal');
    modal.classList.remove('active');
    
    // Разблокируем прокрутку страницы
    document.body.style.overflow = '';
}

// Навигация по изображениям в модальном окне
function prevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : profileData.posts.length - 1;
    document.getElementById('modalImage').src = profileData.posts[currentImageIndex].image;
}

function nextImage() {
    currentImageIndex = currentImageIndex < profileData.posts.length - 1 ? currentImageIndex + 1 : 0;
    document.getElementById('modalImage').src = profileData.posts[currentImageIndex].image;
}

// Настройка навигации в модальном окне
function setupModalNavigation() {
    document.addEventListener('keydown', (e) => {
        const photoModal = document.getElementById('photoModal');
        const videoModal = document.getElementById('videoModal');
        const reviewModal = document.getElementById('reviewModal');
        
        if (photoModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            }
        }
        
        if (videoModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeVideoModal();
            }
        }
        
        if (reviewModal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeReviewModal();
            }
        }
    });
    
    // Закрытие по клику вне изображения
    document.getElementById('photoModal').addEventListener('click', (e) => {
        if (e.target.id === 'photoModal') {
            closeModal();
        }
    });
    
    // Закрытие видео по клику вне области
    document.getElementById('videoModal').addEventListener('click', (e) => {
        if (e.target.id === 'videoModal') {
            closeVideoModal();
        }
    });
    
    // Закрытие отзыва по клику вне области
    document.getElementById('reviewModal').addEventListener('click', (e) => {
        if (e.target.id === 'reviewModal') {
            closeReviewModal();
        }
    });
}

// Подписка на модель
function subscribeToModel() {
    const subscribeBtn = document.getElementById('subscribeText');
    
    if (!isSubscribed) {
        isSubscribed = true;
        subscribeBtn.textContent = 'Подписан';
        subscribeBtn.parentElement.classList.add('subscribed');
        subscribeBtn.parentElement.style.background = '#48bb78';
        
        // Показываем уведомление
        showNotification('Вы подписались на Анастасию! 🎉');
        
        // Обновляем счетчик подписчиков
        updateSubscriberCount(1);
    } else {
        isSubscribed = false;
        subscribeBtn.textContent = 'Подписаться';
        subscribeBtn.parentElement.classList.remove('subscribed');
        subscribeBtn.parentElement.style.background = '';
        
        showNotification('Вы отписались от Анастасии');
        updateSubscriberCount(-1);
    }
}

// Подписка на premium
function subscribeToPremium() {
    if (!isPremiumSubscribed) {
        isPremiumSubscribed = true;
        showNotification('Добро пожаловать в Premium! 👑');
        
        // Разблокируем premium контент
        const premiumItems = document.querySelectorAll('.premium-item');
        premiumItems.forEach(item => {
            item.innerHTML = '👑';
            item.onclick = null;
        });
        
        // Обновляем баннер
        const premiumBanner = document.querySelector('.premium-banner');
        premiumBanner.innerHTML = `
            <h3>👑 Premium активен</h3>
            <p>Спасибо за подписку! Теперь у вас есть доступ ко всему эксклюзивному контенту</p>
        `;
    } else {
        showNotification('У вас уже есть Premium подписка! 👑');
    }
}

// Обновление счетчика подписчиков
function updateSubscriberCount(change) {
    const subscriberStat = document.querySelector('.stat:nth-child(2) .stat-number');
    let currentCount = parseFloat(subscriberStat.textContent);
    
    if (subscriberStat.textContent.includes('к')) {
        currentCount = currentCount * 1000;
    }
    
    currentCount += change;
    
    if (currentCount >= 1000) {
        subscriberStat.textContent = (currentCount / 1000).toFixed(1) + 'к';
    } else {
        subscriberStat.textContent = currentCount.toString();
    }
}

// Отправка сообщения
function sendMessage() {
    // Проверяем авторизацию
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Показываем модальное окно с предложением авторизоваться
        showAuthModal();
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.isGuest) {
        // Если пользователь гость, предлагаем зарегистрироваться
        showAuthModal();
        return;
    }
    
    // Получаем данные модели из localStorage
    const modelData = localStorage.getItem('selectedModel');
    if (modelData) {
        const model = JSON.parse(modelData);
        // Сохраняем информацию о том, кому отправляем сообщение
        localStorage.setItem('messageRecipient', JSON.stringify({
            id: model.id,
            name: model.name,
            avatar: model.image
        }));
    } else {
        // Если нет данных модели, используем данные из профиля
        const profileName = document.getElementById('profileName').textContent;
        const profileAvatar = document.getElementById('profileAvatar').src;
        
        localStorage.setItem('messageRecipient', JSON.stringify({
            id: Date.now(),
            name: profileName,
            avatar: profileAvatar
        }));
    }
    
    // Переходим на страницу сообщений
    window.location.href = 'messages.html';
}

// Показ модального окна авторизации
function showAuthModal() {
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
        width: 400px;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;
    
    // Создаем кнопки отдельно
    const registerBtn = document.createElement('button');
    registerBtn.textContent = 'Регистрация';
    registerBtn.style.cssText = `
        flex: 1;
        padding: 12px 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
    `;
    registerBtn.onclick = function() {
        window.location.href = 'auth.html?register=true';
    };
    
    const loginBtn = document.createElement('button');
    loginBtn.textContent = 'Войти';
    loginBtn.style.cssText = `
        flex: 1;
        padding: 12px 20px;
        background: #e2e8f0;
        color: #4a5568;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s ease;
    `;
    loginBtn.onclick = function() {
        window.location.href = 'auth.html';
    };
    
    // Создаем контейнер для кнопок
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: center;
    `;
    buttonsContainer.appendChild(registerBtn);
    buttonsContainer.appendChild(loginBtn);
    
    // Добавляем содержимое
    modalContent.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
        <h2 style="margin-bottom: 15px; color: #2d3748;">Требуется авторизация</h2>
        <p style="color: #718096; margin-bottom: 30px; line-height: 1.5;">
            Для отправки сообщений необходимо войти в аккаунт или зарегистрироваться
        </p>
    `;
    modalContent.appendChild(buttonsContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Добавление в избранное
function addToFavorites() {
    const btn = event.target;
    if (btn.textContent === '♡') {
        btn.textContent = '❤️';
        btn.style.color = '#ed4956';
        showNotification('Добавлено в избранное ❤️');
    } else {
        btn.textContent = '♡';
        btn.style.color = '';
        showNotification('Удалено из избранного');
    }
}

// Воспроизведение видео
let currentVideoId = null;

function playVideo(videoId) {
    const video = profileData.videos.find(v => v.id === videoId);
    if (!video) return;
    
    currentVideoId = videoId;
    
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    // Устанавливаем источник видео
    modalVideo.src = video.url;
    
    // Устанавливаем информацию о видео
    const modelData = localStorage.getItem('selectedModel');
    if (modelData) {
        const model = JSON.parse(modelData);
        document.getElementById('modalVideoUserAvatar').src = model.image;
        document.getElementById('modalVideoUserName').textContent = model.name;
    }
    
    document.getElementById('modalVideoTitle').textContent = video.title;
    document.getElementById('modalVideoDescription').textContent = video.description;
    document.getElementById('modalVideoViews').textContent = `${video.views.toLocaleString()} просмотров`;
    document.getElementById('modalVideoDate').textContent = '2 часа назад';
    document.getElementById('videoLikeCount').textContent = video.likes;
    document.getElementById('videoCommentCount').textContent = video.comments.length;
    
    // Проверяем, лайкнул ли пользователь это видео
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    const videoLikeBtn = document.getElementById('videoLikeBtn');
    if (likedVideos.includes(video.id)) {
        videoLikeBtn.classList.add('liked');
        videoLikeBtn.querySelector('.action-icon').textContent = '❤️';
    } else {
        videoLikeBtn.classList.remove('liked');
        videoLikeBtn.querySelector('.action-icon').textContent = '♡';
    }
    
    // Отображаем комментарии
    renderVideoComments(video.comments);
    
    // Показываем модальное окно
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Воспроизводим видео
    modalVideo.play();
}

// Закрытие видео модального окна
function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    // Останавливаем видео
    modalVideo.pause();
    modalVideo.src = '';
    
    // Закрываем модальное окно
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    currentVideoId = null;
}

// Отображение комментариев к видео
function renderVideoComments(comments) {
    const commentsContainer = document.getElementById('modalVideoComments');
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = `
            <div class="empty-comments">
                <div class="empty-comments-icon">💬</div>
                <p>Пока нет комментариев. Будьте первым!</p>
            </div>
        `;
        return;
    }
    
    commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment-item" data-comment-id="${comment.id}">
            <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="comment-action" onclick="likeVideoComment(${comment.id})">
                        ${comment.likes > 0 ? `❤️ ${comment.likes}` : 'Нравится'}
                    </button>
                    <button class="comment-action">Ответить</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Переключение лайка на видео
function toggleVideoLike() {
    const video = profileData.videos.find(v => v.id === currentVideoId);
    if (!video) return;
    
    const videoLikeBtn = document.getElementById('videoLikeBtn');
    const videoLikeCount = document.getElementById('videoLikeCount');
    const likedVideos = JSON.parse(localStorage.getItem('likedVideos') || '[]');
    
    if (likedVideos.includes(video.id)) {
        // Убираем лайк
        const index = likedVideos.indexOf(video.id);
        likedVideos.splice(index, 1);
        video.likes--;
        videoLikeBtn.classList.remove('liked');
        videoLikeBtn.querySelector('.action-icon').textContent = '♡';
        showNotification('Лайк убран');
    } else {
        // Добавляем лайк
        likedVideos.push(video.id);
        video.likes++;
        videoLikeBtn.classList.add('liked');
        videoLikeBtn.querySelector('.action-icon').textContent = '❤️';
        showNotification('Вам понравилось! ❤️');
    }
    
    videoLikeCount.textContent = video.likes;
    localStorage.setItem('likedVideos', JSON.stringify(likedVideos));
    
    // Обновляем отображение в сетке
    renderVideos();
}

// Добавление комментария к видео
function addVideoComment() {
    const commentInput = document.getElementById('videoCommentInput');
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        showNotification('Введите текст комментария');
        return;
    }
    
    // Проверяем авторизацию
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.isGuest) {
        showAuthModal();
        return;
    }
    
    const video = profileData.videos.find(v => v.id === currentVideoId);
    if (!video) return;
    
    // Создаем новый комментарий
    const newComment = {
        id: Date.now(),
        author: userData.name,
        avatar: userData.avatar,
        text: commentText,
        time: 'только что',
        likes: 0
    };
    
    video.comments.push(newComment);
    
    // Обновляем отображение
    renderVideoComments(video.comments);
    document.getElementById('videoCommentCount').textContent = video.comments.length;
    
    // Очищаем поле ввода
    commentInput.value = '';
    
    showNotification('Комментарий добавлен! 💬');
}

// Обработка нажатия Enter в поле комментария к видео
function handleVideoCommentKeyPress(event) {
    if (event.key === 'Enter') {
        addVideoComment();
    }
}

// Фокус на поле ввода комментария к видео
function focusVideoCommentInput() {
    document.getElementById('videoCommentInput').focus();
}

// Лайк комментария к видео
function likeVideoComment(commentId) {
    const video = profileData.videos.find(v => v.id === currentVideoId);
    if (!video) return;
    
    const comment = video.comments.find(c => c.id === commentId);
    
    if (comment) {
        comment.likes++;
        renderVideoComments(video.comments);
        showNotification('Вам понравился комментарий! ❤️');
    }
}

// Открытие модального окна отзыва
function openReviewModal() {
    // Проверяем авторизацию
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.isGuest) {
        showAuthModal();
        return;
    }
    
    const modal = document.getElementById('reviewModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна отзыва
function closeReviewModal() {
    const modal = document.getElementById('reviewModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Сбрасываем форму
    selectedRating = 0;
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    document.getElementById('reviewText').value = '';
    document.getElementById('reviewPhoto').value = '';
}

// Настройка рейтинга звездами
function setupStarRating() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            selectedRating = parseInt(this.dataset.rating);
            
            stars.forEach(s => {
                const rating = parseInt(s.dataset.rating);
                if (rating <= selectedRating) {
                    s.classList.add('active');
                    s.textContent = '★';
                } else {
                    s.classList.remove('active');
                    s.textContent = '☆';
                }
            });
        });
        
        star.addEventListener('mouseenter', function() {
            const rating = parseInt(this.dataset.rating);
            stars.forEach(s => {
                if (parseInt(s.dataset.rating) <= rating) {
                    s.textContent = '★';
                } else {
                    s.textContent = '☆';
                }
            });
        });
    });
    
    const starRating = document.getElementById('starRating');
    starRating.addEventListener('mouseleave', function() {
        stars.forEach(s => {
            const rating = parseInt(s.dataset.rating);
            if (rating <= selectedRating) {
                s.textContent = '★';
            } else {
                s.textContent = '☆';
            }
        });
    });
}

// Отправка отзыва
function submitReview() {
    const reviewText = document.getElementById('reviewText').value.trim();
    
    if (selectedRating === 0) {
        showNotification('Пожалуйста, поставьте оценку');
        return;
    }
    
    if (!reviewText) {
        showNotification('Пожалуйста, напишите отзыв');
        return;
    }
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Создаем новый отзыв
    const newReview = {
        id: Date.now(),
        author: currentUser.name,
        avatar: currentUser.avatar,
        rating: selectedRating,
        date: 'только что',
        text: reviewText,
        photos: [],
        helpful: 0,
        verified: false
    };
    
    // Добавляем отзыв в начало списка
    profileData.reviews.unshift(newReview);
    
    // Обновляем отображение
    renderReviews();
    
    // Закрываем модальное окно
    closeReviewModal();
    
    showNotification('Спасибо за ваш отзыв! ⭐');
}

// Настройка фильтров отзывов
function setupReviewFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Применяем фильтр
            const filter = this.dataset.filter;
            renderReviews(filter);
        });
    });
}

// Отметить отзыв как полезный
function markReviewHelpful(reviewId) {
    const review = profileData.reviews.find(r => r.id === reviewId);
    if (review) {
        review.helpful++;
        renderReviews();
        showNotification('Спасибо за вашу оценку! 👍');
    }
}

// Открытие изображения в модальном окне
function openImageInModal(imageSrc) {
    const modal = document.getElementById('photoModal');
    const modalImage = document.getElementById('modalImage');
    
    modalImage.src = imageSrc;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Разблокировка premium контента
function unlockPremium(itemId) {
    if (!isPremiumSubscribed) {
        showNotification('Подпишитесь на Premium для доступа к этому контенту 👑');
    }
}

// Показ уведомлений
function showNotification(message) {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Удаление через 3 секунды
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Анимация при загрузке
window.addEventListener('load', function() {
    const elements = document.querySelectorAll('.post-item, .video-item, .premium-item');
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 50);
    });
});


// Отображение комментариев
function renderComments(comments) {
    const commentsContainer = document.getElementById('modalComments');
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = `
            <div class="empty-comments">
                <div class="empty-comments-icon">💬</div>
                <p>Пока нет комментариев. Будьте первым!</p>
            </div>
        `;
        return;
    }
    
    commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment-item" data-comment-id="${comment.id}">
            <img src="${comment.avatar}" alt="${comment.author}" class="comment-avatar">
            <div class="comment-content">
                <div class="comment-header">
                    <span class="comment-author">${comment.author}</span>
                    <span class="comment-time">${comment.time}</span>
                </div>
                <div class="comment-text">${comment.text}</div>
                <div class="comment-actions">
                    <button class="comment-action" onclick="likeComment(${comment.id})">
                        ${comment.likes > 0 ? `❤️ ${comment.likes}` : 'Нравится'}
                    </button>
                    <button class="comment-action">Ответить</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Переключение лайка на посте
function toggleLike() {
    const post = profileData.posts[currentImageIndex];
    const likeBtn = document.getElementById('likeBtn');
    const likeCount = document.getElementById('likeCount');
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    
    if (likedPosts.includes(post.id)) {
        // Убираем лайк
        const index = likedPosts.indexOf(post.id);
        likedPosts.splice(index, 1);
        post.likes--;
        likeBtn.classList.remove('liked');
        likeBtn.querySelector('.action-icon').textContent = '♡';
        showNotification('Лайк убран');
    } else {
        // Добавляем лайк
        likedPosts.push(post.id);
        post.likes++;
        likeBtn.classList.add('liked');
        likeBtn.querySelector('.action-icon').textContent = '❤️';
        showNotification('Вам понравилось! ❤️');
    }
    
    likeCount.textContent = post.likes;
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    
    // Обновляем отображение в сетке
    renderPosts();
}

// Добавление комментария
function addComment() {
    const commentInput = document.getElementById('commentInput');
    const commentText = commentInput.value.trim();
    
    if (!commentText) {
        showNotification('Введите текст комментария', 'error');
        return;
    }
    
    // Проверяем авторизацию
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.isGuest) {
        showAuthModal();
        return;
    }
    
    const post = profileData.posts[currentImageIndex];
    
    // Создаем новый комментарий
    const newComment = {
        id: Date.now(),
        author: userData.name,
        avatar: userData.avatar,
        text: commentText,
        time: 'только что',
        likes: 0
    };
    
    post.comments.push(newComment);
    
    // Обновляем отображение
    renderComments(post.comments);
    document.getElementById('commentCount').textContent = post.comments.length;
    
    // Очищаем поле ввода
    commentInput.value = '';
    
    showNotification('Комментарий добавлен! 💬');
}

// Обработка нажатия Enter в поле комментария
function handleCommentKeyPress(event) {
    if (event.key === 'Enter') {
        addComment();
    }
}

// Фокус на поле ввода комментария
function focusCommentInput() {
    document.getElementById('commentInput').focus();
}

// Лайк комментария
function likeComment(commentId) {
    const post = profileData.posts[currentImageIndex];
    const comment = post.comments.find(c => c.id === commentId);
    
    if (comment) {
        comment.likes++;
        renderComments(post.comments);
        showNotification('Вам понравился комментарий! ❤️');
    }
}


// Система монетизации
let selectedAmount = 0;
let selectedGiftId = null;
let selectedGiftPrice = 0;
let selectedPaidOption = null;
let selectedPaidPrice = 0;

// Открытие модального окна донатов
function openDonateModal() {
    // Проверяем авторизацию
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showAuthModal();
        return;
    }
    
    const userData = JSON.parse(currentUser);
    if (userData.isGuest) {
        showAuthModal();
        return;
    }
    
    const modal = document.getElementById('donateModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна донатов
function closeDonateModal() {
    const modal = document.getElementById('donateModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Сбрасываем выбор
    resetDonateForm();
}

// Переключение табов
function switchDonateTab(tab) {
    // Убираем активный класс у всех табов
    document.querySelectorAll('.donate-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.donate-section').forEach(s => s.classList.remove('active'));
    
    // Добавляем активный класс
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(`${tab}-section`).classList.add('active');
}

// Выбор суммы доната
function selectAmount(amount) {
    selectedAmount = amount;
    
    // Убираем выделение со всех кнопок
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    
    // Выделяем выбранную кнопку
    event.target.classList.add('selected');
    
    // Очищаем поле кастомной суммы
    document.getElementById('customAmount').value = '';
    
    // Обновляем информацию о том, сколько получит модель
    updateModelReceives(amount);
}

// Обновление суммы, которую получит модель
function updateModelReceives(amount) {
    const commission = amount * 0.15; // 15% комиссия
    const modelReceives = amount - commission;
    document.getElementById('modelReceives').textContent = `Модель получит: ${modelReceives.toFixed(0)} ₽`;
}

// Обработка кастомной суммы
document.addEventListener('DOMContentLoaded', function() {
    const customAmountInput = document.getElementById('customAmount');
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            const amount = parseInt(this.value) || 0;
            selectedAmount = amount;
            
            // Убираем выделение с кнопок
            document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
            
            if (amount > 0) {
                updateModelReceives(amount);
            }
        });
    }
});

// Отправка доната
function sendDonate() {
    const amount = selectedAmount || parseInt(document.getElementById('customAmount').value) || 0;
    
    if (amount < 50) {
        showNotification('Минимальная сумма доната - 50 ₽');
        return;
    }
    
    const message = document.getElementById('donateMessage').value.trim();
    const commission = amount * 0.15;
    const modelReceives = amount - commission;
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    
    // Сохраняем в историю
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    donationHistory.push({
        userId: currentUser.id,
        type: 'donate',
        modelId: modelData.id,
        modelName: modelData.name,
        amount: amount,
        message: message,
        date: new Date().toISOString()
    });
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
    
    // Здесь должна быть интеграция с платежной системой
    showNotification(`Донат на сумму ${amount} ₽ отправлен! 💰`);
    
    // Сохраняем статистику
    const stats = JSON.parse(localStorage.getItem('donateStats') || '{"total": 0, "count": 0}');
    stats.total += modelReceives;
    stats.count += 1;
    localStorage.setItem('donateStats', JSON.stringify(stats));
    
    closeDonateModal();
}

// Выбор подарка
function selectGift(giftId, price) {
    selectedGiftId = giftId;
    selectedGiftPrice = price;
    
    // Убираем выделение со всех подарков
    document.querySelectorAll('.gift-item').forEach(item => item.classList.remove('selected'));
    
    // Выделяем выбранный подарок
    event.currentTarget.classList.add('selected');
    
    // Показываем информацию о выбранном подарке
    const giftName = event.currentTarget.querySelector('.gift-name').textContent;
    document.getElementById('selectedGiftName').textContent = giftName;
    document.getElementById('selectedGiftPrice').textContent = price;
    document.getElementById('selectedGift').style.display = 'block';
    
    // Активируем кнопку отправки
    document.getElementById('sendGiftBtn').disabled = false;
}

// Отправка подарка
function sendGift() {
    if (!selectedGiftId) {
        showNotification('Выберите подарок');
        return;
    }
    
    const giftName = document.getElementById('selectedGiftName').textContent;
    const commission = selectedGiftPrice * 0.15;
    const modelReceives = selectedGiftPrice - commission;
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    
    // Сохраняем в историю
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    donationHistory.push({
        userId: currentUser.id,
        type: 'gift',
        modelId: modelData.id,
        modelName: modelData.name,
        amount: selectedGiftPrice,
        giftName: giftName,
        date: new Date().toISOString()
    });
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
    
    showNotification(`Подарок "${giftName}" отправлен! 🎁`);
    
    // Сохраняем статистику
    const stats = JSON.parse(localStorage.getItem('giftStats') || '{"total": 0, "count": 0}');
    stats.total += modelReceives;
    stats.count += 1;
    localStorage.setItem('giftStats', JSON.stringify(stats));
    
    closeDonateModal();
}

// Выбор платной опции
function selectPaidOption(option, price) {
    selectedPaidOption = option;
    selectedPaidPrice = price;
    
    // Убираем выделение со всех опций
    document.querySelectorAll('.paid-option').forEach(item => item.classList.remove('selected'));
    
    // Выделяем выбранную опцию
    event.currentTarget.classList.add('selected');
    
    // Показываем информацию о выбранной опции
    const optionName = event.currentTarget.querySelector('.option-name').textContent;
    document.getElementById('selectedOptionName').textContent = optionName;
    document.getElementById('selectedOptionPrice').textContent = price;
    document.getElementById('selectedOption').style.display = 'block';
    
    // Активируем кнопку отправки
    document.getElementById('sendPaidMessageBtn').disabled = false;
}

// Отправка платного сообщения
function sendPaidMessage() {
    if (!selectedPaidOption) {
        showNotification('Выберите тариф');
        return;
    }
    
    const messageText = document.getElementById('paidMessageText').value.trim();
    
    if (!messageText) {
        showNotification('Введите текст сообщения');
        return;
    }
    
    const optionName = document.getElementById('selectedOptionName').textContent;
    const commission = selectedPaidPrice * 0.15;
    const modelReceives = selectedPaidPrice - commission;
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    
    // Сохраняем в историю
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const donationHistory = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    donationHistory.push({
        userId: currentUser.id,
        type: 'message',
        modelId: modelData.id,
        modelName: modelData.name,
        amount: selectedPaidPrice,
        message: messageText,
        date: new Date().toISOString()
    });
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
    
    showNotification(`Платное сообщение "${optionName}" отправлено! ✉️`);
    
    // Сохраняем статистику
    const stats = JSON.parse(localStorage.getItem('paidMessageStats') || '{"total": 0, "count": 0}');
    stats.total += modelReceives;
    stats.count += 1;
    localStorage.setItem('paidMessageStats', JSON.stringify(stats));
    
    closeDonateModal();
}

// Сброс формы донатов
function resetDonateForm() {
    selectedAmount = 0;
    selectedGiftId = null;
    selectedGiftPrice = 0;
    selectedPaidOption = null;
    selectedPaidPrice = 0;
    
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.gift-item').forEach(item => item.classList.remove('selected'));
    document.querySelectorAll('.paid-option').forEach(item => item.classList.remove('selected'));
    
    document.getElementById('customAmount').value = '';
    document.getElementById('donateMessage').value = '';
    document.getElementById('paidMessageText').value = '';
    document.getElementById('modelReceives').textContent = 'Модель получит: 0 ₽';
    document.getElementById('selectedGift').style.display = 'none';
    document.getElementById('selectedOption').style.display = 'none';
    document.getElementById('sendGiftBtn').disabled = true;
    document.getElementById('sendPaidMessageBtn').disabled = true;
}

// Закрытие модального окна донатов по клику вне области
document.addEventListener('DOMContentLoaded', function() {
    const donateModal = document.getElementById('donateModal');
    if (donateModal) {
        donateModal.addEventListener('click', (e) => {
            if (e.target.id === 'donateModal') {
                closeDonateModal();
            }
        });
    }
});


// ============= ПОДПИСКИ И PREMIUM =============

// Проверка статуса подписки при загрузке
function checkSubscriptionStatus() {
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    const currentUser = localStorage.getItem('currentUser');
    if (!modelData || !currentUser) return;
    
    const userData = JSON.parse(currentUser);
    const subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const isSubscribed = subscriptions.some(sub => sub.id === modelData.id && sub.userId === userData.id);
    
    // Обновляем кнопку подписки
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeIcon = document.getElementById('subscribeIcon');
    const subscribeText = document.getElementById('subscribeText');
    
    if (subscribeBtn && isSubscribed) {
        subscribeBtn.classList.remove('btn-primary');
        subscribeBtn.classList.add('btn-outline');
        subscribeIcon.textContent = '✓';
        subscribeText.textContent = 'Вы подписаны';
    }
    
    // Проверяем активные бронирования
    checkActiveBooking();
}

// Проверка активного бронирования
function checkActiveBooking() {
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    const currentUser = localStorage.getItem('currentUser');
    
    if (!modelData || !currentUser) return;
    
    const userData = JSON.parse(currentUser);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    // Ищем активные бронирования (pending или confirmed) для этой модели от текущего пользователя
    const activeBooking = bookings.find(b => 
        b.modelId === modelData.id && 
        b.clientId === userData.id && 
        (b.status === 'pending' || b.status === 'confirmed')
    );
    
    const bookingBtn = document.getElementById('bookingBtn');
    if (!bookingBtn) return;
    
    if (activeBooking) {
        // Есть активное бронирование - меняем кнопку
        const dateObj = new Date(activeBooking.date);
        const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
        
        const statusInfo = {
            'pending': { text: 'Ожидает', icon: '⏳', color: 'btn-outline' },
            'confirmed': { text: 'Подтверждено', icon: '✅', color: 'btn-outline' }
        };
        
        const status = statusInfo[activeBooking.status];
        
        bookingBtn.innerHTML = `
            <span>${status.icon} ${status.text}</span>
            <span style="font-size: 13px; opacity: 0.8;">${formattedDate} в ${activeBooking.time}</span>
        `;
        bookingBtn.classList.remove('btn-primary');
        bookingBtn.classList.add(status.color);
        
        if (activeBooking.status === 'confirmed') {
            bookingBtn.style.borderColor = '#48bb78';
            bookingBtn.style.color = '#48bb78';
        } else {
            bookingBtn.style.borderColor = '#f59e0b';
            bookingBtn.style.color = '#f59e0b';
        }
        
        // Меняем действие кнопки - показываем детали брони
        bookingBtn.onclick = function() {
            showBookingDetails(activeBooking);
        };
    }
}

// Показать детали бронирования
function showBookingDetails(booking) {
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
    
    const statusInfo = {
        'pending': { text: 'Ожидает подтверждения', color: '#f59e0b', icon: '⏳' },
        'confirmed': { text: 'Подтверждено', color: '#48bb78', icon: '✅' }
    };
    
    const status = statusInfo[booking.status];
    
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 20px; padding: 40px; max-width: 500px; width: 100%;">
            <h2 style="font-size: 24px; font-weight: 700; color: #2d3748; margin-bottom: 10px; text-align: center;">
                📅 Детали бронирования
            </h2>
            <div style="background: ${status.color}20; color: ${status.color}; padding: 12px 20px; border-radius: 15px; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; margin-bottom: 25px;">
                <span style="font-size: 20px;">${status.icon}</span>
                <span>${status.text}</span>
            </div>
            
            <div style="background: #f7fafc; padding: 25px; border-radius: 15px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                    <span style="color: #718096; font-weight: 600;">Дата:</span>
                    <span style="font-weight: 700; color: #2d3748;">${formattedDate}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                    <span style="color: #718096; font-weight: 600;">Время:</span>
                    <span style="font-weight: 700; color: #2d3748;">${booking.time}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                    <span style="color: #718096; font-weight: 600;">Длительность:</span>
                    <span style="font-weight: 700; color: #2d3748;">${booking.duration} ${booking.duration === 1 ? 'час' : booking.duration < 5 ? 'часа' : 'часов'}</span>
                </div>
                ${booking.comment ? `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #e2e8f0;">
                    <span style="color: #718096; font-weight: 600; display: block; margin-bottom: 8px;">Комментарий:</span>
                    <span style="color: #2d3748;">${booking.comment}</span>
                </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px;">
                    <span style="font-size: 18px; font-weight: 700; color: #2d3748;">Стоимость:</span>
                    <span style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${booking.price.toLocaleString()} ₽</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px;">
                ${booking.status === 'pending' ? `
                <button onclick="cancelBookingFromDetails(${booking.id}); this.closest('.modal').remove(); document.body.style.overflow = ''" 
                        class="btn btn-outline" 
                        style="flex: 1; padding: 14px; border-radius: 12px; font-weight: 600; color: #e53e3e; border-color: #e53e3e;">
                    Отменить бронь
                </button>
                ` : ''}
                <button onclick="this.closest('.modal').remove(); document.body.style.overflow = ''" 
                        class="btn btn-primary" 
                        style="flex: 1; padding: 14px; border-radius: 12px; font-weight: 600;">
                    Закрыть
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Отмена бронирования из деталей
function cancelBookingFromDetails(bookingId) {
    if (!confirm('Вы уверены, что хотите отменить бронирование?')) {
        return;
    }
    
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);
    
    if (bookingIndex !== -1) {
        bookings[bookingIndex].status = 'cancelled';
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        showNotification('Бронирование отменено ❌', 'Вы можете забронировать новую встречу');
        
        // Обновляем кнопку
        setTimeout(() => {
            location.reload();
        }, 1500);
    }
}

// Переключение подписки (бесплатно)
function toggleSubscription() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showNotification('Войдите в аккаунт', 'Для подписки необходимо войти в аккаунт');
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }
    
    const userData = JSON.parse(currentUser);
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    if (!modelData) return;
    
    let subscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    const isSubscribed = subscriptions.some(sub => sub.id === modelData.id && sub.userId === userData.id);
    
    const subscribeBtn = document.getElementById('subscribeBtn');
    const subscribeIcon = document.getElementById('subscribeIcon');
    const subscribeText = document.getElementById('subscribeText');
    
    if (isSubscribed) {
        // Отписаться
        subscriptions = subscriptions.filter(sub => !(sub.id === modelData.id && sub.userId === userData.id));
        subscribeBtn.classList.remove('btn-outline');
        subscribeBtn.classList.add('btn-primary');
        subscribeIcon.textContent = '🔔';
        subscribeText.textContent = 'Подписаться';
        showNotification('Вы отписались', `Вы больше не подписаны на ${modelData.name}`);
    } else {
        // Подписаться
        subscriptions.push({
            userId: userData.id,
            id: modelData.id,
            name: modelData.name,
            image: modelData.image,
            category: modelData.category,
            subscribedAt: new Date().toISOString()
        });
        subscribeBtn.classList.remove('btn-primary');
        subscribeBtn.classList.add('btn-outline');
        subscribeIcon.textContent = '✓';
        subscribeText.textContent = 'Вы подписаны';
        showNotification('Подписка оформлена! 🔔', `Вы подписались на ${modelData.name}`);
    }
    
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
}

// Открытие модального окна Premium
function openPremiumModal() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showNotification('Войдите в аккаунт', 'Для покупки Premium необходимо войти в аккаунт');
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }
    
    document.getElementById('premiumModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна Premium
function closePremiumModal() {
    document.getElementById('premiumModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Сброс выбора
    document.querySelectorAll('.premium-plan').forEach(plan => {
        plan.classList.remove('selected');
    });
    document.getElementById('selectedPremiumPlan').style.display = 'none';
    document.getElementById('purchasePremiumBtn').disabled = true;
}

let selectedPremiumPlan = null;

// Выбор тарифа Premium
function selectPremiumPlan(planType, price) {
    selectedPremiumPlan = { planType, price };
    
    // Обновляем визуальное выделение
    document.querySelectorAll('.premium-plan').forEach(plan => {
        plan.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Показываем выбранный тариф
    const planNames = {
        'month': '1 месяц',
        '3months': '3 месяца',
        'year': '12 месяцев'
    };
    
    document.getElementById('selectedPremiumPlanName').textContent = planNames[planType];
    document.getElementById('selectedPremiumPlanPrice').textContent = price.toLocaleString();
    document.getElementById('selectedPremiumPlan').style.display = 'block';
    document.getElementById('purchasePremiumBtn').disabled = false;
}

// Покупка Premium подписки
function purchasePremium() {
    if (!selectedPremiumPlan) return;
    
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    if (!modelData) return;
    
    const { planType, price } = selectedPremiumPlan;
    
    // Рассчитываем дату окончания подписки
    const now = new Date();
    const expiresAt = new Date(now);
    
    switch(planType) {
        case 'month':
            expiresAt.setMonth(expiresAt.getMonth() + 1);
            break;
        case '3months':
            expiresAt.setMonth(expiresAt.getMonth() + 3);
            break;
        case 'year':
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);
            break;
    }
    
    // Сохраняем Premium подписку
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let premiumSubscriptions = JSON.parse(localStorage.getItem('premiumSubscriptions') || '[]');
    
    // Удаляем старую подписку если есть
    premiumSubscriptions = premiumSubscriptions.filter(sub => !(sub.id === modelData.id && sub.userId === currentUser.id));
    
    // Добавляем новую
    premiumSubscriptions.push({
        userId: currentUser.id,
        id: modelData.id,
        name: modelData.name,
        image: modelData.image,
        category: modelData.category,
        planType: planType,
        price: price,
        purchasedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
    });
    
    localStorage.setItem('premiumSubscriptions', JSON.stringify(premiumSubscriptions));
    
    // Обновляем статистику
    let premiumStats = JSON.parse(localStorage.getItem('premiumStats') || '{"total": 0, "count": 0}');
    premiumStats.total += price;
    premiumStats.count += 1;
    localStorage.setItem('premiumStats', JSON.stringify(premiumStats));
    
    // Комиссия платформы 15%
    const platformFee = price * 0.15;
    const modelEarnings = price - platformFee;
    
    showNotification(
        '👑 Premium подписка оформлена!',
        `Вы получили Premium доступ к контенту ${modelData.name} до ${expiresAt.toLocaleDateString('ru-RU')}`
    );
    
    closePremiumModal();
    checkSubscriptionStatus();
}

// Вызываем проверку статуса при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkSubscriptionStatus();
});


// ============= БРОНИРОВАНИЕ =============

let selectedBookingDuration = null;
let selectedBookingPrice = 0;

// Открытие модального окна бронирования
function openBookingModal() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        showNotification('Войдите в аккаунт', 'Для бронирования необходимо войти в аккаунт');
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }
    
    // Устанавливаем минимальную дату (сегодня)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    document.getElementById('bookingDate').min = minDate;
    
    document.getElementById('bookingModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна бронирования
function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Сброс формы
    document.getElementById('bookingDate').value = '';
    document.getElementById('bookingTime').value = '';
    document.getElementById('bookingComment').value = '';
    document.querySelectorAll('.duration-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('bookingSummary').style.display = 'none';
    document.getElementById('confirmBookingBtn').disabled = true;
    selectedBookingDuration = null;
    selectedBookingPrice = 0;
}

// Выбор длительности
function selectDuration(hours, price) {
    selectedBookingDuration = hours;
    selectedBookingPrice = price;
    
    // Обновляем визуальное выделение
    document.querySelectorAll('.duration-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    updateBookingSummary();
}

// Обновление итоговой информации
function updateBookingSummary() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    
    if (date && time && selectedBookingDuration) {
        // Форматируем дату
        const dateObj = new Date(date);
        const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
        const formattedDate = dateObj.toLocaleDateString('ru-RU', options);
        
        // Рассчитываем время окончания
        const [hours, minutes] = time.split(':');
        const endTime = new Date();
        endTime.setHours(parseInt(hours) + selectedBookingDuration);
        endTime.setMinutes(parseInt(minutes));
        const endTimeStr = endTime.toTimeString().slice(0, 5);
        
        // Обновляем информацию
        document.getElementById('summaryDate').textContent = formattedDate;
        document.getElementById('summaryTime').textContent = `${time} - ${endTimeStr}`;
        document.getElementById('summaryDuration').textContent = `${selectedBookingDuration} ${selectedBookingDuration === 1 ? 'час' : selectedBookingDuration < 5 ? 'часа' : 'часов'}`;
        document.getElementById('summaryPrice').textContent = selectedBookingPrice.toLocaleString() + ' ₽';
        
        // Показываем итоговую информацию
        document.getElementById('bookingSummary').style.display = 'block';
        document.getElementById('confirmBookingBtn').disabled = false;
    } else {
        document.getElementById('bookingSummary').style.display = 'none';
        document.getElementById('confirmBookingBtn').disabled = true;
    }
}

// Подтверждение бронирования
function confirmBooking() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const comment = document.getElementById('bookingComment').value;
    
    if (!date || !time || !selectedBookingDuration) {
        showNotification('Заполните все поля', 'Выберите дату, время и длительность');
        return;
    }
    
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!modelData || !currentUser) return;
    
    // Создаем бронирование
    const booking = {
        id: Date.now(),
        modelId: modelData.id,
        modelName: modelData.name,
        modelImage: modelData.image,
        clientId: currentUser.id,
        clientName: currentUser.name,
        clientAvatar: currentUser.avatar,
        date: date,
        time: time,
        duration: selectedBookingDuration,
        price: selectedBookingPrice,
        comment: comment,
        status: 'pending', // pending, confirmed, cancelled, completed
        createdAt: new Date().toISOString()
    };
    
    // Сохраняем бронирование
    let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Создаем уведомление для модели
    createBookingNotification(booking);
    
    // Обновляем статистику
    let bookingStats = JSON.parse(localStorage.getItem('bookingStats') || '{"total": 0, "count": 0}');
    bookingStats.total += selectedBookingPrice;
    bookingStats.count += 1;
    localStorage.setItem('bookingStats', JSON.stringify(bookingStats));
    
    // Форматируем дату для уведомления
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    
    showNotification(
        '✅ Запрос на бронирование отправлен!',
        `Модель ${modelData.name} получит уведомление. Вы получите подтверждение в течение 24 часов.`
    );
    
    closeBookingModal();
    
    // Обновляем кнопку бронирования
    setTimeout(() => {
        checkActiveBooking();
    }, 500);
}

// Создание уведомления для модели
function createBookingNotification(booking) {
    let notifications = JSON.parse(localStorage.getItem('modelNotifications') || '[]');
    
    const dateObj = new Date(booking.date);
    const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' });
    
    notifications.push({
        id: Date.now(),
        type: 'booking',
        bookingId: booking.id,
        modelId: booking.modelId,
        clientName: booking.clientName,
        clientAvatar: booking.clientAvatar,
        date: booking.date,
        time: booking.time,
        duration: booking.duration,
        price: booking.price,
        message: `${booking.clientName} хочет забронировать встречу на ${formattedDate} в ${booking.time} (${booking.duration} ч.)`,
        createdAt: new Date().toISOString(),
        read: false
    });
    
    localStorage.setItem('modelNotifications', JSON.stringify(notifications));
}

// Проверка цены модели при загрузке
// ============= PREMIUM КОНТЕНТ =============

// Premium контент (эксклюзивные фото)
const premiumContent = [
    {
        id: 1,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 1'
    },
    {
        id: 2,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 2'
    },
    {
        id: 3,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 3'
    },
    {
        id: 4,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 4'
    },
    {
        id: 5,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 5'
    },
    {
        id: 6,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 6'
    },
    {
        id: 7,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 7'
    },
    {
        id: 8,
        type: 'photo',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop',
        title: 'Эксклюзивная фотосессия 8'
    }
];

// Проверка Premium подписки и отображение контента
function checkPremiumAccess() {
    const modelData = JSON.parse(localStorage.getItem('selectedModel'));
    if (!modelData) return;
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        // Пользователь не авторизован - показываем заблокированный контент
        showLockedPremiumContent();
        return;
    }
    
    const premiumSubscriptions = JSON.parse(localStorage.getItem('premiumSubscriptions') || '[]');
    const userPremium = premiumSubscriptions.find(sub => sub.id === modelData.id);
    
    if (userPremium) {
        const expiresAt = new Date(userPremium.expiresAt);
        const now = new Date();
        
        if (expiresAt > now) {
            // Premium активен - показываем контент
            showUnlockedPremiumContent(expiresAt);
            return;
        }
    }
    
    // Premium нет или истек - показываем заблокированный контент
    showLockedPremiumContent();
}

// Показать заблокированный Premium контент
function showLockedPremiumContent() {
    document.getElementById('premiumLockedBanner').style.display = 'block';
    document.getElementById('premiumLockedGrid').style.display = 'grid';
    document.getElementById('premiumUnlockedContent').style.display = 'none';
}

// Показать разблокированный Premium контент
function showUnlockedPremiumContent(expiresAt) {
    document.getElementById('premiumLockedBanner').style.display = 'none';
    document.getElementById('premiumLockedGrid').style.display = 'none';
    document.getElementById('premiumUnlockedContent').style.display = 'block';
    
    // Обновляем текст с датой окончания
    const daysLeft = Math.ceil((expiresAt - new Date()) / (1000 * 60 * 60 * 24));
    const expiresText = document.getElementById('premiumExpiresText');
    
    if (daysLeft <= 7) {
        expiresText.textContent = `⚠️ Осталось ${daysLeft} дн.`;
        expiresText.style.color = '#fbbf24';
    } else {
        expiresText.textContent = `до ${expiresAt.toLocaleDateString('ru-RU')}`;
    }
    
    // Отображаем Premium контент
    renderPremiumContent();
}

// Отрисовка Premium контента
function renderPremiumContent() {
    const grid = document.getElementById('premiumContentGrid');
    
    grid.innerHTML = premiumContent.map(item => `
        <div class="premium-item" onclick="openPremiumPhoto(${item.id})">
            <img src="${item.image}" alt="${item.title}">
            <div class="premium-badge">
                <span>👑</span>
                <span>Premium</span>
            </div>
        </div>
    `).join('');
}

// Открытие Premium фото в модальном окне
function openPremiumPhoto(photoId) {
    const photo = premiumContent.find(p => p.id === photoId);
    if (!photo) return;
    
    // Создаем модальное окно для просмотра
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <button onclick="this.parentElement.remove(); document.body.style.overflow = ''" 
                style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; font-size: 32px; width: 50px; height: 50px; border-radius: 50%; cursor: pointer; transition: all 0.3s ease;"
                onmouseover="this.style.background='rgba(255,255,255,0.3)'"
                onmouseout="this.style.background='rgba(255,255,255,0.2)'">
            ✕
        </button>
        <img src="${photo.image}" 
             alt="${photo.title}" 
             style="max-width: 100%; max-height: 90vh; border-radius: 15px; box-shadow: 0 10px 50px rgba(0,0,0,0.5);">
        <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); padding: 15px 30px; border-radius: 25px; color: white; font-weight: 600; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">👑</span>
            <span>${photo.title}</span>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

// Вызываем проверку Premium при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    checkPremiumAccess();
});


// ============= УНИВЕРСАЛЬНОЕ ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН =============

// Закрытие модального окна по клику на overlay (затемненный фон)
function closeModalOnOverlay(event, modalId) {
    // Проверяем, что клик был именно на overlay, а не на контент
    if (event.target.id === modalId) {
        // Закрываем соответствующее модальное окно
        switch(modalId) {
            case 'bookingModal':
                closeBookingModal();
                break;
            case 'premiumModal':
                closePremiumModal();
                break;
            case 'donateModal':
                closeDonateModal();
                break;
            default:
                // Универсальное закрытие
                document.getElementById(modalId).classList.remove('active');
                document.body.style.overflow = '';
        }
    }
}

// Добавляем обработчик ESC для закрытия модальных окон
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        // Закрываем все открытые модальные окна
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            const modalId = modal.id;
            switch(modalId) {
                case 'bookingModal':
                    closeBookingModal();
                    break;
                case 'premiumModal':
                    closePremiumModal();
                    break;
                case 'donateModal':
                    closeDonateModal();
                    break;
                default:
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
            }
        });
    }
});
