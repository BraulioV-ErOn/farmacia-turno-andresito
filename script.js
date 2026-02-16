// ========= CONFIGURAR TU CSV ACÁ =========

// Pegá tu enlace CSV público acá
const CSV_URL = https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pubhtml;

// ==========================================


function obtenerFechaTurno() {
    const ahora = new Date();

    // Si es antes de las 08:00, sigue siendo turno del día anterior
    if (ahora.getHours() < 8) {
        ahora.setDate(ahora.getDate() - 1);
    }

    return ahora;
}

function formatearFecha(fecha) {
    return fecha.toLocaleDateString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}

async function cargarTurno() {
    try {
        const fechaTurno = obtenerFechaTurno();
        document.getElementById("fecha").textContent = formatearFecha(fechaTurno);

        const respuesta = await fetch(CSV_URL);
        const texto = await respuesta.text();

        const lineas = texto.split("\n");
        const fechaBuscada = fechaTurno.toISOString().split("T")[0];

        let encontrado = false;

        for (let i = 1; i < lineas.length; i++) {
            const columnas = lineas[i].split(",");

            const fechaCSV = columnas[0];
            const nombre = columnas[1];
            const maps = columnas[2];
            const whatsapp = columnas[3];

            if (fechaCSV === fechaBuscada) {
                document.getElementById("farmacia").textContent = nombre;
                document.getElementById("btnMaps").href = maps;
                document.getElementById("btnWpp").href = whatsapp;
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            document.getElementById("farmacia").textContent = "No hay turno cargado";
        }

    } catch (error) {
        document.getElementById("farmacia").textContent = "Error cargando turno";
        console.error(error);
    }
}

cargarTurno();
