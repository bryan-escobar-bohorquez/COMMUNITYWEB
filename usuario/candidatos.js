/**
 * SISTEMA DE GESTIÓN DE TRABAJOS Y CANDIDATOS
 * - Publicación de ofertas de trabajo
 * - Visualización de candidatos por trabajo
 * - Persistencia en localStorage
 */

// =============================================
// CONSTANTES Y CONFIGURACIÓN
// =============================================
const TRABAJOS_STORAGE_KEY = 'trabajos_publicados';
const CANDIDATOS_STORAGE_KEY = 'candidatos_trabajos';

const ESTADOS = {
    ACTIVO: { codigo: 'activo', texto: 'Activo', clase: 'activo' },
    CERRADO: { codigo: 'cerrado', texto: 'Cerrado', clase: 'cerrado' }
};

const ESTADOS_CANDIDATO = {
    POSTULADO: { codigo: 'postulado', texto: 'Postulado', clase: 'postulado' },
    REVISION: { codigo: 'revision', texto: 'En revisión', clase: 'revision' },
    ENTREVISTA: { codigo: 'entrevista', texto: 'Entrevista', clase: 'entrevista' },
    PRUEBAS: { codigo: 'pruebas', texto: 'Pruebas técnicas', clase: 'pruebas' },
    CONTRATADO: { codigo: 'contratado', texto: 'Contratado', clase: 'contratado' },
    DESCARTADO: { codigo: 'descartado', texto: 'Descartado', clase: 'descartado' }
};

let trabajosPublicados = [];
let candidatos = [];

// =============================================
// FUNCIONES DE INICIALIZACIÓN
// =============================================
function inicializarSistema() {
    cargarDatos();
    configurarEventos();
    renderizarTrabajosPublicados();
}

function cargarDatos() {
    cargarTrabajosPublicados();
    cargarCandidatos();
    if (trabajosPublicados.length === 0) {
        cargarEjemploTrabajos();
    }
}

function cargarTrabajosPublicados() {
    const datos = JSON.parse(localStorage.getItem(TRABAJOS_STORAGE_KEY)) || [];
    trabajosPublicados = datos;
}

function cargarCandidatos() {
    const datos = JSON.parse(localStorage.getItem(CANDIDATOS_STORAGE_KEY)) || [];
    candidatos = datos;
}

function cargarEjemploTrabajos() {
    crearTrabajo(
        "Electricista Industrial", 
        "Energia Total", 
        "2025-05-14", 
        ESTADOS.ACTIVO.codigo,
        "$3,000 - $3,800",
        "Planta Norte",
        "Instalación y mantenimiento de sistemas eléctricos industriales.",
        ["Certificación en electricidad industrial", "3+ años de experiencia", "Manejo de normas de seguridad"],
        "Revisión inicial",
        "Prueba técnica",
        "rrhh@energiatotal.com"
    );
    
    crearTrabajo(
        "Técnico en Mantenimiento", 
        "Energia Total", 
        "2025-05-10", 
        ESTADOS.ACTIVO.codigo,
        "$2,800 - $3,200",
        "Planta Sur",
        "Mantenimiento preventivo y correctivo de maquinaria.",
        ["Técnico mecánico/eléctrico", "Disponibilidad para turnos"],
        "Aplicación recibida",
        "Revisión de documentos",
        "contrataciones@energiatotal.com"
    );
}

// =============================================
// GESTIÓN DE TRABAJOS PUBLICADOS
// =============================================
function crearTrabajo(titulo, empresa, fechaPublicacion, estado, salario, ubicacion, descripcion, requisitos, etapaActual, proximoPaso, contacto) {
    const nuevoTrabajo = {
        id: Date.now(),
        titulo,
        empresa,
        fechaPublicacion,
        estado,
        salario,
        ubicacion,
        descripcion,
        requisitos,
        etapaActual,
        proximoPaso,
        contacto,
        fechaCreacion: new Date().toISOString()
    };
    
    trabajosPublicados.push(nuevoTrabajo);
    guardarTrabajos();
    return nuevoTrabajo;
}

function guardarTrabajos() {
    localStorage.setItem(TRABAJOS_STORAGE_KEY, JSON.stringify(trabajosPublicados));
}

function cerrarPublicacion(idTrabajo) {
    const trabajo = trabajosPublicados.find(t => t.id === idTrabajo);
    if (trabajo) {
        trabajo.estado = ESTADOS.CERRADO.codigo;
        guardarTrabajos();
        return true;
    }
    return false;
}

// =============================================
// GESTIÓN DE CANDIDATOS
// =============================================
function agregarCandidato(idTrabajo, nombre, email, telefono, cvUrl) {
    const nuevoCandidato = {
        id: Date.now(),
        idTrabajo,
        nombre,
        email,
        telefono,
        cvUrl,
        estado: ESTADOS_CANDIDATO.POSTULADO.codigo,
        fechaAplicacion: new Date().toISOString().split('T')[0],
        notas: "",
        evaluacion: 0
    };
    
    candidatos.push(nuevoCandidato);
    guardarCandidatos();
    return nuevoCandidato;
}

function actualizarEstadoCandidato(idCandidato, nuevoEstado) {
    const candidato = candidatos.find(c => c.id === idCandidato);
    if (candidato) {
        candidato.estado = nuevoEstado;
        guardarCandidatos();
        return true;
    }
    return false;
}

function guardarCandidatos() {
    localStorage.setItem(CANDIDATOS_STORAGE_KEY, JSON.stringify(candidatos));
}

// =============================================
// RENDERIZADO DE INTERFAZ
// =============================================
function renderizarTrabajosPublicados() {
    const contenedor = document.getElementById('listaTrabajosCandidatos');
    if (!contenedor) return;
    
    contenedor.innerHTML = trabajosPublicados.length === 0 
        ? '<div class="sin-resultados">No hay trabajos publicados</div>'
        : trabajosPublicados.map(trabajo => crearElementoTrabajo(trabajo)).join('');
}

function crearElementoTrabajo(trabajo) {
    const numCandidatos = candidatos.filter(c => c.idTrabajo === trabajo.id).length;
    const estadoInfo = obtenerInfoEstado(trabajo.estado);
    
    return `
        <div class="trabajo-candidato-item ${estadoInfo.clase}">
            <div class="trabajo-info">
                <h3>${trabajo.titulo}</h3>
                <div class="trabajo-meta">
                    <span><strong>Empresa:</strong> ${trabajo.empresa}</span>
                    <span><strong>Publicado:</strong> ${formatearFecha(trabajo.fechaPublicacion)}</span>
                    <span class="estado-badge ${estadoInfo.clase}">${estadoInfo.texto}</span>
                </div>
            </div>
            <div class="candidatos-info">
                <div class="candidatos-count">
                    <span class="numero-candidatos">${numCandidatos}</span>
                    <span>Candidatos</span>
                </div>
                <button class="btn-ver-candidatos" data-id="${trabajo.id}">
                    Ver Todos <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    `;
}

function mostrarPanelCandidatos(idTrabajo) {
    const trabajo = trabajosPublicados.find(t => t.id === idTrabajo);
    if (!trabajo) return;
    
    const candidatosTrabajo = candidatos.filter(c => c.idTrabajo === idTrabajo);
    const listaCandidatos = document.getElementById('listaCandidatosPanel');
    
    document.getElementById('tituloTrabajoPanel').textContent = trabajo.titulo;
    document.getElementById('infoTrabajoPanel').textContent = `${trabajo.empresa} · Publicado: ${formatearFecha(trabajo.fechaPublicacion)}`;
    
    listaCandidatos.innerHTML = candidatosTrabajo.length === 0
        ? '<div class="sin-candidatos">No hay candidatos para este trabajo</div>'
        : candidatosTrabajo.map(candidato => crearElementoCandidato(candidato)).join('');
    
    document.getElementById('panelCandidatos').classList.add('abierto');
    document.getElementById('overlayCandidatos').classList.add('visible');
}

function crearElementoCandidato(candidato) {
    const estadoInfo = obtenerInfoEstadoCandidato(candidato.estado);
    
    return `
        <div class="candidato-item">
            <div class="candidato-avatar">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(candidato.nombre)}&background=random" alt="Avatar">
            </div>
            <div class="candidato-info">
                <h4>${candidato.nombre}</h4>
                <p class="candidato-meta">
                    <span>Postulado: ${formatearFecha(candidato.fechaAplicacion)}</span>
                    <span class="estado-badge ${estadoInfo.clase}">${estadoInfo.texto}</span>
                </p>
            </div>
            <button class="btn-ver-detalle" data-id="${candidato.id}">
                <i class="fas fa-eye"></i>
            </button>
        </div>
    `;
}

function mostrarDetalleCandidato(idCandidato) {
    const candidato = candidatos.find(c => c.id === idCandidato);
    if (!candidato) return;
    
    const trabajo = trabajosPublicados.find(t => t.id === candidato.idTrabajo);
    const estadoInfo = obtenerInfoEstadoCandidato(candidato.estado);
    
    document.getElementById('detalleCandidatoNombre').textContent = candidato.nombre;
    document.getElementById('detalleCandidatoEstado').textContent = estadoInfo.texto;
    document.getElementById('detalleCandidatoEstado').className = `estado-badge ${estadoInfo.clase}`;
    document.getElementById('detalleCandidatoEmail').textContent = candidato.email;
    document.getElementById('detalleCandidatoTelefono').textContent = candidato.telefono || 'No especificado';
    document.getElementById('detalleCandidatoPuesto').textContent = trabajo?.titulo || 'Trabajo no encontrado';
    document.getElementById('detalleCandidatoFecha').textContent = formatearFecha(candidato.fechaAplicacion);
    
    const cvLink = document.getElementById('detalleCandidatoCV');
    cvLink.href = candidato.cvUrl || '#';
    cvLink.style.display = candidato.cvUrl ? 'block' : 'none';
    
    document.getElementById('detalleCandidatoNotas').value = candidato.notas || '';
    document.getElementById('panelDetalleCandidato').classList.add('abierto');
}

// =============================================
// FUNCIONES AUXILIARES
// =============================================
function obtenerInfoEstado(codigoEstado) {
    return Object.values(ESTADOS).find(e => e.codigo === codigoEstado) || 
           { codigo: codigoEstado, texto: codigoEstado, clase: '' };
}

function obtenerInfoEstadoCandidato(codigoEstado) {
    return Object.values(ESTADOS_CANDIDATO).find(e => e.codigo === codigoEstado) || 
           { codigo: codigoEstado, texto: codigoEstado, clase: '' };
}

function formatearFecha(fechaString, formatoExtendido = false) {
    const opciones = {
        day: '2-digit',
        month: formatoExtendido ? 'long' : '2-digit',
        year: 'numeric'
    };
    return new Date(fechaString).toLocaleDateString('es-MX', opciones);
}

// =============================================
// MANEJO DE EVENTOS
// =============================================
function configurarEventos() {
    // Eventos de visualización
    document.addEventListener('click', manejarClicks);
    
    // Eventos del formulario
    const form = document.getElementById('nuevoTrabajoForm');
    if (form) {
        form.addEventListener('submit', manejarEnvioFormulario);
    }
    
    // Botones de cierre
    document.getElementById('cerrarPanelCandidatos')?.addEventListener('click', cerrarPanelCandidatos);
    document.getElementById('cerrarDetalleCandidato')?.addEventListener('click', cerrarDetalleCandidato);
    document.getElementById('overlayCandidatos')?.addEventListener('click', cerrarPanelCandidatos);
    document.getElementById('cancelarPublicacion')?.addEventListener('click', cancelarPublicacion);
    document.getElementById('abrirFormularioTrabajo')?.addEventListener('click', mostrarFormulario);
}

function manejarClicks(e) {
    if (e.target.closest('.btn-ver-candidatos')) {
        const idTrabajo = parseInt(e.target.closest('.btn-ver-candidatos').getAttribute('data-id'));
        mostrarPanelCandidatos(idTrabajo);
    }
    
    if (e.target.closest('.btn-ver-detalle')) {
        const idCandidato = parseInt(e.target.closest('.btn-ver-detalle').getAttribute('data-id'));
        mostrarDetalleCandidato(idCandidato);
    }
}

function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    const titulo = document.getElementById('tituloTrabajo').value;
    const empresa = document.getElementById('empresaTrabajo').value;
    const fecha = document.getElementById('fechaPublicacion').value;
    const salario = document.getElementById('salarioTrabajo').value;
    const ubicacion = document.getElementById('ubicacionTrabajo').value;
    const descripcion = document.getElementById('descripcionTrabajo').value;
    const requisitos = document.getElementById('requisitosTrabajo').value
        .split(',')
        .map(req => req.trim())
        .filter(req => req.length > 0);
    const etapaActual = document.getElementById('etapaActual').value;
    const proximoPaso = document.getElementById('proximoPasoTrabajo').value;
    const contacto = document.getElementById('contactoTrabajo').value;
    
    crearTrabajo(
        titulo, empresa, fecha, ESTADOS.ACTIVO.codigo, 
        salario, ubicacion, descripcion, requisitos, 
        etapaActual, proximoPaso, contacto
    );
    
    cerrarFormulario();
    mostrarNotificacion(`Trabajo "${titulo}" publicado correctamente`, 'success');
    renderizarTrabajosPublicados();
}

function mostrarFormulario() {
    document.getElementById('formPublicarTrabajo').classList.add('mostrar');
}

function cerrarFormulario() {
    document.getElementById('formPublicarTrabajo').classList.remove('mostrar');
    document.getElementById('nuevoTrabajoForm').reset();
}

function cancelarPublicacion() {
    cerrarFormulario();
}

function cerrarPanelCandidatos() {
    document.getElementById('panelCandidatos').classList.remove('abierto');
    document.getElementById('overlayCandidatos').classList.remove('visible');
}

function cerrarDetalleCandidato() {
    document.getElementById('panelDetalleCandidato').classList.remove('abierto');
}

// =============================================
// INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', inicializarSistema);