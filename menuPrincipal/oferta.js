// Función para mostrar notificación temporal
function mostrarNotificacion(mensaje, tipo = 'exito') {
  const notificacion = document.createElement("div");
  notificacion.textContent = mensaje;
  notificacion.style.position = "fixed";
  notificacion.style.top = "20px";
  notificacion.style.right = "20px";
  notificacion.style.padding = "10px 20px";
  notificacion.style.backgroundColor = tipo === 'error' ? "#e74c3c" : "#27ae60";
  notificacion.style.color = "white";
  notificacion.style.borderRadius = "10px";
  notificacion.style.zIndex = 1000;
  document.body.appendChild(notificacion);

  setTimeout(() => {
    notificacion.remove();
  }, 3000);
}

window.addEventListener("DOMContentLoaded", () => {
  const detalleDiv = document.getElementById("detalle-servicio");
  const campoBusqueda = document.getElementById("campo-busqueda");
  const botonBusqueda = document.querySelector(".boton-busqueda");
  const contenedorServicios = document.getElementById("contenedor-servicios");

  // Mostrar detalles de una oferta
  function mostrarDetalle(oferta) {
    detalleDiv.innerHTML = `
      <h2>${oferta.titulo}</h2>
      <p><strong>Categoría:</strong> ${oferta.categoria}</p>
      <p><strong>Ubicación:</strong> ${oferta.ubicacion}</p>
      <p><strong>Precio:</strong> ${oferta.precio}</p>
      <p><strong>Contacto:</strong> ${oferta.contacto}</p>
      <p><strong>Descripción:</strong> ${oferta.descripcion}</p>
    `;
  }

  // Crear tarjeta HTML por cada oferta
  function crearTarjeta(oferta) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("servicio");
    tarjeta.setAttribute("data-clave", oferta.id || oferta.titulo);

    tarjeta.innerHTML = `
      <div class="servicio-header">
        <h3>${oferta.titulo}</h3>
        <p>${oferta.descripcion.substring(0, 60)}...</p>
      </div>
      <div class="botones-servicio">
        <button class="boton-negociar">Negociar</button>
        <button class="boton-aplicar">Aplicar</button>
      </div>
    `;

    tarjeta.addEventListener("click", () => {
      mostrarDetalle(oferta);
    });

    tarjeta.querySelector(".boton-aplicar").addEventListener("click", (e) => {
      e.stopPropagation();
      mostrarNotificacion("¡Has aplicado correctamente a esta oferta!");
    });

    tarjeta.querySelector(".boton-negociar").addEventListener("click", (e) => {
      e.stopPropagation();
      mostrarNotificacion("Redirigiendo a sección de negociación...");
      // window.location.href = "/negociar.html";
    });

    return tarjeta;
  }

  function mostrarOfertas(ofertas) {
    contenedorServicios.innerHTML = "";
    ofertas.forEach(oferta => {
      const tarjeta = crearTarjeta(oferta);
      contenedorServicios.appendChild(tarjeta);
    });
  }

  function buscarServicios() {
    const filtro = campoBusqueda.value.toLowerCase();
    const tarjetas = document.querySelectorAll(".servicio");
    tarjetas.forEach(servicio => {
      const titulo = servicio.querySelector("h3").textContent.toLowerCase();
      const descripcion = servicio.querySelector("p").textContent.toLowerCase();
      servicio.style.display = (titulo.includes(filtro) || descripcion.includes(filtro)) ? "block" : "none";
    });
  }

  // ⚠️ Ruta actualizada con URL absoluta al backend
  fetch("http://localhost:5000/api/ofertas")
    .then(res => {
      if (!res.ok) throw new Error("Error al obtener ofertas");
      return res.json();
    })
    .then(data => mostrarOfertas(data))
    .catch(err => {
      console.error(err);
      mostrarNotificacion("Error al cargar ofertas", "error");
    });

  botonBusqueda.addEventListener("click", buscarServicios);
  campoBusqueda.addEventListener("keypress", e => {
    if (e.key === "Enter") buscarServicios();
  });
});
