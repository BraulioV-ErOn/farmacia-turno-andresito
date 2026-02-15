const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTasNN3fvqils4m-YRo2ZEgkOPUT0PfwKd_Zq0JlYU_uoK7GeimiW6DBNc3mInQc83FysdoCT71k_Nl/pub?output=csv";

async function cargarTurno() {
  try {
    const response = await fetch(sheetURL);
    const data = await response.text();
    const rows = data.split("\n").slice(1);

    const now = new Date();

    // Ajuste para turno que empieza a las 08:00
    const horaActual = now.getHours();
    if (horaActual < 8) {
      now.setDate(now.getDate() - 1);
    }

    const fechaActual = now.toISOString().split("T")[0];

    const fechaTexto = now.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    document.getElementById("fecha").innerText = fechaTexto;

    let turnoEncontrado = false;

    rows.forEach(row => {
      const cols = row.split(",");

      const fecha = cols[0]?.trim();
      const farmacia = cols[1]?.trim();
      const maps = cols[2]?.trim();
      const whatsapp = cols[3]?.trim();

      if (fecha === fechaActual) {
        document.getElementById("farmacia").innerText = farmacia;

        const btnMaps = document.getElementById("btn-maps");
        const btnWpp = document.getElementById("btn-wpp");

        if (btnMaps) btnMaps.href = maps;
        if (btnWpp) btnWpp.href = whatsapp;

        turnoEncontrado = true;
      }
    });

    if (!turnoEncontrado) {
      document.getElementById("farmacia").innerText = "No hay turno cargado.";
    }

  } catch (error) {
    console.error("Error cargando datos:", error);
    document.getElementById("farmacia").innerText = "Error cargando datos.";
  }
}

cargarTurno();
