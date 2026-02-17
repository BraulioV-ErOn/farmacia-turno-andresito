const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

async function cargarTurno() {
  try {
    const response = await fetch(url);
    const data = await response.text();

    const filas = data.split("\n").map(f => f.split(","));

    // === FECHA Y HORA ARGENTINA ===
    const now = new Date();

    const argentina = new Date(
      now.toLocaleString("en-US", {
        timeZone: "America/Argentina/Buenos_Aires"
      })
    );

    const hora = argentina.getHours();

    // 🔥 REGLA REAL:
    // Si es antes de las 08:00 → sigue contando el turno del día anterior
    if (hora < 8) {
      argentina.setDate(argentina.getDate() - 1);
    }

    const year = argentina.getFullYear();
    const month = String(argentina.getMonth() + 1).padStart(2, "0");
    const day = String(argentina.getDate()).padStart(2, "0");

    const hoy = `${year}-${month}-${day}`;

    const fechaElemento = document.getElementById("fecha");
    const farmaciaElemento = document.getElementById("farmacia");
    const btnMaps = document.getElementById("btn-maps");
    const btnWpp = document.getElementById("btn-wpp");

    // Mostrar fecha bonita
    fechaElemento.innerText = argentina.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    // Buscar turno en CSV
    for (let i = 1; i < filas.length; i++) {
      const filaFecha = filas[i][0]?.trim();
      const farmacia = filas[i][1];
      const maps = filas[i][2];
      const wpp = filas[i][3];

      if (filaFecha === hoy) {
        farmaciaElemento.innerText = farmacia;
        btnMaps.href = maps;
        btnWpp.href = wpp;
        return;
      }
    }

    farmaciaElemento.innerText = "No hay turno cargado";

  } catch (error) {
    console.error("Error cargando turno:", error);
    document.getElementById("farmacia").innerText = "Error al cargar turno";
  }
}

cargarTurno();
