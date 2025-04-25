// Base de datos de habilidades para construcción
const habilidadesDisponibles = [
    "Albañil", "Ayudante de albañil", "Maestro de obra", "Topógrafo", "Herrero de obra", 
    "Cimbrero", "Operador de maquinaria pesada", "Carpintero de obra negra", 
    "Electricista de obra negra", "Fontanero de obra negra", "Yesero", "Pintor", 
    "Azulejero", "Carpintero de acabados", "Herrero / Aluminiador", 
    "Electricista de acabados", "Plomero de acabados", 
    "Instalador de cancelería y vidrio", "Instalador de acabados especiales", 
    "Supervisor de acabados", "Soldador", "Techador", "Instalador de pisos", 
    "Especialista en drywall", "Instalador de plafones", "Enchape de piedra"
];

// Habilidades ya agregadas (para evitar duplicados)
const habilidadesAgregadas = new Set();

// Función para guardar en localStorage
function guardarHabilidades() {
    const habilidadesParaGuardar = Array.from(document.querySelectorAll('.tag')).map(tag => {
        return {
            nombre: tag.textContent.replace(/★|☆|×/g, '').trim(),
            nivel: tag.dataset.nivel
        };
    });
    localStorage.setItem('habilidadesGuardadas', JSON.stringify(habilidadesParaGuardar));
}

// Función para cargar habilidades guardadas
function cargarHabilidadesGuardadas() {
    const guardadas = JSON.parse(localStorage.getItem('habilidadesGuardadas')) || [];
    const lista = document.getElementById("habilidades-lista");
    
    guardadas.forEach(habilidad => {
        if (!habilidadesAgregadas.has(habilidad.nombre.toLowerCase())) {
            const nuevaHabilidad = document.createElement("span");
            nuevaHabilidad.className = "tag";
            nuevaHabilidad.dataset.nivel = habilidad.nivel;
            nuevaHabilidad.innerHTML = `
                ${habilidad.nombre}
                <span class="nivel">${mostrarEstrellas(habilidad.nivel)}</span>
                <button class="eliminar-tag" onclick="eliminarHabilidad(this)">×</button>
            `;
            
            lista.appendChild(nuevaHabilidad);
            habilidadesAgregadas.add(habilidad.nombre.toLowerCase());
        }
    });
}

// Llamar a cargarHabilidadesGuardadas cuando la página se cargue
window.addEventListener('DOMContentLoaded', cargarHabilidadesGuardadas);

function agregarHabilidad() {
    const input = document.getElementById("nueva-habilidad");
    const nivel = document.getElementById("nivel-habilidad").value;
    const lista = document.getElementById("habilidades-lista");
    const habilidad = input.value.trim();
    
    // Validaciones
    if (habilidad === "") {
        alert("Por favor ingresa una habilidad");
        return;
    }
    
    // Validar que la habilidad esté en la lista predefinida
    if (!habilidadesDisponibles.includes(habilidad)) {
        alert("Esta habilidad no está en la lista permitida");
        return;
    }
    
    if (habilidadesAgregadas.has(habilidad.toLowerCase())) {
        alert("Esta habilidad ya fue agregada");
        return;
    }
    
    // Crear el elemento de la habilidad
    const nuevaHabilidad = document.createElement("span");
    nuevaHabilidad.className = "tag";
    nuevaHabilidad.dataset.nivel = nivel;
    nuevaHabilidad.innerHTML = `
        ${habilidad}
        <span class="nivel">${mostrarEstrellas(nivel)}</span>
        <button class="eliminar-tag" onclick="eliminarHabilidad(this)">×</button>
    `;
    
    // Agregar al DOM y al Set
    lista.appendChild(nuevaHabilidad);
    habilidadesAgregadas.add(habilidad.toLowerCase());
    
    // Guardar en localStorage
    guardarHabilidades();
    
    // Limpiar input y ocultar sugerencias
    input.value = "";
    document.getElementById("sugerencias-habilidades").style.display = "none";
}

function eliminarHabilidad(boton) {
    const tag = boton.parentElement;
    const habilidad = tag.textContent.replace(/★|☆|×/g, '').trim();
    
    // Confirmar antes de eliminar
    if (!confirm(`¿Estás seguro que deseas eliminar la habilidad "${habilidad}"?`)) {
        return;
    }
    
    habilidadesAgregadas.delete(habilidad.toLowerCase());
    tag.remove();
    
    // Guardar en localStorage después de eliminar
    guardarHabilidades();
}

function filtrarHabilidades() {
    const input = document.getElementById("nueva-habilidad");
    const termino = input.value.trim().toLowerCase();
    const sugerencias = document.getElementById("sugerencias-habilidades");
    
    if (termino === "") {
        sugerencias.style.display = "none";
        return;
    }
    
    // Filtrar habilidades disponibles que coincidan y no estén agregadas
    const opcionesFiltradas = habilidadesDisponibles.filter(hab => 
        hab.toLowerCase().includes(termino) && 
        !habilidadesAgregadas.has(hab.toLowerCase())
    );
    
    // Mostrar sugerencias
    sugerencias.innerHTML = "";
    
    if (opcionesFiltradas.length === 0) {
        const item = document.createElement("div");
        item.className = "sugerencia-item";
        item.textContent = "No se encontraron coincidencias";
        sugerencias.appendChild(item);
    } else {
        opcionesFiltradas.forEach(hab => {
            const item = document.createElement("div");
            item.className = "sugerencia-item";
            item.textContent = hab;
            item.onclick = function() {
                input.value = hab;
                sugerencias.style.display = "none";
            };
            sugerencias.appendChild(item);
        });
    }
    
    sugerencias.style.display = "block";
}

function mostrarEstrellas(nivel) {
    switch (nivel) {
        case "experto": return "★ ★ ★";
        case "intermedio": return "★ ★ ☆";
        case "principiante": return "★ ☆ ☆";
        default: return "";
    }
}

// Cerrar sugerencias al hacer clic fuera
document.addEventListener('click', function(e) {
    const sugerencias = document.getElementById("sugerencias-habilidades");
    const input = document.getElementById("nueva-habilidad");
    
    if (e.target !== input && e.target !== sugerencias) {
        sugerencias.style.display = "none";
    }
});