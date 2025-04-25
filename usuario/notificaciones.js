document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const notificacionesBtn = document.getElementById('notificaciones-btn');
    const notificacionesDropdown = document.getElementById('notificaciones-dropdown');
    const notificacionesBadge = document.getElementById('notificaciones-badge');
    const notificacionesList = document.getElementById('notificaciones-list');
    const marcarTodasBtn = document.querySelector('.marcar-todas');
    
    // Datos de ejemplo (en una aplicación real, estos vendrían de tu backend)
    let notificaciones = [
        {
            id: 1,
            tipo: 'mensaje',
            titulo: 'Nuevo mensaje',
            mensaje: 'Juan te ha enviado un mensaje sobre el proyecto',
            tiempo: 'Hace 10 minutos',
            leida: false
        }
    ];
    
    // Función para renderizar notificaciones
    function renderNotificaciones() {
        // Filtrar notificaciones no leídas para el badge
        const noLeidas = notificaciones.filter(notif => !notif.leida).length;
        notificacionesBadge.textContent = noLeidas;
        notificacionesBadge.style.display = noLeidas > 0 ? 'inline-block' : 'none';
        
        // Renderizar lista
        if (notificaciones.length === 0) {
            notificacionesList.innerHTML = '<div class="notificacion-vacia">No tienes notificaciones nuevas</div>';
            return;
        }
        
        notificacionesList.innerHTML = '';
        notificaciones.forEach(notif => {
            const notifElement = document.createElement('div');
            notifElement.className = `notificacion-item ${notif.leida ? '' : 'no-leida'}`;
            notifElement.innerHTML = `
                <div class="notificacion-icono ${notif.tipo}">
                    ${getIconoPorTipo(notif.tipo)}
                </div>
                <div class="notificacion-contenido">
                    <div class="notificacion-titulo">${notif.titulo}</div>
                    <div class="notificacion-mensaje">${notif.mensaje}</div>
                </div>
                <div class="notificacion-tiempo">${notif.tiempo}</div>
            `;
            
            notifElement.addEventListener('click', () => marcarComoLeida(notif.id));
            notificacionesList.appendChild(notifElement);
        });
    }
    
    // Función auxiliar para obtener icono por tipo
    function getIconoPorTipo(tipo) {
        const iconos = {
            'mensaje': '✉️',
            'solicitud': '👋',
            'sistema': '⚙️'
        };
        return iconos[tipo] || '🔔';
    }
    
    // Función para marcar notificación como leída
    function marcarComoLeida(id) {
        const notifIndex = notificaciones.findIndex(n => n.id === id);
        if (notifIndex !== -1 && !notificaciones[notifIndex].leida) {
            notificaciones[notifIndex].leida = true;
            renderNotificaciones();
            
            // Aquí deberías hacer una llamada al backend para actualizar el estado
            // fetch(`/api/notificaciones/${id}/leida`, { method: 'PUT' });
        }
    }
    
    // Función para marcar todas como leídas
    function marcarTodasLeidas() {
        notificaciones = notificaciones.map(notif => ({ ...notif, leida: true }));
        renderNotificaciones();
        
        // Aquí deberías hacer una llamada al backend para actualizar todas
        // fetch('/api/notificaciones/leidas', { method: 'PUT' });
    }
    
    // Event listeners
    notificacionesBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificacionesDropdown.style.display = notificacionesDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    marcarTodasBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        marcarTodasLeidas();
    });
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', function() {
        notificacionesDropdown.style.display = 'none';
    });
    
    // Renderizar notificaciones al cargar
    renderNotificaciones();
    
    // Simular nueva notificación (solo para demostración)
    setTimeout(() => {
        notificaciones.unshift({
            id: Date.now(),
            tipo: 'mensaje',
            titulo: 'Nuevo mensaje',
            mensaje: 'Tienes un nuevo mensaje de un cliente potencial',
            tiempo: 'Ahora',
            leida: false
        });
        renderNotificaciones();
        
        // Mostrar notificación toast (opcional)
        mostrarToastNotificacion('Tienes una nueva notificación');
    }, 10000);
    
    // Función para mostrar notificación toast (opcional)
    function mostrarToastNotificacion(mensaje) {
        const toast = document.createElement('div');
        toast.className = 'toast-notificacion';
        toast.textContent = mensaje;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('mostrar');
        }, 100);
        
        setTimeout(() => {
            toast.classList.remove('mostrar');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
// En lugar de usar el array de ejemplo, harías:
async function cargarNotificaciones() {
    try {
        const response = await fetch('/api/notificaciones');
        notificaciones = await response.json();
        renderNotificaciones();
    } catch (error) {
        console.error('Error al cargar notificaciones:', error);
    }
}

async function marcarComoLeida(id) {
    try {
        await fetch(`/api/notificaciones/${id}/leida`, { method: 'PUT' });
        cargarNotificaciones(); // Recargar después de actualizar
    } catch (error) {
        console.error('Error al marcar como leída:', error);
    }
}