// Общие функции для всех страниц

// Предотвращаем прыжки скролла при перезагрузке
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Функция переключения dropdown меню
function toggleUserMenu() {
    const dropdown = document.getElementById('dropdownMenu');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

function toggleUserMenuHeader() {
    const dropdown = document.getElementById('dropdownMenuHeader');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Закрытие dropdown при клике вне его
document.addEventListener('click', function(event) {
    const userMenu = event.target.closest('.user-menu');
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    
    if (!userMenu) {
        dropdowns.forEach(dropdown => {
            dropdown.style.display = 'none';
        });
    }
});

// Выход из аккаунта
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    window.location.href = 'index.html';
}

// Загрузка меню авторизации
function loadAuthButtons() {
    const currentUserData = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons');
    
    if (!authButtons) return;
    
    if (currentUserData) {
        try {
            const userData = JSON.parse(currentUserData);
            
            if (userData.id && userData.email && userData.isGuest !== true) {
                authButtons.innerHTML = `
                    <div class="user-menu" onclick="toggleUserMenu()" style="display: flex; align-items: center; gap: 10px; cursor: pointer; position: relative; width: 100%; justify-content: flex-end;">
                        <img src="${userData.avatar}" alt="Avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
                        <span style="font-weight: 600; color: #2d3748; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${userData.name}</span>
                        <div class="dropdown-menu" id="dropdownMenu" style="position: absolute; top: 100%; right: 0; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 10px 0; min-width: 180px; display: none; z-index: 100; margin-top: 10px;">
                            <a href="user-profile.html" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Мой профиль</a>
                            <a href="#" onclick="logout()" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Выйти</a>
                        </div>
                    </div>
                `;
                return;
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    
    authButtons.innerHTML = `
        <a href="auth.html" class="btn btn-outline" style="flex-shrink: 0;">Войти</a>
        <a href="auth.html?register=true" class="btn btn-primary" style="flex-shrink: 0;">Регистрация</a>
    `;
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем скролл в начало
    window.scrollTo(0, 0);
});
