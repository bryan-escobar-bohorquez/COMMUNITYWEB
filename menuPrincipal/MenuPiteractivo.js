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
    // Se convierte el texto ingresado a minúsculas para hacer la búsqueda sin importar mayúsculas
    const filtro = campoBusqueda.value.toLowerCase();

    // Se revisa cada tarjeta para ver si coincide con la búsqueda
    tarjetas.forEach(servicio => {
      // Se obtiene el título de la tarjeta y se pasa a minúsculas
      const titulo = servicio.querySelector('h3').textContent.toLowerCase();

      // Se obtiene la descripción de la tarjeta y también se pasa a minúsculas
      const descripcion = servicio.querySelector('p').textContent.toLowerCase();

      // Si el título o la descripción contienen el texto buscado, se muestra la tarjeta
      if (titulo.includes(filtro) || descripcion.includes(filtro)) {
        servicio.style.display = "block"; // mostrar
      } else {
        servicio.style.display = "none"; // ocultar
      }
    });
  }

  // Se ejecuta la búsqueda cuando el usuario hace clic en el botón
  botonBusqueda.addEventListener("click", buscarServicios);

  // También se ejecuta la búsqueda si el usuario presiona Enter dentro del campo de búsqueda
  campoBusqueda.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      buscarServicios();
    }
  });
});
