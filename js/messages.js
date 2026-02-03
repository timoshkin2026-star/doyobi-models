// Данные чатов и сообщений
const chatsData = [
    {
        id: 1,
        name: 'Анастасия',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop',
        lastMessage: 'Привет! Когда планируете съемку?',
        time: '14:30',
        unread: 2,
        online: true,
        messages: [
            { id: 1, text: 'Привет! Интересует фотосессия', time: '14:25', own: false, read: true },
            { id: 2, text: 'Здравствуйте! Конечно, расскажите подробнее о проекте', time: '14:27', own: true, read: true },
            { id: 3, text: 'Нужна fashion съемка для каталога', time: '14:28', own: false, read: true },
            { id: 4, text: 'Отлично! Это как раз моя специализация. Когда планируете?', time: '14:29', own: true, read: true },
            { id: 5, text: 'Привет! Когда планируете съемку?', time: '14:30', own: false, read: false }
        ]
    },
    {
        id: 2,
        name: 'Виктория',
        avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&h=100&fit=crop',
        lastMessage: 'Спасибо за отличную работу! 🔥',
        time: '12:15',
        unread: 0,
        online: false,
        messages: [
            { id: 1, text: 'Добрый день! Хочу заказать съемку', time: '10:00', own: false, read: true },
            { id: 2, text: 'Здравствуйте! Буду рада поработать с вами', time: '10:05', own: true, read: true },
            { id: 3, text: 'Спасибо за отличную работу! 🔥', time: '12:15', own: false, read: true }
        ]
    },
    {
        id: 3,
        name: 'Елена',
        avatar: 'https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=100&h=100&fit=crop',
        lastMessage: 'Можем обсудить детали завтра',
        time: 'Вчера',
        unread: 0,
        online: true,
        messages: [
            { id: 1, text: 'Привет! Видела ваше портфолио, очень понравилось', time: 'Вчера 18:30', own: false, read: true },
            { id: 2, text: 'Спасибо! Что вас интересует?', time: 'Вчера 18:35', own: true, read: true },
            { id: 3, text: 'Можем обсудить детали завтра', time: 'Вчера 19:00', own: false, read: true }
        ]
    }
];

const availableUsers = [
    { id: 4, name: 'Мария Петрова', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop', status: 'Фотомодель', online: true },
    { id: 5, name: 'Дарья Смирнова', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', status: 'Fashion модель', online: false },
    { id: 6, name: 'Алиса Козлова', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop', status: 'Коммерческая модель', online: true },
    { id: 7, name: 'София Волкова', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop', status: 'Подиумная модель', online: true }
];

let currentChatId = null;
let currentUser = null;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    updateHeaderMenu();
    loadCurrentUser();
    renderChats();
    setupUserMenu();
    
    // Имитация получения новых сообщений
    setInterval(simulateIncomingMessage, 30000);
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
                <div class="user-menu" onclick="toggleUserMenuHeader()" style="display: flex; align-items: center; gap: 10px; cursor: pointer; position: relative;">
                    <img src="${userData.avatar}" alt="Avatar" class="user-avatar" style="width: 35px; height: 35px; border-radius: 50%; object-fit: cover;">
                    <span class="user-name" style="font-weight: 600; color: #2d3748;">${userData.name}</span>
                    <div class="dropdown-menu" id="dropdownMenuHeader" style="position: absolute; top: 100%; right: 0; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); padding: 10px 0; min-width: 180px; display: none; z-index: 100; margin-top: 10px;">
                        <a href="user-profile.html" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Мой профиль</a>
                        <a href="#" onclick="logout()" style="display: block; padding: 10px 15px; color: #4a5568; text-decoration: none; transition: background 0.3s ease;" onmouseover="this.style.background='#f7fafc'; this.style.color='#667eea'" onmouseout="this.style.background=''; this.style.color='#4a5568'">Выйти</a>
                    </div>
                </div>
            `;
        }
    }
}

// Переключение пользовательского меню в хедере
function toggleUserMenuHeader() {
    const dropdown = document.getElementById('dropdownMenuHeader');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    }
}

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    const userMenus = document.querySelectorAll('.user-menu');
    const dropdownHeader = document.getElementById('dropdownMenuHeader');
    
    let clickedInsideMenu = false;
    userMenus.forEach(menu => {
        if (menu.contains(e.target)) {
            clickedInsideMenu = true;
        }
    });
    
    if (!clickedInsideMenu && dropdownHeader) {
        dropdownHeader.style.display = 'none';
    }
});

// Загрузка текущего пользователя
function loadCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (!userData) {
        // Перенаправляем на страницу авторизации
        showAuthRequiredMessage();
        return;
    }
    
    currentUser = JSON.parse(userData);
    
    // Синхронизируем данные с users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const fullUser = users.find(u => u.id === currentUser.id);
    if (fullUser) {
        currentUser = fullUser;
        localStorage.setItem('currentUser', JSON.stringify(fullUser));
    }
    
    // Проверяем, что пользователь действительно авторизован
    // Упрощенная проверка - если есть id и email, значит авторизован
    if (!currentUser.id || !currentUser.email) {
        showAuthRequiredMessage();
        return;
    }
    
    // Если isGuest явно установлен в true, показываем сообщение
    if (currentUser.isGuest === true) {
        showAuthRequiredMessage();
        return;
    }
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').src = currentUser.avatar;
    
    // Проверяем, есть ли получатель сообщения
    const recipient = localStorage.getItem('messageRecipient');
    if (recipient) {
        const recipientData = JSON.parse(recipient);
        createChatWithRecipient(recipientData);
        localStorage.removeItem('messageRecipient');
    }
}

// Показ сообщения о необходимости авторизации
function showAuthRequiredMessage() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                padding: 60px 40px;
                border-radius: 25px;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                max-width: 500px;
                width: 90%;
            ">
                <div style="font-size: 64px; margin-bottom: 25px;">💬</div>
                <h1 style="font-size: 32px; font-weight: 800; color: #2d3748; margin-bottom: 15px;">
                    Сообщения
                </h1>
                <p style="color: #718096; font-size: 18px; margin-bottom: 35px; line-height: 1.6;">
                    Для доступа к сообщениям необходимо войти в аккаунт или зарегистрироваться
                </p>
                <div style="display: flex; gap: 15px; margin-bottom: 25px;">
                    <button onclick="window.location.href='auth.html?register=true'" 
                            style="flex: 1; padding: 15px 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px; transition: transform 0.3s ease;"
                            onmouseover="this.style.transform='translateY(-2px)'"
                            onmouseout="this.style.transform='translateY(0)'">
                        Регистрация
                    </button>
                    <button onclick="window.location.href='auth.html'" 
                            style="flex: 1; padding: 15px 25px; background: #e2e8f0; color: #4a5568; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; font-size: 16px; transition: all 0.3s ease;"
                            onmouseover="this.style.background='#cbd5e0'"
                            onmouseout="this.style.background='#e2e8f0'">
                        Войти
                    </button>
                </div>
                <p style="color: #a0aec0; font-size: 14px; text-align: center;">
                    <a href="index.html" style="color: #667eea; text-decoration: none; font-weight: 600;">← Вернуться на главную</a>
                </p>
                <p style="color: #a0aec0; font-size: 14px;">
                    Уже есть аккаунт? <a href="auth.html" style="color: #667eea; text-decoration: none; font-weight: 600;">Войти</a>
                </p>
            </div>
        </div>
    `;
}

// Настройка пользовательского меню
function setupUserMenu() {
    const userMenu = document.getElementById('userMenu');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    document.addEventListener('click', function() {
        dropdownMenu.classList.remove('active');
    });
}

// Отрисовка списка чатов
function renderChats() {
    const chatsList = document.getElementById('chatsList');
    
    chatsList.innerHTML = chatsData.map(chat => `
        <div class="chat-item ${currentChatId === chat.id ? 'active' : ''}" onclick="openChat(${chat.id})">
            <div class="chat-item-avatar">
                <img src="${chat.avatar}" alt="${chat.name}">
                ${chat.online ? '<div class="online-indicator"></div>' : ''}
            </div>
            <div class="chat-item-info">
                <div class="chat-item-name">${chat.name}</div>
                <div class="chat-item-message">${chat.lastMessage}</div>
            </div>
            <div class="chat-item-meta">
                <div class="chat-item-time">${chat.time}</div>
                ${chat.unread > 0 ? `<div class="chat-item-badge">${chat.unread}</div>` : ''}
            </div>
        </div>
    `).join('');
}

// Открытие чата
function openChat(chatId) {
    currentChatId = chatId;
    const chat = chatsData.find(c => c.id === chatId);
    
    if (!chat) return;
    
    // Обновляем активный чат в списке
    renderChats();
    
    // Показываем область чата
    document.getElementById('emptyChat').style.display = 'none';
    document.getElementById('activeChat').classList.remove('hidden');
    
    // Заполняем информацию о чате
    document.getElementById('chatAvatar').src = chat.avatar;
    document.getElementById('chatUserName').textContent = chat.name;
    document.getElementById('chatUserStatus').textContent = chat.online ? 'онлайн' : 'был(а) недавно';
    document.getElementById('chatUserStatus').style.color = chat.online ? '#48bb78' : '#a0aec0';
    
    // Отрисовываем сообщения
    renderMessages(chat.messages);
    
    // Помечаем сообщения как прочитанные
    chat.unread = 0;
    chat.messages.forEach(msg => {
        if (!msg.own) msg.read = true;
    });
    
    // Прокручиваем к последнему сообщению (принудительно при открытии чата)
    scrollToBottom(true);
}

// Отрисовка сообщений
function renderMessages(messages) {
    const messagesArea = document.getElementById('messagesArea');
    
    messagesArea.innerHTML = messages.map(message => `
        <div class="message ${message.own ? 'own' : ''}">
            <img src="${message.own ? currentUser.avatar : chatsData.find(c => c.id === currentChatId).avatar}" 
                 alt="Avatar" class="message-avatar">
            <div class="message-content">
                <div class="message-bubble">${message.text}</div>
                <div class="message-time">
                    ${message.time}
                    ${message.own ? `<span class="message-status ${message.read ? 'read' : ''}">${message.read ? '✓✓' : '✓'}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// Прокрутка к последнему сообщению
function scrollToBottom(force = false) {
    const messagesArea = document.getElementById('messagesArea');
    
    // Проверяем, находится ли пользователь уже внизу чата
    const isNearBottom = messagesArea.scrollHeight - messagesArea.scrollTop - messagesArea.clientHeight < 100;
    
    // Прокручиваем только если пользователь уже внизу или это принудительная прокрутка
    if (force || isNearBottom) {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
}

// Отправка сообщения
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const text = messageInput.value.trim();
    
    if (!text || !currentChatId) return;
    
    const chat = chatsData.find(c => c.id === currentChatId);
    if (!chat) return;
    
    // Создаем новое сообщение
    const newMessage = {
        id: Date.now(),
        text: text,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        own: true,
        read: false
    };
    
    // Добавляем сообщение в чат
    chat.messages.push(newMessage);
    chat.lastMessage = text;
    chat.time = newMessage.time;
    
    // Обновляем интерфейс
    renderMessages(chat.messages);
    renderChats();
    messageInput.value = '';
    scrollToBottom(true);
    
    // Имитируем индикатор печати
    setTimeout(() => {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            simulateReply(chat);
        }, 2000);
    }, 1000);
}

// Обработка нажатия Enter в поле ввода
function handleMessageKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Показ индикатора печати
function showTypingIndicator() {
    document.getElementById('typingIndicator').classList.remove('hidden');
    scrollToBottom(); // Не принудительно - только если пользователь внизу
}

// Скрытие индикатора печати
function hideTypingIndicator() {
    document.getElementById('typingIndicator').classList.add('hidden');
}

// Имитация ответа
function simulateReply(chat) {
    const replies = [
        'Понятно, спасибо за информацию!',
        'Хорошо, давайте обсудим детали',
        'Отлично! Жду дальнейших новостей',
        'Согласна, так и сделаем',
        'Спасибо! Очень интересное предложение'
    ];
    
    const replyText = replies[Math.floor(Math.random() * replies.length)];
    
    const replyMessage = {
        id: Date.now(),
        text: replyText,
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        own: false,
        read: false
    };
    
    chat.messages.push(replyMessage);
    chat.lastMessage = replyText;
    chat.time = replyMessage.time;
    chat.unread = (chat.unread || 0) + 1;
    
    renderMessages(chat.messages);
    renderChats();
    scrollToBottom(); // Не принудительно - только если пользователь внизу

    
    // Звуковое уведомление (если разрешено)
    playNotificationSound();
}

// Имитация входящего сообщения
function simulateIncomingMessage() {
    if (Math.random() > 0.7) { // 30% шанс получить сообщение
        const randomChat = chatsData[Math.floor(Math.random() * chatsData.length)];
        const messages = [
            'Привет! Как дела?',
            'Есть новое предложение по работе',
            'Можем встретиться завтра?',
            'Спасибо за вчерашнюю съемку!',
            'Когда будут готовы фотографии?'
        ];
        
        const messageText = messages[Math.floor(Math.random() * messages.length)];
        
        const newMessage = {
            id: Date.now(),
            text: messageText,
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            own: false,
            read: false
        };
        
        randomChat.messages.push(newMessage);
        randomChat.lastMessage = messageText;
        randomChat.time = newMessage.time;
        randomChat.unread = (randomChat.unread || 0) + 1;
        
        renderChats();
        
        if (currentChatId === randomChat.id) {
            renderMessages(randomChat.messages);
            scrollToBottom(); // Не принудительно - только если пользователь внизу
        }
        
        showNotification(`Новое сообщение от ${randomChat.name}: ${messageText}`);
        playNotificationSound();
    }
}

// Поиск чатов
function searchChats() {
    const query = document.getElementById('chatSearch').value.toLowerCase();
    const chatItems = document.querySelectorAll('.chat-item');
    
    chatItems.forEach(item => {
        const name = item.querySelector('.chat-item-name').textContent.toLowerCase();
        const message = item.querySelector('.chat-item-message').textContent.toLowerCase();
        
        if (name.includes(query) || message.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Начать новый чат
function startNewChat() {
    document.getElementById('newChatModal').classList.add('active');
    renderAvailableUsers();
}

// Закрыть модальное окно нового чата
function closeNewChatModal() {
    document.getElementById('newChatModal').classList.remove('active');
}

// Отрисовка доступных пользователей
function renderAvailableUsers() {
    const usersList = document.getElementById('usersList');
    
    usersList.innerHTML = availableUsers.map(user => `
        <div class="user-item" onclick="createNewChat(${user.id})">
            <img src="${user.avatar}" alt="${user.name}" class="user-item-avatar">
            <div class="user-item-info">
                <div class="user-item-name">${user.name}</div>
                <div class="user-item-status">${user.status}</div>
            </div>
            <div class="online-indicator" style="display: ${user.online ? 'block' : 'none'}"></div>
        </div>
    `).join('');
}

// Создание чата с получателем (из профиля модели)
function createChatWithRecipient(recipientData) {
    // Проверяем, есть ли уже чат с этой моделью
    const existingChat = chatsData.find(c => c.name === recipientData.name);
    
    if (existingChat) {
        // Открываем существующий чат
        openChat(existingChat.id);
        return;
    }
    
    // Создаем новый чат с моделью
    const newChat = {
        id: Date.now(),
        name: recipientData.name,
        avatar: recipientData.avatar,
        lastMessage: 'Чат создан',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        online: true,
        messages: [
            {
                id: 1,
                text: `Привет! Меня интересует сотрудничество с вами.`,
                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
                own: true,
                read: false
            }
        ]
    };
    
    // Добавляем чат в начало списка
    chatsData.unshift(newChat);
    renderChats();
    openChat(newChat.id);
    
    // Показываем уведомление
    showNotification(`Чат с ${recipientData.name} создан! 💬`);
    
    // Имитируем быстрый ответ от модели
    setTimeout(() => {
        const welcomeMessage = {
            id: Date.now(),
            text: `Привет! Спасибо за интерес к моей работе. Расскажите подробнее о вашем проекте 😊`,
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            own: false,
            read: false
        };
        
        newChat.messages.push(welcomeMessage);
        newChat.lastMessage = welcomeMessage.text;
        newChat.time = welcomeMessage.time;
        
        if (currentChatId === newChat.id) {
            renderMessages(newChat.messages);
            scrollToBottom(); // Не принудительно - только если пользователь внизу
        }
        
        renderChats();
        playNotificationSound();
    }, 3000);
}

// Поиск пользователей
function searchUsers() {
    const query = document.getElementById('userSearch').value.toLowerCase();
    const userItems = document.querySelectorAll('.user-item');
    
    userItems.forEach(item => {
        const name = item.querySelector('.user-item-name').textContent.toLowerCase();
        const status = item.querySelector('.user-item-status').textContent.toLowerCase();
        
        if (name.includes(query) || status.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Видеозвонок
function makeVideoCall() {
    const chat = chatsData.find(c => c.id === currentChatId);
    showNotification(`Видеозвонок ${chat.name} (функция в разработке) 📹`);
}

// Голосовой звонок
function makeVoiceCall() {
    const chat = chatsData.find(c => c.id === currentChatId);
    showNotification(`Звонок ${chat.name} (функция в разработке) 📞`);
}

// Информация о чате
function showChatInfo() {
    const chat = chatsData.find(c => c.id === currentChatId);
    if (!chat) return;
    
    const chatInfoContent = document.getElementById('chatInfoContent');
    chatInfoContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <img src="${chat.avatar}" alt="${chat.name}" style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 10px;">
            <h3>${chat.name}</h3>
            <p style="color: #718096;">${chat.online ? 'Онлайн' : 'Был(а) недавно'}</p>
        </div>
        <div style="display: grid; gap: 15px;">
            <div style="padding: 15px; background: #f7fafc; border-radius: 10px;">
                <strong>Всего сообщений:</strong> ${chat.messages.length}
            </div>
            <div style="padding: 15px; background: #f7fafc; border-radius: 10px;">
                <strong>Первое сообщение:</strong> ${chat.messages.length > 0 ? chat.messages[0].time : 'Нет сообщений'}
            </div>
            <div style="padding: 15px; background: #f7fafc; border-radius: 10px;">
                <strong>Последняя активность:</strong> ${chat.time}
            </div>
        </div>
    `;
    
    document.getElementById('chatInfoModal').classList.add('active');
}

// Закрыть информацию о чате
function closeChatInfoModal() {
    document.getElementById('chatInfoModal').classList.remove('active');
}

// Прикрепить файл
function attachFile() {
    showNotification('Функция прикрепления файлов в разработке 📎');
}

// Показать эмодзи
function showEmojiPicker() {
    const emojis = ['😊', '😂', '❤️', '👍', '👎', '😍', '😢', '😮', '😡', '🔥', '💯', '👏'];
    const messageInput = document.getElementById('messageInput');
    
    // Простая реализация - добавляем случайный эмодзи
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    messageInput.value += randomEmoji;
    messageInput.focus();
}

// Воспроизведение звука уведомления
function playNotificationSound() {
    // Создаем аудио контекст для звукового уведомления
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
    } catch (e) {
        // Звук не поддерживается
    }
}

// Показ уведомлений
function showNotification(message) {
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
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Выход из аккаунта
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberUser');
    window.location.href = 'auth.html';
}

// Создание нового чата
function createNewChat(userId) {
    const user = availableUsers.find(u => u.id === userId);
    if (!user) return;
    
    // Проверяем, есть ли уже чат с этим пользователем
    const existingChat = chatsData.find(c => c.name === user.name);
    if (existingChat) {
        closeNewChatModal();
        openChat(existingChat.id);
        return;
    }
    
    // Создаем новый чат
    const newChat = {
        id: Date.now(),
        name: user.name,
        avatar: user.avatar,
        lastMessage: 'Чат создан',
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        unread: 0,
        online: user.online,
        messages: []
    };
    
    chatsData.unshift(newChat);
    renderChats();
    closeNewChatModal();
    openChat(newChat.id);
}
