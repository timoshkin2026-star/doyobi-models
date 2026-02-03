// База данных пользователей (хранится в localStorage)

// Инициализация базы данных
function initDatabase() {
    if (!localStorage.getItem('users')) {
        const users = [];
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Получить всех пользователей
function getAllUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Получить пользователя по ID
function getUserById(id) {
    const users = getAllUsers();
    return users.find(user => user.id === id);
}

// Получить всех моделей
function getAllModels() {
    const users = getAllUsers();
    return users.filter(user => user.type === 'model');
}

// Обновить пользователя
function updateUser(userId, updates) {
    const users = getAllUsers();
    const index = users.findIndex(user => user.id === userId);
    if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        localStorage.setItem('users', JSON.stringify(users));
        return users[index];
    }
    return null;
}

// Получить посты пользователя
function getUserPosts(userId) {
    const user = getUserById(userId);
    return user ? user.posts || [] : [];
}

// Инициализация при загрузке
initDatabase();
