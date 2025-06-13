// DOM Elements
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const heroSlides = document.querySelectorAll('.hero__slide');
const heroDots = document.querySelectorAll('.hero__dot');
const heroNext = document.querySelector('.hero__next');
const heroPrev = document.querySelector('.hero__prev');

// Mobile Menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Event Listeners for Mobile Menu
if (burger) {
    burger.addEventListener('click', toggleMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Close mobile menu when clicking on links
document.querySelectorAll('.mobile-nav__link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

// Close mobile menu when clicking outside
mobileMenu?.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
        closeMobileMenu();
    }
});

// Hero Slider
let currentSlide = 0;
const totalSlides = heroSlides.length;

function showSlide(index) {
    heroSlides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    
    heroDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Hero Slider Event Listeners
if (heroNext) {
    heroNext.addEventListener('click', nextSlide);
}

if (heroPrev) {
    heroPrev.addEventListener('click', prevSlide);
}

heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-play slider
let sliderInterval = setInterval(nextSlide, 5000);

// Pause auto-play on hover
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
        clearInterval(sliderInterval);
    });
    
    heroSection.addEventListener('mouseleave', () => {
        sliderInterval = setInterval(nextSlide, 5000);
    });
}

// Menu Data
const menuData = {
    cold: [
        {
            name: "Ассорти рыбное",
            description: "Семга м/с, масляная рыба, лист салата, зелень, лимон",
            price: "1200 р.",
            weight: "240/45 гр",
            image: "images/menu/fish-assort.jpg"
        },
        {
            name: "Ассорти мясное",
            description: "Язык говяжий, буженина, рулет куриный, черри, маслины, зелень, хрен, горчица дижонская",
            price: "750 р.",
            weight: "150/20/30 гр",
            image: "images/menu/meat-assort.jpg"
        },
        {
            name: "Сырная тарелка",
            description: "Пармезан, маасдам, дорблю, грецкий орех, мед, виноград",
            price: "680 р.",
            weight: "210/55 гр",
            image: "images/menu/cheese-plate.jpg"
        },
        {
            name: "Домашний разносол",
            description: "Капуста квашеная, огурец соленый, черри соленые, черемша и чеснок маринованный",
            price: "450 р.",
            weight: "360 гр",
            image: "images/menu/pickles.jpg"
        }
    ],
    hot: [
        {
            name: "Стейк из свинины",
            description: "Сочный стейк из свиной шеи с гарниром",
            price: "890 р.",
            weight: "250/150 гр",
            image: "images/menu/pork-steak.jpg"
        },
        {
            name: "Куриная грудка гриль",
            description: "Куриная грудка на гриле с овощами",
            price: "650 р.",
            weight: "200/100 гр",
            image: "images/menu/chicken-grill.jpg"
        }
    ],
    pizza: [
        {
            name: "Пицца Маргарита",
            description: "Томатный соус, моцарелла, базилик",
            price: "450 р.",
            weight: "30 см",
            image: "images/menu/pizza-margherita.jpg"
        },
        {
            name: "Пицца Пепперони",
            description: "Томатный соус, моцарелла, пепперони",
            price: "550 р.",
            weight: "30 см",
            image: "images/menu/pizza-pepperoni.jpg"
        }
    ],
    drinks: [
        {
            name: "Кофе американо",
            description: "Классический американо",
            price: "150 р.",
            weight: "200 мл",
            image: "images/menu/americano.jpg"
        },
        {
            name: "Чай черный",
            description: "Черный чай с лимоном",
            price: "120 р.",
            weight: "300 мл",
            image: "images/menu/black-tea.jpg"
        }
    ],
    burgers: [
        {
            name: "Бургер Йорк",
            description: "Котлета куриная, булка белая, бекон копченый, сыр, помидор, лист салата, красный лук, подается с картофелем фри и соусом цезарь",
            price: "470 р.",
            weight: "310/100/50 гр",
            image: "images/menu/burger-york.jpg"
        },
        {
            name: "Альпбургерс",
            description: "Говяжья котлета, булка белая, сыр, огурец соленый, помидор, лук красный, лист салата, подается с картофелем фри и соусом барбекю",
            price: "490 р.",
            weight: "300/100/50 гр",
            image: "images/menu/alpburgers.jpg"
        }
    ]
};

// Menu Functions
function renderMenuItems(category = 'all') {
    const menuContainer = document.getElementById('menuItems');
    if (!menuContainer) return;
    
    let items = [];
    
    if (category === 'all') {
        Object.values(menuData).forEach(categoryItems => {
            items = items.concat(categoryItems);
        });
    } else {
        items = menuData[category] || [];
    }
    
    menuContainer.innerHTML = items.map(item => `
        <div class="menu-item fade-in-up">
            <div class="menu-item__image">
                <img src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="menu-item__content">
                <h3 class="menu-item__name">${item.name}</h3>
                <p class="menu-item__description">${item.description}</p>
                <div class="menu-item__footer">
                    <span class="menu-item__price">${item.price}</span>
                    <span class="menu-item__weight">${item.weight}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Menu Category Switching
document.querySelectorAll('.menu__category').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        document.querySelectorAll('.menu__category').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Render items for selected category
        const category = button.dataset.category;
        renderMenuItems(category);
    });
});

// Events Data
const eventsData = {
    current: [
        {
            title: "Скидка 20% на банкеты",
            description: "При заказе банкета на выходные дни",
            image: "images/events/banquet-discount.jpg",
            date: "До 31 декабря"
        },
        {
            title: "Счастливые часы",
            description: "Скидка 15% на все напитки с 15:00 до 18:00",
            image: "images/events/happy-hours.jpg",
            date: "Ежедневно"
        }
    ],
    upcoming: [
        {
            title: "Новогодняя вечеринка",
            description: "Встречаем Новый год вместе!",
            image: "images/events/new-year.jpg",
            date: "31 декабря"
        },
        {
            title: "Караоке-батл",
            description: "Соревнование между командами",
            image: "images/events/karaoke-battle.jpg",
            date: "15 января"
        }
    ]
};

// Events Functions
function renderEvents(category = 'current') {
    const eventsContainer = document.querySelector(`#${category} .events__grid`);
    if (!eventsContainer) return;
    
    const events = eventsData[category] || [];
    
    eventsContainer.innerHTML = events.map(event => `
        <div class="event-card fade-in-up">
            <div class="event-card__image">
                <img src="${event.image}" alt="${event.title}" loading="lazy" onerror="this.src='images/placeholder.jpg'">
            </div>
            <div class="event-card__content">
                <h3 class="event-card__title">${event.title}</h3>
                <p class="event-card__description">${event.description}</p>
                <div class="event-card__date">${event.date}</div>
            </div>
        </div>
    `).join('');
}

// Events Tab Switching
document.querySelectorAll('.events__tab').forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons and content
        document.querySelectorAll('.events__tab').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.events__tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        const tabId = button.dataset.tab;
        document.getElementById(tabId).classList.add('active');
        
        // Render events for selected tab
        renderEvents(tabId);
    });
});

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function openBookingModal() {
    openModal('bookingModal');
}

function openMenuModal() {
    // This would open a full menu modal
    alert('Полное меню будет доступно в ближайшее время');
}

function openDeliveryModal() {
    // This would open a delivery modal
    alert('Заказ доставки будет доступен в ближайшее время');
}

// Modal Event Listeners
document.querySelectorAll('.modal__close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Booking Form Handling
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = bookingForm.querySelector('input[type="text"]').value.trim();
        const phone = bookingForm.querySelector('input[type="tel"]').value.trim();
        const hall = bookingForm.querySelector('select').value;
        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Валидация
        if (!name || !phone || !hall) {
            showFormMessage(bookingForm, 'Пожалуйста, заполните все поля', false);
            return;
        }
        if (!/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(phone)) {
            showFormMessage(bookingForm, 'Введите корректный номер телефона', false);
            return;
        }

        // Блокируем кнопку
        submitBtn.innerHTML = '<span class="loading"></span> Отправка...';
        submitBtn.disabled = true;

        // Отправка данных
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, hall })
            });
            const result = await response.json();
            if (result.status === 'success') {
                showFormMessage(bookingForm, 'Спасибо! Ваша заявка отправлена.', true);
                bookingForm.reset();
            } else {
                showFormMessage(bookingForm, result.message || 'Ошибка отправки', false);
            }
        } catch (err) {
            showFormMessage(bookingForm, 'Ошибка соединения с сервером', false);
        }
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
}

function showFormMessage(form, message, success = true) {
    let msg = form.querySelector('.form-message');
    if (!msg) {
        msg = document.createElement('div');
        msg.className = 'form-message';
        form.appendChild(msg);
    }
    msg.textContent = message;
    msg.style.color = success ? 'green' : 'red';
    msg.style.marginTop = '10px';
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for Animations
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
});

// Observe elements for animation
document.querySelectorAll('.hall-card, .menu-item, .event-card').forEach(el => {
    observer.observe(el);
});

// Sticky header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Initialize Map (placeholder)
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <p>Карта будет загружена</p>
                <p><strong>Адрес:</strong> Саратов, Днепропетровская, 2/33</p>
                <p>(пересечение с ул. Антонова)</p>
            </div>
        `;
    }
}

// Phone Number Formatting
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }
        if (value.startsWith('7')) {
            value = value.slice(0, 11);
            const formatted = value.replace(/(\d)(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5');
            e.target.value = formatted;
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    renderMenuItems();
    renderEvents('current');
    renderEvents('upcoming');
    initMap();
    
    // Add CSS for menu and event items
    const style = document.createElement('style');
    style.textContent = `
        .menu-item {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .menu-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .menu-item__image {
            width: 100%;
            height: 200px;
            overflow: hidden;
        }
        
        .menu-item__image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .menu-item:hover .menu-item__image img {
            transform: scale(1.05);
        }
        
        .menu-item__content {
            padding: 25px;
        }
        
        .menu-item__name {
            color: #333;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .menu-item__description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 0.9rem;
        }
        
        .menu-item__footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .menu-item__price {
            color: #ff6b35;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .menu-item__weight {
            color: #999;
            font-size: 0.9rem;
        }
        
        .event-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .event-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }
        
        .event-card__image {
            width: 100%;
            height: 200px;
            overflow: hidden;
        }
        
        .event-card__image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
        }
        
        .event-card:hover .event-card__image img {
            transform: scale(1.05);
        }
        
        .event-card__content {
            padding: 25px;
        }
        
        .event-card__title {
            color: #333;
            margin-bottom: 10px;
            font-size: 1.2rem;
        }
        
        .event-card__description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
        }
        
        .event-card__date {
            color: #ff6b35;
            font-weight: 600;
            font-size: 0.9rem;
        }
    `;
    document.head.appendChild(style);
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Close modals with Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Close mobile menu
        if (mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }
    
    // Navigate slider with arrow keys
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Performance Optimization: Lazy Loading Images
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        }
    });
});

// Apply lazy loading to images
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Error Handling for Images
document.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'images/placeholder.jpg';
    }
}, true);

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}