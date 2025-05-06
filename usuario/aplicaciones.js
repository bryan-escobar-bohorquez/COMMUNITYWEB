/**
 * SISTEMA DE GESTIÓN DE TRABAJOS APLICADOS
 * - Persistencia con LocalStorage
 * - Panel de detalles con scroll
 * - Filtrado por estado
 */

// =============================================
// CONFIGURACIÓN INICIAL
// =============================================
const STORAGE_KEY = 'trabajos_aplicados';
let trabajosAplicados = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// Datos de ejemplo si no hay nada en LocalStorage
if (trabajosAplicados.length === 0) {
    trabajosAplicados = [
        {
            id: 1,
            titulo: "Constructor de Edificios Residenciales",
            empresa: "Constructora XYZ",
            fecha: "2025-03-15",
            estado: "pendiente",
            salario: "$3,500 - $4,200 mensuales",
            ubicacion: "Ciudad de México",
            detalles: "Buscamos constructor con experiencia en edificación de proyectos residenciales de mediana altura (5-10 pisos). Serás responsable de coordinar equipos de trabajo y supervisar el avance según los planos arquitectónicos.",
            requisitos: [
                "3+ años de experiencia en construcción",
                "Conocimiento de normativas locales",
                "Disponibilidad para viajar",
                "Certificación en seguridad en construcción"
            ],
            etapa: "Revisión inicial",
            proximoPaso: "Prueba técnica (si pasa filtro inicial)",
            contacto: "reclutamiento@constructora-xyz.com"
        },
        
        {
            id: 2,
            titulo: "Supervisor de Obra",
            empresa: "Edificaciones Modernas SA",
            fecha: "2025-02-28",
            estado: "revision",
            salario: "$4,000 - $4,800 mensuales",
            ubicacion: "Monterrey",
            detalles: "Supervisión de obra gruesa en proyecto comercial de 3 niveles. Responsable de coordinar equipos, verificar cumplimiento de especificaciones técnicas y reportar avances semanales.",
            requisitos: [
                "5+ años en supervisión de obras",
                "Certificación en gestión de proyectos",
                "Disponibilidad para turnos rotativos",
                "Conocimiento de software de planificación"
            ],
            etapa: "Prueba técnica",
            proximoPaso: "Entrevista con director de obra",
            contacto: "rh@edificaciones-modernas.com"
        },
       
    ];
    guardarEnStorage();
}

// =============================================
// FUNCIONES PRINCIPALES
// =============================================

/**
 * Guarda los trabajos en LocalStorage
 */
function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trabajosAplicados));
}

/**
 * Renderiza la lista de trabajos aplicados
 * @param {string} filtro - Estado por el cual filtrar ('todos', 'pendiente', 'revision', etc.)
 */
function renderizarTrabajos(filtro = "todos") {
    const contenedor = document.getElementById('trabajosList');
    const sinResultados = document.getElementById('sinResultados');
    
    contenedor.innerHTML = '';
    
    const trabajosFiltrados = filtro === 'todos' 
        ? trabajosAplicados 
        : trabajosAplicados.filter(t => t.estado === filtro);
    
    if (trabajosFiltrados.length === 0) {
        sinResultados.style.display = 'block';
        return;
    }
    
    sinResultados.style.display = 'none';
    
    trabajosFiltrados.forEach(trabajo => {
        const fechaFormateada = new Date(trabajo.fecha).toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        
        const item = document.createElement('div');
        item.className = `trabajo-item ${trabajo.estado}`;
        item.innerHTML = `
            <div class="trabajo-info">
                <h3>${trabajo.titulo}</h3>
                <p><strong>Empresa:</strong> ${trabajo.empresa}</p>
                <p><strong>Fecha aplicación:</strong> ${fechaFormateada}</p>
                <p><strong>Estado:</strong> <span class="estado-badge ${trabajo.estado}">
                    ${formatEstado(trabajo.estado)}
                </span></p>
            </div>
            <div class="trabajo-acciones">
                <button class="ver-detalle" data-id="${trabajo.id}">Ver detalles</button>
                <button class="cancelar-aplicacion" data-id="${trabajo.id}">Cancelar</button>
            </div>
        `;
        contenedor.appendChild(item);
    });
    
    setupEventListeners();
}

/**
 * Filtra los trabajos según el estado seleccionado
 */
function filtrarTrabajos() {
    const filtro = document.getElementById('filtro-estado').value;
    renderizarTrabajos(filtro);
}

/**
 * Muestra el panel de detalles con scroll
 * @param {number} id - ID del trabajo
 */
function mostrarDetalleTrabajo(id) {
    const trabajo = trabajosAplicados.find(t => t.id === id);
    
    if (!trabajo) {
        mostrarNotificacion('No se encontró el trabajo', 'error');
        return;
    }
    
    // Rellenar datos
    document.getElementById('detalleTitulo').textContent = trabajo.titulo;
    document.getElementById('detalleEmpresa').textContent = trabajo.empresa;
    document.getElementById('detalleFecha').textContent = new Date(trabajo.fecha).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    document.getElementById('detalleEstado').textContent = formatEstado(trabajo.estado);
    document.getElementById('detalleSalario').textContent = trabajo.salario || 'No especificado';
    document.getElementById('detalleUbicacion').textContent = trabajo.ubicacion || 'Remoto';
    document.getElementById('detalleDescripcion').textContent = trabajo.detalles;
    
    // Requisitos
    const requisitosList = document.getElementById('detalleRequisitos');
    requisitosList.innerHTML = '';
    (trabajo.requisitos || ['No se especificaron requisitos']).forEach(req => {
        const li = document.createElement('li');
        li.textContent = req;
        requisitosList.appendChild(li);
    });
    
    // Proceso de selección
    document.getElementById('detalleProceso').innerHTML = `
        <p><strong>Etapa actual:</strong> ${trabajo.etapa || 'Revisión inicial'}</p>
        <p><strong>Próximo paso:</strong> ${trabajo.proximoPaso || 'No especificado'}</p>
        ${trabajo.contacto ? `<p><strong>Contacto:</strong> ${trabajo.contacto}</p>` : ''}
    `;
    
    // Configurar botones
    document.getElementById('cancelarAplicacion').onclick = () => {
        cerrarPanelDetalle();
        cancelarAplicacion(id);
    };
    
    document.getElementById('contactarReclutador').onclick = () => {
        if (trabajo.contacto) {
            window.location.href = `mailto:${trabajo.contacto}?subject=Consulta sobre ${trabajo.titulo}`;
        } else {
            mostrarNotificacion('No hay contacto disponible', 'info');
        }
    };
    
    // Mostrar panel
    document.getElementById('detalleTrabajoPanel').classList.add('abierto');
    document.getElementById('overlay').classList.add('visible');
    document.body.style.overflow = 'hidden'; // Bloquear scroll del body
}

/**
 * Cierra el panel de detalles
 */
function cerrarPanelDetalle() {
    document.getElementById('detalleTrabajoPanel').classList.remove('abierto');
    document.getElementById('overlay').classList.remove('visible');
    document.body.style.overflow = ''; // Restaurar scroll del body
}

/**
 * Cancela una aplicación
 * @param {number} id - ID del trabajo
 */
function cancelarAplicacion(id) {
    if (confirm('¿Cancelar esta aplicación?')) {
        const index = trabajosAplicados.findIndex(t => t.id === id);
        if (index !== -1) {
            trabajosAplicados.splice(index, 1);
            guardarEnStorage();
            renderizarTrabajos(document.getElementById('filtro-estado').value);
            mostrarNotificacion('Aplicación cancelada', 'success');
        }
    }
}

// =============================================
// FUNCIONES AUXILIARES
// =============================================

/**
 * Formatea el estado para mostrarlo
 * @param {string} estado - Estado del trabajo
 * @returns {string} Estado formateado
 */
function formatEstado(estado) {
    const estados = {
        'pendiente': 'Pendiente',
        'revision': 'En revisión',
        'aceptado': 'Aceptado',
        'rechazado': 'Rechazado'
    };
    return estados[estado] || estado;
}

/**
 * Muestra una notificación
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación ('success', 'error', 'info')
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    console.log(`[${tipo.toUpperCase()}] ${mensaje}`);
    alert(mensaje); // (Puede mejorarse con un sistema de notificaciones visuales)
}

/**
 * Configura los event listeners
 */
function setupEventListeners() {
    // Botones de ver detalle
    document.querySelectorAll('.ver-detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            mostrarDetalleTrabajo(id);
        });
    });
    
    // Botones de cancelar
    document.querySelectorAll('.cancelar-aplicacion').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            cancelarAplicacion(id);
        });
    });
    
    // Cerrar panel
    document.getElementById('cerrarDetalle').addEventListener('click', cerrarPanelDetalle);
    document.getElementById('overlay').addEventListener('click', cerrarPanelDetalle);
    
    // Filtro
    document.getElementById('filtro-estado').addEventListener('change', filtrarTrabajos);
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', function() {
    renderizarTrabajos();
    setupEventListeners();
});