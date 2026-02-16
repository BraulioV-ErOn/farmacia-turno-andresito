const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

async function cargarTurno() {
    try {
        const response = await fetch(url);
        const data = await response.text();

        const filas = data.split("\n").map(f => f.split(","));

        const hoy = new Date().toLocaleDateString("en-CA", {
            timeZone: "America/Argentina/Buenos_Aires"
        });

        const fechaElemento = document.getElementById("fecha");
        const farmaciaElemento = document.getElementById("farmacia");
        const btnMaps = document.getElementById("btn-maps");
        const btnWpp = document.getElementById("btn-wpp");

        for (let i = 1; i < filas.length; i++) {
            const fecha = filas[i][0]?.trim();

            if (fecha === hoy) {

                fechaElemento.textContent = new Date(fecha)
                    .toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                    });

                farmaciaElemento.textContent = filas[i][1];
                btnMaps.href = filas[i][2];
                btnWpp.href = filas[i][3];

                return;
            }
        }

        farmaciaElemento.textContent = "No hay turno cargado";

    } catch (error) {
        document.getElementById("farmacia").textContent = "Error al cargar datos";
        console.error(error);
    }
}

cargarTurno();
