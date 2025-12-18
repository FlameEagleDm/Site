// Глобальная переменная для отслеживания загруженных товаров
let productsLoaded = false;

function saveProductToLocalStorage(category, product) {
    // Загружаем текущие товары из localStorage
    let storedProducts = localStorage.getItem('products');
    let data = storedProducts ? JSON.parse(storedProducts) : {};
    
    // Инициализируем категорию, если её нет
    if (!data[category]) {
        data[category] = [];
    }
    
    // Добавляем новый товар
    data[category].push(product);
    
    // Сохраняем обратно в localStorage
    localStorage.setItem('products', JSON.stringify(data));
    
    console.log('=== ТОВАР СОХРАНЕН В LOCALSTORAGE ===');
    console.log('Категория:', category);
    console.log('Данные товара:', JSON.stringify(product, null, 2));
    console.log('======================================');
    
    // Также обновляем products.json (для демонстрации)
    updateProductsJson(category, product);
}

function updateProductsJson(category, newProduct) {
    // Этот метод только показывает данные для копирования
    // В реальном проекте это делалось бы через сервер
    console.log('=== ДАННЫЕ ДЛЯ РУЧНОГО ДОБАВЛЕНИЯ В products.json ===');
    console.log(`Добавьте этот объект в массив "${category}":`);
    console.log(JSON.stringify(newProduct, null, 2));
    console.log('=====================================================');
}

function addProductToUI(category, product) {
    const $grid = $(`.products-grid[data-category="${category}"]`);
    
    if ($grid.length) {
        $grid.find('.loading, .error-message').remove();
        
        const productHtml = `
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
        
        $grid.append(productHtml);
        
        attachProductHandlers();
    } else if (category === 'paintings' && paintingsApp) {
        // Проверяем, нет ли уже такого товара
        const exists = paintingsApp.products.some(p => p.id === product.id);
        if (!exists) {
            paintingsApp.products.push(product);
        }
    }
}

function loadFromLocalStorage() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts && !productsLoaded) {
        const data = JSON.parse(savedProducts);
        
        // Фильтруем товары, чтобы не дублировать уже загруженные
        for (const category in data) {
            if (category === 'paintings' && paintingsApp) {
                // Фильтруем дубликаты для картин
                const existingIds = paintingsApp.products.map(p => p.id);
                const newProducts = data[category].filter(product => 
                    !existingIds.includes(product.id)
                );
                
                if (newProducts.length > 0) {
                    paintingsApp.products = [...paintingsApp.products, ...newProducts];
                    console.log(`Добавлено ${newProducts.length} товаров из localStorage в категорию "${category}"`);
                }
            } else {
                const $grid = $(`.products-grid[data-category="${category}"]`);
                if ($grid.length) {
                    // Получаем уже существующие ID товаров
                    const existingIds = [];
                    $grid.find('.product-card').each(function() {
                        existingIds.push(parseInt($(this).data('id')));
                    });
                    
                    // Добавляем только новые товары
                    data[category].forEach(product => {
                        if (!existingIds.includes(product.id)) {
                            addProductToUI(category, product);
                        }
                    });
                }
            }
        }
        
        productsLoaded = true;
    }
}

function loadAllProducts() {
    loadProducts(); // из JSON
    setTimeout(loadFromLocalStorage, 500); // из localStorage с задержкой
}

function saveUserProduct(category, product) {
    // Сохраняем пользовательские товары отдельно
    let userProducts = localStorage.getItem('userProducts');
    let data = userProducts ? JSON.parse(userProducts) : {};
    
    if (!data[category]) {
        data[category] = [];
    }
    
    data[category].push(product);
    localStorage.setItem('userProducts', JSON.stringify(data));
}

// И загружать только пользовательские товары:
function loadUserProducts() {
    const userProducts = localStorage.getItem('userProducts');
    if (userProducts) {
        const data = JSON.parse(userProducts);
        
        for (const category in data) {
            data[category].forEach(product => {
                addProductToUI(category, product);
            });
        }
    }
}

$(document).ready(function() {
    // Валидация формы добавления товара
    $('#add-product-form').on('submit', function(e) {
        e.preventDefault();
        let isValid = true;

        const category = $('#product-category').val();
        const title = $('#product-title').val().trim();
        const description = $('#product-description').val().trim();
        const author = $('#product-author').val().trim();
        const price = parseInt($('#product-price').val());
        const imageFile = $('#product-image')[0].files[0];

        // Валидация полей
        if (!category) {
            validateField($('#product-category'), 'Выберите категорию');
            isValid = false;
        } else {
            validateField($('#product-category'), '');
        }

        if (!title) {
            validateField($('#product-title'), 'Введите название товара');
            isValid = false;
        } else {
            validateField($('#product-title'), '');
        }

        if (!description) {
            validateField($('#product-description'), 'Введите описание товара');
            isValid = false;
        } else {
            validateField($('#product-description'), '');
        }

        if (!author) {
            validateField($('#product-author'), 'Введите имя автора');
            isValid = false;
        } else {
            validateField($('#product-author'), '');
        }

        if (!price || price <= 0) {
            validateField($('#product-price'), 'Введите корректную цену');
            isValid = false;
        } else {
            validateField($('#product-price'), '');
        }

        if (!isValid) return;

        // Генерируем уникальный ID (используем timestamp + случайное число)
        const newId = Date.now() + Math.floor(Math.random() * 1000);

        // Создаем объект товара
        const newProduct = {
            id: newId,
            title: title,
            price: price,
            author: author,
            description: description,
            image: imageFile ? URL.createObjectURL(imageFile) : 'path/to/default.jpg',
            imageClass: `product-${newId}`
        };

        // Сохраняем товар в localStorage
        saveProductToLocalStorage(category, newProduct);

        // Обновляем интерфейс
        addProductToUI(category, newProduct);

        alert('Товар успешно добавлен!\n\nДанные для копирования в products.json выведены в консоль (F12 → Console).');
        closeModal();
        this.reset();
        $('.form-input').removeClass('error success');
    });
});