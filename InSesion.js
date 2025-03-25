document.addEventListener("DOMContentLoaded", function () {
    // Capturamos el formulario
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Capturamos los valores ingresados
        let usuario = document.getElementById("username").value;
        let contraseña = document.getElementById("password").value;

        // Aquí puedes definir un usuario y contraseña válidos de prueba
        const usuarioValido = "admin";
        const contraseñaValida = "1234";

        // Validación
        if (usuario === "" || contraseña === "") {
            alert("Por favor, completa todos los campos.");
        } else if (usuario === usuarioValido && contraseña === contraseñaValida) {
            alert("Inicio de sesión exitoso 🎉");
            window.location.href = "../menuPrincipal/MenuPiteractivo.html"; // Ruta corregida
        } else {
            alert("Usuario o contraseña incorrectos. Inténtalo de nuevo.");
        }
    });
});
