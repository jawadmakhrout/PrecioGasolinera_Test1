// --- CONFIGURACIÓN ---
const USUARIO_GITHUB = 'jawadmakhrout'; // Escribe tu usuario aquí (ej: 'juanperez')
const NOMBRE_REPO = 'PrecioGasolinera_Test1'; // Escribe el nombre del repo (ej: 'precios-gasolinera')
const RUTA_ARCHIVO = 'datos.json';
// ---------------------

// 1. Cargar los precios actuales en los inputs al abrir la página
async function cargarInputs() {
    try {
        const response = await fetch(RUTA_ARCHIVO + '?v=' + new Date().getTime());
        const datos = await response.json();

        document.getElementById('input-gasoil-n').value = datos.gasoil_normal;
        document.getElementById('input-gasoil-p').value = datos.gasoil_premium;
        document.getElementById('input-gasolina-n').value = datos.gasolina_normal;
        document.getElementById('input-gasolina-p').value = datos.gasolina_premium;
    } catch (error) {
        console.error('Error cargando datos iniciales', error);
    }
}

// 2. Función para guardar en GitHub
async function guardarCambios() {
    const token = document.getElementById('github-token').value;
    const status = document.getElementById('status-msg');

    if (!token) {
        alert("Por favor, introduce tu Token de GitHub para poder guardar.");
        return;
    }

    status.textContent = "Guardando... espera un momento.";
    status.style.color = "blue";

    // Recoger los nuevos valores
    const nuevosDatos = {
        "gasoil_normal": document.getElementById('input-gasoil-n').value,
        "gasoil_premium": document.getElementById('input-gasoil-p').value,
        "gasolina_normal": document.getElementById('input-gasolina-n').value,
        "gasolina_premium": document.getElementById('input-gasolina-p').value,
        "moneda": "€"
    };

    try {
        // A) Obtener el SHA (identificador) del archivo actual en GitHub
        const apiUrl = `https://api.github.com/repos/${USUARIO_GITHUB}/${NOMBRE_REPO}/contents/${RUTA_ARCHIVO}`;
        
        const getResponse = await fetch(apiUrl, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!getResponse.ok) throw new Error("No se pudo conectar con GitHub. Revisa tu Token y los datos de Configuración.");
        
        const fileData = await getResponse.json();
        const shaActual = fileData.sha;

        // B) Convertir el JSON a Base64 (formato que pide GitHub)
        // Usamos este truco para que funcionen los caracteres especiales (UTF-8)
        const contenidoBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(nuevosDatos, null, 2))));

        // C) Enviar la actualización (PUT)
        const putResponse = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: "Actualización de precios desde Web",
                content: contenidoBase64,
                sha: shaActual
            })
        });

        if (putResponse.ok) {
            status.textContent = "¡Éxito! Precios actualizados en el servidor.";
            status.style.color = "green";
            alert("Precios actualizados correctamente. Pueden tardar 1 o 2 minutos en reflejarse en la web pública.");
        } else {
            throw new Error("Error al guardar.");
        }

    } catch (error) {
        console.error(error);
        status.textContent = "Error: " + error.message;
        status.style.color = "red";
    }
}

// Iniciar carga
cargarInputs();