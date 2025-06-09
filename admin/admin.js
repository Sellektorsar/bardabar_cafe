// Admin credentials (in production, this should be handled server-side)
const ADMIN_CREDENTIALS = {
    'admin': 'bardabar2024',
    'manager': 'manager123'
};

// Current user
let currentUser = null;

// Data storage (in production, this would be a database)
let adminData = {
    about: {
        title: "О нас",
        content: `В Вашем распоряжении имеется три зала: семейное кафе с детской площадкой, спорт-бар с ночной дискотекой и пивной ресторан-банкетный зал. К Вашим услугам европейская кухня, пиццерия.

Каждый месяц стартует новая акция!

У каждого посетителя развлекательного центра «Бар-да-бар» есть возможность получить дисконтную карту. Мы постоянно что-то меняем и обновляем для вашего удобства и комфорта!

Приятного Вам отдыха!

Развлекательный Центр «Бар-да-бар» находится на пересечении улиц А.Антонова и Перспективной с удобной парковкой.`
    },
    menu: {
        cold: [
            {
                id: 1,
                name: "Ассорти рыбное",
                description: "Семга м/с, масляная рыба, лист салата, зелень, лимон",
                price: "1200 р.",
                weight: "240/45 гр",
                image: "images/menu/fish-assort.jpg"
            },
            {
                id: 2,
                name: "Ассорти мясное",
                description: "Язык говяжий, буженина, рулет куриный, черри, маслины, зелень, хрен, горчица дижонская",
                price: "750 р.",
                weight: "150/20/30 гр",
                image: "images/menu/meat-assort.jpg"
            }
        ],
        hot: [
            {
                id: 3,
                name: "Стейк из свинины",
                description: "Сочный стейк из свиной шеи с гарниром",
                price: "890 р.",
                weight: "250/150 гр",
                image: "images/menu/pork-steak.jpg"
            }
        ],
        pizza: [
            {
                id: 4,
                name: "Пицца Маргарита",
                description: "Томатный соус, моцарелла, базилик",
                price: "450 р.",
                weight: "30 см",
                image: "images/menu/pizza-margherita.jpg"
            }
        ],
        drinks: [
            {
                id: 5,
                name: "Кофе американо",
                description: "Классический американо",
                price: "150 р.",
                weight: "200 мл",
                image: "images/menu/americano.jpg"
            }
        ],
        burgers: [
            {
                id: 6,
                name: "Бургер Йорк",
                description: "Котлета куриная, булка белая, бекон копченый, сыр, помидор, лист салата, красный лук",
                price: "470 р.",
                weight: "310/100/50 гр",
                image: "images/menu/burger-york.jpg"
            }
        ]
    },
    staff: [
        {
            id: 1,
            name: "Анна Петрова",
            position: "Шеф-повар",
            description: "Опытный шеф-повар с 10-летним стажем",
            photo: "images/staff/chef.jpg"
        },
        {
            id: 2,
            name: "Михаил Сидоров",
            position: "Администратор",
            description: "Ответственный за организацию мероприятий",
            photo: "images/staff/admin.jpg"
        }
    ],
    events: {
        current: [
            {
                id: 1,
                title: "Скидка 20% на банкеты",
                description: "При заказе банкета на выходные дни",
                date: "До 31 декабря",
                image: "images/events/banquet-discount.jpg"
            }
        ],
        upcoming: [
            {
                id: 2,
                title: "Новогодняя вечеринка",
                description: "Встречаем Новый год вместе!",
                date: "31 декабря",
                image: "images/events/new-year.jpg"
            }
        ]
    },
    bookings: [
        {
            id: 1,
            date: "2024-06-15",
            time: "19:00",
            name: "Иван Иванов",
            phone: "+7 (912) 345-67-89",
            hall: "banquet",
            guests: 25,
            status: "pending"
        },
        {
            id: 2,
            date: "2024-06-16",
            time: "20:00",
            name: "Мария Петрова",
            phone: "+7 (923) 456-78-90",
            hall: "family",
            guests: 8,
            status: "confirmed"
        }
    ],
    settings: {
        phone1: "+7 (8452) 35-25-25",
        phone2: "+7 (8452) 24-40-68",
        email: "bardabar.sar@mail.ru",
        address: "Саратов, Днепропетровская, 2/33",
        workingHours: "Воскресенье - четверг: 13:00 - 23:00\nПятница - суббота: 12:00 - 04:00",
        vkLink: "",
        instagramLink: "",
        telegramLink: ""
    }
};

// Current editing item
let currentEditingItem = null;
let currentMenuCategory = 'cold';
let currentEventsTab = 'current';

// DOM Elements will be accessed when needed

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing admin panel...');
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('adminUser');
    if (savedUser) {
        currentUser = savedUser;
        showDashboard();
    }
    
    // Load saved data
    const savedData = localStorage.getItem('adminData');
    if (savedData) {
        adminData = { ...adminData, ...JSON.parse(savedData) };
    }
    
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
        console.log('Login form event listener added');
    }
    
    // Navigation
    document.querySelectorAll('.admin-nav__link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
            
            // Update active nav item
            document.querySelectorAll('.admin-nav__link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Menu category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentMenuCategory = btn.dataset.category;
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderMenuItems();
        });
    });
    
    // Events tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentEventsTab = btn.dataset.tab;
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderEvents();
        });
    });
    
    // Forms
    document.getElementById('menuItemForm').addEventListener('submit', handleMenuItemSave);
    document.getElementById('staffForm').addEventListener('submit', handleStaffSave);
    
    // Booking filter
    document.getElementById('bookingFilter').addEventListener('change', renderBookings);
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('Username:', username, 'Password:', password);
    console.log('Checking credentials...');
    
    if (ADMIN_CREDENTIALS[username] === password) {
        console.log('Login successful');
        currentUser = username;
        localStorage.setItem('adminUser', username);
        showDashboard();
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    } else {
        console.log('Login failed');
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = 'Неверный логин или пароль';
        }
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('adminUser');
    loginContainer.style.display = 'flex';
    adminDashboard.style.display = 'none';
    
    // Reset form
    loginForm.reset();
    errorMessage.textContent = '';
}

function showDashboard() {
    console.log('Showing dashboard...');
    const loginContainer = document.getElementById('loginContainer');
    const adminDashboard = document.getElementById('adminDashboard');
    
    if (loginContainer) {
        loginContainer.style.display = 'none';
    }
    if (adminDashboard) {
        adminDashboard.style.display = 'grid';
    }
    
    // Load initial data
    loadAboutSection();
    renderMenuItems();
    renderStaff();
    renderEvents();
    renderBookings();
    loadSettings();
}

// Section Navigation
function showSection(sectionName) {
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionName).classList.add('active');
}

// About Section
function loadAboutSection() {
    document.getElementById('aboutTitle').value = adminData.about.title;
    document.getElementById('aboutContent').value = adminData.about.content;
}

function saveAbout() {
    adminData.about.title = document.getElementById('aboutTitle').value;
    adminData.about.content = document.getElementById('aboutContent').value;
    
    saveData();
    showMessage('Раздел "О нас" сохранен', 'success');
}

// Menu Management
function renderMenuItems() {
    const container = document.getElementById('menuItemsList');
    const items = adminData.menu[currentMenuCategory] || [];
    
    container.innerHTML = items.map(item => `
        <div class="menu-item-card slide-in">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <p><strong>Цена:</strong> ${item.price}</p>
            <p><strong>Вес:</strong> ${item.weight}</p>
            <div class="menu-item-actions">
                <button class="btn-edit" onclick="editMenuItem(${item.id})">Редактировать</button>
                <button class="btn-delete" onclick="deleteMenuItem(${item.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function addMenuItem() {
    currentEditingItem = null;
    document.getElementById('menuItemForm').reset();
    document.getElementById('itemCategory').value = currentMenuCategory;
    openModal('menuItemModal');
}

function editMenuItem(id) {
    const item = findMenuItemById(id);
    if (item) {
        currentEditingItem = item;
        document.getElementById('itemName').value = item.name;
        document.getElementById('itemDescription').value = item.description;
        document.getElementById('itemPrice').value = item.price;
        document.getElementById('itemWeight').value = item.weight;
        document.getElementById('itemCategory').value = currentMenuCategory;
        openModal('menuItemModal');
    }
}

function deleteMenuItem(id) {
    if (confirm('Вы уверены, что хотите удалить это блюдо?')) {
        adminData.menu[currentMenuCategory] = adminData.menu[currentMenuCategory].filter(item => item.id !== id);
        renderMenuItems();
        saveData();
        showMessage('Блюдо удалено', 'success');
    }
}

function handleMenuItemSave(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const itemData = {
        name: formData.get('itemName') || document.getElementById('itemName').value,
        description: formData.get('itemDescription') || document.getElementById('itemDescription').value,
        price: formData.get('itemPrice') || document.getElementById('itemPrice').value,
        weight: formData.get('itemWeight') || document.getElementById('itemWeight').value,
        category: formData.get('itemCategory') || document.getElementById('itemCategory').value,
        image: "images/menu/placeholder.jpg" // In production, handle file upload
    };
    
    if (currentEditingItem) {
        // Update existing item
        Object.assign(currentEditingItem, itemData);
    } else {
        // Add new item
        itemData.id = Date.now();
        if (!adminData.menu[itemData.category]) {
            adminData.menu[itemData.category] = [];
        }
        adminData.menu[itemData.category].push(itemData);
    }
    
    renderMenuItems();
    closeModal('menuItemModal');
    saveData();
    showMessage('Блюдо сохранено', 'success');
}

function findMenuItemById(id) {
    for (const category in adminData.menu) {
        const item = adminData.menu[category].find(item => item.id === id);
        if (item) return item;
    }
    return null;
}

// Staff Management
function renderStaff() {
    const container = document.getElementById('staffGrid');
    
    container.innerHTML = adminData.staff.map(member => `
        <div class="staff-card slide-in">
            <img src="${member.photo}" alt="${member.name}" class="staff-photo" onerror="this.src='images/placeholder-person.jpg'">
            <h4>${member.name}</h4>
            <div class="staff-position">${member.position}</div>
            <div class="staff-description">${member.description}</div>
            <div class="menu-item-actions">
                <button class="btn-edit" onclick="editStaffMember(${member.id})">Редактировать</button>
                <button class="btn-delete" onclick="deleteStaffMember(${member.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

function addStaffMember() {
    currentEditingItem = null;
    document.getElementById('staffForm').reset();
    openModal('staffModal');
}

function editStaffMember(id) {
    const member = adminData.staff.find(m => m.id === id);
    if (member) {
        currentEditingItem = member;
        document.getElementById('staffName').value = member.name;
        document.getElementById('staffPosition').value = member.position;
        document.getElementById('staffDescription').value = member.description;
        openModal('staffModal');
    }
}

function deleteStaffMember(id) {
    if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
        adminData.staff = adminData.staff.filter(member => member.id !== id);
        renderStaff();
        saveData();
        showMessage('Сотрудник удален', 'success');
    }
}

function handleStaffSave(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const staffData = {
        name: formData.get('staffName') || document.getElementById('staffName').value,
        position: formData.get('staffPosition') || document.getElementById('staffPosition').value,
        description: formData.get('staffDescription') || document.getElementById('staffDescription').value,
        photo: "images/staff/placeholder.jpg" // In production, handle file upload
    };
    
    if (currentEditingItem) {
        // Update existing member
        Object.assign(currentEditingItem, staffData);
    } else {
        // Add new member
        staffData.id = Date.now();
        adminData.staff.push(staffData);
    }
    
    renderStaff();
    closeModal('staffModal');
    saveData();
    showMessage('Сотрудник сохранен', 'success');
}

// Events Management
function renderEvents() {
    const container = document.getElementById('eventsContent');
    const events = adminData.events[currentEventsTab] || [];
    
    container.innerHTML = `
        <div class="events-grid">
            ${events.map(event => `
                <div class="event-card slide-in">
                    <h4>${event.title}</h4>
                    <div class="event-description">${event.description}</div>
                    <div class="event-date">${event.date}</div>
                    <div class="menu-item-actions">
                        <button class="btn-edit" onclick="editEvent(${event.id})">Редактировать</button>
                        <button class="btn-delete" onclick="deleteEvent(${event.id})">Удалить</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function addEvent() {
    // In a full implementation, this would open an event modal
    const title = prompt('Название события:');
    const description = prompt('Описание:');
    const date = prompt('Дата:');
    
    if (title && description && date) {
        const newEvent = {
            id: Date.now(),
            title,
            description,
            date,
            image: "images/events/placeholder.jpg"
        };
        
        adminData.events[currentEventsTab].push(newEvent);
        renderEvents();
        saveData();
        showMessage('Событие добавлено', 'success');
    }
}

function editEvent(id) {
    const event = adminData.events[currentEventsTab].find(e => e.id === id);
    if (event) {
        const title = prompt('Название события:', event.title);
        const description = prompt('Описание:', event.description);
        const date = prompt('Дата:', event.date);
        
        if (title && description && date) {
            event.title = title;
            event.description = description;
            event.date = date;
            
            renderEvents();
            saveData();
            showMessage('Событие обновлено', 'success');
        }
    }
}

function deleteEvent(id) {
    if (confirm('Вы уверены, что хотите удалить это событие?')) {
        adminData.events[currentEventsTab] = adminData.events[currentEventsTab].filter(event => event.id !== id);
        renderEvents();
        saveData();
        showMessage('Событие удалено', 'success');
    }
}

// Bookings Management
function renderBookings() {
    const container = document.getElementById('bookingsTableBody');
    const filter = document.getElementById('bookingFilter').value;
    
    let bookings = adminData.bookings;
    if (filter !== 'all') {
        bookings = bookings.filter(booking => booking.status === filter);
    }
    
    container.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>${booking.name}</td>
            <td>${booking.phone}</td>
            <td>${getHallName(booking.hall)}</td>
            <td>${booking.guests}</td>
            <td><span class="booking-status status-${booking.status}">${getStatusName(booking.status)}</span></td>
            <td>
                <div class="booking-actions">
                    <button class="btn-edit" onclick="updateBookingStatus(${booking.id}, 'confirmed')">Подтвердить</button>
                    <button class="btn-delete" onclick="updateBookingStatus(${booking.id}, 'cancelled')">Отменить</button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getHallName(hall) {
    const halls = {
        'banquet': 'Банкетный зал',
        'family': 'Семейное кафе',
        'sport': 'Спорт-бар',
        'vip': 'VIP-зал'
    };
    return halls[hall] || hall;
}

function getStatusName(status) {
    const statuses = {
        'pending': 'Ожидает',
        'confirmed': 'Подтвержден',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}

function updateBookingStatus(id, status) {
    const booking = adminData.bookings.find(b => b.id === id);
    if (booking) {
        booking.status = status;
        renderBookings();
        saveData();
        showMessage(`Бронирование ${getStatusName(status).toLowerCase()}`, 'success');
    }
}

// Settings Management
function loadSettings() {
    document.getElementById('phone1').value = adminData.settings.phone1;
    document.getElementById('phone2').value = adminData.settings.phone2;
    document.getElementById('email').value = adminData.settings.email;
    document.getElementById('address').value = adminData.settings.address;
    document.getElementById('workingHours').value = adminData.settings.workingHours;
    document.getElementById('vkLink').value = adminData.settings.vkLink;
    document.getElementById('instagramLink').value = adminData.settings.instagramLink;
    document.getElementById('telegramLink').value = adminData.settings.telegramLink;
}

function saveSettings() {
    adminData.settings = {
        phone1: document.getElementById('phone1').value,
        phone2: document.getElementById('phone2').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        workingHours: document.getElementById('workingHours').value,
        vkLink: document.getElementById('vkLink').value,
        instagramLink: document.getElementById('instagramLink').value,
        telegramLink: document.getElementById('telegramLink').value
    };
    
    saveData();
    showMessage('Настройки сохранены', 'success');
}

// Modal Functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = '';
}

// Utility Functions
function saveData() {
    localStorage.setItem('adminData', JSON.stringify(adminData));
}

function showMessage(text, type = 'success') {
    // Remove existing messages
    document.querySelectorAll('.message').forEach(msg => msg.remove());
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    
    const activeSection = document.querySelector('.admin-section.active');
    if (activeSection) {
        activeSection.insertBefore(message, activeSection.firstChild);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
}

// File Upload Handling (placeholder)
function handleFileUpload(input, callback) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            callback(e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

// Export/Import Data (for backup)
function exportData() {
    const dataStr = JSON.stringify(adminData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bardabar-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                adminData = { ...adminData, ...importedData };
                saveData();
                
                // Refresh all sections
                loadAboutSection();
                renderMenuItems();
                renderStaff();
                renderEvents();
                renderBookings();
                loadSettings();
                
                showMessage('Данные импортированы успешно', 'success');
            } catch (error) {
                showMessage('Ошибка при импорте данных', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save current section
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        const activeSection = document.querySelector('.admin-section.active');
        if (activeSection) {
            const sectionId = activeSection.id;
            switch (sectionId) {
                case 'about':
                    saveAbout();
                    break;
                case 'settings':
                    saveSettings();
                    break;
            }
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// Auto-save functionality
let autoSaveTimeout;
function scheduleAutoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        saveData();
        console.log('Auto-saved data');
    }, 30000); // Auto-save every 30 seconds
}

// Monitor form changes for auto-save
document.addEventListener('input', (e) => {
    if (e.target.matches('input, textarea, select')) {
        scheduleAutoSave();
    }
});

// Initialize auto-save
scheduleAutoSave();