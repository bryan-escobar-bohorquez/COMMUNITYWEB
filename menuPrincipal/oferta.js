// Objeto que contiene los detalles de cada servicio, identificados por una clave
const detalles = {
  electricista: {
    titulo: "Reparación de circuito eléctrico",
    empresa: "Construcciones Alfa S.A.",
    ciudad: "Bogotá",
    salario: "$2.000.000",
    modalidad: "Presencial",
    descripcion: "Se requiere electricista profesional para realizar reparaciones en el cableado de una obra residencial. Se valorará experiencia previa y certificación."
  },
  plomero: {
    titulo: "Reparación de plomería",
    empresa: "Construcciones Alfa S.A.",
    ciudad: "Bogotá",
    salario: "$1.800.000",
    modalidad: "Presencial",
    descripcion: "Se busca plomero con experiencia para atender urgencias domésticas. Contrato por prestación de servicios, con posibilidad de extensión."
  }
  // Puedes agregar más servicios aquí, usando la misma estructura
};

// Espera a que el contenido HTML se cargue completamente antes de ejecutar el script
window.addEventListener("DOMContentLoaded", () => {

  // Selecciona todas las tarjetas de servicios mostradas en la página
  const tarjetas = document.querySelectorAll(".servicio");

  // Selecciona el contenedor donde se mostrará el detalle del servicio
  const detalleDiv = document.getElementById("detalle-servicio");

  // Obtiene el campo de búsqueda (donde el usuario escribe lo que quiere buscar)
  const campoBusqueda = document.getElementById("campo-busqueda");

  // Obtiene el botón de búsqueda
  const botonBusqueda = document.querySelector(".boton-busqueda");

  // Función que muestra los detalles del servicio en el panel derecho
  function mostrarDetalleServicio(clave) {
    const info = detalles[clave]; // Obtiene los datos del servicio según su clave

    // Si existe información para esa clave, muestra los detalles en el contenedor
    if (info) {
      const contenedor = document.getElementById("detalle-servicio");
      contenedor.innerHTML = `
        <h2>${info.titulo}</h2>
        <p><strong>Empresa:</strong> ${info.empresa}</p>
        <p><strong>Ciudad:</strong> ${info.ciudad}</p>
        <p><strong>Salario:</strong> ${info.salario}</p>
        <p><strong>Modalidad:</strong> ${info.modalidad}</p>
        <p><strong>Descripción:</strong> ${info.descripcion}</p>
        <button class="contactar">Contactar</button>
      `;
    }
  }

  // Asigna un evento a cada tarjeta para que, al hacer clic, muestre los detalles correspondientes
  document.querySelectorAll(".servicio").forEach(servicio => {
    servicio.addEventListener("click", () => {
      // Obtiene la clave del servicio desde el atributo personalizado data-clave
      const clave = servicio.getAttribute("data-clave");

      // Llama a la función para mostrar los detalles en pantalla
      mostrarDetalleServicio(clave);
    });
  });

  // Función que filtra los servicios en pantalla según el texto escrito por el usuario
  function buscarServicios() {
    const filtro = campoBusqueda.value.toLowerCase(); // Convierte el texto a minúsculas

    tarjetas.forEach(servicio => {
      const titulo = servicio.querySelector('h3').textContent.toLowerCase(); // Título en minúsculas
      const descripcion = servicio.querySelector('p').textContent.toLowerCase(); // Descripción en minúsculas

      // Si el texto aparece en el título o en la descripción, muestra la tarjeta
      if (titulo.includes(filtro) || descripcion.includes(filtro)) {
        servicio.style.display = "block"; // Mostrar
      } else {
        servicio.style.display = "none"; // Ocultar
      }
    });
  }

  // Ejecuta la búsqueda al hacer clic en el botón
  botonBusqueda.addEventListener("click", buscarServicios);

  // Ejecuta la búsqueda al presionar la tecla Enter en el campo de búsqueda
  campoBusqueda.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      buscarServicios();
    }
  });
});
