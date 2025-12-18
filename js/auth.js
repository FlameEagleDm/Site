let currentUser = null;
let profileDropdownOpen = false;

function checkAuth() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateProfileButton();
    }
}

function updateProfileButton() {
    if (currentUser) {
        $('#profile-btn').html(`
            <div class="profile-icon"></div>
            ${currentUser.name}
        `);
        
        $('#profile-dropdown').html(`
            <a href="#" class="profile-dropdown-item" id="profile-info">Мой профиль</a>
            ${currentUser.role === 'moderator' ? '<a href="#" class="profile-dropdown-item" id="add-product-link">Добавить новый товар</a>' : ''}
            <a href="#" class="profile-dropdown-item" id="logout-link">Выйти</a>
        `);
    } else {
        $('#profile-btn').html(`
            <div class="profile-icon"></div>
            Профиль
        `);
        
        $('#profile-dropdown').html(`
            <a href="#" class="profile-dropdown-item" id="login-link">Войти</a>
            <a href="#" class="profile-dropdown-item" id="register-link">Зарегистрироваться</a>
        `);
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateField($input, errorMsg) {
    const $formGroup = $input.closest('.form-group');
    const $errorSpan = $formGroup.find('.error-message');
    
    if (errorMsg) {
        $input.addClass('error').removeClass('success');
        $errorSpan.text(errorMsg).show();
        return false;
    } else {
        $input.removeClass('error').addClass('success');
        $errorSpan.hide();
        return true;
    }
}

function clearValidation($input) {
    $input.removeClass('error success');
    $input.closest('.form-group').find('.error-message').hide();
}

$(document).ready(function() {
    checkAuth();

    // Открытие/закрытие выпадающего меню профиля
    $(document).on('click', '#profile-btn', function(e) {
        e.stopPropagation();
        profileDropdownOpen = !profileDropdownOpen;
        $('#profile-dropdown').toggleClass('show');
    });

    // Закрытие выпадающего меню при клике вне его
    $(document).on('click', function(e) {
        if (profileDropdownOpen && !$(e.target).closest('#profile-dropdown').length && !$(e.target).closest('#profile-btn').length) {
            $('#profile-dropdown').removeClass('show');
            profileDropdownOpen = false;
        }
    });

    // Открытие модального окна входа
    $(document).on('click', '#login-link', function(e) {
        e.preventDefault();
        $('#profile-dropdown').removeClass('show');
        profileDropdownOpen = false;
        openModal('login-modal');
    });

    // Открытие модального окна регистрации
    $(document).on('click', '#register-link', function(e) {
        e.preventDefault();
        $('#profile-dropdown').removeClass('show');
        profileDropdownOpen = false;
        openModal('register-modal');
    });

    // Открытие модального окна добавления товара
    $(document).on('click', '#add-product-link', function(e) {
        e.preventDefault();
        $('#profile-dropdown').removeClass('show');
        profileDropdownOpen = false;
        openModal('add-product-modal');
    });

    // Выход из профиля
    $(document).on('click', '#logout-link', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        currentUser = null;
        updateProfileButton();
        $('#profile-dropdown').removeClass('show');
        profileDropdownOpen = false;
        alert('Вы вышли из профиля');
    });

    // Валидация формы входа
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const email = $('#login-email').val().trim();
        const password = $('#login-password').val();

        // Проверка email
        if (!email) {
            validateField($('#login-email'), 'Введите email');
            isValid = false;
        } else if (!validateEmail(email)) {
            validateField($('#login-email'), 'Неверный формат email (должны быть @ и .)');
            isValid = false;
        } else {
            validateField($('#login-email'), '');
        }

        // Проверка пароля
        if (!password) {
            validateField($('#login-password'), 'Введите пароль');
            isValid = false;
        } else if (password.length < 6) {
            validateField($('#login-password'), 'Пароль должен содержать минимум 6 символов');
            isValid = false;
        } else {
            validateField($('#login-password'), '');
        }

        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (user) {
                currentUser = {
                    name: user.name,
                    email: user.email,
                    role: user.role || 'user'
                };
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateProfileButton();
                
                alert(`Добро пожаловать, ${user.name}!`);
                closeModal();
                this.reset();
                $('.form-input').removeClass('error success');
            } else {
                alert('Неверный email или пароль');
            }
        }
    });

    // Валидация формы регистрации
    $('#register-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const surname = $('#register-surname').val().trim();
        const name = $('#register-name').val().trim();
        const patronymic = $('#register-patronymic').val().trim();
        const email = $('#register-email').val().trim();
        const password = $('#register-password').val();

        // Проверка фамилии
        if (!surname) {
            validateField($('#register-surname'), 'Введите фамилию');
            isValid = false;
        } else if (surname.length < 2) {
            validateField($('#register-surname'), 'Фамилия должна содержать минимум 2 символа');
            isValid = false;
        } else {
            validateField($('#register-surname'), '');
        }

        // Проверка имени
        if (!name) {
            validateField($('#register-name'), 'Введите имя');
            isValid = false;
        } else if (name.length < 2) {
            validateField($('#register-name'), 'Имя должно содержать минимум 2 символа');
            isValid = false;
        } else {
            validateField($('#register-name'), '');
        }

        // Проверка email
        if (!email) {
            validateField($('#register-email'), 'Введите email');
            isValid = false;
        } else if (!validateEmail(email)) {
            validateField($('#register-email'), 'Неверный формат email (должны быть @ и .)');
            isValid = false;
        } else {
            validateField($('#register-email'), '');
        }

        // Проверка пароля
        if (!password) {
            validateField($('#register-password'), 'Введите пароль');
            isValid = false;
        } else if (password.length < 6) {
            validateField($('#register-password'), 'Пароль должен содержать минимум 6 символов');
            isValid = false;
        } else {
            validateField($('#register-password'), '');
        }

        if (isValid) {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.email === email);

            if (existingUser) {
                alert('Пользователь с таким email уже зарегистрирован');
                return;
            }

            const role = (email.includes('admin') || email.includes('moderator')) ? 'moderator' : 'user';
            const fullName = patronymic ? `${name} ${patronymic}` : name;
            const newUser = {
                surname: surname,
                name: fullName,
                email: email,
                password: password,
                role: role,
                registeredAt: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            console.log('=== ДАННЫЕ ДЛЯ СОХРАНЕНИЯ В users.json ===');
            console.log(JSON.stringify(users, null, 2));
            console.log('==========================================');

            alert(`Регистрация прошла успешно!${role === 'moderator' ? ' Вам назначена роль модератора.' : ''}\n\nДанные пользователя выведены в консоль браузера (F12 → Console)`);
            closeModal();
            this.reset();
            $('.form-input').removeClass('error success');
        }
    });

    // Валидация в реальном времени
    $('#login-email, #register-email').on('blur', function() {
        const email = $(this).val().trim();
        if (email && !validateEmail(email)) {
            validateField($(this), 'Неверный формат email (должны быть @ и .)');
        } else if (email) {
            validateField($(this), '');
        }
    });

    $('#login-password, #register-password').on('input', function() {
        const password = $(this).val();
        if ($(this).hasClass('error') && password.length >= 6) {
            validateField($(this), '');
        }
    });

    $('#register-surname, #register-name').on('input', function() {
        const value = $(this).val().trim();
        if ($(this).hasClass('error') && value.length >= 2) {
            validateField($(this), '');
        }
    });

    $('.form-input').on('input', function() {
        if ($(this).hasClass('error')) {
            clearValidation($(this));
        }
    });
});