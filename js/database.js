// База данных пользователей и контента

// Инициализация базы данных
function initDatabase() {
    // Проверяем, есть ли уже база
    const users = localStorage.getItem('users');
    
    if (!users) {
        // Создаем тестовую базу пользователей
        const testUsers = [
            {
                id: 1,
                email: 'anastasia@model.com',
                password: '123456',
                name: 'Анастасия',
                firstName: 'Анастасия',
                lastName: 'Иванова',
                userType: 'model',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop',
                bio: 'Профессиональная модель 📸 Fashion & Commercial | Москва 🏙️ | Доступна для съемок ✨',
                verified: true,
                premium: true,
                followers: 2400,
                following: 156,
                posts: 156,
                likes: 12500,
                rating: 4.9,
                price: 8000,
                category: 'Fashion',
                age: 24,
                height: 175,
                city: 'Москва',
                createdAt: '2023-01-15',
                isOnline: true
            },
            {
                id: 2,
                email: 'victoria@model.com',
                password: '123456',
                name: 'Виктория',
                firstName: 'Виктория',
                lastName: 'Петрова',
                userType: 'model',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
                bio: 'Fashion & Beauty Model 💄 | Москва | Сотрудничество: victoria@model.com',
                verified: true,
                premium: true,
                followers: 3200,
                following: 189,
                posts: 234,
                likes: 18900,
                rating: 4.8,
                price: 10000,
                category: 'Fashion',
                age: 26,
                height: 178,
                city: 'Москва',
                createdAt: '2022-11-20',
                isOnline: false
            },
            {
                id: 3,
                email: 'elena@model.com',
                password: '123456',
                name: 'Елена',
                firstName: 'Елена',
                lastName: 'Смирнова',
                userType: 'model',
                avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop',
                bio: 'Commercial Model 🎬 | Реклама & Каталоги | Москва',
                verified: true,
                premium: false,
                followers: 1800,
                following: 145,
                posts: 98,
                likes: 8700,
                rating: 4.7,
                price: 7000,
                category: 'Commercial',
                age: 23,
                height: 172,
                city: 'Москва',
                createdAt: '2023-03-10',
                isOnline: true
            },
            {
                id: 4,
                email: 'maria@model.com',
                password: '123456',
                name: 'Мария',
                firstName: 'Мария',
                lastName: 'Козлова',
                userType: 'model',
                avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
                bio: 'Runway Model 👗 | Fashion Week | Москва & СПб',
                verified: true,
                premium: true,
                followers: 4100,
                following: 203,
                posts: 312,
                likes: 25600,
                rating: 4.9,
                price: 12000,
                category: 'Runway',
                age: 25,
                height: 180,
                city: 'Москва',
                createdAt: '2022-08-05',
                isOnline: true
            },
            {
                id: 5,
                email: 'sofia@model.com',
                password: '123456',
                name: 'София',
                firstName: 'София',
                lastName: 'Новикова',
                userType: 'model',
                avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
                bio: 'Fitness & Lifestyle Model 💪 | Здоровый образ жизни',
                verified: false,
                premium: false,
                followers: 1200,
                following: 98,
                posts: 67,
                likes: 5400,
                rating: 4.6,
                price: 6000,
                category: 'Fitness',
                age: 22,
                height: 170,
                city: 'Москва',
                createdAt: '2023-05-20',
                isOnline: false
            },
            {
                id: 6,
                email: 'daria@model.com',
                password: '123456',
                name: 'Дарья',
                firstName: 'Дарья',
                lastName: 'Волкова',
                userType: 'model',
                avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
                bio: 'Editorial Model 📰 | Журналы & Фотосессии',
                verified: true,
                premium: true,
                followers: 2900,
                following: 167,
                posts: 189,
                likes: 15300,
                rating: 4.8,
                price: 9000,
                category: 'Editorial',
                age: 27,
                height: 176,
                city: 'Москва',
                createdAt: '2022-12-15',
                isOnline: true
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(testUsers));
        console.log('База данных пользователей создана');
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
