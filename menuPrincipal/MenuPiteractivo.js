// Espera a que se cargue completamente el DOM (todo el HTML), antes de ejecutar el código
window.addEventListener("DOMContentLoaded", () => {

  // Se obtiene el campo de texto donde el usuario escribe lo que quiere buscar
  const campoBusqueda = document.getElementById("campo-busqueda");

  // Se obtiene el botón que el usuario presiona para buscar
  const botonBusqueda = document.querySelector(".boton-busqueda");

  // Se obtienen todas las tarjetas de servicio (donde está la información de cada servicio)
  const tarjetas = document.querySelectorAll(".servicio");

  // Función que busca servicios comparando el texto ingresado con los títulos o descripciones
  function buscarServicios() {
    const filtro = campoBusqueda.value.toLowerCase();

    tarjetas.forEach(servicio => {
      const titulo = servicio.querySelector('h3').textContent.toLowerCase();
      const descripcion = servicio.querySelector('p').textContent.toLowerCase();

      if (titulo.includes(filtro) || descripcion.includes(filtro)) {
        servicio.style.display = "block";
      } else {
        servicio.style.display = "none";
      }
    });
  }

  // Se ejecuta la búsqueda al hacer clic o presionar Enter
  botonBusqueda.addEventListener("click", buscarServicios);
  campoBusqueda.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      buscarServicios();
    }
  });

  // ========== CERRAR SESIÓN ==========
  const botonCerrarSesion = document.querySelector(".cerrar-sesion button");

  const cerrarSesionBtn = document.querySelector(".cerrar-sesion");

  if (cerrarSesionBtn) {
    cerrarSesionBtn.addEventListener("click", () => {
    localStorage.removeItem("logueado");
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");

    // Impide regresar con botón atrás
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", () => {
      history.pushState(null, "", location.href);
    });

    // Redirige al login
    window.location.href = "menuP.html";
  });
}

});
