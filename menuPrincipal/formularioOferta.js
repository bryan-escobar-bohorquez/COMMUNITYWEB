const formulario = document.getElementById("formulario-oferta");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevaOferta = {
    titulo: document.getElementById("titulo").value.trim(),
    categoria: document.getElementById("categoria").value.trim(),
    ubicacion: document.getElementById("ubicacion").value.trim(),
    precio: document.getElementById("precio").value.trim(),
    contacto: document.getElementById("contacto").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
  };

  // Validar campos vacíos
  for (const campo in nuevaOferta) {
    if (!nuevaOferta[campo]) {
      mensaje.style.color = "red";
      mensaje.textContent = `El campo "${campo}" no puede estar vacío.`;
      return;
    }
  }

  try {
    const respuesta = await fetch("http://localhost:5000/api/ofertas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevaOferta)
    });

    const datos = await respuesta.json(); // Captura la respuesta del backend

    if (!respuesta.ok) {
      throw new Error(datos?.error || "Error al publicar");
    }

    mensaje.style.color = "green";
    mensaje.textContent = "¡Oferta publicada con éxito!";
    formulario.reset();

    // Opcional: mostrar oferta nueva en pantalla
    // const tarjeta = crearTarjeta(datos);
    // document.getElementById("contenedor-servicios").appendChild(tarjeta);

  } catch (error) {
    console.error("Error al publicar oferta:", error);
    mensaje.style.color = "red";
    mensaje.textContent = error.message || "Hubo un error al publicar la oferta.";
  }
});
