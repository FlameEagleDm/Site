let paintingsApp = null;
let productsInitialized = false;

function initPaintingsVue(products) {
    // Проверяем, не инициализирован ли Vue уже
    if (paintingsApp && productsInitialized) {
        return paintingsApp;
    }
    
    paintingsApp = new Vue({
        el: '#paintings-vue',
        data: {
            products: products || [],
            loading: true
        },
        methods: {
            formatPrice(price) {
                return new Intl.NumberFormat('ru-RU').format(price) + '₽';
            },
            addToCart(product, event) {
                event.preventDefault();
                event.stopPropagation();
                
                const button = event.target;
                const originalText = button.textContent;
                
                if (cart[product.id]) {
                    cart[product.id].quantity++;
                } else {
                    cart[product.id] = {
                        title: product.title,
                        price: product.price,
                        author: product.author,
                        image: product.image,
                        quantity: 1
                    };
                }

                renderCart();

                button.textContent = 'Добавлено!';
                button.style.background = '#5a9e5a';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = '';
                }, 1000);
            }
        },
        mounted() {
            this.loading = false;
        },
        template: `
            <div>
                <div v-if="loading" class="loading">Загрузка товаров...</div>
                <a v-else 
                   v-for="product in products" 
                   :key="product.id"
                   href="#" 
                   class="product-card" 
                   :data-id="product.id"
                   :data-title="product.title"
                   :data-price="product.price"
                   :data-author="product.author"
                   :data-image="product.image">
                    <div class="product-image" :class="product.imageClass"></div>
                    <div class="product-info">
                        <div class="product-title">{{ product.title }}</div>
                        <div class="product-description">{{ product.description }}</div>
                        <div class="product-author">Автор: {{ product.author }}</div>
                        <button class="product-button add-to-cart" @click="addToCart(product, $event)">
                            В корзину за {{ formatPrice(product.price) }}
                        </button>
                    </div>
                </a>
            </div>
        `
    });
    
    productsInitialized = true;
    return paintingsApp;
}

function attachProductHandlers() {
    $('.add-to-cart').off('click').on('click', function(e) {
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
        const originalPrice = price;
        setTimeout(() => {
            $(this).text('В корзину за ' + formatPrice(originalPrice)).css('background', '');
        }, 1000);
    });
}

function loadProducts() {
    $.ajax({
        url: 'products.json',
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('=== Товары загружены из products.json ===');
            
            if (data.paintings) {
                initPaintingsVue(data.paintings);
            }
            
            $('.products-grid[data-category]').each(function() {
                const category = $(this).data('category');
                const products = data[category];
                
                if (products && products.length > 0) {
                    let html = '';
                    products.forEach(product => {
                        html += `
                            <a href="#" class="product-card" data-id="${product.id}" 
                               data-title="${product.title}" 
                               data-price="${product.price}" 
                               data-author="${product.author}" 
                               data-image="${product.image}">
                                <div class="product-image ${product.imageClass}"></div>
                                <div class="product-info">
                                    <div class="product-title">${product.title}</div>
                                    <div class="product-description">${product.description}</div>
                                    <div class="product-author">Автор: ${product.author}</div>
                                    <button class="product-button add-to-cart">В корзину за ${formatPrice(product.price)}</button>
                                </div>
                            </a>
                        `;
                    });
                    $(this).html(html);
                } else {
                    $(this).html('<p class="error-message">Товары не найдены</p>');
                }
            });

            attachProductHandlers();
        },
        error: function() {
            $('.products-grid').html('<p class="error-message">Ошибка загрузки товаров. Попробуйте позже.</p>');
        }
    });
}