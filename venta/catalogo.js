// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Cemento Gris 50kg",
        precio: 32000,
        categoria: "materiales",
        imagen: "cemento.jpg",
        stock: 50
    },
    {
        id: 2,
        nombre: "Taladro Percutor 650W",
        precio: 250000,
        categoria: "herramientas",
        imagen: "taladro.jpg",
        stock: 15
    },
    // Agregar más productos...
];

let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Funcionalidad del menú móvil
document.getElementById('menu-icon').addEventListener('click', () => {
    document.querySelector('.navlist').classList.toggle('active');
});

// Cargar productos
function cargarProductos() {
    const grid = document.querySelector('.products-grid');
    grid.innerHTML = productos.map(producto => `
        <div class="product-card">
            <img src="img/${producto.imagen}" alt="${producto.nombre}">
            <div class="product-info">
                <h3>${producto.nombre}</h3>
                <p class="product-price">$${producto.precio.toLocaleString('es-CO')} COP</p>
                <button class="add-to-cart" onclick="agregarAlCarrito(${producto.id})">Agregar al Carrito</button>
            </div>
        </div>
    `).join('');
}

// Funcionalidad del carrito
function actualizarCarrito() {
    document.querySelector('.cart-count').textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Event listeners para el carrito
document.querySelector('.cart-icon').addEventListener('click', () => {
    document.querySelector('.cart-modal').classList.add('active');
});

document.querySelector('.close-cart').addEventListener('click', () => {
    document.querySelector('.cart-modal').classList.remove('active');
});

// Inicialización
window.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
    actualizarCarrito();
});


