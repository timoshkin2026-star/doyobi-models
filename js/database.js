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
    
    // Не создаем тестовые посты для моделей
    // Посты будут создаваться только когда пользователь сам их загрузит
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
