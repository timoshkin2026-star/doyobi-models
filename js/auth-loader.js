// Загрузка меню авторизации - выполняется синхронно
(function() {
    const currentUserData = localStorage.getItem('currentUser');
    const authButtons = document.getElementById('authButtons');
    
    if (!authButtons) return;
    
    if (currentUserData) {
        try {
            const userData = JSON.parse(currentUserData);
            
            if (userData.id && userData.email && userData.isGuest !== true) {
                authButtons.innerHTML = '<div class="user-menu" onclick="toggleUserMenu()" style="display:flex;align-items:center;gap:10px;cursor:pointer;position:relative;width:100%;justify-content:flex-end"><img src="' + userData.avatar + '" style="width:35px;height:35px;border-radius:50%;object-fit:cover;flex-shrink:0"><span style="font-weight:600;color:#2d3748;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px">' + userData.name + '</span><div class="dropdown-menu" id="dropdownMenu" style="position:absolute;top:100%;right:0;background:white;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1);padding:10px 0;min-width:180px;display:none;z-index:100;margin-top:10px"><a href="user-profile.html" style="display:block;padding:10px 15px;color:#4a5568;text-decoration:none">Мой профиль</a><a href="#" onclick="logout()" style="display:block;padding:10px 15px;color:#4a5568;text-decoration:none">Выйти</a></div></div>';
                return;
            }
        } catch (e) {}
    }
    
    authButtons.innerHTML = '<a href="auth.html" class="btn btn-outline" style="flex-shrink:0">Войти</a><a href="auth.html?register=true" class="btn btn-primary" style="flex-shrink:0">Регистрация</a>';
})();
