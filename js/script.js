<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Админ-панель - Бар-да-бар</title>
    <link rel="stylesheet" href="admin.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Login Form -->
    <div class="login-container" id="loginContainer">
        <div class="login-form">
            <div class="login-header">
                <h1>Админ-панель</h1>
                <p>Бар-да-бар</p>
            </div>
            
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Логин</label>
                    <input type="text" id="username" name="username" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Пароль</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <button type="submit" class="btn-primary">Войти</button>
                
                <div class="error-message" id="errorMessage"></div>
            </form>
        </div>
    </div>

    <!-- Admin Dashboard -->
    <div class="admin-dashboard" id="adminDashboard" style="display: none;">
        <!-- Header -->
        <header class="admin-header">
            <div class="admin-header__content">
                <h1>Панель управления</h1>
                <div class="admin-header__actions">
                    <span class="admin-user">Администратор</span>
                    <button class="btn-logout" onclick="logout()">Выйти</button>
                </div>
            </div>
        </header>

        <!-- Sidebar -->
        <aside class="admin-sidebar">
            <nav class="admin-nav">
                <ul class="admin-nav__list">
                    <li class="admin-nav__item">
                        <a href="#about" class="admin-nav__link active" data-section="about">
                            <span class="nav-icon">📝</span>
                            О нас
                        </a>
                    </li>
                    <li class="admin-nav__item">
                        <a href="#menu" class="admin-nav__link" data-section="menu">
                            <span class="nav-icon">🍽️</span>
                            Меню
                        </a>
                    </li>
                    <li class="admin-nav__item">
                        <a href="#staff" class="admin-nav__link" data-section="staff">
                            <span class="nav-icon">👥</span>
                            Персонал
                        </a>
                    </li>
                    <li class="admin-nav__item">
                        <a href="#events" class="admin-nav__link" data-section="events">
                            <span class="nav-icon">🎉</span>
                            События
                        </a>
                    </li>
                    <li class="admin-nav__item">
                        <a href="#bookings" class="admin-nav__link" data-section="bookings">
                            <span class="nav-icon">📅</span>
                            Бронирования
                        </a>
                    </li>
                    <li class="admin-nav__item">
                        <a href="#settings" class="admin-nav__link" data-section="settings">
                            <span class="nav-icon">⚙️</span>
                            Настройки
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="admin-main">
            <!-- About Section -->
            <section class="admin-section active" id="about">
                <div class="section-header">
                    <h2>Редактирование раздела "О нас"</h2>
                    <button class="btn-primary" onclick="saveAbout()">Сохранить</button>
                </div>
                
                <div class="form-container">
                    <div class="form-group">
                        <label for="aboutTitle">Заголовок</label>
                        <input type="text" id="aboutTitle" value="О нас">
                    </div>
                    
                    <div class="form-group">
                        <label for="aboutContent">Содержание</label>
                        <textarea id="aboutContent" rows="10">В Вашем распоряжении имеется три зала: семейное кафе с детской площадкой, спорт-бар с ночной дискотекой и пивной ресторан-банкетный зал. К Вашим услугам европейская кухня, пиццерия.

Каждый месяц стартует новая акция!

У каждого посетителя развлекательного центра «Бар-да-бар» есть возможность получить дисконтную карту. Мы постоянно что-то меняем и обновляем для вашего удобства и комфорта!

Приятного Вам отдыха!

Развлекательный Центр «Бар-да-бар» находится на пересечении улиц А.Антонова и Перспективной с удобной парковкой.</textarea>
                    </div>
                </div>
            </section>

            <!-- Menu Section -->
            <section class="admin-section" id="menu">
                <div class="section-header">
                    <h2>Управление меню</h2>
                    <button class="btn-primary" onclick="addMenuItem()">Добавить блюдо</button>
                </div>
                
                <div class="menu-categories">
                    <button class="category-btn active" data-category="cold">Холодные закуски</button>
                    <button class="category-btn" data-category="hot">Горячие блюда</button>
                    <button class="category-btn" data-category="pizza">Пицца</button>
                    <button class="category-btn" data-category="drinks">Напитки</button>
                    <button class="category-btn" data-category="burgers">Бургеры</button>
                </div>
                
                <div class="menu-items" id="menuItemsList">
                    <!-- Menu items will be loaded here -->
                </div>
            </section>

            <!-- Staff Section -->
            <section class="admin-section" id="staff">
                <div class="section-header">
                    <h2>Управление персоналом</h2>
                    <button class="btn-primary" onclick="addStaffMember()">Добавить сотрудника</button>
                </div>
                
                <div class="staff-grid" id="staffGrid">
                    <!-- Staff members will be loaded here -->
                </div>
            </section>

            <!-- Events Section -->
            <section class="admin-section" id="events">
                <div class="section-header">
                    <h2>Управление событиями</h2>
                    <button class="btn-primary" onclick="addEvent()">Добавить событие</button>
                </div>
                
                <div class="events-tabs">
                    <button class="tab-btn active" data-tab="current">Текущие акции</button>
                    <button class="tab-btn" data-tab="upcoming">Афиша</button>
                </div>
                
                <div class="events-content" id="eventsContent">
                    <!-- Events will be loaded here -->
                </div>
            </section>

            <!-- Bookings Section -->
            <section class="admin-section" id="bookings">
                <div class="section-header">
                    <h2>Бронирования</h2>
                    <div class="booking-filters">
                        <select id="bookingFilter">
                            <option value="all">Все</option>
                            <option value="pending">Ожидают</option>
                            <option value="confirmed">Подтверждены</option>
                            <option value="cancelled">Отменены</option>
                        </select>
                    </div>
                </div>
                
                <div class="bookings-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Время</th>
                                <th>Имя</th>
                                <th>Телефон</th>
                                <th>Зал</th>
                                <th>Гости</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody id="bookingsTableBody">
                            <!-- Bookings will be loaded here -->
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Settings Section -->
            <section class="admin-section" id="settings">
                <div class="section-header">
                    <h2>Настройки</h2>
                    <button class="btn-primary" onclick="saveSettings()">Сохранить</button>
                </div>
                
                <div class="settings-grid">
                    <div class="settings-group">
                        <h3>Контактная информация</h3>
                        <div class="form-group">
                            <label for="phone1">Телефон 1</label>
                            <input type="tel" id="phone1" value="+7 (8452) 35-25-25">
                        </div>
                        <div class="form-group">
                            <label for="phone2">Телефон 2</label>
                            <input type="tel" id="phone2" value="+7 (8452) 24-40-68">
                        </div>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" value="bardabar.sar@mail.ru">
                        </div>
                        <div class="form-group">
                            <label for="address">Адрес</label>
                            <input type="text" id="address" value="Саратов, Днепропетровская, 2/33">
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Режим работы</h3>
                        <div class="form-group">
                            <label for="workingHours">Общий режим работы</label>
                            <textarea id="workingHours" rows="5">Воскресенье - четверг: 13:00 - 23:00
Пятница - суббота: 12:00 - 04:00</textarea>
                        </div>
                    </div>
                    
                    <div class="settings-group">
                        <h3>Социальные сети</h3>
                        <div class="form-group">
                            <label for="vkLink">ВКонтакте</label>
                            <input type="url" id="vkLink" placeholder="https://vk.com/...">
                        </div>
                        <div class="form-group">
                            <label for="instagramLink">Instagram</label>
                            <input type="url" id="instagramLink" placeholder="https://instagram.com/...">
                        </div>
                        <div class="form-group">
                            <label for="telegramLink">Telegram</label>
                            <input type="url" id="telegramLink" placeholder="https://t.me/...">
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- Modals -->
    <div class="modal" id="menuItemModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Редактирование блюда</h3>
                <button class="modal-close" onclick="closeModal('menuItemModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="menuItemForm">
                    <div class="form-group">
                        <label for="itemName">Название</label>
                        <input type="text" id="itemName" required>
                    </div>
                    <div class="form-group">
                        <label for="itemDescription">Описание</label>
                        <textarea id="itemDescription" rows="3" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="itemPrice">Цена</label>
                        <input type="text" id="itemPrice" required>
                    </div>
                    <div class="form-group">
                        <label for="itemWeight">Вес/Объем</label>
                        <input type="text" id="itemWeight" required>
                    </div>
                    <div class="form-group">
                        <label for="itemCategory">Категория</label>
                        <select id="itemCategory" required>
                            <option value="cold">Холодные закуски</option>
                            <option value="hot">Горячие блюда</option>
                            <option value="pizza">Пицца</option>
                            <option value="drinks">Напитки</option>
                            <option value="burgers">Бургеры</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="itemImage">Изображение</label>
                        <input type="file" id="itemImage" accept="image/*">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('menuItemModal')">Отмена</button>
                        <button type="submit" class="btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <div class="modal" id="staffModal">
        <div class="modal-content">
            <div class="modal-header">
                <h3>Редактирование сотрудника</h3>
                <button class="modal-close" onclick="closeModal('staffModal')">&times;</button>
            </div>
            <div class="modal-body">
                <form id="staffForm">
                    <div class="form-group">
                        <label for="staffName">Имя</label>
                        <input type="text" id="staffName" required>
                    </div>
                    <div class="form-group">
                        <label for="staffPosition">Должность</label>
                        <input type="text" id="staffPosition" required>
                    </div>
                    <div class="form-group">
                        <label for="staffDescription">Описание</label>
                        <textarea id="staffDescription" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="staffPhoto">Фото</label>
                        <input type="file" id="staffPhoto" accept="image/*">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn-secondary" onclick="closeModal('staffModal')">Отмена</button>
                        <button type="submit" class="btn-primary">Сохранить</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="admin.js"></script>
</body>
</html>