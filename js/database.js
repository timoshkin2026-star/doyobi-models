// База данных пользователей и контента

// Инициализация базы данных
function initDatabase() {
    // Проверяем, есть ли уже база
    const users = localStorage.getItem('users');
    
    if (!users) {
        // Создаем пустую базу пользователей (без тестовых моделей)
        const testUsers = [];
        
        localStorage.setItem('users', JSON.stringify(testUsers));
        console.log('База данных пользователей создана (пустая)');
    }
    
    // Создаем посты для каждой модели
    const allUsers = JSON.parse(localStorage.getItem('users'));
    allUsers.forEach(user => {
        if (user.userType === 'model') {
            const existingPosts = localStorage.getItem('userPosts_' + user.id);
            if (!existingPosts) {
                createDefaultPosts(user.id);
            }
        }
    });
}

// Создание дефолтных постов для модели
function createDefaultPosts(userId) {
    const posts = [
        {
            id: Date.now() + 1,
            userId: userId,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop',
            description: 'Новая фотосессия для модного журнала 📸✨',
            isPremium: false,
            likes: Math.floor(Math.random() * 500) + 100,
            comments: [],
            createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
            id: Date.now() + 2,
            userId: userId,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop',
            description: 'Behind the scenes 🎬',
            isPremium: false,
            likes: Math.floor(Math.random() * 400) + 80,
            comments: [],
            createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
            id: Date.now() + 3,
            userId: userId,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
            description: 'Эксклюзивный контент для подписчиков 👑',
            isPremium: true,
            likes: Math.floor(Math.random() * 600) + 200,
            comments: [],
            createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
            id: Date.now() + 4,
            userId: userId,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=800&fit=crop',
            description: 'Летняя коллекция 2024 ☀️',
            isPremium: false,
            likes: Math.floor(Math.random() * 450) + 150,
            comments: [],
            createdAt: new Date(Date.now() - 14400000).toISOString()
        },
        {
            id: Date.now() + 5,
            userId: userId,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
            description: 'Вечерний образ 💫',
            isPremium: false,
            likes: Math.floor(Math.random() * 350) + 100,
            comments: [],
            createdAt: new Date(Date.now() - 18000000).toISOString()
        },
        {
            id: Date.now() + 6,
            userId: userId,
            type: 'image',
            url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&h=800&fit=crop',
            description: 'Premium фотосет 🔥',
            isPremium: true,
            likes: Math.floor(Math.random() * 700) + 250,
            comments: [],
            createdAt: new Date(Date.now() - 21600000).toISOString()
        }
    ];
    
    localStorage.setItem('userPosts_' + userId, JSON.stringify(posts));
}

// Получить пользователя по ID
function getUserById(userId) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.id === parseInt(userId));
}

// Получить всех пользователей
function getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

// Получить всех моделей
function getAllModels() {
    const users = getAllUsers();
    return users.filter(u => u.userType === 'model');
}

// Обновить пользователя
function updateUser(userId, updates) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === parseInt(userId));
    
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        return users[index];
    }
    
    return null;
}

// Получить посты пользователя
function getUserPosts(userId) {
    return JSON.parse(localStorage.getItem('userPosts_' + userId) || '[]');
}

// Инициализация при загрузке
if (typeof window !== 'undefined') {
    initDatabase();
}
