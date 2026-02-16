const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

async function cargarTurno() {
    try {
        const response = await fetch(url);
        const data = await response.text();

        const filas = data.split("\n").map(f => f.split(","));

        // Fecha actual en Argentina
        const hoy = new Date().toLocaleDateString("en-CA", {
            timeZone: "America/Argentina/Buenos_Aires"
        });

        const fechaElemento = document.getElementById("fecha");
        const farmaciaElemento = document.getElementById("farmacia");
        const btnMaps = document.getElementById("btn-maps");
        const btnWpp = document.getElementById("btn-wpp");

        fechaElemento.textContent = new Date().toLocaleDateString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "America/Argentina/Buenos_Aires"
        });

        const filaHoy = filas.find(f => f[0]?.trim() === hoy);

        if (filaHoy) {
            farmaciaElemento.textContent = filaHoy[1];
            btnMaps.href = filaHoy[2];
            btnWpp.href = filaHoy[3];
        } else {
            farmaciaElemento.textContent = "No hay turno cargado";
        }

    } catch (error) {
        console.error("Error cargando datos:", error);
        document.getElementById("farmacia").textContent = "Error al cargar datos";
    }
}

cargarTurno();
