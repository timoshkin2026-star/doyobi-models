let currentUser = null;
let gallery = [];

window.addEventListener('DOMContentLoaded', init);

function init() {
    checkAuth();
    loadStats();
    loadProfile();
    loadGallery();
    loadBookings();
    loadReviews();
    loadEarnings();
    setupFileUploads();
}

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }
    currentUser = JSON.parse(user);
    if (currentUser.isGuest || currentUser.userType !== 'model') {
        alert('Доступ только для моделей');
        window.location.href = 'index.html';
        return;
    }
    updateMenu();
}

function updateMenu() {
    document.getElementById('authButtons').innerHTML = `
        <div class="user-menu" onclick="toggleMenu()">
            <img src="${currentUser.avatar}" style="width:35px;height:35px;border-radius:50%;object-fit:cover;">
            <span style="font-weight:600;color:#2d3748;margin:0 10px;">${currentUser.name}</span>
            <div id="menu" style="position:absolute;top:100%;right:0;background:white;border-radius:10px;box-shadow:0 4px 20px rgba(0,0,0,0.1);padding:10px 0;min-width:180px;display:none;z-index:100;">
                <a href="user-profile.html" style="display:block;padding:10px 15px;color:#4a5568;text-decoration:none;">👤 Профиль</a>
                <a href="#" onclick="logout()" style="display:block;padding:10px 15px;color:#4a5568;text-decoration:none;">🚪 Выйти</a>
            </div>
        </div>
    `;
    document.getElementById('authButtons').style.position = 'relative';
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showSection(section) {
    // Скрываем все секции
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Убираем активный класс у всех пунктов меню
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    
    // Показываем выбранную секцию
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }
    
    // Находим и активируем соответствующий пункт меню
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`'${section}'`)) {
            item.classList.add('active');
        }
    });
}

function loadStats() {
    const history = JSON.parse(localStorage.getItem('viewHistory') || '[]');
    const views = history.filter(h => h.modelId === currentUser.id).length;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const likes = favorites.filter(f => f.modelId === currentUser.id).length;
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const myBookings = bookings.filter(b => b.modelId === currentUser.id);
    
    const donations = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    const myDonations = donations.filter(d => d.modelId === currentUser.id);
    const total = myDonations.reduce((sum, d) => sum + (d.amount * 0.85), 0);
    
    document.getElementById('viewsCount').textContent = views;
    document.getElementById('likesCount').textContent = likes;
    document.getElementById('bookingsCount').textContent = myBookings.length;
    document.getElementById('earningsTotal').textContent = Math.floor(total).toLocaleString() + ' ₽';
}

function loadProfile() {
    document.getElementById('avatarPreview').src = currentUser.avatar;
    document.getElementById('nameInput').value = currentUser.name || '';
    document.getElementById('ageInput').value = 24;
    document.getElementById('categoryInput').value = 'Fashion';
    document.getElementById('priceInput').value = 8000;
    document.getElementById('bioInput').value = '';
    document.getElementById('publishedInput').checked = true;
    
    const status = localStorage.getItem('modelStatus_' + currentUser.id) === 'online';
    document.getElementById('onlineStatus').checked = status;
    document.getElementById('statusText').textContent = status ? 'Онлайн' : 'Оффлайн';
    document.getElementById('statusText').style.color = status ? '#48bb78' : '#718096';
}

function saveProfile() {
    currentUser.name = document.getElementById('nameInput').value;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === currentUser.id);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    alert('Профиль сохранен!');
}

function toggleStatus() {
    const checked = document.getElementById('onlineStatus').checked;
    localStorage.setItem('modelStatus_' + currentUser.id, checked ? 'online' : 'offline');
    document.getElementById('statusText').textContent = checked ? 'Онлайн' : 'Оффлайн';
    document.getElementById('statusText').style.color = checked ? '#48bb78' : '#718096';
}

function loadGallery() {
    gallery = JSON.parse(localStorage.getItem('gallery_' + currentUser.id) || '[]');
    renderGallery();
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;
    
    if (gallery.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;">Нет загруженных фото. Нажмите кнопку выше чтобы загрузить.</p>';
        return;
    }
    
    grid.innerHTML = gallery.map((item, index) => {
        if (item.type === 'video') {
            return `
                <div class="gallery-item">
                    <video src="${item.url}" controls style="width:100%;height:100%;object-fit:cover;"></video>
                    <button class="delete-btn" onclick="deletePhoto(${index})" style="position:absolute;top:10px;right:10px;background:rgba(255,0,0,0.8);color:white;border:none;border-radius:50%;width:35px;height:35px;cursor:pointer;font-size:18px;">🗑️</button>
                </div>
            `;
        } else {
            return `
                <div class="gallery-item" style="position:relative;">
                    <img src="${item.url}" alt="Photo ${index + 1}" style="width:100%;height:100%;object-fit:cover;">
                    <button class="delete-btn" onclick="deletePhoto(${index})" style="position:absolute;top:10px;right:10px;background:rgba(255,0,0,0.8);color:white;border:none;border-radius:50%;width:35px;height:35px;cursor:pointer;font-size:18px;">🗑️</button>
                </div>
            `;
        }
    }).join('');
}

function deletePhoto(index) {
    if (confirm('Удалить это фото?')) {
        gallery.splice(index, 1);
        localStorage.setItem('gallery_' + currentUser.id, JSON.stringify(gallery));
        renderGallery();
    }
}

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const myBookings = bookings.filter(b => b.modelId === currentUser.id);
    
    const list = document.getElementById('bookingsList');
    if (!list) return;
    
    if (myBookings.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;">Нет бронирований</p>';
        return;
    }
    
    list.innerHTML = myBookings.map(b => `
        <div class="booking-item">
            <div class="booking-info">
                <h4>${b.clientName}</h4>
                <p>📅 ${b.date} в ${b.time}</p>
                <p>💰 ${b.price} ₽</p>
            </div>
            <div class="booking-status status-${b.status}">${getStatusText(b.status)}</div>
        </div>
    `).join('');
}

function getStatusText(status) {
    const map = {
        'pending': 'Ожидает',
        'confirmed': 'Подтверждено',
        'completed': 'Завершено',
        'cancelled': 'Отменено'
    };
    return map[status] || status;
}

function loadReviews() {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const myReviews = reviews.filter(r => r.modelId === currentUser.id);
    
    const list = document.getElementById('reviewsList');
    if (!list) return;
    
    if (myReviews.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;">Нет отзывов</p>';
        return;
    }
    
    list.innerHTML = myReviews.map(r => `
        <div class="review-item">
            <div class="review-header">
                <strong>${r.author}</strong>
                <span class="review-rating">${'⭐'.repeat(r.rating)}</span>
            </div>
            <p>${r.text}</p>
            <small style="color:#718096;">${r.date}</small>
        </div>
    `).join('');
}

function loadEarnings() {
    const donations = JSON.parse(localStorage.getItem('donationHistory') || '[]');
    const myDonations = donations.filter(d => d.modelId === currentUser.id);
    
    const list = document.getElementById('earningsList');
    if (!list) return;
    
    if (myDonations.length === 0) {
        list.innerHTML = '<p style="text-align:center;color:#718096;padding:40px;">Нет транзакций</p>';
        return;
    }
    
    list.innerHTML = myDonations.map(d => `
        <div class="earning-item">
            <div>
                <strong>${d.from}</strong>
                <p style="color:#718096;font-size:14px;">${d.date}</p>
            </div>
            <div style="text-align:right;">
                <strong style="color:#48bb78;">+${Math.floor(d.amount * 0.85)} ₽</strong>
                <p style="color:#718096;font-size:12px;">Комиссия: ${Math.floor(d.amount * 0.15)} ₽</p>
            </div>
        </div>
    `).join('');
}

function setupFileUploads() {
    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
    
    const videoInput = document.getElementById('videoInput');
    if (videoInput) {
        videoInput.addEventListener('change', handleVideoUpload);
    }
    
    const avatarInput = document.getElementById('avatarUpload');
    if (avatarInput) {
        avatarInput.addEventListener('change', handleAvatarUpload);
    }
}

function handlePhotoUpload(e) {
    const files = e.target.files;
    if (!files.length) return;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            gallery.push({
                url: event.target.result,
                date: new Date().toISOString(),
                type: 'photo'
            });
            localStorage.setItem('gallery_' + currentUser.id, JSON.stringify(gallery));
            renderGallery();
        };
        reader.readAsDataURL(file);
    });
    
    // Очищаем input чтобы можно было загрузить те же файлы снова
    e.target.value = '';
}

function handleVideoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        gallery.push({
            url: event.target.result,
            date: new Date().toISOString(),
            type: 'video'
        });
        localStorage.setItem('gallery_' + currentUser.id, JSON.stringify(gallery));
        renderGallery();
    };
    reader.readAsDataURL(file);
    
    // Очищаем input
    e.target.value = '';
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(event) {
        currentUser.avatar = event.target.result;
        document.getElementById('avatarPreview').src = event.target.result;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index].avatar = event.target.result;
            localStorage.setItem('users', JSON.stringify(users));
        }
    };
    reader.readAsDataURL(file);
}
