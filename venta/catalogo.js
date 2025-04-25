const featuredGrid = document.querySelector('.featured-grid');
const categoryGrid = document.querySelector('.category-grid');
const cartModal = document.querySelector('.cart-modal');
const cartItems = document.querySelector('.cart-items');
const totalPrice = document.querySelector('.total-price');
const cartCountElement = document.querySelector('.cart-count');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');
const checkoutBtn = document.querySelector('.checkout-btn');

document.addEventListener('DOMContentLoaded', () => {   
    
    loadProducts();             // Productos 
    loadFeaturedProducts();    // Productos destacados
    setupCategoryEvents();     // Clicks por categoría
    setupEventListeners();     // Botones generales
    updateCart();              // Cargar carrito

    const hash = window.location.hash;
    if (hash.startsWith("#categoria/")) {
        const categoria = hash.split("/")[1];
        if (categoria) {
            mostrarCategoria(categoria);
        }
    }
});



function loadProducts() {
    fetch("http://localhost:5000/api/productos")
        .then(res => res.json())
        .then(productos => {
            productsGrid.innerHTML = "";
            productos.forEach(p => {
                const card = createProductCard(p);
                productsGrid.appendChild(card);
            });
        })
        .catch(err => console.error("Error al cargar productos:", err));
}

function loadFeaturedProducts() {
    fetch("http://localhost:5000/api/productos/destacados")
        .then(res => res.json())
        .then(productos => {
            featuredGrid.innerHTML = "";
            const productosDestacados = [...productos]
                .sort((a, b) => b.stock - a.stock)
                .slice(0, 3);
        
            productosDestacados.forEach(p => {
                const card = createProductCard(p);
                featuredGrid.appendChild(card);
            });
        })
        .catch(err => console.error("Error al cargar productos destacados:", err));
}

function createProductCard(product) {
    const card = document.createElement('div'); 

    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.imagen_url || 'img/default.jpg'}" alt="${product.nombre}">
        <h3>${product.nombre}</h3>
        <p class="price">$${product.precio.toLocaleString()} COP</p>
        <p class="description">${product.descripcion || 'Sin descripción disponible'}</p>
        <button class="add-to-cart" data-id="${product.id}">Añadir al carrito</button>
    `;
    return card;
}

// Configurar clics por categoría
function setupCategoryEvents() {
    const categoryCards = document.querySelectorAll(".category-card");

    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const categoria = card.getAttribute("data-category");
            window.location.hash = `#categoria/${categoria}`;
            mostrarCategoria(categoria);
        });
    });
}

// Mostrar productos por categoría desde backend
function mostrarCategoria(categoria) {
    const categoriesContainer = document.querySelector(".categories-container");
    const categoryProducts = document.getElementById("category-products");
    const categoryTitle = document.querySelector(".category-title");
    const categoryGrid = document.querySelector(".category-grid");
    const card = document.querySelector(`[data-category="${categoria}"]`);
    const nombreCategoria = card ? card.querySelector("h3").textContent : categoria;

    categoryTitle.textContent = `Productos de ${nombreCategoria}`;
    categoriesContainer.classList.add("hidden");
    categoryProducts.classList.remove("hidden");

    fetch(`http://localhost:5000/api/productos/categoria/${categoria}`)
        .then(res => res.json())
        .then(productos => {
            categoryGrid.innerHTML = "";
            if (productos.length === 0) {
                categoryGrid.innerHTML = "<p>No hay productos en esta categoría.</p>";
            } else {
                productos.forEach(p => {
                    const card = createProductCard(p);
                    categoryGrid.appendChild(card);
                });
            }
        })
        .catch(err => {
            categoryGrid.innerHTML = "<p style='color:red;'>Error al cargar productos</p>";
            console.error("Error al cargar productos por categoría:", err);
        });

    // Botón volver
    document.querySelector('.back-btn').addEventListener('click', () => {
        categoryProducts.classList.add("hidden");
        categoriesContainer.classList.remove("hidden");
        window.location.hash = ""; // Limpiar hash
    });
}

// Eventos generales: carrito, añadir/eliminar producto
function setupEventListeners() {
    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', checkout);

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const id = parseInt(e.target.dataset.id);
            addToCart(id);
        }
        if (e.target.classList.contains('remove-item')) {
            const id = parseInt(e.target.dataset.id);
            removeFromCart(id);
        }
    });
}

// Añadir al carrito (POST /carrito)
function addToCart(productId) {

    const addButton = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (addButton) {
        addButton.disabled = true;
        addButton.innerHTML = "<i class='bx bx-loader bx-spin'></i>";
    }

    fetch("http://localhost:5000/api/carrito", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ producto_id: productId, cantidad: 1 })
    })
    .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
    })
    .then(() => {
        updateCart();
        showAddedToCartMessage("Producto añadido");
    })
    .catch(err => {
        console.error("Error al añadir al carrito:", err);
        showAddedToCartMessage("Error al añadir producto", true);
    })
    .finally(() => {
        if (addButton) {
            addButton.disabled = false;
            addButton.textContent = "Añadir al carrito";
        }
    });
}

function updateCart() {
    fetch("http://localhost:5000/api/carrito")
        .then(res => res.json())
        .then(items => {
            const totalItems = items.reduce((total, item) => total + item.cantidad, 0);
            cartCountElement.textContent = totalItems;

            let total = 0;
            cartItems.innerHTML = '';

            if (items.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
                totalPrice.textContent = '$0 COP';
                return;
            }

            // Generar cada producto con su cálculo integrado
            items.forEach(item => {
                const subtotal = item.precio * item.cantidad;
                total += subtotal;

                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.imagen_url}" alt="${item.nombre}">
                    <div class="item-details">
                        <h4>${item.nombre}</h4>
                        <span class="price">$${item.precio.toLocaleString()} COP</span>
                        
                        
                        <div class="quantity-controls">
                            <button class="quantity-btn decrement-btn" data-id="${item.producto_id}">-</button>
                            <span class="quantity-value">${item.cantidad}</span>
                            <button class="quantity-btn increment-btn" data-id="${item.producto_id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.producto_id}">
                        <i class='bx bx-trash'></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });

            // Mostrar el total final
            totalPrice.innerHTML = `<strong>Total: $${total.toLocaleString()} COP</strong>`;
            
            // Agregar event listeners para los botones
            addCartEventListeners();
        })
        .catch(err => console.error("Error al obtener el carrito:", err));
}


function addCartEventListeners() {
    document.querySelectorAll('.increment-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            updateQuantity(e.target.dataset.id, 1);
        });
    });
    
    document.querySelectorAll('.decrement-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const currentQty = parseInt(e.target.nextElementSibling.textContent);
            if (currentQty > 1) {
                updateQuantity(e.target.dataset.id, -1);
            } else {
                removeFromCart(e.target.dataset.id);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeFromCart(e.target.closest('button').dataset.id);
        });
    });
}
// Actualizar cantidad de un producto (PUT /carrito/:productoId)

function updateQuantity(productId, change) {
    const quantityElement = document.querySelector(`.quantity-value[data-id="${productId}"]`);
    if (!quantityElement) return;

    let currentQuantity = parseInt(quantityElement.textContent);
    let newQuantity = currentQuantity + change;

    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }

    quantityElement.textContent = newQuantity;

    // Obtener el elemento del subtotal para actualizarlo también
    const cartItem = quantityElement.closest('.cart-item');
    const priceElement = cartItem.querySelector('.price');
    const subtotalElement = cartItem.querySelector('.subtotal');

    if (priceElement && subtotalElement) {
        const unitPrice = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
        const newSubtotal = unitPrice * newQuantity;
        subtotalElement.textContent = `$${newSubtotal.toLocaleString()} COP`;
    }

    // Deshabilitar los botones mientras se envía la petición
    const buttons = document.querySelectorAll(`.quantity-btn[data-id="${productId}"]`);
    buttons.forEach(btn => {
        btn.disabled = true;
    });

    fetch(`http://localhost:5000/api/carrito/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cambio: change })
    })
    .then(res => {
        if (!res.ok) throw new Error('Error al actualizar cantidad');
        return res.json();
    })
    .then(() => {
        
        updateCart(); // Opcional: para asegurar la sincronización con el servidor
    })
    .catch(err => {
        console.error("Error al actualizar cantidad:", err);
        showAddedToCartMessage("Error al actualizar cantidad", true);
        // Revertir la cantidad visualmente en caso de error
        quantityElement.textContent = currentQuantity;
        if (priceElement && subtotalElement) {
            const unitPrice = parseFloat(priceElement.textContent.replace(/[^\d.]/g, ''));
            const originalSubtotal = unitPrice * currentQuantity;
            subtotalElement.textContent = `$${originalSubtotal.toLocaleString()} COP`;
        }
    })
    .finally(() => {
        buttons.forEach(btn => {
            btn.disabled = false;
        });
    });
}

// Eliminar producto del carrito (DELETE /carrito/:productoId)
function removeFromCart(productId) {
    const button = document.querySelector(`.remove-item[data-id="${productId}"]`);
    if (!button) return;
    
    button.disabled = true;
    button.innerHTML = "<i class='bx bx-loader bx-spin'></i>";

    fetch(`http://localhost:5000/api/carrito/${productId}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        updateCart();
    })
    .catch(err => {
        console.error("Error al eliminar del carrito:", err);
        button.disabled = false;
        button.innerHTML = "<i class='bx bx-trash'></i>";
    });
}

// Mostrar u ocultar el modal del carrito
function toggleCart() {
    cartModal.classList.toggle('active');
    if (cartModal.classList.contains('active')) {
        updateCart();
    }
}

// Finalizar compra
function checkout() {
    if (parseInt(cartCountElement.textContent) === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    if (!confirm('¿Confirmar compra?')) return;

    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = "Procesando... <i class='bx bx-loader bx-spin'></i>";
    const usuarioId = 1;

    fetch(`http://localhost:5000/api/carrito/${usuarioId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ usuario_id: usuarioId }) 
    })
    .then(res => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor al vaciar el carrito');
        return res.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data); // Para depuración
        // Actualizar toda la interfaz del carrito
        cartItems.innerHTML = '<p class="empty-cart">¡Compra realizada con éxito!</p>';
        totalPrice.textContent = '$0 COP';
        cartCountElement.textContent = '0';

        // Mostrar confirmación
        if (checkout)
            alert('¡Gracias por tu compra!')
            toggleCart();
            return removeFromCart();
    })
    .catch(err => {
        console.error("Error al finalizar compra:", err);
        alert('Error al procesar la compra: ' + err.message);
    })
    .finally(() => {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Finalizar Compra';
    });
}
// Mostrar notificación visual
function showAddedToCartMessage(texto, isError = false) {
    const msg = document.createElement('div');
    msg.className = `cart-message ${isError ? 'error' : ''}`;
    msg.innerHTML = `<i class='bx ${isError ? 'bx-error-circle' : 'bx-check-circle'}'></i> ${texto}`;
    document.body.appendChild(msg);

    setTimeout(() => {
        msg.classList.add('fade-out');
        setTimeout(() => msg.remove(), 500);
    }, 2000);
}