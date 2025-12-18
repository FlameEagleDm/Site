let cart = {};

function formatPrice(price) {
    return new Intl.NumberFormat('ru-RU').format(price) + '₽';
}

function updateTotal() {
    let total = 0;
    for (let id in cart) {
        total += cart[id].price * cart[id].quantity;
    }
    $('#cart-total').text(formatPrice(total));
}

function renderCart() {
    const $cartItems = $('#cart-items');
    $cartItems.empty();

    if (Object.keys(cart).length === 0) {
        $cartItems.html('<div class="cart-empty">Корзина пуста</div>');
        updateTotal();
        return;
    }

    for (let id in cart) {
        const item = cart[id];
        const itemTotal = item.price * item.quantity;
        const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';

        const $cartItem = $(`
            <div class="cart-item" data-id="${id}">
                <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}${quantityText}</div>
                    <div class="cart-item-author">Автор: ${item.author}</div>
                    <div class="cart-item-bottom">
                        <div class="cart-item-price">${formatPrice(itemTotal)}</div>
                        <div class="cart-item-right">
                            <div class="cart-item-controls">
                                <button class="cart-item-btn decrease">-</button>
                                <span class="cart-item-quantity">${item.quantity}</span>
                                <button class="cart-item-btn increase">+</button>
                            </div>
                            <button class="cart-item-remove">Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        $cartItems.append($cartItem);
    }

    updateTotal();
}

// Инициализация корзины
$(document).ready(function() {
    renderCart();

    // Увеличение количества
    $(document).on('click', '.increase', function() {
        const id = $(this).closest('.cart-item').data('id');
        cart[id].quantity++;
        renderCart();
    });

    // Уменьшение количества
    $(document).on('click', '.decrease', function() {
        const id = $(this).closest('.cart-item').data('id');
        if (cart[id].quantity > 1) {
            cart[id].quantity--;
        } else {
            delete cart[id];
        }
        renderCart();
    });

    // Удаление товара
    $(document).on('click', '.cart-item-remove', function() {
        const id = $(this).closest('.cart-item').data('id');
        delete cart[id];
        renderCart();
    });

    // Добавление товара в корзину (общий обработчик)
    $(document).on('click', '.add-to-cart', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const $card = $(this).closest('.product-card');
        const id = $card.data('id');
        const title = $card.data('title');
        const price = parseInt($card.data('price'));
        const author = $card.data('author');
        const image = $card.data('image');

        if (cart[id]) {
            cart[id].quantity++;
        } else {
            cart[id] = {
                title: title,
                price: price,
                author: author,
                image: image,
                quantity: 1
            };
        }

        renderCart();

        // Визуальная обратная связь
        $(this).text('Добавлено!').css('background', '#5a9e5a');
        setTimeout(() => {
            $(this).text('В корзину за ' + formatPrice(price)).css('background', '');
        }, 1000);
    });
});