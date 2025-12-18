function openModal(modalId) {
    $('#modal-overlay').fadeIn(300);
    $(`#${modalId}`).fadeIn(300);
    $('body').css('overflow', 'hidden');
}

function closeModal() {
    $('#modal-overlay').fadeOut(300);
    $('.modal').fadeOut(300);
    $('body').css('overflow', 'auto');
}

$(document).ready(function() {
    // Плавная прокрутка к якорям
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this).attr('href');
        if (target !== '#' && $(target).length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: $(target).offset().top - 20
            }, 800);
        }
    });

    // Закрытие модального окна при клике на overlay
    $('#modal-overlay').on('click', function() {
        closeModal();
    });

    // Закрытие модального окна при нажатии Escape
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});