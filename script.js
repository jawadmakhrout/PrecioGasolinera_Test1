// Función para obtener los datos
async function cargarPrecios() {
    try {
        // Añadimos una fecha al final para evitar que el navegador guarde caché antiguo
        const response = await fetch('datos.json?v=' + new Date().getTime());
        const datos = await response.json();

        // Actualizar el HTML con los datos del JSON
        document.getElementById('p-gasoil-n').textContent = datos.gasoil_normal;
        document.getElementById('p-gasoil-p').textContent = datos.gasoil_premium;
        document.getElementById('p-gasolina-n').textContent = datos.gasolina_normal;
        document.getElementById('p-gasolina-p').textContent = datos.gasolina_premium;

    } catch (error) {
        console.error('Error cargando los precios:', error);
        alert("No se pudieron cargar los precios. Revisa el archivo JSON.");
    }
}

// Ejecutar al cargar la página
cargarPrecios();