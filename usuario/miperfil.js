document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    let fotoActualModal = null;
    const contenedorFotos = document.getElementById('contenedor-fotos');
    const inputNuevaFoto = document.getElementById('nueva-foto');
    const modal = document.getElementById('visor-modal');
    const modalImg = document.getElementById('imagen-modal');
    const btnEliminarModal = document.querySelector('.eliminar-modal');
    const btnCerrarModal = document.querySelector('.cerrar-modal');

    // Elementos del DOM
    const fotoPerfilImg = document.getElementById('foto-perfil-img');
    const inputPerfil = document.getElementById('input-perfil');
    const portadaImg = document.getElementById('portada-img');
    const inputPortada = document.getElementById('input-portada');



    // Cargar fotos al iniciar
    cargarFotos();

    // Eventos
    inputNuevaFoto.addEventListener('change', agregarFoto);
    btnCerrarModal.addEventListener('click', cerrarModal);
    btnEliminarModal.addEventListener('click', eliminarFotoActual);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) cerrarModal();
    });

    // Cargar fotos desde localStorage
    function cargarFotos() {
        const fotos = JSON.parse(localStorage.getItem('galeriaFotos')) || [];
        fotos.forEach(foto => {
            crearElementoFoto(foto.id, foto.src);
        });
    }

    // Guardar fotos en localStorage
    function guardarFotos() {
        const fotos = [];
        document.querySelectorAll('.foto-item').forEach(item => {
            fotos.push({
                id: item.dataset.id,
                src: item.querySelector('img').src
            });
        });
        localStorage.setItem('galeriaFotos', JSON.stringify(fotos));
    }

    // Agregar nueva foto
    function agregarFoto(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const id = 'foto-' + Date.now();
                crearElementoFoto(id, event.target.result);
                guardarFotos();
            };
            reader.readAsDataURL(e.target.files[0]);
            // Resetear el input para permitir cargar la misma imagen otra vez
            e.target.value = '';
        }
    }

    // Crear elemento de foto en el DOM
    function crearElementoFoto(id, src) {
        const fotoItem = document.createElement('div');
        fotoItem.className = 'foto-item';
        fotoItem.dataset.id = id;

        const img = document.createElement('img');
        img.src = src;
        img.className = 'foto-trabajo';
        img.addEventListener('click', function() {
            mostrarModal(this);
        });

        const btnEliminar = document.createElement('button');
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.innerHTML = '×';
        btnEliminar.addEventListener('click', function(e) {
            e.stopPropagation();
            eliminarFoto(this);
        });

        fotoItem.appendChild(img);
        fotoItem.appendChild(btnEliminar);
        contenedorFotos.appendChild(fotoItem);
    }

    // Mostrar modal con foto
    function mostrarModal(imgElement) {
        modal.style.display = 'block';
        modalImg.src = imgElement.src;
        fotoActualModal = imgElement.closest('.foto-item');
    }

    // Cerrar modal
    function cerrarModal() {
        modal.style.display = 'none';
        fotoActualModal = null;
    }

    // Eliminar foto desde el modal
    function eliminarFotoActual() {
        if (fotoActualModal && confirm('¿Eliminar esta foto permanentemente?')) {
            fotoActualModal.remove();
            guardarFotos();
            cerrarModal();
        }
    }

    // Eliminar foto desde miniatura
    function eliminarFoto(btnEliminar) {
        if (confirm('¿Eliminar esta foto?')) {
            const fotoItem = btnEliminar.closest('.foto-item');
            fotoItem.remove();
            guardarFotos();
        }
    }

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') cerrarModal();
            if (e.key === 'Delete') eliminarFotoActual();
        }
    });
     // Cargar imágenes guardadas
    cargarImagenes();

    // Eventos
    inputPerfil.addEventListener('change', function(e) {
        cambiarImagen(e, 'fotoPerfil');
    });

    inputPortada.addEventListener('change', function(e) {
        cambiarImagen(e, 'portada');
    });

    // Cargar imágenes desde localStorage
    function cargarImagenes() {
        const imagenesGuardadas = JSON.parse(localStorage.getItem('imagenesPerfil')) || {};
        
        if (imagenesGuardadas.fotoPerfil) {
            fotoPerfilImg.src = imagenesGuardadas.fotoPerfil;
        } else {
            // Imagen por defecto si no hay guardada
            fotoPerfilImg.src = 'img/perfil-default.jpg';
        }
        
        if (imagenesGuardadas.portada) {
            portadaImg.src = imagenesGuardadas.portada;
        } else {
            // Imagen por defecto si no hay guardada
            portadaImg.src = 'img/portada-default.jpg';
        }
    }

    // Función para cambiar imágenes
    function cambiarImagen(event, tipo) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                if (tipo === 'fotoPerfil') {
                    fotoPerfilImg.src = e.target.result;
                } else {
                    portadaImg.src = e.target.result;
                }
                
                guardarImagenes();
            };
            
            reader.readAsDataURL(event.target.files[0]);
            event.target.value = ''; // Resetear input
        }
    }

    // Guardar imágenes en localStorage
    function guardarImagenes() {
        const imagenes = {
            fotoPerfil: fotoPerfilImg.src,
            portada: portadaImg.src
        };
        localStorage.setItem('imagenesPerfil', JSON.stringify(imagenes));
    }
});
    document.addEventListener('DOMContentLoaded', function() {
        const barraContacto = document.querySelector('.contacto');
        let ultimaPosicion = 0;
        const umbral = 150; // Píxeles a bajar antes de mostrar
        
        window.addEventListener('scroll', function() {
            const posicionActual = window.pageYOffset;
            
            // Mostrar si bajamos más del umbral
            if (posicionActual > umbral && posicionActual > ultimaPosicion) {
                barraContacto.classList.add('visible');
            } 
            // Ocultar si estamos cerca del tope o subiendo
            else if (posicionActual < (umbral / 2) || posicionActual < ultimaPosicion) {
                barraContacto.classList.remove('visible');
            }
            
            ultimaPosicion = posicionActual;
        });
    });