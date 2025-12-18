// Навигация между главной страницей и страницей "О нас"

$(document).ready(function() {
    // Функция для отображения главной страницы
    function showMainPage() {
        $('#main-container').show();
        $('#about-page').hide();
        $('html, body').animate({ scrollTop: 0 }, 300);
    }

    // Функция для отображения страницы "О нас"
    function showAboutPage() {
        $('#main-container').hide();
        $('#about-page').show();
        $('html, body').animate({ scrollTop: 0 }, 300);
    }

    // Клик по логотипу - переход на главную
    $('#logo-link').on('click', function(e) {
        e.preventDefault();
        showMainPage();
    });

    // Клик по кнопке "Главная"
    $('#main-page-link').on('click', function(e) {
        e.preventDefault();
        showMainPage();
    });

    // Клик по кнопке "О нас"
    $('#about-page-link').on('click', function(e) {
        e.preventDefault();
        showAboutPage();
    });

    // Клик по кнопке "Авторы" - переход на главную к секции авторов
    $('#authors-link').on('click', function(e) {
        e.preventDefault();
        showMainPage();
        setTimeout(function() {
            $('html, body').animate({
                scrollTop: $('#top-authors').offset().top - 20
            }, 800);
        }, 100);
    });
});