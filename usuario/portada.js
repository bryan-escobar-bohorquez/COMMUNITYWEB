document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const fotoPerfilImg = document.getElementById('foto-perfil-img');
    const inputPerfil = document.getElementById('input-perfil');
    const portadaImg = document.getElementById('portada-img');
    const inputPortada = document.getElementById('input-portada');

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